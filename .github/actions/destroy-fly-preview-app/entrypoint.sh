#!/bin/sh -l

set -ex

# Change underscores to hyphens.
app="${INPUT_NAME//_/-}"


if ! flyctl status --app "$app"; then
  echo "App name not found"
  exit 1
fi

flyctl apps destroy "$app" -y
echo "App $app successfully destroyed"
exit 0