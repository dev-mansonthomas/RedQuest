#!/usr/bin/env bash
COUNTRY=$1
ENV=$2

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


function setProject
{
  CURRENT_PROJECT=$(gcloud config get-value project)
  TARGET_PROJECT="$1"

  if [[ ${CURRENT_PROJECT} != "${TARGET_PROJECT}" ]]
  then

    echo "GCP Project was '${CURRENT_PROJECT}', updating it to '${TARGET_PROJECT}'"
    #set current project to target project"
    gcloud config set project ${TARGET_PROJECT}

  fi
}

setProject "rq-${COUNTRY}-${ENV}"

#list current connect google account
gcloud auth list


echo "Deploying ${TARGET}"


ng build --configuration "${ENV}" && firebase deploy
