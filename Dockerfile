# base node image
FROM node:20-alpine as base

# set for base and all layer that inherit from it
ENV NODE_ENV production

# Install all node_modules, including dev dependencies
FROM base as deps

ADD package.json .yarnrc.yml ./
RUN yarn install

# Setup production node_modules
FROM base as production-deps

COPY --from=deps /node_modules /node_modules
ADD package.json .yarnrc.yml ./
RUN yarn prune --production

# Build the app
FROM base as build

COPY --from=deps /node_modules /node_modules

ADD . .
RUN yarn build

# Finally, build the production image with minimal footprint
FROM base

COPY --from=production-deps /node_modules /node_modules

COPY --from=build /build/server /build/server
COPY --from=build /build/client /build/client
ADD . .

CMD ["yarn", "start"]