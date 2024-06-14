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
  # For debugging
  apt-get -y install nano && \
  apt-get clean

COPY ./package.json ./package.json
RUN yarn install

COPY ./server.js ./server.js

EXPOSE 30102

ENTRYPOINT [ "node", "./server.js" ]