alter table "public"."research_updates" add column "order" integer;

update "public"."research_updates" ru
set "order" = ranked.position
from (
  select id, row_number() over (partition by research_id order by created_at) - 1 as position
  from "public"."research_updates"
) ranked
where ru.id = ranked.id;

CREATE OR REPLACE FUNCTION "public"."set_research_update_order"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET search_path = public, pg_temp
    AS $$
BEGIN
  IF NEW."order" IS NULL THEN
    SELECT COALESCE(MAX(ru."order") + 1, 0) INTO NEW."order"
    FROM research_updates ru
    WHERE ru.research_id = NEW.research_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER "research_update_order_trigger" BEFORE INSERT ON "public"."research_updates" FOR EACH ROW EXECUTE FUNCTION "public"."set_research_update_order"();
