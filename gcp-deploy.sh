#!/usr/bin/env bash
set -euo pipefail

COUNTRY=${1:-}
ENV=${2:-}

if [[ "${COUNTRY}1" != "fr1" ]]
then
  echo "'${COUNTRY}' the first parameter (country) is not valid. Valid values are ['fr']"
  exit 1
fi

if  [[ "${ENV}1" != "dev1" ]] && [[ "${ENV}1" != "test1" ]] && [[ "${ENV}1" != "prod1" ]]
then
  echo "'${ENV}' the second parameter (env) is not valid. Valid values are ['dev', 'test', 'prod']"
  exit 1
fi

# Node version check (must be >= 22, see .nvmrc)
NODE_MAJOR=$(node -p "process.versions.node.split('.')[0]" 2>/dev/null || echo "0")
if [[ "${NODE_MAJOR}" -lt 22 ]]
then
  echo "Error: Node >= 22 is required (.nvmrc=22). Current: $(node -v 2>/dev/null || echo 'not installed')"
  echo "Hint: 'nvm use' if you have nvm, or install Node 22 via Homebrew/installer."
  exit 1
fi

# firebase-tools is pinned to major v15 via npx so the deploy never
# silently picks up a new major version (supply-chain hygiene).
FIREBASE="npx --yes firebase-tools@15"

# Fail-fast: avoid wasting a build if no firebase session is active.
if ${FIREBASE} login:list 2>&1 | grep -q "No authorized accounts"
then
  echo "Error: no active firebase session. Run 'firebase login' first."
  exit 1
fi

function setProject
{
  CURRENT_PROJECT=$(gcloud config get-value project)
  TARGET_PROJECT="$1"

  if [[ ${CURRENT_PROJECT} != "${TARGET_PROJECT}" ]]
  then

    echo "GCP Project was '${CURRENT_PROJECT}', updating it to '${TARGET_PROJECT}'"
    #set current project to target project"
    gcloud auth application-default set-quota-project ${TARGET_PROJECT}
    gcloud config set project ${TARGET_PROJECT}

  fi
}

setProject "rq-${COUNTRY}-${ENV}"

#list current connect google account
gcloud auth list

# `firebase deploy` (no --only) pushes hosting + firestore.rules +
# firestore.indexes. Warn explicitly when those Firestore config files have
# uncommitted local changes, because they WILL be shipped along with hosting.
# Dev is an iterative validation env: changes are validated there BEFORE
# being committed, so working-tree warnings are pure noise. Test/prod still
# enforce the safety prompts.
if [[ "${ENV}" != "dev" ]] && git rev-parse --git-dir >/dev/null 2>&1
then
  if ! git diff --quiet HEAD -- firestore.rules firestore.indexes.json 2>/dev/null
  then
    echo "WARNING: Uncommitted changes in firestore.rules and/or firestore.indexes.json."
    echo "         They WILL be deployed to rq-${COUNTRY}-${ENV} together with hosting."
    read -r -p "         Proceed anyway? [y/N] " ans
    [[ "${ans}" =~ ^[Yy]$ ]] || { echo "aborted."; exit 1; }
  fi

  # Non-blocking warning for any other dirty file outside Firestore config.
  OTHER_DIRTY=$(git status --porcelain 2>/dev/null | grep -vE '(firestore\.rules|firestore\.indexes\.json)$' || true)
  if [[ -n "${OTHER_DIRTY}" ]]
  then
    echo "WARNING: Working tree has other uncommitted changes:"
    echo "${OTHER_DIRTY}"
    read -r -p "         Proceed? [y/N] " ans
    [[ "${ans}" =~ ^[Yy]$ ]] || { echo "aborted."; exit 1; }
  fi
fi

# Capture release context for Firebase Console traceability.
GIT_SHA=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")
DEPLOY_MSG="deploy ${GIT_BRANCH}@${GIT_SHA} to rq-${COUNTRY}-${ENV}"

echo "Deploying rq-${COUNTRY}-${ENV} (${DEPLOY_MSG})"

export NODE_OPTIONS=--openssl-legacy-provider

# Restrict the deploy targets to hosting + firestore.rules. We deliberately
# exclude firestore:indexes from the default deploy because firebase prompts
# interactively to delete any server-side index that is missing from
# firestore.indexes.json, which both breaks unattended runs and is destructive
# by default. Indexes are deployed explicitly with:
#   npx firebase-tools@15 deploy --only firestore:indexes --project rq-${COUNTRY}-${ENV}
# after reviewing the diff between the live indexes and firestore.indexes.json.
DEPLOY_TARGETS="hosting,firestore:rules"

if [[ ${ENV} != "prod" ]]
then
  ng build --configuration "${ENV}" \
    && ${FIREBASE} deploy --only "${DEPLOY_TARGETS}" --non-interactive \
         --project "rq-${COUNTRY}-${ENV}" --message "${DEPLOY_MSG}"
else
  ng build --configuration=production \
    && ${FIREBASE} deploy --only "${DEPLOY_TARGETS}" --non-interactive \
         --project "rq-${COUNTRY}-${ENV}" --message "${DEPLOY_MSG}"
fi

echo "Deployed to: https://rq-${COUNTRY}-${ENV}.web.app"
