alter type "public"."content_types" rename to "content_types__old_version_to_be_dropped";

create type "public"."content_types" as enum ('questions', 'projects', 'research', 'news', 'comment');

alter table "public"."categories" alter column type type "public"."content_types" using type::text::"public"."content_types";

alter table "public"."useful_votes" alter column content_type type "public"."content_types" using content_type::text::"public"."content_types";

drop type "public"."content_types__old_version_to_be_dropped";


