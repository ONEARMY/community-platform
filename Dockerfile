# syntax = docker/dockerfile:1

FROM node:20-slim AS base

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
ARG VITE_CDN_URL
ARG VITE_SENTRY_DSN
ARG VITE_GA_TRACKING_ID
ARG VITE_PATREON_CLIENT_ID
ARG VITE_PLATFORM_PROFILES
ARG VITE_PROJECT_VERSION
ARG VITE_SUPPORTED_MODULES
ARG VITE_ACADEMY_RESOURCE
ARG VITE_API_URL
ARG VITE_PROFILE_GUIDELINES_URL
ARG VITE_SITE_NAME
ARG VITE_THEME
ARG VITE_DONATIONS_BODY
ARG VITE_DONATIONS_IFRAME_SRC
ARG VITE_DONATIONS_IMAGE_URL
ARG VITE_HOWTOS_HEADING
ARG VITE_COMMUNITY_PROGRAM_URL
ARG VITE_QUESTIONS_GUIDELINES_URL
ARG VITE_NO_MESSAGING

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
    --mount=type=secret,id=VITE_CDN_URL \
    --mount=type=secret,id=VITE_SENTRY_DSN \
    --mount=type=secret,id=VITE_GA_TRACKING_ID \
    --mount=type=secret,id=VITE_PATREON_CLIENT_ID \
    --mount=type=secret,id=VITE_PROJECT_VERSION \
    --mount=type=secret,id=VITE_SUPPORTED_MODULES \
    --mount=type=secret,id=VITE_ACADEMY_RESOURCE \
    --mount=type=secret,id=VITE_API_URL \
    --mount=type=secret,id=VITE_PROFILE_GUIDELINES_URL \
    --mount=type=secret,id=VITE_PLATFORM_PROFILES \
    --mount=type=secret,id=VITE_SITE_NAME \
    --mount=type=secret,id=VITE_THEME \
    --mount=type=secret,id=VITE_DONATIONS_BODY \
    --mount=type=secret,id=VITE_DONATIONS_IFRAME_SRC \
    --mount=type=secret,id=VITE_DONATIONS_IMAGE_URL \
    --mount=type=secret,id=VITE_HOWTOS_HEADING \
    --mount=type=secret,id=VITE_COMMUNITY_PROGRAM_URL \
    --mount=type=secret,id=VITE_QUESTIONS_GUIDELINES_URL \
    --mount=type=secret,id=VITE_NO_MESSAGING \
    VITE_CDN_URL="$(cat /run/secrets/VITE_CDN_URL)" && \
    VITE_BRANCH="$(cat /run/secrets/VITE_BRANCH)" && \
    VITE_SENTRY_DSN="$(cat /run/secrets/VITE_SENTRY_DSN)" && \
    VITE_GA_TRACKING_ID="$(cat /run/secrets/VITE_GA_TRACKING_ID)" && \
    VITE_PATREON_CLIENT_ID="$(cat /run/secrets/VITE_PATREON_CLIENT_ID)" && \
    VITE_PLATFORM_PROFILES="$(cat /run/secrets/VITE_PLATFORM_PROFILES)" && \
    VITE_PROJECT_VERSION="$(cat /run/secrets/VITE_PROJECT_VERSION)" && \
    VITE_SUPPORTED_MODULES="$(cat /run/secrets/VITE_SUPPORTED_MODULES)" && \
    VITE_ACADEMY_RESOURCE="$(cat /run/secrets/VITE_ACADEMY_RESOURCE)" && \
    VITE_API_URL="$(cat /run/secrets/VITE_API_URL)" && \
    VITE_PROFILE_GUIDELINES_URL="$(cat /run/secrets/VITE_PROFILE_GUIDELINES_URL)" && \
    VITE_SITE_NAME="$(cat /run/secrets/VITE_SITE_NAME)" && \
    VITE_THEME="$(cat /run/secrets/VITE_THEME)" && \
    VITE_DONATIONS_BODY="$(cat /run/secrets/VITE_DONATIONS_BODY)" && \
    VITE_DONATIONS_IFRAME_SRC="$(cat /run/secrets/VITE_DONATIONS_IFRAME_SRC)" && \
    VITE_DONATIONS_IMAGE_URL="$(cat /run/secrets/VITE_DONATIONS_IMAGE_URL)" && \
    VITE_HOWTOS_HEADING="$(cat /run/secrets/VITE_HOWTOS_HEADING)" && \
    VITE_COMMUNITY_PROGRAM_URL="$(cat /run/secrets/VITE_COMMUNITY_PROGRAM_URL)" && \
    VITE_QUESTIONS_GUIDELINES_URL="$(cat /run/secrets/VITE_QUESTIONS_GUIDELINES_URL)" && \
    VITE_NO_MESSAGING="$(cat /run/secrets/VITE_NO_MESSAGING)" && \
    echo "VITE_CDN_URL=\"${VITE_CDN_URL}\"" >> .env && \
    echo "VITE_BRANCH=\"${VITE_BRANCH}\"" >> .env && \
    echo "VITE_SENTRY_DSN=\"${VITE_SENTRY_DSN}\"" >> .env && \
    echo "VITE_GA_TRACKING_ID=\"${VITE_GA_TRACKING_ID}\"" >> .env && \
    echo "VITE_PATREON_CLIENT_ID=\"${VITE_PATREON_CLIENT_ID}\"" >> .env && \
    echo "VITE_PLATFORM_PROFILES=\"${VITE_PLATFORM_PROFILES}\"" >> .env && \
    echo "VITE_PROJECT_VERSION=\"${VITE_PROJECT_VERSION}\"" >> .env && \
    echo "VITE_SUPPORTED_MODULES=\"${VITE_SUPPORTED_MODULES}\"" >> .env && \
    echo "VITE_ACADEMY_RESOURCE=\"${VITE_ACADEMY_RESOURCE}\"" >> .env && \
    echo "VITE_API_URL=\"${VITE_API_URL}\"" >> .env && \
    echo "VITE_PROFILE_GUIDELINES_URL=\"${VITE_PROFILE_GUIDELINES_URL}\"" >> .env && \
    echo "VITE_SITE_NAME=\"${VITE_SITE_NAME}\"" >> .env && \
    echo "VITE_THEME=\"${VITE_THEME}\"" >> .env && \
    echo "VITE_DONATIONS_BODY=\"${VITE_DONATIONS_BODY}\"" >> .env && \
    echo "VITE_DONATIONS_IFRAME_SRC=\"${VITE_DONATIONS_IFRAME_SRC}\"" >> .env && \
    echo "VITE_DONATIONS_IMAGE_URL=\"${VITE_DONATIONS_IMAGE_URL}\"" >> .env && \
    echo "VITE_HOWTOS_HEADING=\"${VITE_HOWTOS_HEADING}\"" >> .env && \
    echo "VITE_COMMUNITY_PROGRAM_URL=\"${VITE_COMMUNITY_PROGRAM_URL}\"" >> .env && \
    echo "VITE_QUESTIONS_GUIDELINES_URL=\"${VITE_QUESTIONS_GUIDELINES_URL}\"" >> .env && \
    echo "VITE_NO_MESSAGING=\"${VITE_NO_MESSAGING}\"" >> .env

# Build application
RUN yarn run build

# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "yarn", "run", "start:prod" ]

