const fs = require('fs');
const { createClient } = require("@supabase/supabase-js");

const envVars = fs.readFileSync('.env.local', 'utf8').split('\n').reduce((acc, line) => {
  const [key, val] = line.split('=');
  if (key && val) acc[key.trim()] = val.trim();
  return acc;
}, {});

const url = envVars.NEXT_PUBLIC_SUPABASE_URL;
const key = envVars.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(url, key);

async function test() {
  const { data, error } = await supabase.from("categories").upsert([
    { id: "test", name: "Test Category", tone: "blue", order_index: 0 }
  ]).select();
  console.log("Category upsert:", data, error);
  
  const { error: upsertError } = await supabase.from("products").upsert({
    id: "test-prod",
    category_id: "test",
    name: "Test Prod",
    colors: ["#111111|Preto", "#ffffff|Branco"]
  });
  console.log("Product upsert error:", upsertError);
}

test();
