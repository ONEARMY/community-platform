####################################################################
#
# Due to complexities with Yarn workspaces, this Dockerfile
# does not create the `dist` folder. It should be mounted from
# the host machine to the container, using the `-v` flag.
#
# Optionally, initial data can be setup by mounting `/seed`.
#
# If you want to not get errors due to missing email templates,
# you also need to mount those. The functions code in the
# emulator expects them to be located at `/templates`.
#
# COMMANDS
# We need some files from the root directory of the project,
# therefore these commands should be ran from there.
#
#   BUILD
#   docker build -f ./emulator/Dockerfile -t emulator .
#
#   RUN
#   docker run -v ./functions:/app/functions -p 4001-4008:4001-4008 -it emulator
#
#   RUN WITH SEED DATA
#   docker run -v ./functions/data/emulator:/seed -v ./functions:/app/functions -p 4001-4008:4001-4008 -it emulator
#
#   RUN WITH EMAIL TEMPLATES
#   docker run -v ./functions/src/emailNotifications/templates:/templates -v ./functions:/app/functions -p 4001-4008:4001-4008 -it emulator
#
#   EXPORT (while the container is running)
#   docker exec -it <conatiner_name> /app/export.js
#   docker cp <conatiner_name>:/app/dump ./whatever
#
# HOW TO DEBUG THE CONTAINER WHILE IT IS RUNNING:
#   1) Open a new terminal.
#   2) Run `docker ps` command.
#   3) Find the name for the container.
#   4) Run `docker exec -it <conatiner_name> bash` command.
#
# TECHNICAL NOTES:
#   WHAT IS THAT DOT AT THE END OF THE BUILD COMMAND?
#   That is the `context` argument. For the COPY command,
#   the part that happens on the host machine is done
#   relative to it.
#
#   So if you are in the root directory it will start from there.
#   https://docs.docker.com/build/building/context/#filesystem-contexts
#
#   FIREBASE.JSON HOSTS
#   Due to Docker, the Firebase emulators should run on 0.0.0.0
#   https://stackoverflow.com/a/52518929
#
####################################################################

FROM node:20.9.0-bullseye-slim

WORKDIR /app

RUN \
  apt-get update && \
  apt-get -y install curl && \
  # For Firebase
  # https://firebase.google.com/docs/emulator-suite/install_and_configure
  apt-get -y install openjdk-11-jre-headless && \
  # For debugging
  apt-get -y install nano && \
  apt-get clean

HEALTHCHECK CMD curl --fail http://0.0.0.0:4001 || exit 1

# In this codebase, we prefer to use yarn over npm
# but I couldn't get yarn global install working.
# This works but feel free to make a change.
RUN npm install -g firebase-tools

# Doing setup saves time when running the container.
# There are no setup commands for functions, hosting, or auth.
RUN \
  firebase setup:emulators:ui && \
  firebase setup:emulators:firestore && \
  firebase setup:emulators:database && \
  firebase setup:emulators:storage && \
  firebase setup:emulators:pubsub

COPY ./firebase.json                    ./firebase.json
COPY ./firebase.storage.rules           ./firebase.storage.rules
COPY ./firestore.indexes.json           ./firestore.indexes.json
COPY ./firestore.rules                  ./firestore.rules

COPY ./emulator/export.js               ./export.js

COPY ./emulator/link-logs.js            ./link-logs.js

# This folder needs to exist because otherwise
# the emulators error if the user did not mount
# their own folder.
RUN mkdir /seed

# These should be the ports specified in firebase.json
EXPOSE 4001 4002 4003 4004 4005 4006 4007 4008

# Used to tell the functions code we are in the emulator
ENV IS_EMULATED=true

CMD \
  ./link-logs.js & \
  # Do firebase emulators:start --help for details
  firebase emulators:start \
  --project demo-community-platform-emulated \
  --only auth,functions,firestore,pubsub,storage,hosting,database \
  --import=/seed
