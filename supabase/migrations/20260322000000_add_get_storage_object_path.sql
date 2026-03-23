CREATE OR REPLACE FUNCTION public.get_storage_object_path(
  object_id uuid,
  bucket_name text
)
RETURNS TABLE (
  id uuid,
  name text,
  path_tokens text[],
  bucket_id text
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    so.id,
    so.name,
    so.path_tokens,
    so.bucket_id
  FROM storage.objects so
  WHERE so.id = object_id
    AND so.bucket_id = bucket_name;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_storage_object_path(uuid, text) TO authenticated;
