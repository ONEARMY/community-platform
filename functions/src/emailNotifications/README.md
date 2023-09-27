# Email Notifications

This folder contains code that we use to send emails to users about missed notifications. This readme explains the notification and email process.

## Background on Notifications

Users receive notifications when other users interact with their content. These are stored in a `notifications` array for each user in the `users` collection. When a notification is created, it has `read` and `notified` boolean fields which track the user's interaction with the notification. A notification is marked as `notified=true` when it is rendered in the collapsed notification list dropdown as a red dot, which indicates the user has notifications. If the user clicks the dropdown to see the contents of their notifications, the notification is marked `read=true`.

If a user has not been active in the platform, then their notifications will remain un-notified and un-read. In these situations, we send them in an email.

Users can choose if they would like to receive these emails, and if so, at what cadence (daily, weekly, or monthly). They do this in their settings page. This is stored for each user in `notification_settings.emailFrequency`.

## Notification Email Process

Based on the user's `notifications` and `notification_settings`, the [user notifications aggregation](../aggregations/userNotifications.aggregations.ts) creates a `pending_emails` collection to store any notifications for users that are not yet `notified` or `read`. This aggregation is refreshed any time the `users` collection is updated.

The function [createNotificationEmails](./createNotificationEmails.ts) in this directory reads from the `pending_emails` collection and writes to the `emails` collection. The `emails` collection is set up with the [trigger email extension](https://firebase.google.com/docs/extensions/official/firestore-send-email) to send emails to users via [Brevo](https://www.brevo.com/) (formerly Sendinblue).

The object written to the `emails` collection must be in the format

```
{
  to: 'someone@example.com',
  message: {
    subject: 'Hello from One Army!',
    html: 'This is an <code>HTML</code> email body.',
  },
}
```

The function [getNotificationEmailTemplate](./getNotificationEmailTemplate.ts) dynamically generates a subject line and html string to enter into the `emails` collection for each `pendingEmails` object.

Once emails are successfully written to the `emails` collection database, we add an `emailed` field to the notification, which contains the `_id` of the email object in the `emails` collection. If an error occurs in the email function, we populate this field with the string `'failed'`.

Once a notification has been sent as an email, we exclude it from the `pending_emails` aggregation (we're not spammers 🙂).

## Technical Implementation

### Scheduled functions

We use [firebase scheduled functions](https://firebase.google.com/docs/functions/schedule-functions?gen=1st) in [index.js](./index.ts) to trigger the [createNotificationEmails](./createNotificationEmails.ts) function for the different email cadences. We use the following schedule:

- Daily emails: each day at 3pm Portugal Time
- Weekly emails: each Sunday at 3pm Portugal Time
- Monthly emails: first day of each month at 3pm Portugal Time

### Firebase extension

We use the [trigger email extension](https://firebase.google.com/docs/extensions/official/firestore-send-email) which is set up and managed for each database individually. Currently the extension is not part of the local emulator environments. To edit the configuration you must update it in the Firebase console directly.

Once the document is added to the `emails` collection, a `delivery` field with additional information regarding the delivery status of the email will be appended to the document.

### Transactional Email Provider

The firebase email extension requires integration with a transactional email provider. We use [Brevo](https://www.brevo.com/) (formerly Sendinblue). This integration is managed within the firebase extension setup. You can login to our Brevo account to see information about sent emails. Reach out to a maintainer with questions about this.

## Development and Testing

We do not have the email extension set up in the emulator environment, so testing the end-to-end flow is difficult locally. Here are suggested steps for development and testing:

### Changes to email UI

1. Make changes to the function.
2. Use the [unit tests](./createNotificationEmails.spec.ts) to test new transformation functionality and generate new html snapshots.

Additionally you can run `yarn serve:email-templates` to run a local vite server that will serve the email templates. This is useful for testing the email templates in a browser. You can find the code for this in the [development](./development) directory.

### Changes to email sending logic\*

1. Make changes to the function.
2. \*Deploy the function to the development environment using the [firebase cli](https://firebase.google.com/docs/functions/get-started?gen=1st)
3. \*Set up trigger email extension on the dev environment with [mailtrap](https://mailtrap.io/home) credentials (you can set up your own account mailtrap for testing).
4. \*Trigger emails manually through the [admin notifications panel](../../../src/modules/admin/pages/adminNotifications.tsx).
5. \*Check function [logs](https://firebase.google.com/docs/functions/writing-and-viewing-logs?gen=1st) to debug errors.
6. \*Check emails in mailtrap.

\*Only available to maintainers with database access. Reach out to a maintainer if you need assistance.
