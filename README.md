# Pola Vida Website: Prototype (Design A + Design B)

One folder, 29 pages, two designs. Built 22 Oct 2026 from Pola's own drafts
("Designer Handover", "Website Draft – whole website") and the SOW.

## Open it
- **On your computer:** double-click `index.html`. Everything works from disk; no server needed.
- **On Netlify:** drag this whole folder onto app.netlify.com/drop. The site sends `noindex`, so Google will not list it.

## The design switch
Every page has a **Design A / B** switch in the bottom-left corner (bottom-right on phones).
- **A · Faithful:** Pola's approved homepage layout, carried through every page.
- **B · Immersive:** same copy, colours and photos; full-photo heroes, a transparent header, dark burgundy panels and editorial layouts.
- The choice is remembered while you click through the site.
- Send Pola a specific design with a link: `index.html?v=a` or `index.html?v=b` (works on any page).

## Pages
| Area | Files |
|---|---|
| Core | index, about, contact, testimonials |
| Tantra & Coaching | tantra-coaching, for-men, for-women, for-couples, private-retreats |
| Retreats | retreats, tantra-for-all, retreat (detail template) |
| Training | training (Foundations + Modules 1 to 5 + private training) |
| Events | events (calendar with category filters), booking (registration form) |
| Shop (SOW) | shop, product, cart, checkout, order-confirmed |
| Members (SOW) | courses, course, login (login / register / forgot password), account (dashboard), lesson (protected player) |
| Legal | imprint, privacy, terms (placeholders), 404 |

Header on every page: full menu, EN / PT / DE / ES switcher (prototype; WPML does the translation at build), member login, cart with item count.

## What works in the prototype
- Menus, dropdowns, mobile menu, language menu
- Sliders (arrows, swipe, auto-play that pauses on hover or touch)
- Event calendar filters (Training, Tantra, Massage, Retreat, Couples, Men, Women, Singles, Workshop)
- Add to cart, cart quantities, checkout flow to "Order confirmed" (no payment taken)
- Login, register and forgot-password screens leading to the members dashboard
- Dashboard tabs: My Courses, Downloads, Orders, My Events, Profile
- Forms validate and show a confirmation; nothing is sent anywhere

## Animations
Hero text rises in; hero photos drift slowly and move with gentle parallax; sections and cards fade up as you scroll; images reveal with a soft wipe; Sri Yantra and mandala lines rotate very slowly; the header shrinks on scroll; cards lift on hover.
All animations switch off for visitors who choose "reduce motion" in their device settings, and content is never hidden in print or screenshots.

## Content rules followed
- All copy comes from Pola's drafts and her current website. Nothing invented.
- **Highlighted text** (gold dashed underline) = still to come from Pola: dates, venues, prices, subtitles, product names, the meditation title, the male graduate quote, WhatsApp/Telegram, the original logo.
- Prices shown highlighted on the Tantra, Couples and Training pages are **from the current polavida.com** and must be confirmed by Pola.
- No nudity in any photo (SOW brief).

## Photos
76 WebP images from Pola's Drive ("Pola Vida - Images & Videos"), one consistent warm-natural colour grade.
- Professional sets used first: Pola's portrait session, the men's retreat shoot, the training group, the Sanctuary venue folder.
- 14 lower-resolution phone/WhatsApp photos were enlarged with AI super-resolution (FSRCNN) and sharpened: tantra_hero, women_hero, couples_hero, private_hero, forall_hero, shop_hero, tantra_room, house, private_room, private_pool, yurt_land, tent, sunset, card_group.
  Upscaling makes them crisper but cannot add detail the camera did not capture; replace them when better originals exist.

## Decisions to show Pola
1. Two designs, same content: she picks the direction first, then section-level details.
2. Colours: exactly her handover values; no new colours.
3. Contrast: small labels on gold/sand use the darker terracotta from her own draft, to reach 4.5:1.
4. Fonts are embedded in the site (no request to Google; GDPR-friendly, and they work offline).
5. Button labels kept as in her drafts; her handover suggests unifying them later.
6. Shop and members area follow the SOW; product list, prices, payment gateway and video hosting (SproutVideo or other) are open.

## Still owed by Pola
Logo · hero headline (final) · training start date · event dates, venues, prices · course and product list · e-book titles · meditation title · testimonial videos (6 files exist in Drive › Testimonials) · men's quotes (Andreas, Jim, Roelof, Uros) · qualifications list · legal texts · WhatsApp number · Telegram username.

## Files
```
*.html            29 pages (relative links)
assets/css/       style.css (both designs, fonts embedded)
assets/js/        main.js (no libraries)
assets/img/       76 WebP images
assets/fonts/     font licences (SIL OFL)
favicon.svg  netlify.toml  robots.txt  README.md
```
