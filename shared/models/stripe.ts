export type StripeCustomer = {
  id: number;
  auth_id: string;
  stripe_customer_id: string;
  tenant_id: string;
  created_at: Date;
};

export type StripeCustomerInsert = {
  auth_id: string;
  stripe_customer_id: string;
  tenant_id: string;
};

export type StripeBadgeProduct = {
  id: number;
  stripe_product_id: string;
  badge_id: number;
  tenant_id: string;
};

export type StripeTierConfig = {
  id: number;
  badge_id: number;
  description: string;
  color: string;
  tenant_id: string;
};
