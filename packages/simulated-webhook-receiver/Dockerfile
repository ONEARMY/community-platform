####################################################################
#
# COMMANDS:
# This commands are ran from `packages/simulated-webhook-reciever/`.
#
#   BUILD
#   docker build -t simulated-webook-receiver .
#
#   RUN
#   docker run -it simulated-webook-receiver
#
####################################################################

FROM node:20.9.0-bullseye-slim

WORKDIR /app

RUN \
  apt-get update && \
  apt-get -y install curl && \
  # For debugging
  apt-get -y install nano && \
  apt-get clean

HEALTHCHECK CMD curl --fail http://localhost:30102/health || exit 1

COPY ./package.json ./package.json
RUN yarn install

COPY ./server.js ./server.js

EXPOSE 30102

ENTRYPOINT [ "node", "./server.js" ]