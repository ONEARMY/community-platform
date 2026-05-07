ALTER TABLE tenant_settings ADD COLUMN pwa_icons JSONB;

ALTER TABLE tenant_settings
ADD CONSTRAINT check_pwa_icons_schema
CHECK (
  pwa_icons IS NULL
  OR (
    jsonb_typeof(pwa_icons) = 'object'
    AND pwa_icons - ARRAY['16','32','192','256','512'] = '{}'::jsonb
    AND (pwa_icons->>'16')  IS NOT NULL
    AND (pwa_icons->>'32')  IS NOT NULL
    AND (pwa_icons->>'192') IS NOT NULL
    AND (pwa_icons->>'256') IS NOT NULL
    AND (pwa_icons->>'512') IS NOT NULL
    AND jsonb_typeof(pwa_icons->'16')  = 'string'
    AND jsonb_typeof(pwa_icons->'32')  = 'string'
    AND jsonb_typeof(pwa_icons->'192') = 'string'
    AND jsonb_typeof(pwa_icons->'256') = 'string'
    AND jsonb_typeof(pwa_icons->'512') = 'string'
  )
);