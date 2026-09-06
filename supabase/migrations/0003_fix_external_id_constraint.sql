-- The partial unique index from 0002 can't be used as an ON CONFLICT
-- target (Postgres requires the predicate to match exactly, which the
-- supabase-js upsert() API has no way to express). A plain unique index
-- works fine here: multiple NULL external_ids (all the demo rows) are
-- already treated as distinct by Postgres, so no predicate is needed.

drop index if exists products_source_external_id_idx;

create unique index if not exists products_source_external_id_idx
  on products (source, external_id);
