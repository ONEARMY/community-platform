# syntax = docker/dockerfile:1

FROM oven/bun:1.3.10 AS base

LABEL fly_launch_runtime="React Router"

# App lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Add CircleCI context variables as ARGs
ARG VITE_BRANCH
ARG VITE_SENTRY_DSN
ARG VITE_GA_TRACKING_ID

# Throw-away build stage to reduce size of final image
FROM base AS build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential pkg-config python-is-python3

# Copy source code
ADD . .

# Install packages
RUN bun install

RUN --mount=type=secret,id=VITE_BRANCH \
    --mount=type=secret,id=VITE_SENTRY_DSN \
    --mount=type=secret,id=VITE_GA_TRACKING_ID \
    VITE_BRANCH="$(cat /run/secrets/VITE_BRANCH)" && \
    VITE_SENTRY_DSN="$(cat /run/secrets/VITE_SENTRY_DSN)" && \
    VITE_GA_TRACKING_ID="$(cat /run/secrets/VITE_GA_TRACKING_ID)" && \
    echo "VITE_BRANCH=\"${VITE_BRANCH}\"" >> .env && \
    echo "VITE_SENTRY_DSN=\"${VITE_SENTRY_DSN}\"" >> .env && \
    echo "VITE_GA_TRACKING_ID=\"${VITE_GA_TRACKING_ID}\"" >> .env

# Build application (skip tsc type checking - already done in CI)
RUN bun run build:shared && bun run build:themes && bun run build:components && bun run build:vite

# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

# Start the server by default, this can be overwritten at runtime
ENV PORT=3000
EXPOSE 3000
CMD [ "bun", "./server.js" ]

