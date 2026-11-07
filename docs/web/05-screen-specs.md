# 05 — Screen Specs

Per-screen format: **Purpose · Layout · Elements · States · Actions ·
Acceptance criteria.**
Components refer to `06-components.md`. Exact text is in
`08-content-and-copy.md` (copy keys in parentheses when available).
All screens: mobile-first (360px), no horizontal scroll.

---

## M01 — Landing `/`

**Purpose:** explain the product in 30 seconds and invite owners to
create a shop; give judges a fast path to the demo.

**Layout (top to bottom):**
1. **Marketing header** (see `03` 4.1).
2. **Hero:** H1 (display), 1–2 sentence subtitle, `primary` "Create a
   free shop" button, `secondary` "See example shop" button (→
   `/toko-roti-ibu`). Desktop: text left, phone mockup of the shop view
   on the right (static visual component, not an external image).
3. **Problem → solution:** 3 short cards (icon + title + one sentence).
4. **How it works (anchor `#how-it-works`):** 3 numbered steps: Create
   shop → Add products → Share the link, customers order via WhatsApp.
5. **Who it's for:** row of business-type chips (coffee shop, bakery,
   catering, snacks, etc.).
6. **Honest note:** small card "Payment and delivery are handled
   directly between seller and buyer via WhatsApp."
7. **Closing CTA** + footer (privacy, "Built with WarungKu").

**States:** static; no loading/error.
**Criteria:** hero visible without scrolling at 360×640; main button ≥
44px; one H1; all links functional.

---

## M02 — Privacy policy `/privacy`

Simple text page (H1 + H2 sections): data collected (email, name, shop
WhatsApp number), shop WhatsApp number is public, no customer data is
stored, how to delete the account. Read width `max-w-prose`. *(Content
referenced from `08`; consult legal counsel if used outside the
competition.)*

---

## A01 — Register `/signup`

**Layout:** centered form card (`max-w-xl`), logo on top, H1 "Create a
free shop", "Already have an account? Log in" link.
**Fields:** Full name, Email, Password (min. 8 characters,
show/hide button), small consent: "By registering you agree to the
Privacy Policy" (link).
**Actions:** `primary` "Register" (full width on mobile).
**States:** idle · submitting (button loading, fields disabled) ·
per-field error · general error (banner above form, "Registration
didn't succeed. Try again.") · success (mock: redirect to D01).
**Criteria:** Zod validation (see `09`); inline error messages; Enter
submits the form; focus moves to the first error field.

## A02 — Log in `/login`

Like A01 with Email + Password fields, "Forgot password?" link (static
in Phase 1) and "No account yet? Register".
Credential errors use a generic message. Do not distinguish "email not
registered" from "wrong password".

---

## D01 — Overview `/dashboard`

**Purpose:** quick orientation and next steps.

**Variants by condition:**

| Condition | Display |
|---|---|
| No shop yet | Greeting card + **initial checklist** (Create shop · Add products · Publish) with step 1 highlighted and a `primary` "Create shop" button |
| Has shop, Draft | Progress checklist (per what's done) + status card "Shop not yet published" + Publish button (rules in F1) |
| Has shop, Published | **Shop link** card (URL, Copy, Share to WhatsApp, View shop, QR *optional*) + summary: product count, sold-out product count, category count + "Add product" shortcut |

**Elements:** `PageHeader` ("Hi, {first name}"), `StatusBadge`
Published/Draft, `ShareLinkCard`, simple stat cards (big number +
label; not a chart).
**States:** loading (card skeleton) · filled · error (banner + "Try
again" button).
**Criteria:** the next step is always one clear `primary` button; the
link card is only shown when published.

---

## D02 — My shop `/dashboard/toko`

**Create mode** (no shop yet) and **edit mode** use the same form
(`StoreForm`).

**Fields:**
| Field | UI rule | Helper text |
|---|---|---|
| Shop name (required) | 2–80 characters | — |
| Shop address / slug (required) | Lowercase, digits, hyphens; 3–40; not a forbidden word; **display the `warungku.id/` prefix** glued to the left of the input; typing is auto-normalized (space → `-`, lowercase) | "This is your shop's link address. Pick one that's easy to remember." |
| Description (optional) | Max 500, character counter | — |
| WhatsApp number (required) | Accepts `0812…`, `+62812…`, `62812…`; normalizes to `62…`; displays a readable format | "This number shows on your shop and is used to receive orders." |
| Logo (optional) | Circular `ImagePicker`, jpeg/png/webp, max 2 MB, preview | — |

**Publish settings:** separate card with a `PublishToggle` (Published /
Draft) and an explanation of the impact. Turning it off triggers a
confirmation dialog ("Your shop will no longer be visible to
customers").
**Slug behavior (mock):** availability check is simulated (slugs in the
seed are treated as taken) with an "Available / Taken" indicator after
a typing debounce (~400ms).
**Warning when changing the slug after publishing:** dialog "The old
link will stop working".
**States:** idle · dirty (Save button active, exit warning) · saving ·
per-field error · success (toast "Saved").
**Criteria:** number and slug normalization happens in the UI and is
covered by unit tests; the Save button is inactive when nothing changed.

---

## D03 — Product list `/dashboard/produk`

**Header:** H1 "Products" + `primary` "Add product" button. Below:
search box (name) and category filter (select) — client-side filter.
**List (mobile):** `ProductRow` card: 56px photo, name (max 2 lines),
price, category (small text), `AvailabilityToggle` (switch labeled
"Available"/"Sold out"), `⋯` menu (Edit, Delete). Tapping the row →
D05.
**List (desktop ≥ md):** table with columns Photo · Name · Category ·
Price · Status · Actions.
**Empty:** icon + "No products yet" + "Add your first product so
customers can order." + `primary` "Add product".
**Empty search results:** "No products match" + "Clear search" button.
**States:** loading (5 skeleton rows) · filled · empty · error.
**Quick actions:** Available/Sold-out toggle directly (optimistic +
"Undo" toast); delete via dialog (F2).
**Criteria:** no horizontal scroll at 360px; the toggle has an
`aria-label` naming the product; order follows `sortOrder` then newest.

## D04 / D05 — Product form `/dashboard/produk/baru` and `/[id]`

**Layout:** one column `max-w-xl`; on desktop a live product card
preview (the real `ProductCard` component) on the right that updates
as you type.
**Fields:**
| Field | UI rule |
|---|---|
| Product photo | Square `ImagePicker`, tap to select/take photo, preview, remove; jpeg/png/webp; client-side compression (see `07`) |
| Name (required) | 1–100 |
| Price (required) | Number input with "Rp" prefix; thousands separator as you type; stored as integer; 0–100,000,000; numeric keyboard on phone (`inputMode="numeric"`) |
| Category (optional) | Select from the shop's categories + "No category" option + "Add a new category" link (small dialog) |
| Description (optional) | Max 1000, counter |
| Available | Switch, default on |

**Actions:** `primary` "Save" · `secondary` "Cancel" · (D05)
`destructive` text "Delete product" below, separated.
**States:** idle · dirty · saving · error · D05 loading (skeleton) ·
D05 not found ("Product not found" + back to list).
**Criteria:** price is never stored as a decimal; common typos are
prevented (letters ignored in the price input); exit warning when
dirty.

---

## D06 — Categories `/dashboard/kategori`

**Layout:** card with a "Category name" input + "Add" button on top;
the category list below.
**Category row:** name (tap to inline-edit), product count, up/down
buttons (icon, `aria-label`), delete button.
**Validation:** 1–40 characters; duplicates (case-insensitive)
rejected inline.
**Delete:** dialog states how many products will become "No category".
**Empty:** "No categories yet" + helper "Categories help customers find
products. This is optional." (do not force it).
**Criteria:** reordering is immediately reflected in the list; fully
keyboard-accessible.

---

## P01 — Public catalog `/[slug]`

**Purpose:** clearly show the shop and its products, make adding to
cart easy.

**Layout (mobile):**
1. **StoreHeader** sticky: logo + shop name (truncated to 1 line) +
   cart icon with item-count badge.
2. **Shop info:** description (concise, "See more" if > 3 lines),
   product-count badge.
3. **CategoryTabs:** horizontally scrollable chips ("All" +
   categories); sticky below the header; (optional) search box.
4. **Product grid:** 2 columns (360px), 3 columns (≥ md), 4 columns
   (≥ lg).
5. **Floating cart bar** (mobile): appears when the cart is not empty,
   shows "{n} items · Rp xx" + a "View cart" button. Desktop: the
   header icon is enough, plus a summary in the sheet.
6. Footer: "Built with WarungKu".

**ProductCard:** 1:1 photo, name (max 2 lines), price, description
(optional, 2 lines, hidden on small cards if too dense), **"Add"**
button (`primary`, 44px). After adding, the button becomes a
`QuantityStepper` (− n +). Sold-out products: photo dimmed, "Sold
out" badge, "Unavailable" button disabled (`aria-disabled`).

**States:**
| State | Display |
|---|---|
| Filled | Grid |
| Shop with no products | Friendly empty: "This shop has no products yet. Check back soon." |
| All sold out | Info banner "All products are sold out" + grid with buttons disabled |
| Empty category filter | "No products in this category" + "See all" button |
| Loading (client nav) | Skeleton grid |

**Criteria:** no user-specific data; no `cookies()`; `next/image`
images with explicit dimensions; cart badge updates instantly; the cart
persists after refresh and is separated per slug.

## P02 — Cart (sheet)

Bottom sheet (mobile) / right panel (≥ md). Title "Cart".
**Item row (`CartItemRow`):** 56px photo, name, unit price,
`QuantityStepper` (1–99), subtotal, remove button (icon +
`aria-label`).
**Sheet footer:** "Estimated total" + amount, `primary` "Continue"
(→ P03), text button "Clear cart" (light confirmation).
**Empty:** icon + "Your cart is still empty" + "See products" button.
**Problem items** (after F5): the row is given a "Unavailable" badge
and a "Remove" button; "Continue" is disabled until resolved.
**Criteria:** quantity changes update the total without flicker;
quantity 0 asks to remove (not silently removed).

## P03 — Order details & checkout (sheet)

**Contents (in order):**
1. **Order summary** (concise item × quantity list, "Estimated
   total").
2. **Your name** field (required, 2–60), **Note for the seller**
   (optional, max 200, counter).
3. **Info box (info-subtle):** the required honesty text
   (`checkout.honesty`) above the button.
4. `whatsapp` button **"Continue to WhatsApp"** (full width, WA
   icon), with small text below "Final total confirmed by the seller".
5. Text link "Back to cart".

**Behavior:**
- Button press → brief loading state ("Preparing message…") → call
  `checkoutService.prepare()` (mock) → if OK, open `https://wa.me/...`
  in a new tab/app; if conflict, show **P05**.
- Prevent double clicks during processing.
- After WhatsApp opens, the sheet becomes the **"Already sent the
  message?"** panel containing: neutral text (`checkout.after`), a
  **"Copy message"** button (feedback "Copied"), a **"Back to
  catalog"** button, and (optional) **"Clear cart"**. A **"Order
  successful"** screen is **not allowed**.
- If the popup is blocked/WhatsApp did not open: show a manual
  "Open WhatsApp" link and a "Copy message" button.

**States:** idle · validation failed · preparing · conflict (P05) ·
ready/opened (post-WA panel) · general error ("Couldn't prepare the
message. Try again." + retry button).

## P05 — Item conflict (dialog)

Title "Some items are no longer available". List of problematic items
(name + reason: "Sold out" / "No longer sold"), list of remaining safe
items with the new total. `primary` button "Remove and continue"
(removes problematic items then re-checks), `secondary` "Back to
cart". If all are problematic: "All items in your cart are
unavailable" message + "See products".

## P04 — Shop not found

Icon + H1 "Shop not found" + "The shop address may be wrong, or the
shop is not open yet." + `primary` "Go to WarungKu" button and a
"Create your own shop" link.

## E01 — Generic 404

Like P04 with the text "Page not found" and a "Back to home" button.

---

## Cross-screen patterns

| Pattern | Rule |
|---|---|
| Loading | Skeleton that matches the final shape; action buttons show a spinner and are disabled |
| Data error | `danger-subtle` banner with icon, short message, "Try again" button; no technical detail |
| Form error | Inline under the field; focus on the first wrong field; error summary above the form if > 2 |
| Destructive confirmation | Dialog names the object, action button clearly labeled ("Delete product"), Cancel is the initial focus |
| Toast | Only for success/light feedback; action can be undone when possible |
| Navigation away from a dirty form | "Changes not saved" dialog with "Stay" / "Discard changes" |
