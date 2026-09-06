-- Support caching real products pulled from external sources (e.g. Lomadee)
-- into the same `products` table used by the demo catalog. `id` stays our
-- own uuid (so AI-referenced ids are always ours, never a raw external id);
-- `external_id` is the natural key for upserting on re-fetch.

alter table products add column if not exists external_id text;

create unique index if not exists products_source_external_id_idx
  on products (source, external_id)
  where external_id is not null;
