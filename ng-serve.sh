#!/usr/bin/env bash

PATH="/usr/local/opt/node@14/bin/:$PATH"

export NODE_OPTIONS=--openssl-legacy-provider
ng serve --configuration "dev" 
