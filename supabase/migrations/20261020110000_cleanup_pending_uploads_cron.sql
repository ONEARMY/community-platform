CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "pg_catalog";

SELECT cron.schedule(
  'cleanup-pending-uploads',
  '0 * * * *',
  $$
  SELECT net.http_post(
    url := public.read_secret('project_url') || '/functions/v1/cleanup-pending-uploads',
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body := '{}'::jsonb
  );
  $$
);
