# Email Notifications

This folder contains code and templates that we use to send emails to users about missed notifications. This readme explains the notification and email process.

## Background on Notification and Email Process

Users receive notifications when other users comment on their content or mark it as useful. These are stored in a `notifications` array for each user in the `users` collection. When a notification is created, it has two fields, `read` and `notified` which track the user's interaction with the notification. A notification is marked as `notified=true` when it is rendered in the collapsed notification list dropdown as a red dot, which indicates the user has notifications. If the user clicks the dropdown to see the contents of their notifications, the notification is marked `read=true`.

If a user has not been active in the platform, then their notifications will remain un-notified and un-read. In these situations, we send them in an email.

Users can choose if they would like to receive these emails, and if so, at what cadence (daily, weekly, or monthly). They do this in their settings page. This is stored for each user in `notification_settings.emailFrequency`.

Based on the users `notifications` and `notification_settings`, the [user notifications aggregation](../aggregations/userNotifications.aggregations.ts) creates a `pending_emails` collection to store any notifications for users that are not yet `notified` or `read`. This aggregation is refreshed any time the `users` collection is updated.

The function [createNotificationEmails](./createEmail.ts) in this directory reads from the `pending_emails` collection and transforms the notifications for each user into a format that can be understood by our [handlebars](https://handlebarsjs.com/) email templates, which you can also find in this folder.

This data is then written to the `emails` collection in Firebase, which is set up with the [trigger email extension](https://firebase.google.com/docs/extensions/official/firestore-send-email) to send emails to users via [Brevo](https://www.brevo.com/) (formerly Sendinblue).

Once emails are successfully written to the `emails` collection database, we add an `emailed` field to the notification, which contains the id of the email object in the `emails` collection. Once a notification has been sent as an email, we exclude it from the `pending_emails` aggregation (we're not spammers 🙂).

## Technical Implementation

### Scheduled functions

We use [firebase scheduled functions](https://firebase.google.com/docs/functions/schedule-functions?gen=1st) in [index.js](./index.ts) to trigger the [createNotificationEmails](./createEmail.ts) function for the different email cadences. We use the following schedule:

- Daily emails: each day at 3pm Portugal Time
- Weekly emails: each Sunday at 3pm Portugal Time
- Monthly emails: first day of each month at 3pm Portugal Time

### Firebase extension

We use the [trigger email extension](https://firebase.google.com/docs/extensions/official/firestore-send-email) which is set up and managed for each database individually. Currently the extension is not part of the local emulator environments. To edit the configuration you must update it in the Firebase console directly.

The extension is set up using two collections: the `templates` collection which stores our handlebars email template and the `emails` collection, which triggers an email to be sent each time a document is added. You can find the expected structure for documents in these collections in the firebase documentation [here](https://firebase.google.com/docs/extensions/official/firestore-send-email/templates).

Once the document is added to the `emails` collection, a `delivery` field with additional information regarding the delivery status of the email will be appended to the document.

### Transactional Email Provider

The firebase email extension requires integration with a transactional email provider. We use [Brevo](https://www.brevo.com/) (formerly Sendinblue). This integration is managed within the firebase extension setup. You can login to our Brevo account to see information about sent emails.

### Email Templates

The templates tracked in this directory are NOT linked to the templates we use in production. They are included for reference and version control. The templates are stored in the `templates` collection in each of our databases, which is why we have different templates for different projects.

# Development

Development in this space is complicated because elements must be updated in conjunction in different places. This is an area that we will try to better automate in the future. For now, here is a suggested workflow:

1. If you are only changing the templates and not the required data, open a PR with the template changes for each project. Please include a screenshot of the changes with sample data using a handlebars sandbox like [this one](https://handlebarsjs.com/playground.html). Once approved, a maintainer will update the database templates on dev to test, then in production.
2. If you also have to change the data sent to the templates, make new versions of the `createNotificationEmails` function and the templates for each project (i.e. `createNotificationEmailsV2` + `pk-template-v2.handlebars` etc.) and open a PR. Once approved, a maintainer will test the new version on dev. Then, we will update the called function in `index.ts` to the new version and update the templates in production to release the changes.

### Testing

We do not have the email extension set up in the emulator environment, so testing the end-to-end flow is difficult locally. Here are suggested steps for testing:

1. Use unit tests to test the transformation of data in [createNotificationEmails](./createEmail.ts).
2. Use handlebars sandbox to test the templates with sample data.
3. \*Deploy the function to the development environment using the [firebase cli](https://firebase.google.com/docs/functions/get-started?gen=1st)
4. \*Set up trigger email extension on the dev environment with [mailtrap](https://mailtrap.io/home) credentials (you can set up your own account mailtrap for testing).
5. \*Trigger emails manually through the [admin notifications panel](../../../src/modules/admin/pages/adminNotifications.tsx).
6. \*Check function [logs](https://firebase.google.com/docs/functions/writing-and-viewing-logs?gen=1st) to debug errors.
7. \*Check emails in mailtrap.

\*Only available to maintainers with database access
