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

# firebase-tools is pinned to major v15 via npx so the deploy never
# silently picks up a new major version (supply-chain hygiene).
FIREBASE="npx --yes firebase-tools@15"

${FIREBASE} use --add "rq-${COUNTRY}-${ENV}"

echo "Deploying rq-${COUNTRY}-${ENV}"

export NODE_OPTIONS=--openssl-legacy-provider

if [[ ${ENV} != "prod" ]]
then
  ng build --configuration "${ENV}" && ${FIREBASE} deploy
else
  ng build --prod && ${FIREBASE} deploy
fi
