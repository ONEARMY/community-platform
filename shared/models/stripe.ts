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
