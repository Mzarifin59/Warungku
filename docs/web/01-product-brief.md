# 01 — Product Brief

## 1. Problem

Many UMKM (Indonesian micro/small/medium businesses) sell via WhatsApp:
re-sending price lists through chat or images, then manually noting orders
from the conversation. The result: information goes stale quickly,
customers are confused about choices, and orders are often incomplete.

## 2. Solution

One shop link (`warungku.id/{slug}`) with a clean catalog. Customers pick
products and quantities, and WarungKu composes a **structured WhatsApp
message** to send to the seller. Owners only need to manage products from a
simple dashboard.

**Differentiator:** frictionless onboarding for non-technical owners, no
dependency on payment gateways or the WhatsApp Business API, and honest about
the limits of `wa.me`.

## 3. Personas

### Bu Ratna — home-bakery owner (primary)
- 42 years old, sells via WhatsApp and WA status. Uses a mid-range Android
  phone with a small screen.
- Comfortable with WhatsApp and Instagram, **not comfortable** with
  technical jargon.
- Needs: add products in minutes, quickly mark "Sold out", share the link.
- Worries: hassle, fear of mis-clicks, fear of losing data.

### Budi — customer (primary)
- 27 years old, orders from a phone, often from a link shared in a WA group.
- Needs: see products and prices clearly, see the total calculated, send the
  message without typing a long chat.
- Worries: uncertain prices/stock, not knowing whether the order "went
  through".

### Competition judges (secondary)
- Try it on a laptop and a phone in a few minutes. They need a flow that
  immediately looks functional and an interface that convinces.

## 4. UX principles

1. **One primary action per screen.** The main button is always clear.
2. **Everyday language.** Avoid terms like "slug", "publish", "SKU" in the
   UI; use "shop address", "publish", etc. (see `08`).
3. **Mobile-first.** Owners and customers mostly use phones.
4. **Honest about WhatsApp.** The UI never implies the order was received.
   See the rules in section 6.
5. **Safe from misclicks.** Destructive actions (delete) always require
   confirmation; frequent actions (mark Sold out) are one-tap and
   reversible.
6. **There is always a next step.** Every empty state has a call to
   action.
7. **Speed feels fast.** Skeletons for loading, optimistic UI for simple
   toggles.

## 5. Phase 1 scope (frontend)

### Must have
- Landing, Signup, Login (UI + mock).
- Dashboard: overview, shop settings, product list & form, category
  management.
- Public shop page with category filter, cart, and WhatsApp checkout.
- All states: loading, empty, error, filled, not-found, draft.
- Responsive 360px–1280px+.

### Nice to have
Copy/share-link button, shop QR code, in-catalog product search,
preview-the-shop-from-dashboard.

### Out of scope
Payments, delivery, numeric stock, multiple users per shop, dark mode,
multi-language, admin panel, analytics, PWA/offline, order history.

## 6. WhatsApp communication rules (UI must follow)

Opening `wa.me` **does not prove** the order was sent or received.
- Button label **"Continue to WhatsApp"**, not "Order now" or "Pay".
- Helper text must appear near the button: the order is only sent after the
  customer presses Send in WhatsApp, and the seller confirms availability
  and the final total.
- Total is labeled **"Estimated total"**.
- No "Order successful" screen/icon.
- After WhatsApp opens, show a light panel "Already sent the message?" with
  options **Copy message** and **Back to catalog**, without any claim about
  order status.

## 7. Interface success criteria

| Criterion | Target |
|---|---|
| New owner publishes a shop with 5 products | < 10 minutes (measured with 3–5 real people) |
| Customer from opening the link to WhatsApp open | < 1 minute for 3 items |
| Public page on phone | Feels instant; Lighthouse mobile score measured and reported |
| Main screens | No horizontal scroll at 360px |
| Accessibility | All forms labeled, full keyboard navigation |
