# Supabase server

You're here for either the migrations or functions.

## Functions

Require a couple of env variables in .env to run locally:
```
RESEND_API_KEY=<from resend>
SEND_EMAIL_HOOK_SECRET=<anything>
```

Then run (in the project root):
```
supabase functions serve --env-file ./supabase/.env --no-verify-jwt
```

To deploy:
```
supabase functions deploy send-email --no-verify-jwt
```

Example CURL to hit send-email with:
```
curl --request POST 'http://127.0.0.1:54321/functions/v1/send-email' \ --header 'Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY>' \  --header 'Content-Type: application/json' \  --data '{ "email_data": { "email_action_type": "moderation_notification", "redirect_to": "http://community.preciousplastic.com/", "notification": { "title": { "triggeredBy": "precious-plastic", "middle": "has requested changes", "parentTitle": "Will AI kill us all?", "parentSlug": "research-slug" }, "body": "The title is a bit much", "slug": "research-slug/edit" } }, "user": {"email": "<your email address>"}}'
```
