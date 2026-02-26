# syntax = docker/dockerfile:1

FROM node:22-slim AS base

LABEL fly_launch_runtime="Remix"

# Remix app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"
ARG YARN_VERSION=3.6.4

# Install Yarn 3
RUN corepack enable && \
    yarn set version ${YARN_VERSION}

# Add CircleCI context variables as ARGs
ARG VITE_BRANCH
ARG VITE_SENTRY_DSN
ARG VITE_GA_TRACKING_ID
ARG VITE_THEME

# Throw-away build stage to reduce size of final image
FROM base AS build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Copy source code
ADD . .

# Install packages
RUN yarn install

RUN --mount=type=secret,id=VITE_BRANCH \
    --mount=type=secret,id=VITE_SENTRY_DSN \
    --mount=type=secret,id=VITE_GA_TRACKING_ID \
    --mount=type=secret,id=VITE_THEME \
    VITE_BRANCH="$(cat /run/secrets/VITE_BRANCH)" && \
    VITE_SENTRY_DSN="$(cat /run/secrets/VITE_SENTRY_DSN)" && \
    VITE_GA_TRACKING_ID="$(cat /run/secrets/VITE_GA_TRACKING_ID)" && \
    VITE_THEME="$(cat /run/secrets/VITE_THEME)" && \
    echo "VITE_BRANCH=\"${VITE_BRANCH}\"" >> .env && \
    echo "VITE_SENTRY_DSN=\"${VITE_SENTRY_DSN}\"" >> .env && \
    echo "VITE_GA_TRACKING_ID=\"${VITE_GA_TRACKING_ID}\"" >> .env && \
    echo "VITE_THEME=\"${VITE_THEME}\"" >> .env

# Build application
RUN yarn run build

# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "yarn", "run", "start:prod" ]

