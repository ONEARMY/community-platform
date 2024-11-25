---
id: integrations
title: Integrations
---

Integrations with 3rd party services can be handled by the `functions` backend. Any number of triggers can be used, including Cloud Firestore (database) Triggers, HTTP, and cron Triggers.

## Examples

### Post to slack on new howTo, event or map pin

This uses the [firestore document triggers](https://firebase.google.com/docs/functions/firestore-events) to recognise new database entries and make a http post to slack which uses a [webhooks](https://api.slack.com/messaging/webhooks) to add messages to a designated slack channel.

The full code can be seen at [`functions\src\Integrations\firebase-slack.ts`](https://github.com/ONEARMY/community-platform/blob/master/functions/src/Integrations/firebase-slack.ts) and exposed in [`functions\src\index.ts`](https://github.com/ONEARMY/community-platform/blob/master/functions/src/index.ts)

### Link user account to Patreon

This uses an [HTTP endpoint](functions/src/Integrations/patreon.ts) to communicate with the Patreon API. This should be done server-side to protect sensitive keys and auth codes. The endpoint is called from the frontend with a single-use access token. The token is used to grant an access code that we pass in to other Patreon API endpoints for authentication.

When a human links their Patreon account with the Community Platform, we access their Patreon user information from the Patreon API and store it in the users collection. We store sensitive access codes in the user_integrations collection which has stricter security rules.

## Configuration

Sometimes specific urls/api_keys need to be stored to use with the service. Rather than storing this values in code we are using config variables. This keeps them out of version control and prevents them being public.

To work with the [environment configuration](https://firebase.google.com/docs/functions/config-env#migrating_from_environment_configuration) you will need to be authenticated via the CLI and have edit access to the target Firebase instance.

Inspect the configuration on the current instance, this will return all values that have been set as an object.

```bash
firebase functions:config:get
```

Store values on the instance

```bash
firebase functions:config:set documentation=amazing

# You can set values in a nested object using dot notation
firebase functions:config:set nested.path=value
```

The implementation is at [`functions/src/config/config.ts`](https://github.com/ONEARMY/community-platform/blob/master/functions/src/config/config.ts).

## Development

Contact a maintainer in order to access the config variables needed to test these integrations locally. Or, set up your own test account on the integration platform and generate keys to play with! Just remember not to remove any sensitive info before pushing to Github 🤫
