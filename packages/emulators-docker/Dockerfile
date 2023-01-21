# Use bullseye instead of alpine due to v11.18 pubsub crash issue (could try revert post emulator 0.7.1)
# https://github.com/firebase/firebase-tools/issues/5256
# https://github.com/micrometer-metrics/micrometer/issues/2776)

FROM node:18-bullseye-slim AS community-platform-builder

ARG FIREBASE_TOOLS_VERSION
ARG BUILD_DATE
ARG VCS_REF
LABEL org.label-schema.schema-version="1.0" \
  org.label-schema.name="" \
  org.label-schema.version=${FIREBASE_TOOLS_VERSION} \
  org.label-schema.build-date=${BUILD_DATE} \
  org.label-schema.description="" \
  org.label-schema.url="" \
  org.label-schema.vcs-url="" \
  org.label-schema.vcs-ref=${VCS_REF}

ENV HOME=/home/node

# Install Java and curl
# NOTE - this will not cache unless running with buildkit
RUN apt-get update && apt-get -y install openjdk-11-jre-headless dos2unix curl && apt-get clean

# Install firebase and check versions
RUN \
  yarn global add firebase-tools@${FIREBASE_TOOLS_VERSION} && \
  firebase -V && \
  java -version && \
  chown -R node:node $HOME   

# First run to setup emulators
RUN firebase setup:emulators:database && \
  firebase setup:emulators:firestore && \
  firebase setup:emulators:pubsub && \
  firebase setup:emulators:storage && \
  firebase setup:emulators:ui

WORKDIR /app

# Copy dist package.json and install (step will be cached unless changed)
RUN mkdir -p /app/functions/dist
COPY ./app/functions/dist/package.json /app/functions/dist/package.json
RUN cd /app/functions/dist && yarn install && yarn cache clean

# Copy additional config files (done individually to not override dist package.json)
COPY ./app/.firebaserc /app/.firebaserc
COPY ./app/firebase.json /app/firebase.json
COPY ./app/firebase.storage.rules /app/firebase.storage.rules
COPY ./app/credentials.json /app/credentials.json
COPY ./app/functions/.runtimeconfig.json /app/functions/.runtimeconfig.json
COPY ./app/functions/dist/index.js /app/functions/dist/index.js

# Copy seed data
RUN mkdir -p /app/seed_data && mkdir -p /app/import
COPY ./seed_data/pp-2022-12-04 /app/seed_data

# Copy config files. Ensure executable and lf line format
RUN mkdir -p /app/config
COPY ./config /app/config
RUN dos2unix /app/config/bootstrap.sh && chmod +x /app/config/bootstrap.sh

# Prompt firebase to use json credentials for login by exporting variable
ENV GOOGLE_APPLICATION_CREDENTIALS=/app/credentials.json

# Ensure runtime config vars picked up (https://github.com/firebase/firebase-tools/issues/3983)
ENV CLOUD_RUNTIME_CONFIG=/app/functions/.runtimeconfig.json
# Fix: ensure database emulator can configure with url
# https://github.com/firebase/firebase-admin-node/issues/116
ENV FIREBASE_DATABASE_EMULATOR_HOST = 'http://127.0.0.1:4006'

# Troubleshooting - can just run to get cli access to exec below manually and check logs
# CMD [ "/bin/sh" ]

# Prepare seed data used in the app
RUN \
  # Include a temporary env file to avoid timeouts (https://github.com/firebase/firebase-tools/issues/2837)
  echo "FUNCTIONS_EMULATOR_TIMEOUT_SECONDS=540s" > /app/functions/dist/.env.local && \ 
  # Make a first run of emulators to ensure configured correctly and allow any seed data to be processed
  # via bootstrap script. Once processed seed data is then re-exported for use at runtime
  firebase emulators:exec \
  --project  ${FIRESTORE_PROJECT_NAME:-community-platform-emulated} \
  --import=/app/seed_data --export-on-exit=/app/import \
  "/bin/bash /app/config/bootstrap.sh" \
  # Check that data exists and remove seed once complete
  && rm -R /app/seed_data \
  && rm -R /app/functions/dist/.env.local \
  # Clear global firebase-tools (will run from local node_modules which is pinned to same version), and dangling emulator zips
  # shaves around 200MB off final image 
  && yarn global remove firebase-tools && yarn cache clean --all\
  && rm /home/node/.cache/firebase/emulators/*.zip

# TODO - find a way to run the functions test spec against emulator 

# Exposed Ports - These should match firebase.json config
EXPOSE 4001 4002 4003 4004 4005 4006 4007 5000

CMD ./functions/dist/node_modules/.bin/firebase emulators:start \
  --only auth,functions,firestore,pubsub,storage,hosting,database \
  --project ${FIRESTORE_PROJECT_NAME:-community-platform-emulated} \
  --import=/app/import