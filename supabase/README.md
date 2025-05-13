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
