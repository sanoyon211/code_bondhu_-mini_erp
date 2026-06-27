const url = 'https://kaubgrgxvuasaomjplhs.supabase.co/rest/v1/purchases';
const headers = {
  'apikey': 'sb_publishable_1fAmEW5ttBCUuJQWyPLCgg_LxHxBCdJ',
  'Authorization': 'Bearer sb_publishable_1fAmEW5ttBCUuJQWyPLCgg_LxHxBCdJ',
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};

async function check() {
  const payload = {
    supplier_id: "583fea50-890d-4fdf-abca-63f5217154cb",
    product_id: "bf4173ee-a89c-4307-9356-b18b7364a67b",
    quantity: 1,
    unit_cost: 1,
    total_amount: 1
  };
  const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(payload) });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

check();
