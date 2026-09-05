/**
 * Seeds the `products` table with the fictitious DEMO_PRODUCT catalog.
 * Run with: npm run seed
 *
 * Idempotent: clears existing DEMO_PRODUCT rows before inserting, so it's
 * safe to re-run after editing demoProducts.data.ts.
 */
import { createClient } from "@supabase/supabase-js";
import { demoProducts } from "../src/lib/catalog/demoProducts.data";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. " +
      "Copy .env.example to .env.local and fill in your Supabase project's values.",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey, {
  auth: { persistSession: false },
});

async function seed() {
  console.log(`Seeding ${demoProducts.length} demo products...`);

  const { error: deleteError } = await supabase
    .from("products")
    .delete()
    .eq("source", "DEMO_PRODUCT");

  if (deleteError) {
    throw new Error(`Failed to clear existing demo products: ${deleteError.message}`);
  }

  const rows = demoProducts.map((p) => ({
    source: "DEMO_PRODUCT",
    name: p.name,
    category: p.category,
    subcategory: p.subcategory,
    brand: p.brand,
    price: p.price,
    previous_price: p.previousPrice,
    currency: "BRL",
    image: p.image,
    url: "#",
    store: p.store,
    description: p.description,
    colors: p.colors,
    sizes: p.sizes,
    material: p.material,
    style: p.style,
    gender: p.gender,
    rating: p.rating,
    review_count: p.reviewCount,
    availability: true,
    tags: p.tags,
  }));

  const { data, error: insertError } = await supabase
    .from("products")
    .insert(rows)
    .select("id");

  if (insertError) {
    throw new Error(`Failed to insert demo products: ${insertError.message}`);
  }

  console.log(`Done. Inserted ${data?.length ?? 0} products.`);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
