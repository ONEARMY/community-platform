#!/bin/bash
# To test production site locally requires a custom .env file with server environment variables
# to temporarily populate.
cp .env .env-default
cp ./.env-prod ./.env
npm run build
cp .env-default .env
rm .env-default
firebase serve
