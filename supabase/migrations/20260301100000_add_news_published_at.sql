ALTER TABLE news ADD COLUMN published_at timestamptz;

UPDATE news SET published_at = created_at WHERE (is_draft = false OR is_draft IS NULL);
