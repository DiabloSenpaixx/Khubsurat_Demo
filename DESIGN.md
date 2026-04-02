# Design System: The Heirloom Editorial

## 1. Overview & Creative North Star
**Creative North Star: "The Digital Atelier"**

This design system is not a template; it is a high-end digital gallery designed to mirror the tactile, bespoke experience of a luxury Pakistani bridal boutique. We move away from the rigid, boxy constraints of standard e-commerce to embrace **The Digital Atelier**—a philosophy where white space is as intentional as the embroidery on a gown.

By utilizing extreme "0px" sharpness (The Absolute Edge), intentional asymmetry, and a tonal layering strategy, we create an environment that feels expensive, curated, and quiet. This system breaks the "bootstrap" look by treating the screen as a high-fashion editorial spread rather than a functional grid.

---

## 2. Colors
Our palette is rooted in heritage and prestige, utilizing the Material Design convention to create a sophisticated, layered depth.

*   **Primary (#210000) & Primary Container (#4A0404):** These Deep Burgundy tones are reserved for moments of high impact—call-to-action buttons, high-level accents, and sophisticated "ink" moments.
*   **Secondary (#735C00) & Secondary Container (#FED65B):** Our Gold tones. Use these for ornamental borders and high-luxury details. Use the `secondary_fixed_dim` (#E9C349) for a more muted, metallic feel.
*   **Surface Hierarchy (The Cream Foundation):**
    *   `surface` (#FBFBE2): The base fabric of our UI.
    *   `surface_container_low` (#F5F5DC): Your primary sectioning color.
    *   `surface_container_highest` (#E4E4CC): Used for nested elements requiring the most "lift."

### Rules of Engagement
*   **The "No-Line" Rule:** Prohibit the use of 1px solid charcoal or burgundy borders to section off the UI. Separation must be achieved through shifts between `surface`, `surface_container_low`, and `surface_container_highest`.
*   **Surface Hierarchy & Nesting:** Treat the UI like stacked sheets of fine parchment. A card (`surface_container_lowest`) should sit on a background of `surface_container_low` to define its bounds naturally.
*   **The "Glass & Gold" Rule:** For floating navigation or product overlays, use `surface` with a 0.8 opacity and a 20px backdrop-blur. This simulates the frosted glass of a high-end display case.
*   **Signature Textures:** Apply a subtle linear gradient from `primary_container` (#4A0404) to `primary` (#210000) on hero buttons to provide a "velvet" depth that flat hex codes cannot achieve.

---

## 3. Typography
The typography system relies on the high-contrast tension between the ornate `notoSerif` (Playfair Display equivalent) and the architectural `manrope` (Montserrat equivalent).

*   **Display & Headline (notoSerif):** Used for brand storytelling and product names. The serif should feel "large and airy." Use `display-lg` (3.5rem) with negative letter-spacing (-0.02em) to create a sophisticated, editorial impact.
*   **Title & Body (manrope):** Used for navigation and descriptions. `body-lg` at 1rem should be tracked out slightly (+0.03em) to ensure a premium, breathable reading experience.
*   **Labels (manrope):** All-caps for `label-md` and `label-sm` is encouraged for utility items (e.g., "VIEW DETAILS") to create a sense of formal authority.

---

## 4. Elevation & Depth
In this system, we do not use "shadows" in the traditional sense; we use **Tonal Layering**.

*   **The Layering Principle:** To highlight a product card, do not use a drop shadow. Place the card on `surface_container_lowest` (#FFFFFF) and the surrounding background on `surface_container` (#EFEFD7). The contrast creates the "lift."
*   **Ambient Shadows:** If an element *must* float (e.g., a "Book Consultation" modal), use a shadow color derived from `on_surface` at 4% opacity with a 40px blur. It should look like a soft glow of light, not a dark stain.
*   **The "Ghost Border" Fallback:** For buttons or inputs, use the `secondary` gold at 30% opacity. This "Ghost Border" provides a hint of structure without interrupting the minimalist flow.
*   **The Absolute Edge:** With a `0px` roundedness scale, every element is sharp. This conveys precision and craftsmanship. Avoid rounded corners at all costs; they dilute the architectural "boutique" feel.

---

## 5. Components

### Buttons
*   **Primary:** Background: `primary_container`, Text: `on_primary`. Sharp corners (0px). High horizontal padding (Spacing 8).
*   **Secondary (Gold):** Background: Transparent, Border: 1px `secondary`, Text: `secondary`.
*   **Tertiary:** Text only in `primary`, `label-md` styling, with a 1px `primary` underline offset by 4px.

### Input Fields
*   **Styling:** Only a bottom border (1px) using `outline_variant`. No background fill.
*   **Focus State:** Bottom border transitions to `secondary` (Gold). Labels should float using `label-sm`.

### Cards & Lists
*   **The "No-Divider" Rule:** Never use horizontal lines to separate list items. Use Spacing 10 (3.5rem) to let content breathe or use alternating `surface` and `surface_container_low` background blocks.
*   **Product Cards:** Use an asymmetric layout. Place the product name (headline-sm) offset to the left and the price (title-sm) in a lighter weight to the right.

### Additional Components: The "Lookbook" Carousel
*   Instead of standard dots, use a progress bar made of a thin `outline_variant` line, with a `secondary` gold segment that expands as the user scrolls.

---

## 6. Do's and Don'ts

### Do:
*   **Use Asymmetry:** Place text blocks off-center to mimic high-fashion magazine layouts.
*   **Embrace Whitespace:** If you think there is enough space, double it. Use Spacing 20 (7rem) between major sections.
*   **Gold as an Accent:** Only use `secondary` (Gold) for interactive elements or very thin decorative borders.

### Don't:
*   **No Rounded Corners:** Never use border-radius. This system is defined by sharp, confident lines.
*   **No Heavy Shadows:** Avoid "Material Design" style shadows. Stick to background tonal shifts.
*   **No Standard Grids:** Avoid placing 3 or 4 cards in a perfectly even row. Try 2 large cards and 1 smaller, offset card to create visual interest.
*   **No Pure Black:** Always use `on_background` (#1B1D0E) or `tertiary` (#0A0A0A) for text to maintain the warmth of the cream palette.