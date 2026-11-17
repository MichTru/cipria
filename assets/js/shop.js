// Catalogo e carrello: Shopify Storefront API, oppure catalogo demo se il token manca.
import { SHOPIFY } from './config.js';

export const isDemo = !SHOPIFY.domain || !SHOPIFY.storefrontToken;

const STORAGE_KEY = 'cipria-carrello';
const FAV_KEY = 'cipria-armadio';

async function storefront(query, variables = {}) {
  const res = await fetch(`https://${SHOPIFY.domain}/api/${SHOPIFY.apiVersion}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY.storefrontToken
    },
    body: JSON.stringify({ query, variables })
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors.map(e => e.message).join(', '));
  return json.data;
}

const PRODUCTS_QUERY = `
  query Prodotti($first: Int!, $query: String) {
    products(first: $first, query: $query, sortKey: CREATED_AT, reverse: true) {
      nodes {
        id handle title productType tags description
        priceRange { minVariantPrice { amount currencyCode } }
        featuredImage { url(transform: { maxWidth: 1200 }) altText }
        variants(first: 20) { nodes { id title availableForSale } }
      }
    }
  }`;

function normalize(p) {
  return {
    id: p.id,
    handle: p.handle,
    title: p.title,
    productType: p.productType,
    tags: p.tags,
    description: p.description,
    price: Number(p.priceRange.minVariantPrice.amount),
    currency: p.priceRange.minVariantPrice.currencyCode,
    image: p.featuredImage?.url || null,
    alt: p.featuredImage?.altText || p.title,
    variants: p.variants.nodes.map(v => ({ id: v.id, title: v.title, available: v.availableForSale }))
  };
}

export async function getProducts({ first = 24 } = {}) {
  if (isDemo) {
    const res = await fetch('data/catalogo-demo.json');
    const data = await res.json();
    return data.products.filter(p => !p.tags.includes(SHOPIFY.excludeTag));
  }
  const data = await storefront(PRODUCTS_QUERY, { first, query: `-tag:${SHOPIFY.excludeTag}` });
  return data.products.nodes.map(normalize);
}

export function formatPrice(amount, currency = 'EUR') {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

// Carrello locale: le righe restano nel browser finché si va al checkout.
function read(key) {
  try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
}
function write(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage non disponibile */ }
}

const listeners = new Set();
let lines = read(STORAGE_KEY);

export const cart = {
  get lines() { return lines; },
  get total() { return lines.reduce((s, l) => s + l.price * l.qty, 0); },
  get count() { return lines.reduce((s, l) => s + l.qty, 0); },
  subscribe(fn) { listeners.add(fn); fn(this); return () => listeners.delete(fn); },
  add(product, variant, qty = 1) {
    const found = lines.find(l => l.variantId === variant.id);
    if (found) found.qty += qty;
    else lines.push({
      variantId: variant.id, productId: product.id, title: product.title, size: variant.title,
      price: product.price, currency: product.currency, tinta: product.tinta || '#EAD9CF', image: product.image || null, qty
    });
    this.save();
  },
  setQty(variantId, qty) {
    lines = qty <= 0 ? lines.filter(l => l.variantId !== variantId) : lines.map(l => l.variantId === variantId ? { ...l, qty } : l);
    this.save();
  },
  save() { write(STORAGE_KEY, lines); listeners.forEach(fn => fn(this)); },
  async checkout() {
    if (isDemo) return { demo: true };
    const data = await storefront(`
      mutation CreaCarrello($lines: [CartLineInput!]!) {
        cartCreate(input: { lines: $lines }) {
          cart { checkoutUrl }
          userErrors { message }
        }
      }`, { lines: lines.map(l => ({ merchandiseId: l.variantId, quantity: l.qty })) });
    const { cart: created, userErrors } = data.cartCreate;
    if (userErrors.length) throw new Error(userErrors[0].message);
    return { url: created.checkoutUrl };
  }
};

// Armadio: preferiti salvati senza account.
export const armadio = {
  get ids() { return read(FAV_KEY); },
  has(id) { return this.ids.includes(id); },
  toggle(id) {
    const ids = this.ids;
    const next = ids.includes(id) ? ids.filter(i => i !== id) : [...ids, id];
    write(FAV_KEY, next);
    return next.includes(id);
  }
};
