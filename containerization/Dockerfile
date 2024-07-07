####################################################################
#
# When starting the container, you probably want to mount the
# project folder, so code changes are shared with the container
# (see commands below.) In that case, log files for each emulated
# service are shared back to the host machine.
#
# TODO: check if the below is still true.
# If you want to not get errors due to missing email templates,
# you also need to mount a folder. The functions code in the
# emulator expects them to be located in the `/templates` folder
# on the container.
#
# COMMANDS
# We need files from the root directory of the project, therefore
# these commands should be ran from there.
#
#   BUILD
#   docker build -f ./containerization/Dockerfile -t backend .
#
#   RUN
#   docker run -v ./:/app -p 4001-4008:4001-4008 -it backend
#
#   RUN WITH EMAIL TEMPLATES (TODO: unsure if still needed)
#   docker run -v ./functions/src/emailNotifications/templates:/templates -v ./functions:/app/functions -p 4001-4008:4001-4008 -it backend
#
#   EXPORT (while the container is running)
#   docker exec -it <conatiner_name> /app/containerization/export.cjs
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
#   DOCUMENTATION FOR RUN
#   https://docs.docker.com/reference/cli/docker/container/run
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

# Doing setup here saves time when running the container.
# There are no setup commands for functions, hosting, or auth.
RUN \
  firebase setup:emulators:ui && \
  firebase setup:emulators:firestore && \
  firebase setup:emulators:database && \
  firebase setup:emulators:storage && \
  firebase setup:emulators:pubsub

############################################################
#
# We must do some weirdness because of the yarn workspace.
#
# The normal approach is:
# 1) copy the package.json files
# 2) install the dependencies
# 3) copy the application files
#
# Doing it like this optimizes rebuilds, as dependenices
# change much less often compared to application files.
#
# source: https://www.docker.com/blog/getting-started-with-docker-using-node-jspart-i/
#
# But for our situation, this results in an error when
# trying to install the dependencies:
#   Resolving packages...
#   error Couldn't find any versions for "oa-components" that matches "workspace:*"
#   info Visit https://yarnpkg.com/en/docs/cli/install for documentation about this command.
#
# So instead we must:
# 1) copy the package.json files and application files
# 2) install the dependencies
#
# This is slower but at least it works. And, ideally, once
# the container is running, developers should not need
# to be constantly rebuilding it.
#
COPY ./ ./
#
RUN yarn install
#
############################################################

# These should be the ports specified in firebase.json
EXPOSE 4001 4002 4003 4004 4005 4006 4007 4008

# Used to tell the functions code we are in the emulator
ENV IS_EMULATED=true

CMD \
  yarn workspace functions watch & \
  # Do firebase emulators:start --help for details
  firebase emulators:start \
  --project demo-community-platform-emulated \
  --only auth,functions,firestore,pubsub,storage,hosting,database \
  --import=/app/containerization/data
