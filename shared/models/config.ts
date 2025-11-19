/************** Interfaces ************** */
export interface IServiceAccount {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
}
export interface IAnalytics {
  tracking_code: string;
  view_id: string;
}
export interface IIntergrations {
  slack_webhook: string;
  discord_webhook: string;
  discord_alert_channel_webhook: string;
  patreon_client_id: string;
  patreon_client_secret: string;
}
export interface IDeployment {
  site_url: string;
}

export interface configVars {
  service: IServiceAccount;
  analytics: IAnalytics;
  integrations: IIntergrations;
  deployment: IDeployment;
}
