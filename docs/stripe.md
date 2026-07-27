# Stripe Setup

## Overview

Stripe handles supporter subscriptions and membership tiers. It is **optional** for local development — if Stripe is not configured, the app will use stub data for tier config and pricing in development mode.

## Local Development (without Stripe)

No setup needed. When Stripe environment variables are not set, the app falls back to hardcoded stub prices and tier config. This is sufficient for most frontend development work.

## Local Development (with Stripe)

### 1. Create a Stripe account

Sign up at https://dashboard.stripe.com and use **test mode**.

### 2. Create products and prices

In the Stripe Dashboard, create products for each membership tier. Each product needs at least one recurring price.

The platform expects products to be mapped to badge tiers in the `stripe_badge_products` database table. After creating products in Stripe, you'll need to insert rows mapping each Stripe product ID to a badge:

```sql
INSERT INTO stripe_badge_products (tenant_id, stripe_product_id, name, badge_id)
VALUES
  ('precious-plastic', 'prod_xxx', 'Tier 1 Membership', <stripe-tier-1 badge id>),
  ('precious-plastic', 'prod_yyy', 'Tier 2 Membership', <stripe-tier-2 badge id>),
  ('precious-plastic', 'prod_zzz', 'Tier 3 Membership', <stripe-tier-3 badge id>);
```

Replace `prod_xxx`, `prod_yyy`, `prod_zzz` with the actual product IDs from your Stripe Dashboard.

You can find badge IDs by querying: `SELECT id, name FROM profile_badges WHERE name LIKE 'stripe-tier-%';`

### 3. Set environment variables

Add the following to your `.env.local`:

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

The secrets service will look for these in the Supabase vault first (as `{NAME}:{TENANT_ID}`, e.g. `STRIPE_SECRET_KEY:precious-plastic`), then fall back to environment variables.

### 4. Set up webhooks (optional)

To test webhook events locally, use the [Stripe CLI](https://docs.stripe.com/stripe-cli):

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

This will output a webhook signing secret (`whsec_...`) — use that as your `STRIPE_WEBHOOK_SECRET`.

The app handles these webhook events:
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_failed`

## Database Tables

- **`stripe_customers`** — Maps auth users to Stripe customer IDs
- **`stripe_badge_products`** — Maps Stripe product IDs to profile badges/tiers
- **`stripe_tier_config`** — UI configuration for each tier (color, description). Seeded automatically by `db:seed`

All tables use Row Level Security with tenant isolation via the `x-tenant-id` header.

## Production

For production/QA, Stripe secrets are stored in the Supabase vault as `{SECRET_NAME}:{TENANT_ID}` and retrieved via the `read_secret` database function. Product-to-badge mappings in `stripe_badge_products` must be configured with real Stripe product IDs.
