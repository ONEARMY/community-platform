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
ARG REACT_APP_BRANCH
ARG REACT_APP_CDN_URL
ARG REACT_APP_FIREBASE_API_KEY
ARG REACT_APP_FIREBASE_AUTH_DOMAIN
ARG REACT_APP_FIREBASE_DATABASE_URL
ARG REACT_APP_FIREBASE_MESSAGING_SENDER_ID
ARG REACT_APP_FIREBASE_PROJECT_ID
ARG REACT_APP_FIREBASE_STORAGE_BUCKET
ARG REACT_APP_SENTRY_DSN
ARG REACT_APP_GA_TRACKING_ID
ARG REACT_APP_PATREON_CLIENT_ID
ARG REACT_APP_PLATFORM_THEME
ARG REACT_APP_PROJECT_VERSION
ARG REACT_APP_SUPPORTED_MODULES
ARG VITE_ACADEMY_RESOURCE
ARG VITE_PROFILE_GUIDELINES_URL
ARG VITE_SITE_NAME
ARG VITE_THEME
ARG VITE_DONATIONS_BODY
ARG VITE_DONATIONS_IFRAME_SRC
ARG VITE_DONATIONS_IMAGE_URL
ARG VITE_HOWTOS_HEADING
ARG VITE_COMMUNITY_PROGRAM_URL
ARG VITE_QUESTIONS_GUIDELINES_URL

# Throw-away build stage to reduce size of final image
FROM base AS build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Copy source code
ADD . .

# Install packages
RUN yarn install

RUN --mount=type=secret,id=REACT_APP_BRANCH \
    --mount=type=secret,id=REACT_APP_CDN_URL \
    --mount=type=secret,id=REACT_APP_FIREBASE_API_KEY \
    --mount=type=secret,id=REACT_APP_FIREBASE_AUTH_DOMAIN \
    --mount=type=secret,id=REACT_APP_FIREBASE_DATABASE_URL \
    --mount=type=secret,id=REACT_APP_FIREBASE_MESSAGING_SENDER_ID \
    --mount=type=secret,id=REACT_APP_FIREBASE_PROJECT_ID \
    --mount=type=secret,id=REACT_APP_FIREBASE_STORAGE_BUCKET \
    --mount=type=secret,id=REACT_APP_SENTRY_DSN \
    --mount=type=secret,id=REACT_APP_GA_TRACKING_ID \
    --mount=type=secret,id=REACT_APP_PATREON_CLIENT_ID \
    --mount=type=secret,id=REACT_APP_PLATFORM_THEME \
    --mount=type=secret,id=REACT_APP_PROJECT_VERSION \
    --mount=type=secret,id=REACT_APP_SUPPORTED_MODULES \
    --mount=type=secret,id=VITE_ACADEMY_RESOURCE \
    --mount=type=secret,id=VITE_PROFILE_GUIDELINES_URL \
    --mount=type=secret,id=VITE_SITE_NAME \
    --mount=type=secret,id=VITE_THEME \
    --mount=type=secret,id=VITE_DONATIONS_BODY \
    --mount=type=secret,id=VITE_DONATIONS_IFRAME_SRC \
    --mount=type=secret,id=VITE_DONATIONS_IMAGE_URL \
    --mount=type=secret,id=VITE_HOWTOS_HEADING \
    --mount=type=secret,id=VITE_COMMUNITY_PROGRAM_URL \
    --mount=type=secret,id=VITE_QUESTIONS_GUIDELINES_URL \
    REACT_APP_BRANCH="$(cat /run/secrets/REACT_APP_BRANCH)" && \
    REACT_APP_CDN_URL="$(cat /run/secrets/REACT_APP_CDN_URL)" && \
    REACT_APP_FIREBASE_API_KEY="$(cat /run/secrets/REACT_APP_FIREBASE_API_KEY)" && \
    REACT_APP_FIREBASE_AUTH_DOMAIN="$(cat /run/secrets/REACT_APP_FIREBASE_AUTH_DOMAIN)" && \
    REACT_APP_FIREBASE_DATABASE_URL="$(cat /run/secrets/REACT_APP_FIREBASE_DATABASE_URL)" && \
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID="$(cat /run/secrets/REACT_APP_FIREBASE_MESSAGING_SENDER_ID)" && \
    REACT_APP_FIREBASE_PROJECT_ID="$(cat /run/secrets/REACT_APP_FIREBASE_PROJECT_ID)" && \
    REACT_APP_FIREBASE_STORAGE_BUCKET="$(cat /run/secrets/REACT_APP_FIREBASE_STORAGE_BUCKET)" && \
    REACT_APP_SENTRY_DSN="$(cat /run/secrets/REACT_APP_SENTRY_DSN)" && \
    REACT_APP_GA_TRACKING_ID="$(cat /run/secrets/REACT_APP_GA_TRACKING_ID)" && \
    REACT_APP_PATREON_CLIENT_ID="$(cat /run/secrets/REACT_APP_PATREON_CLIENT_ID)" && \
    REACT_APP_PLATFORM_THEME="$(cat /run/secrets/REACT_APP_PLATFORM_THEME)" && \
    REACT_APP_PROJECT_VERSION="$(cat /run/secrets/REACT_APP_PROJECT_VERSION)" && \
    REACT_APP_SUPPORTED_MODULES="$(cat /run/secrets/REACT_APP_SUPPORTED_MODULES)" && \
    VITE_ACADEMY_RESOURCE="$(cat /run/secrets/VITE_ACADEMY_RESOURCE)" && \
    VITE_PROFILE_GUIDELINES_URL="$(cat /run/secrets/VITE_PROFILE_GUIDELINES_URL)" && \
    VITE_SITE_NAME="$(cat /run/secrets/VITE_SITE_NAME)" && \
    VITE_THEME="$(cat /run/secrets/VITE_THEME)" && \
    VITE_DONATIONS_BODY="$(cat /run/secrets/VITE_DONATIONS_BODY)" && \
    VITE_DONATIONS_IFRAME_SRC="$(cat /run/secrets/VITE_DONATIONS_IFRAME_SRC)" && \
    VITE_DONATIONS_IMAGE_URL="$(cat /run/secrets/VITE_DONATIONS_IMAGE_URL)" && \
    VITE_HOWTOS_HEADING="$(cat /run/secrets/VITE_HOWTOS_HEADING)" && \
    VITE_COMMUNITY_PROGRAM_URL="$(cat /run/secrets/VITE_COMMUNITY_PROGRAM_URL)" && \
    VITE_QUESTIONS_GUIDELINES_URL="$(cat /run/secrets/VITE_QUESTIONS_GUIDELINES_URL)" && \
    echo "REACT_APP_BRANCH=\"${REACT_APP_BRANCH}\"" >> .env && \
    echo "REACT_APP_CDN_URL=\"${REACT_APP_CDN_URL}\"" >> .env && \
    echo "REACT_APP_FIREBASE_API_KEY=\"${REACT_APP_FIREBASE_API_KEY}\"" >> .env && \
    echo "REACT_APP_FIREBASE_AUTH_DOMAIN=\"${REACT_APP_FIREBASE_AUTH_DOMAIN}\"" >> .env && \
    echo "REACT_APP_FIREBASE_DATABASE_URL=\"${REACT_APP_FIREBASE_DATABASE_URL}\"" >> .env && \
    echo "REACT_APP_FIREBASE_MESSAGING_SENDER_ID=\"${REACT_APP_FIREBASE_MESSAGING_SENDER_ID}\"" >> .env && \
    echo "REACT_APP_FIREBASE_PROJECT_ID=\"${REACT_APP_FIREBASE_PROJECT_ID}\"" >> .env && \
    echo "REACT_APP_FIREBASE_STORAGE_BUCKET=\"${REACT_APP_FIREBASE_STORAGE_BUCKET}\"" >> .env && \
    echo "REACT_APP_SENTRY_DSN=\"${REACT_APP_SENTRY_DSN}\"" >> .env && \
    echo "REACT_APP_GA_TRACKING_ID=\"${REACT_APP_GA_TRACKING_ID}\"" >> .env && \
    echo "REACT_APP_PATREON_CLIENT_ID=\"${REACT_APP_PATREON_CLIENT_ID}\"" >> .env && \
    echo "REACT_APP_PLATFORM_THEME=\"${REACT_APP_PLATFORM_THEME}\"" >> .env && \
    echo "REACT_APP_PROJECT_VERSION=\"${REACT_APP_PROJECT_VERSION}\"" >> .env && \
    echo "REACT_APP_SUPPORTED_MODULES=\"${REACT_APP_SUPPORTED_MODULES}\"" >> .env && \
    echo "VITE_ACADEMY_RESOURCE=\"${VITE_ACADEMY_RESOURCE}\"" >> .env && \
    echo "VITE_PROFILE_GUIDELINES_URL=\"${VITE_PROFILE_GUIDELINES_URL}\"" >> .env && \
    echo "VITE_SITE_NAME=\"${VITE_SITE_NAME}\"" >> .env && \
    echo "VITE_THEME=\"${VITE_THEME}\"" >> .env && \
    echo "VITE_DONATIONS_BODY=\"${VITE_DONATIONS_BODY}\"" >> .env && \
    echo "VITE_DONATIONS_IFRAME_SRC=\"${VITE_DONATIONS_IFRAME_SRC}\"" >> .env && \
    echo "VITE_DONATIONS_IMAGE_URL=\"${VITE_DONATIONS_IMAGE_URL}\"" >> .env && \
    echo "VITE_HOWTOS_HEADING=\"${VITE_HOWTOS_HEADING}\"" >> .env && \
    echo "VITE_COMMUNITY_PROGRAM_URL=\"${VITE_COMMUNITY_PROGRAM_URL}\"" >> .env && \
    echo "VITE_QUESTIONS_GUIDELINES_URL=\"${VITE_QUESTIONS_GUIDELINES_URL}\"" >> .env

# Build application
RUN yarn run build

# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "yarn", "run", "start" ]
