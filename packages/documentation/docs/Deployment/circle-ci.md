# Deployment via CircleCI

We use CircleCI to handle automated build-test-deploy cycles when PRs and releases are created from the GitHub Repository

## Environment Variables

The following environment variables should be set within the [CircleCI Environment](https://circleci.com/docs/2.0/env-vars/), or via [CircleCI Contexts](https://circleci.com/docs/2.0/contexts/)

### Runtime Variables

Any variables prefixed with `VITE_` are automatically included with the runtime build. Currently we require:

Sentry error tracking

```
VITE_SENTRY_DSN
```

Google Analytics

```
VITE_GA_TRACKING_ID
```

### Misc Variables

Proposed (but not currently implemented)

```
LIGHTHOUSE_API_KEY
```
