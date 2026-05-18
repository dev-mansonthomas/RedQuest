#!/usr/bin/env bash
# scripts/firestore-cleanup.sh
#
# Cleanup Firestore configuration after migration of `ul_queteur_stats_per_year`
# reads from client SDK to Cloud Functions (Admin SDK).
#
# Two independent phases:
#   --indexes  Reduce firestore.indexes.json to the 3 composite indexes still
#              used server-side on `ul_queteur_stats_per_year`:
#                - (queteur_id ASC, year DESC)        -> get-queteur-stats
#                - (ul_id ASC, amount DESC)           -> kept (server usage TBD)
#                - (ul_id ASC, year ASC, amount DESC) -> get-ul-queteur-ranking
#              Deploys with `--force`, which DELETES every other composite index
#              currently online on the collection. Safe once both Cloud Functions
#              (get-ul-queteur-ranking AND get-queteur-stats) are deployed.
#   --rules    Tighten firestore.rules to forbid client reads on
#              `ul_queteur_stats_per_year`. REQUIRES `get-queteur-stats` to be
#              deployed AND frontend migrated (cf. docs/specs/get-queteur-stats.md).
#
# Modes:
#   --dry-run  (default) Show diffs only, do not touch files, do not deploy.
#   --apply    Replace files in place (with .bak.<timestamp> backups).
#   --deploy   Imply --apply, then run `firebase deploy --only firestore:...`.
#
# Required: --project <id> for --deploy. Recommended ordering: rq-fr-dev →
# rq-fr-test → rq-fr-prod, with manual validation between each step.

set -euo pipefail

PHASE_INDEXES=0
PHASE_RULES=0
MODE="dry-run"
PROJECT=""
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TS="$(date +%Y%m%d-%H%M%S)"

usage() {
  sed -n '2,22p' "$0"
  exit "${1:-1}"
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --indexes)  PHASE_INDEXES=1 ;;
    --rules)    PHASE_RULES=1 ;;
    --dry-run)  MODE="dry-run" ;;
    --apply)    MODE="apply" ;;
    --deploy)   MODE="deploy" ;;
    --project)  PROJECT="${2:?--project requires a value}"; shift ;;
    -h|--help)  usage 0 ;;
    *)          echo "unknown option: $1" >&2; usage 1 ;;
  esac
  shift
done

if [[ $PHASE_INDEXES -eq 0 && $PHASE_RULES -eq 0 ]]; then
  echo "error: at least one of --indexes or --rules is required" >&2; usage 1
fi
if [[ "$MODE" == "deploy" && -z "$PROJECT" ]]; then
  echo "error: --deploy requires --project <id>" >&2; usage 1
fi

INDEXES_FILE="$REPO_ROOT/firestore.indexes.json"
RULES_FILE="$REPO_ROOT/firestore.rules"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

# --- Target file contents -----------------------------------------------------

cat > "$TMP_DIR/firestore.indexes.json" <<'JSON'
{
  "indexes": [
    {
      "collectionGroup": "ul_queteur_stats_per_year",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "queteur_id", "order": "ASCENDING" },
        { "fieldPath": "year",       "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "ul_queteur_stats_per_year",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "ul_id",  "order": "ASCENDING" },
        { "fieldPath": "amount", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "ul_queteur_stats_per_year",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "ul_id",  "order": "ASCENDING" },
        { "fieldPath": "year",   "order": "ASCENDING" },
        { "fieldPath": "amount", "order": "DESCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
JSON

cat > "$TMP_DIR/firestore.rules" <<'RULES'
rules_version = "2";

service cloud.firestore {
  match /databases/{database}/documents {
    match /queteurs/{queteur} {
      allow write, update: if request.auth.uid != null
        && !exists(/databases/$(database)/documents/queteurs/$(request.auth.uid))
        && (request.resource.data.registration_approved == false || request.resource.data.registration_approved == null);
      allow read: if request.auth.uid != null;
    }

    // ul_queteur_stats_per_year is read server-side only (Admin SDK bypasses rules).
    // Client SDK access is forbidden since the migration to get-ul-queteur-ranking
    // and get-queteur-stats Cloud Functions.
    match /ul_queteur_stats_per_year/{doc} {
      allow read, write: if false;
    }

    match /{document=**} {
      allow write: if false;
      allow read: if request.auth.uid != null
        && get(/databases/$(database)/documents/queteurs/$(request.auth.uid)).data.registration_approved == true;
    }
  }
}
RULES

# --- Diff / apply helpers -----------------------------------------------------

show_diff() {
  local current="$1" target="$2" label="$3"
  echo
  echo "=== diff ($label) ==="
  if diff -u "$current" "$target"; then
    echo "(no change — files are already identical)"
  fi
}

apply_file() {
  local current="$1" target="$2"
  local backup_dir="${REPO_ROOT}/.firestore-backups/${TS}"
  mkdir -p "$backup_dir"
  local backup_path="${backup_dir}/$(basename "$current")"
  cp "$current" "$backup_path"
  cp "$target" "$current"
  echo "applied: $(basename "$current") (backup: .firestore-backups/${TS}/$(basename "$current"))"
}

# --- Execute phases -----------------------------------------------------------

DEPLOY_ARGS=()

if [[ $PHASE_INDEXES -eq 1 ]]; then
  show_diff "$INDEXES_FILE" "$TMP_DIR/firestore.indexes.json" "firestore.indexes.json"
  if [[ "$MODE" != "dry-run" ]]; then
    apply_file "$INDEXES_FILE" "$TMP_DIR/firestore.indexes.json"
  fi
  DEPLOY_ARGS+=("firestore:indexes")
fi

if [[ $PHASE_RULES -eq 1 ]]; then
  show_diff "$RULES_FILE" "$TMP_DIR/firestore.rules" "firestore.rules"
  if [[ "$MODE" != "dry-run" ]]; then
    apply_file "$RULES_FILE" "$TMP_DIR/firestore.rules"
  fi
  DEPLOY_ARGS+=("firestore:rules")
fi

if [[ "$MODE" == "deploy" ]]; then
  ONLY="$(IFS=','; echo "${DEPLOY_ARGS[*]}")"
  echo
  echo "=== firebase deploy --only $ONLY --project $PROJECT --force ==="
  if [[ $PHASE_INDEXES -eq 1 ]]; then
    echo "WARNING (--indexes): --force deletes every composite index on"
    echo "  ul_queteur_stats_per_year that is NOT declared in firestore.indexes.json"
    echo "  above. Verify the declared list before confirming."
  fi
  read -r -p "Proceed? [y/N] " ans
  [[ "$ans" =~ ^[Yy]$ ]] || { echo "aborted."; exit 2; }
  ( cd "$REPO_ROOT" && firebase deploy --only "$ONLY" --project "$PROJECT" --force )
fi

echo
echo "done (mode: $MODE)."
