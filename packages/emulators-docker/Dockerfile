FROM node:16-alpine
################################################################################
# Loosely based on
# https://github.com/AndreySenov/firebase-tools-docker/blob/main/Dockerfile
# https://github.com/goat-io/fluent/blob/master/src/Docker/Database/Firebase/Dockerfile
################################################################################

ARG BUILD_DATE
ARG VERSION
ARG VCS_REF
LABEL org.label-schema.schema-version="1.0" \
  org.label-schema.name="" \
  org.label-schema.version=${VERSION} \
  org.label-schema.build-date=${BUILD_DATE} \
  org.label-schema.description="" \
  org.label-schema.url="" \
  org.label-schema.vcs-url="" \
  org.label-schema.vcs-ref=${VCS_REF}
ENV FIREBASE_TOOLS_VERSION=${VERSION}
ENV HOME=/home/node

# Install Java, Curl and Firebase-Tools
RUN apk --no-cache add curl openjdk11-jre bash && \
  yarn global add firebase-tools@${VERSION} && \
  yarn cache clean

# Check versions
RUN firebase -V && \
  java -version && \
  chown -R node:node $HOME   

# First run to setup emulators
RUN firebase setup:emulators:database && \
  firebase setup:emulators:firestore && \
  firebase setup:emulators:pubsub && \
  firebase setup:emulators:storage && \
  firebase setup:emulators:ui

# Install gcloud commmand utilities to use default login (requires python)
# RUN curl -sSL https://sdk.cloud.google.com > /tmp/gcl && bash /tmp/gcl --install-dir=~/gcloud --disable-prompts
# ENV PATH $PATH:~/gcloud/google-cloud-sdk/bin

WORKDIR /app

# Copy dist package.json and install (step will be cached unless changed)
RUN mkdir -p /app/functions/dist
COPY ./app/functions/dist/package.json /app/functions/dist/package.json
RUN cd /app/functions/dist && yarn install && yarn cache clean

# Copy additional config files (done individually to not override dist package.json)
COPY ./app/firebase.json /app/firebase.json
COPY ./app/.firebaserc /app/.firebaserc
COPY ./app/firebase.storage.rules /app/firebase.storage.rules
COPY ./app/functions/dist/index.js /app/functions/dist/index.js
COPY ./app/credentials.json /app/credentials.json

# Copy seed data
RUN mkdir -p /app/seed_data && mkdir -p /app/import
COPY ./seed_data/pp-2022-06-16 /app/seed_data

# Copy config files. Ensure executable and lf line format
RUN mkdir -p /app/config
COPY ./config /app/config
RUN dos2unix /app/config/bootstrap.sh
RUN chmod +x /app/config/bootstrap.sh

# Prompt firebase to use json credentials for login by exporting variable
ENV GOOGLE_APPLICATION_CREDENTIALS=/app/credentials.json

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
  && printf "\nExports" \
  && cat /app/import/firebase-export-metadata.json \
  && printf "\nUsers" \
  && cat /app/import/auth_export/accounts.json \
  && rm -R /app/seed_data \
  && rm -R /app/functions/dist/.env.local

# # Exposed Ports - These should match firebase.json config
EXPOSE 4001 4002 4003 4004 4005 4006 4007

# # Troubleshooting - can just run to get cli access
# CMD [ "/bin/sh" ]

CMD firebase emulators:start \
  --only auth,functions,firestore,pubsub,storage,hosting,database \
  --project ${FIRESTORE_PROJECT_NAME:-community-platform-emulated} \
  --import=/app/import