alter table "public"."stripe_customers"
  drop constraint "stripe_customers_stripe_customer_id_key";

alter table "public"."stripe_customers"
  add constraint "stripe_customers_stripe_customer_id_tenant_id_key" unique ("stripe_customer_id", "tenant_id");
