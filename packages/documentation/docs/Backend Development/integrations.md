---
id: integrations
title: Integrations
---

Integrations with 3rd party services can be handled by the `functions` backend. Any number of triggers can be used, including Cloud Firestore (database) Triggers, HTTP, and cron Triggers

## Examples

### Post to slack on new howTo, event or map pin

This uses the [firestore document triggers](https://firebase.google.com/docs/functions/firestore-events) to recognise new database entries and make a http post to slack which uses a [webhooks](https://api.slack.com/messaging/webhooks) to add messages to a designated slack channel.

The full code can be seen at [`functions\src\Integrations\firebase-slack.ts`](https://github.com/ONEARMY/community-platform/blob/master/functions/src/Integrations/firebase-slack.ts) and exposed in [`functions\src\index.ts`](https://github.com/ONEARMY/community-platform/blob/master/functions/src/index.ts)

## Configuration

Sometimes specific urls/api_keys need to be stored to use with the service. This is best done using config variables so that they are not exposed publically, such as those described at [`functions/src/config/config.ts`](https://github.com/ONEARMY/community-platform/blob/master/functions/src/config/config.ts).
