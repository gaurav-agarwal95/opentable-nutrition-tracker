import React, { useState, useEffect, useRef } from "react";

// Curated photo sets — 10 restaurant photos + 9 dish photos, cycled by index
// (modulo) across every card instance rather than needing one unique photo
// per card. See ImagePlaceholder's `src` prop below for how these get used.
import restaurant1 from "./assets/restaurants/restaurant_1.jpg";
import restaurant2 from "./assets/restaurants/restaurant_2.jpg";
import restaurant3 from "./assets/restaurants/restaurant_3.jpg";
import restaurant4 from "./assets/restaurants/restaurant_4.jpg";
import restaurant5 from "./assets/restaurants/restaurant_5.jpg";
import restaurant6 from "./assets/restaurants/restaurant_6.jpg";
import restaurant7 from "./assets/restaurants/restaurant_7.jpg";
import restaurant8 from "./assets/restaurants/restaurant_8.jpg";
import restaurant9 from "./assets/restaurants/restaurant_9.jpg";
import restaurant10 from "./assets/restaurants/restaurant_10.jpg";
import dish1 from "./assets/dishes/dish_1.jpg";
import dish2 from "./assets/dishes/dish_2.jpg";
import dish3 from "./assets/dishes/dish_3.jpg";
import dish4 from "./assets/dishes/dish_4.jpg";
import dish5 from "./assets/dishes/dish_5.jpg";
import dish6 from "./assets/dishes/dish_6.jpg";
import dish7 from "./assets/dishes/dish_7.jpg";
import dish8 from "./assets/dishes/dish_8.jpg";
import dish9 from "./assets/dishes/dish_9.jpg";

const RESTAURANT_PHOTOS = [
  restaurant1, restaurant2, restaurant3, restaurant4, restaurant5,
  restaurant6, restaurant7, restaurant8, restaurant9, restaurant10,
];
const DISH_PHOTOS = [dish1, dish2, dish3, dish4, dish5, dish6, dish7, dish8, dish9];
const restaurantPhoto = (i) => RESTAURANT_PHOTOS[i % RESTAURANT_PHOTOS.length];
const dishPhoto = (i) => DISH_PHOTOS[i % DISH_PHOTOS.length];

/* ============================================================================
   OPENTABLE NUTRITION TRACKER — combined prototype
   VERSION: v0.61

   This is the master interactive prototype, combining all flows into one
   clickable artifact. New flows get added here going forward (Flow 3 next).
   Screens so far:
   - Flow 1: Set & Manage Goals — Profile page + Goal-setup modal
   - Flow 2: Monitor Progress — Nutrition Goals dashboard + Goal activity log
   - Flow 3: Goal-Aware Recommendations — Homepage + Search results +
     Booking confirmation

   Navigation wired in this version:
   - Header's Nutrition Goals (target) icon -> Dashboard, on every screen
   - Header logo -> Profile, on every screen
   - Left-nav "Profile" / "Nutrition Goals" items -> switch screens
   - Profile page's Diner Profile "Nutrition goals" row -> opens the
     goal-setup modal (unchanged from Flow 1 — this is for editing the
     goal, distinct from the left-nav item which VIEWS the dashboard)
   - Dashboard's "Goal activity" link -> Activity log screen

   FLOW 1 HISTORY (condensed — this content shipped as its own artifact
   through v0.1 -> v0.7 before being folded in here): font-family fixes on
   form controls, real extracted icon paths throughout, real logo SVG,
   heading-weight correction (800 -> 700 to compensate for BrandonText not
   being loadable here), missing "Your details" fields restored, card
   padding corrected to CSS-verified 24px on all sides, divider/row-title
   fixes, "NEW" badges removed (not a real OpenTable pattern), chip labels
   shortened to "More protein" / "More plant-forward", and a `tracking`
   field added to each goal ('target' / 'tally' / 'none') documenting how
   Manage weight and Balanced eating should be measured on the dashboard —
   built in Flow 2 below using exactly that field.

   NAVIGATION MAP (updated in v0.2):
   - Logo -> Home (was Profile in v0.1 — corrected, matches real OpenTable
     IA where the logo always links to the homepage, not the account)
   - Avatar (GA circle) -> Profile (new in v0.2)
   - Header target icon -> Dashboard, left-nav "Nutrition Goals" -> Dashboard
   - Homepage: "Let's go" / any prompt card -> Search results
   - Search results: any time-slot pill -> Booking confirmation
   - Booking confirmation: "Complete reservation" -> Home
   - Dashboard: "Goal activity" -> Activity log

   CHANGELOG v0.60 -> v0.61:
   - First real photos in the prototype: 2 hero images provided directly
     by the user, replacing both remaining full-width placeholders.
     - Homepage hero: hatch-pattern placeholder replaced with the real
       photo as a background-image, with a new translucent dark overlay
       div on top for text legibility (the hatch pattern was previously
       standing in for both the photo AND an opaque tint at once; now
       they're two real, separate layers — photo, then a semi-
       transparent rgba(47,45,65,0.6) wash, matching the same color the
       hatch was originally approximating).
     - Dashboard hero: solid dark panel replaced with the real photo.
       This one already has a natural dark-to-light gradient built into
       its own left side, so no separate overlay was added — just
       background-position:'left center' to keep that dark region
       anchored under the text rather than letting a center-crop drift
       the lighter part of the photo into the text area.
   - Both images resized and JPEG-compressed before embedding (1200px/
     1600px wide respectively, quality 68-78) and embedded directly as
     base64 data URIs — no external hosting dependency, consistent with
     how any future photo additions to this prototype should be handled.

   CHANGELOG v0.59 -> v0.60:
   - Goal-alignment micro-toggle rebuilt per direct discussion (Option A
     of several proposed): a Yes/No segmented pill pair instead of a
     single checkbox, reusing the exact same selected-pill treatment
     already established by FilterPill elsewhere (2px red border, no
     fill) rather than inventing a new selection pattern for this one
     field. goalAligned changed from a plain boolean to tri-state
     (null/true/false), since "unanswered" and "explicitly said no" are
     now meaningfully different states with two independent buttons,
     unlike a single checkbox where they'd render identically.

   CHANGELOG v0.58 -> v0.59:
   - Booking Confirmation screen rebuilt against real outerHTML for the
     first time — every previous version was built from general
     judgment, not sourced markup. Real fixes/additions:
     - Added the 3-step progress stepper (entirely missing before).
     - Photo corrected 72x72 -> 160x160 (real size); restaurant name is
       a real link; the meta line was one plain "·"-joined text row —
       real markup has 3 separate icon+text rows (calendar/clock/
       person, reusing icons already sourced elsewhere in this file).
     - "Add a special menu" is a real bordered button with the real
       filled plus icon (new Ic.PlusFilled, kept separate from the
       existing hand-drawn Ic.Plus used by the Search Results map
       placeholder, so that placeholder's own flagging isn't muddied).
     - "OpenTable Regulars" was using the wrong icon (gift/Reward) —
       replaced with the real icPoints diamond icon (new Ic.Points).
     - Real restaurant policy text restored verbatim, including the
       specific contact email that had been dropped/paraphrased away.
     - Occasion select was missing 2 of 5 real options ("Business Meal,"
       "Celebration").
     - Special request field corrected from a plain single-line input to
       a real textarea with the real maxlength (75) and placeholder.
     - Phone field now shows a country-code prefix affordance instead of
       looking like a plain text input, without replicating the real
       page's full country-list dropdown.
   - The goal-alignment micro-toggle remains this exercise's own
     addition (PRD §9D) — explicitly noted in code as having no real
     OpenTable equivalent, not something the rebuild was trying to
     source.
   - One honest gap flagged rather than guessed: the real stepper
     distinguishes "completed" vs. "current" step via two different CSS
     classes that weren't resolvable from HTML alone (no matching CSS
     available) — simplified to 3 identical solid-red segments.

   CHANGELOG v0.57 -> v0.58:
   - Goal set replaced per direct discussion: More protein / More fiber /
     More plant-forward / Less added sugar / More balanced meals, with
     "Just exploring" set apart under its own "Not sure yet?" label
     rather than sitting as a 6th equal chip in the grid — matching how
     the PRD already described it in words but never showed visually.
     All 5 real goals now get the frequency stepper (hasFrequency:true,
     tracking:"target"); only "Just exploring" has neither. The old
     "tally" tracking type (Manage weight/Balanced eating) is no longer
     used with this set.
   - GOAL_PROMPT and GOAL_DISHES updated to match: protein/plant/balanced
     keys kept (content reused), sodium/weight keys removed, new
     fiber/sugar keys added with 15 dishes each, reusing the same
     restaurant names already established elsewhere for continuity.
   - Chip given whiteSpace:nowrap and the modal widened 640px -> 760px,
     per direct instruction, so every label (including the longer "More
     balanced meals" and "Less added sugar") reliably stays on one line
     at desktop widths instead of risking a wrap.
   - Confirmed no stale references to the removed sodium/weight IDs
     remain anywhere else in the file, and that the app's default
     pre-selected goal ("protein") and the dish-carousel's fallback key
     ("balanced") both still resolve correctly against the new list.

   CHANGELOG v0.56 -> v0.57:
   - Ic.Target replaced again — v0.56's hand-built approximation (from a
     raster PNG reference) didn't look right. This time a real vector
     SVG source was provided directly, so the exact paths and
     transforms are used as-is, not approximated: only the hardcoded
     fill="#000000" was swapped for the color prop (to match this
     file's existing icon convention) and the canvas adapted to
     0 0 512 512 (the real source's native size, no explicit viewBox in
     the original). Same icon, used throughout the app, updated
     everywhere at once again.

   CHANGELOG v0.55 -> v0.56:
   - Ic.Target replaced with a bullseye-with-arrow design per direct
     request (user-provided reference PNG). Only a raster image was
     provided, no vector source, so this is a hand-built SVG
     approximation of that reference's composition (3 concentric rings,
     filled center dot, diagonal arrow with triangular head and tail
     fletching) rather than a pixel-perfect trace — flagged as such in
     code. This icon is used throughout the app (header nav, Dashboard,
     Profile, etc.), so this one change updates it everywhere at once.

   CHANGELOG v0.54 -> v0.55:
   - Homepage's "Location, Restaurant, or Cuisine" search field
     placeholder was reading as medium/bold — fontWeight:500 -> 400.
     This one is a plain <span> styled to mimic a placeholder (not a
     real input with ::placeholder), so no CSS-class workaround was
     needed here, unlike the Concierge input fix earlier — just a
     direct inline style change.

   CHANGELOG v0.53 -> v0.54:
   - Default frequency bumped 3 -> 5 meals/month, per direct instruction,
     in both places it's set: the App-level pre-selected default goal on
     load, and the Goal-setup modal's stepper default for a fresh
     selection. The modal's `frequency` is a single shared piece of
     state across ALL hasFrequency goals (Protein/Reduce sodium/More
     plant-forward) — switching between goal chips within the same
     modal session never resets it — so this one change covers every
     goal's default, not just protein's, directly satisfying the second
     part of the request without needing separate per-goal logic.

   CHANGELOG v0.52 -> v0.53:
   - v0.52 removed the wrong thing — it removed the Diner Profile page's
     "Nutrition goals" summary row, but the actual request was to remove
     "Nutrition Goals" from the account LEFT NAVIGATION (the Profile/
     Settings sidebar), since that's what's genuinely redundant with the
     header's Nutrition Goals icon (both linked to the Dashboard). Fully
     reverted v0.52's changes — the Diner Profile row, goalSummary(),
     and ProfilePage's savedGoal/onOpenGoalModal props are all restored
     exactly as they were in v0.51 — then applied the correct change:
     removed "Nutrition Goals" from LeftNav's items array. LeftNav is
     only ever rendered on Profile and Settings (confirmed no other
     screen references it), so this doesn't orphan anything.

   CHANGELOG v0.51 -> v0.52:
   - [REVERTED in v0.53 — see above. This entry preserved as historical
     record rather than deleted, matching how this changelog treats
     every other past version.]
     Removed the "Nutrition goals" row from the Profile page's Diner
     Profile summary block, per direct instruction — redundant now that
     the header's Nutrition Goals (target) icon and the left-nav
     "Nutrition Goals" item both already link directly to the Dashboard.
     Editing the goal is still fully reachable from the Dashboard's own
     "Your goal: ... Edit" control (added in v0.45), so no path to the
     goal-setup modal was lost, just this one redundant entry point.
   - Cleanup cascading from that removal: goalSummary() (only ever used
     by this row) removed as dead code; ProfilePage's now-unused
     savedGoal and onOpenGoalModal props removed from its signature and
     call site. DashboardScreen keeps both, since it still uses them.

   CHANGELOG v0.50 -> v0.51:
   - Nutrition & Goal Data checkboxes revised per direct discussion: the
     original two ("Use my nutrition goals to personalize
     recommendations" / "Include my goal-aligned bookings in my
     progress tracking") were internal feature toggles, not sharing
     controls — structurally different from every other category on
     this page, which is entirely about data leaving OpenTable to
     restaurants/partners/POS systems. Replaced with two genuine
     sharing-focused checkboxes matching that same real pattern (Option
     A from the discussion — per-checkbox explanation, matching
     Customized Dining Experience's style): "Share my nutrition goal
     with restaurants when I book" and "Share my nutrition goal with
     OpenTable's restaurant partners & affiliates." Real position on the
     page unchanged.

   CHANGELOG v0.49 -> v0.50:
   - Settings page rebuilt completely against real outerHTML + a real
     screenshot for the ENTIRE page, not just the new section — v0.49
     had reduced the 3 existing categories to inert collapsed rows since
     no real content was available at the time; now fully built with
     real copy throughout.
   - Real structure confirmed: two heading levels ("Dining Preferences"
     page title, "Communication Preferences" second heading further
     down, same underlying H3 style) containing several fieldset/legend
     categories. Customized Dining Experience and Point of Sale
     Information both use per-checkbox indented descriptions; Third
     Party Sharing uses a genuinely different pattern — one shared intro
     paragraph above 2 plain checkboxes with no individual descriptions.
     SettingsSection extended with an optional `intro` prop and
     SettingsCheckboxRow's `description` is now optional to support both
     real patterns.
   - Added Promotional Emails (7 real unchecked checkboxes), Reservation
     Emails (1 checked), and SMS Preferences (2 plain-text sub-groups —
     Booking updates/Waitlist updates, NOT styled like the uppercase
     category legends — each with one real checked checkbox), plus the
     real "Save Changes" button in its real disabled/greyed styling.
   - The new "Nutrition & Goal Data" section now sits in its real,
     correct position: directly after Point of Sale Information and
     before the "Communication Preferences" second heading, matching
     PRD §6's "alongside the existing checkbox categories" — not
     appended at the end of the page as an afterthought.
   - Inline "Privacy Policy" links added (styled red, matching this
     file's existing link-color convention), appearing exactly where
     they do in the real copy.

   CHANGELOG v0.48 -> v0.49:
   - Real mistake caught and fixed: v0.48 fabricated plausible-sounding
     checkbox labels/descriptions for the 3 pre-existing categories
     (Customized Dining Experience/Third Party Sharing/Point of Sale
     Information) — invented content presented as if it were real,
     which it wasn't. The PRD only establishes that these categories
     exist as context for where the new section gets inserted
     "alongside" them, never what checkboxes actually live under them.
     Replaced with inert collapsed rows (label + chevron, matching the
     same collapsed-category pattern already used in the Search Results
     filter modal) — nothing implies sourced content that doesn't exist.
     The new "Nutrition & Goal Data" section (real, verbatim PRD copy)
     remains the only fully-built part of this page, matching the
     deliverable plan's actual scope: add the new consent subsection to
     the existing page, not invent the rest of the page's content.

   CHANGELOG v0.47 -> v0.48:
   - NEW SCREEN: Settings (Dining Preferences), per PRD §6/§10 — this
     was the one PRD-scoped screen not yet built. Reuses the existing
     LeftNav and Checkbox components rather than inventing new chrome.
     The 3 pre-existing categories (Customized Dining Experience/Third
     Party Sharing/Point of Sale Information) are shown minimally with
     generic sample copy, just enough to establish this as a real
     existing settings page being extended — matching deliverable-plan
     §5's allowance that this isn't required at full fidelity. The new
     "Nutrition & Goal Data" subsection uses the real copy verbatim from
     PRD §10, in the real checkbox + explanatory-paragraph pattern from
     design-system §4.8 (uppercase small bold letter-spaced section
     label, square red-fill/white-check checkbox, bold label + indented
     explanatory paragraph). Both new checkboxes default to checked,
     matching how the PRD frames this as already-active personalization.
   - Wired "Settings" in LeftNav (previously a dead, non-clickable
     placeholder alongside "Reservations"/"Saved Restaurants"/"Payment
     Methods") and added the route in App(). Left the other 3 LeftNav
     items un-wired still, since building those pages is out of scope.

   CHANGELOG v0.46 -> v0.47:
   - Concierge input placeholder was reading as bold — the textarea used
     fontWeight:500 for both typed text and placeholder, since inline
     styles can't target ::placeholder separately. Added a scoped class
     + injected ::placeholder rule so the placeholder is regular (400)
     while typed text stays medium (500).
   - PromptCard given an always-on subtle resting shadow (was 'none' at
     rest, only appearing on hover) — the light-grey border alone has
     poor contrast against a plain white page, which is why Concierge's
     empty-state prompts looked like borderless floating text. On the
     homepage this wasn't visible because that section sits on a tinted
     gradient wash, not plain white. A resting shadow gives the card a
     distinct surface on any background — applied globally to PromptCard
     since it's a strict improvement for the homepage's cards too, not
     just a Concierge-specific fix.

   CHANGELOG v0.45 -> v0.46:
   - "Editing:" label on the Dashboard hero didn't make sense (the user
     isn't actively editing, just viewing their goal with an option to
     edit it) — changed to "Your goal:".
   - Added a "Your next reservation" heading above that card — it had no
     label at all before, giving no context for why the card was there.
   - Activity Log month switcher was a full separate row above the
     filter pills, costing an extra ~50px of vertical space. Combined
     into the SAME row as the pills (pills left, month switcher right,
     via justify-content:space-between) — still two independent
     controls, just no longer stacked on their own rows.

   CHANGELOG v0.44 -> v0.45:
   - Discussed and agreed structure implemented in full:
     1. Dashboard hero now shows the active goal with a direct "Edit"
        entry point, reopening the same existing Goal-setup modal — the
        Dashboard previously never named the active goal or let you
        touch it at all.
     2. New "Your next reservation" card (sample/static data, same
        treatment as every other dataset in this file) placed right
        after the progress section: goal-fit callout ("Great fit for
        your goal") plus a specific dish count tied to the active
        goal's freqNoun. Omitted for "Just exploring" (tracking:'none'),
        matching how every other tracking module already behaves.
     3. "Ways to hit your goal" tiles now end in real CTA buttons —
        "Find a goal-aligned table near you" (-> Search Results) and
        "Explore goal-aligned dishes" (-> Homepage) — turning the
        section from purely informational into something actionable.
        WaysTile extended with optional ctaLabel/onCtaClick props.
     4. Activity Log: new month switcher (left/right arrows + label)
        above the existing All/Counted/Not-counted pills — the two work
        together, not one replacing the other. Right arrow disables at
        the current month; left arrow disables at the oldest sample
        month. New distinct empty state for "goal is set, this specific
        month just has nothing" vs the existing "no goal set at all"
        empty state.
   - Data: SAMPLE_ACTIVITY entries now carry a monthOffset field (0 =
     current month) with new July/June sample entries added to make the
     month-switcher meaningful. Real bug caught and fixed while doing
     this: COUNTED_TOTAL (feeds the Dashboard's progress bar/milestone/
     tally) was previously unscoped across ALL entries — harmless before
     since every sample entry happened to be in the current month, but
     would have silently inflated the Dashboard's monthly progress once
     past-month entries existed. Scoped to monthOffset:0 specifically.

   CHANGELOG v0.43 -> v0.44:
   - Fixed a real bug: PromptCard's @keyframes promptSweep was only ever
     injected from inside HomeScreen's specific AI-section JSX, so any
     PromptCard used elsewhere (Concierge's example prompts and follow-
     up chips) referenced an undefined keyframe and silently didn't
     animate — and since the border itself is part of the same gradient
     background-clip technique, this likely read as "no border either,"
     not just "no animation." Moved the keyframe injection to be self-
     contained inside PromptCard itself, matching the pattern already
     used by ScrollCarousel (no-scrollbar style) and ConciergeLoader
     (spin keyframe) — now guaranteed to be defined wherever PromptCard
     renders. Removed the now-redundant duplicate injection from
     HomeScreen.
   - Concierge input rebuilt with the real gradient-border technique
     (red -> yellow -> aqua, same padding-box/border-box trick as the
     CTA button and PromptCard) instead of a plain grey 1px border — the
     real CSS confirmed this exact technique is used on the input's
     wrapper. One value conflict flagged: the extracted CSS specified a
     4px border-radius on that wrapper, which doesn't match the clearly
     pill-shaped border visible in the screenshot — trusted the direct
     screenshot evidence over that one value, consistent with this
     project's established practice of preferring visual evidence when
     it conflicts with uncertain CSS attribution.

   CHANGELOG v0.42 -> v0.43:
   - NEW SCREEN: Concierge — a dedicated full-page AI chat screen,
     discovered via direct user report that all homepage prompts
     actually lead here, not to Search Results (which is what they
     incorrectly did before). Built against real outerHTML/CSS for both
     states (empty + populated), not guessed.
   - New real icons added (exact paths, not hand-drawn): ArrowUp
     (send button), Bookmark, ThumbsUp, ThumbsDown, DiamondSparkle
     (premium-badge icon, distinct from the regular Sparkle already
     used for "Powered by AI"), and 5 loader shapes (ConciergeStar +
     ConciergeOutline1-4).
   - ConciergeLoader built with real, sourced animation mechanics: a
     static center star icon plus 4 full-size outline layers, all
     continuously rotating on the real stepped keyframe (hold/90deg/
     hold/180deg/hold/270deg/hold/360deg over 4s), with only one
     outline opaque at a time. What cycles which outline is visible
     isn't in the CSS (that's JS not present in what was extracted) —
     implemented as a 1s interval cycling through all 4, a reasonable
     inference from the 4s/4-layer ratio, not a confirmed value.
     Outline shapes render with preserveAspectRatio="none" to fill a
     uniform container despite each having a different real native
     aspect ratio (30x34, 34x32, 34x32 again — confirmed identical in
     the real source, not a mistake — and 32x32).
   - Empty state: real heading ("Concierge" + "AI Beta" badge, confirmed
     exact), real "Let's find the best restaurant for you." copy, real
     input component, and the 3 real example prompts from the actual
     HTML — reusing the existing animated PromptCard component, so
     these get the same border sweep as the homepage prompts.
   - Populated state: real chat bubble (user message pill), real AI
     response text, and a new ConciergeRestaurantCard built from the
     real captured markup — photo carousel with dot indicators, premium
     "diamond sparkle" badge (real icon, confirmed only some restaurants
     get it), bookmark button, star+rating+review+price(with faded
     upper tiers, matching the real fAwKcPtLqSo-/_3JbEJDrCk58- pattern)+
     cuisine+neighborhood meta line, 5 real time slots (null entries
     render as unavailable, matching the real page not every restaurant
     having 5 real openings), and an AI "match relevance" line reusing
     the same real sparkle icon already sourced elsewhere in this file.
   - Real thumbs up/down feedback icons added per response.
   - Follow-up suggestion chips added, reusing the same real animated
     PromptCard component — flagged as inferred placement, since the
     specific HTML capture provided didn't include them (likely a
     conditional/timing gap in that particular capture), even though
     they're visible in the reference screenshot.
   - Data: 5 restaurants for an "italian" query — 2 fully sourced from
     the real HTML (San Sabino, Eataly NYC Downtown - La Pizza & La
     Pasta), the remaining 3 filled in from the reference screenshot's
     visible text since the HTML capture didn't include their full
     detail. A generic fallback set covers any other query text.
   - Navigation: added "concierge" as a screen state (not a real page/
     new tab, per direct instruction) with a new conciergeQuery piece of
     App-level state carrying the clicked prompt's text so the screen
     can auto-send it on arrival. Wired to be reachable ONLY via prompt
     clicks and "Describe your ideal spot" (no header entry point, per
     direct instruction) — replacing the three call sites that
     previously (incorrectly) routed to Search Results. The hero's main
     "Let's go" search button was left untouched, since that's a
     genuinely different, correct flow.
   - Deliberate simplification, flagged: the real page's gradient
     ambient background behind the "Concierge" heading is an animated
     4-layer crossfade (9s cycle); built here as a single static
     gradient wash instead, given the scope of everything else in this
     build.

   CHANGELOG v0.41 -> v0.42:
   - Partial revert per direct instruction: ONLY the "Describe your ideal
     spot" change from v0.41 was undone. AiCtaButton restored exactly as
     it was (distinct gradient-border styling, no animated sweep). The
     other two v0.41 changes stay as they were: goal-aware prompt still
     renders first, and the seafood prompt is still removed.

   CHANGELOG v0.40 -> v0.41:
   - "Describe your ideal spot" no longer uses its own distinctly-styled
     AiCtaButton component (gradient border, different chrome) — it now
     renders as a plain PromptCard instance, same look/feel as every
     other prompt, and correctly participates in the animated border
     sweep sequence for the first time (it was a different component
     before, so the sweep skipped over it entirely). AiCtaButton removed.
   - Goal-aware prompt moved from last to first in render order.
   - Removed "What are the best seafood spots near me?" from
     DEFAULT_PROMPTS entirely (now 2 default prompts instead of 3).
   - New order: goal-prompt (if active) -> 2 default prompts -> "Describe
     your ideal spot". Index props recomputed so the stagger animation
     still flows correctly through the new sequence.
   - Dropped the now-fully-dead `highlight` styling call at the goal-
     prompt's render site (the prop itself does nothing since v0.27,
     when border width/color were uniformed across all cards).

   CHANGELOG v0.39 -> v0.40:
   - "Book for lunch today" restaurant cards now show a goal-aligned
     badge — discussed before building (Option B, agreed): a photo-
     overlay badge (red pill, top-left corner of the image, same pattern
     as DishCard's name badge) rather than a text line like Search
     Results uses. A text line would make aligned cards taller than
     non-aligned ones in the same row, which is jarring in a side-by-
     side carousel — Search Results doesn't have that problem since it's
     a single-column list. Same copy ("Great fit for your goal") as
     Search Results for message consistency, even though the visual
     container differs by context.
   - 5 of the 15 restaurants flagged goalAligned:true (Gramercy Tavern,
     Union Square Cafe, Nobu Downtown, Carbone, Blue Hill) — kept
     partial, not universal, so the badge stays a meaningful signal
     rather than showing on every card. Badge only renders when a goal
     is actually active (`goal && r.goalAligned`), matching the same
     gating already used everywhere else goal-awareness appears.

   CHANGELOG v0.38 -> v0.39:
   - Fixed a real hover rendering bug: QuickFilterPill and the Filter
     icon button were applying BOTH a border-color change AND a separate
     box-shadow ring at the same 1px offset — two overlapping red
     outlines on a fully-rounded (9999px radius) pill, which rendered as
     an uneven/doubled outline instead of a clean ring. Dropped the
     box-shadow on both, keeping just the border-color change. The
     Featured button (border already red at rest, so a border-color
     change had nothing to change to) now uses a light red background
     tint on hover instead.
   - Added hover states to the carousel arrow buttons (Book for lunch
     today, Dishes, and the search-results quick-filter row all share
     this ScrollCarousel component, so this fixes all three at once):
     border turns red and the icon recolors to match, plus the existing
     elevation shadow deepens slightly. This is a different visual
     change than the pill fix above — one border-color change plus
     intensifying an already-present, different-purpose elevation
     shadow, not a second overlapping ring of the same effect.

   CHANGELOG v0.37 -> v0.38:
   - Removed unexplained bold on the "Goal-aligned" checkbox label —
     matches the other checkboxes now, no reason for it to stand out.
   - Filter modal restructured into three parts: fixed header (title+
     close), scrollable middle (the filter sections), sticky footer with
     Apply (primary, red) / Reset (secondary, outlined) — the single
     "Show results" button was previously INSIDE the scrollable area, so
     it could scroll out of view.
   - Sort dropdown: added a "Sort" header row with a close (X) icon.
     Removed the red/bold emphasis on "Best match for your goal" — same
     category of unexplained-emphasis issue as the checkbox; it's just
     another option now, styled identically to the rest.
   - "How are Featured results ranked" now correctly right-aligns within
     the LIST column specifically (via justify-content:space-between
     scoped to that column's own width, since the row already lives
     inside it), not the full page width / map column. My previous fix
     had misread the instruction as left-aligning the text itself rather
     than correctly scoping which container the alignment applies to.
   - Added hover states to the Featured pill, the Filter icon button,
     and QuickFilterPill — all previously static. Hover treatment is the
     real, already-sourced value from the original FilterPill extraction
     (Points Activity CSS): border turns red with a matching 1px ring
     shadow.
   - Fixed map zoom buttons (+/-): `display: block` doesn't center
     content, so the icons weren't centered in their 36x36 boxes.
     Switched to `display: flex` with center alignment.

   CHANGELOG v0.36 -> v0.37:
   - Real filter icon swapped in (exact SVG path provided directly),
     replacing the earlier hand-drawn placeholder.
   - "Featured" pill's chevron rebuilt as real inline content (gap-
     spaced flex child) instead of an absolutely-positioned overlay that
     was crowding the label — now reads as a proper trailing icon.
   - Fixed a real structural bug: Featured pill + filter icon were
     sharing ONE scroll container with all the category pills, so they
     scrolled away together — wrong. Split into a FIXED left section
     (Featured + filter icon), a vertical divider, then a separately
     scrollable section for just the category pills.
   - Category pills now use the real ScrollCarousel component (arrow-
     driven, hidden scrollbar) instead of a plain overflow-x row —
     matches the carousel pattern already established for the other two
     homepage carousels. Removed the old ad-hoc trailing chevron button.
   - Heading + count/ranked-link moved from a separate full-width block
     INTO the same row as the map, so the map's top edge now aligns with
     the "You searched for..." line specifically, per direct
     instruction, rather than with the quick-filter row above it.
   - "How are Featured results ranked" moved from right-aligned
     (justify-content:space-between) to sit on the LEFT alongside the
     results count, per direct correction.
   - Map height corrected from `calc(100vh - 48px)` (which assumed the
     map starts near the very top of the viewport) to `calc(100vh -
     280px)`, accounting for the approximate stacked height of
     everything above this row. Estimate, not an exact calculation —
     flagged as possibly needing further tuning since static styles
     can't measure real rendered layout.

   CHANGELOG v0.35 -> v0.36:
   - Search Results screen rebuilt end to end against direct screenshot
     comparison (no real HTML/CSS was available for this page — flagged
     throughout as visual-match work, not sourced extraction, unlike the
     Homepage sections):
     - Added the missing secondary search bar (dark band: Date/Time/
       Party/search-input pre-filled with the query/red "Find a table"
       button) — reuses the same real icons already confirmed elsewhere.
     - Rebuilt the quick-filter row structurally: "Featured" is now a
       selected pill INSIDE the row (was a separate button), filter
       button is icon-only circular (was icon+"Filters" text), every
       category pill carries an icon prefix, and the pill matching the
       active search term shows as selected (red) — all previously
       missing or structurally wrong.
     - Added the heading region entirely: quoted search term in the
       title, a results-count line, and a "How are Featured results
       ranked" link — none of this existed before.
     - Result cards rebuilt: photo carousel dot indicators (static,
       flagged placeholder), meta line merged onto one line (was split
       across two), 5 time slots (was 3), optional "+1,000 pts" under
       slots, optional promo line with a ticket icon — all added.
     - Added a map column (flagged placeholder: hatched background, no
       real tiles/integration, hand-drawn pin icons at rough scattered
       positions, non-functional zoom/locate/expand controls included
       for visual completeness only). Hidden below 900px width via an
       injected media query so the list doesn't get crushed on narrow
       viewports.
     - New hand-drawn icons added for this rebuild, all explicitly
       flagged in code as not sourced from any real extraction: Heart,
       InfoCircle, Ticket, Plus, Minus, Compass, Expand, Pin.
   - Fixed a duplicate `position` style key introduced mid-build in
     MapPlaceholder (sticky then immediately overridden by relative,
     which would have silently dropped the sticky behavior) — caught via
     the duplicate-style-key scan before archiving, not shipped.

   CHANGELOG v0.34 -> v0.35:
   - DishCard now has the same border + hover-lift + image-zoom
     treatment as RestaurantCard (1px ash-lighter border, 8px radius,
     translateY(-6px) + shadow on hover, image scale(1.05) inside its
     own clipped layer) — previously a static card with no hover state
     at all. Name badge repositioned to sit inside the new relatively-
     positioned image wrapper, unaffected by the added layers.

   CHANGELOG v0.33 -> v0.34:
   - Both carousels (Book for lunch today, Dishes) now scroll natively
     via trackpad/mouse wheel/touch, not just the arrow buttons.
     ScrollCarousel's inner container was `overflowX: hidden`, which
     blocks ALL native scroll input entirely — only the JS-driven
     scrollBy from the arrows could move it. Switched to `overflowX:
     auto` and added a small injected CSS class (.no-scrollbar) to hide
     the scrollbar visually cross-browser (::-webkit-scrollbar +
     scrollbar-width:none), so it's genuinely scrollable by hand while
     still not showing a visible scrollbar track, matching the original
     "arrows, not a scrollbar" requirement from earlier. Since both
     carousels already share this one component, this fixes both at
     once.

   CHANGELOG v0.32 -> v0.33:
   - Expanded GOAL_DISHES from 4 to 15 entries per goal category
     (protein/sodium/plant/weight/balanced), same treatment as
     BOOK_TODAY_RESTAURANTS earlier, so the dish carousel's arrows have
     real content to scroll through at desktop width instead of the
     whole list already fitting in one screen. Reused the same 15
     restaurant names established for the restaurant row for continuity,
     with dish names tailored per goal category.

   CHANGELOG v0.31 -> v0.32:
   - Dish carousel enhanced to match "Book for lunch today": now uses
     the same ScrollCarousel component (real 42px arrow buttons, no
     visible scrollbar) instead of a plain overflow-x scrollbar row, and
     a "View all" link added to its header for consistency with that
     section too.
   - Dish card width matched to RestaurantCard's 258px (was 196px) so
     both carousels share the same column alignment down the page.
     Image height scaled proportionally to keep the same ~1.17:1 aspect
     ratio (168px at 196px wide -> 220px at 258px wide), and the name-
     badge's max-width scaled accordingly (164px -> 226px).
   - Note: each goal's dish list is still only 4 items (GOAL_DISHES
     wasn't expanded, unlike BOOK_TODAY_RESTAURANTS earlier) — wasn't
     asked for here, so left as-is. At 258px+16px gap per card that's
     close to filling a full desktop-width row already, so the arrows
     may have little/nothing to scroll to at this count — flagging in
     case that's worth revisiting the way the restaurant row was.

   CHANGELOG v0.30 -> v0.31:
   - v0.30's row padding (6px, based on a "real value ~0px" CSS reading)
     was wrong per direct visual comparison — the real site has
     noticeably MORE spacing than that. Same category of error as the
     AI-prompt-section layout misread earlier in this project: a class
     name almost certainly shared/reused across a different component
     context than assumed. Increased row padding to 20px, trusting the
     visual comparison over the CSS reading this time. Flagged as an
     estimate now, not a sourced value — happy to nail it down precisely
     against a fresh screenshot if still off.

   CHANGELOG v0.29 -> v0.30:
   - Heading-to-list spacing fixed: real margin-bottom on "Frequently
     asked questions" is 16px (confirmed, class eT-RxmO7imI-) — had 8px.
   - Row spacing tightened: real button padding is 0px (row height comes
     purely from title line-height + icon size). v0.28 deliberately
     compromised at 16px "for usability," which is very likely the
     second thing flagged here — pulled back to 6px, much closer to the
     real near-zero value now that the ask is fidelity, not a UX
     judgment call.

   CHANGELOG v0.28 -> v0.29:
   - FAQ title/answer font sizes reduced (18px->16px title, 16px->14px
     answer; line-heights tightened to match), same font-substitution
     compensation category as the earlier hero text fix: the CSS values
     v0.28 used were the real, confirmed numbers for BrandonText, but
     that licensed webfont can't load here, so the fallback stack
     renders those exact px values visibly larger than the real site
     does. Deliberate visual-match override, not a correction to the
     sourced values themselves.

   CHANGELOG v0.27 -> v0.28:
   - FAQ accordion rebuilt against real CSS (classes RjGtnqKK63c-,
     cO0uBZWRVZk-, D1DFHmi9wDU-, LcVggoazFpE-, _0EgX2-OIShI-):
     - Chevron icon enlarged 20px -> 34px (2.125rem), the real size —
       was noticeably too small before.
     - Divider now correctly omitted on the last item
       (`:last-child { border-bottom: none }` in the real CSS) instead
       of applying uniformly to every row.
     - Row padding tightened: real button has NO padding at all — row
       height comes purely from the title's line-height + icon size, not
       added vertical padding. Reduced from 20px to 16px (kept some
       padding for click-target comfort; the real 0px felt too cramped
       once rendered, a deliberate small deviation for usability, not an
       extraction error).
     - Answer text color fixed: real paragraph uses the same dark body
       text color as everything else (foreground-default), not a muted
       grey — was incorrectly de-emphasizing genuinely relevant content.
     - Title sizing corrected to 18px/24px line-height with
       padding-right:48px reserved for the icon (was 16px, no reserved
       space).
     - Rotate-on-open transition corrected 0.2s -> 0.4s.

   CHANGELOG v0.26 -> v0.27:
   - v0.26 unified the base color but kept a 2px border for the
     highlighted card, which still rendered the sweep as a visibly
     thicker band than the 1px cards (border width directly determines
     how much of the gradient shows). Per direct instruction that all
     cards should look the same, border width is now uniform 1px across
     the board — the goal-aware card is no longer visually distinguished
     by its border/animation at all, only by its text content.

   CHANGELOG v0.25 -> v0.26:
   - The goal-aware (highlighted) prompt card's sweep looked heavier than
     the other three because its resting border color was red (not grey
     like the rest) AND it was 2px thick — two intensity cues stacking
     on top of each other. Base resting color is now always ash-lighter
     for every card regardless of highlight; border width (2px vs 1px)
     alone is the highlight cue now, so the sweep's visual weight is
     consistent across all four cards.

   CHANGELOG v0.24 -> v0.25:
   - "More protein" (3 meals/month, matching the modal's own default
     stepper value) is now pre-selected on load instead of starting with
     no goal set. Dashboard, Activity log, Homepage AI prompt/carousel,
     Search results badges/filter/sort, and the Booking confirmation
     toggle all now show goal-relevant content by default rather than
     their empty/no-goal states — still fully editable via the Goal-
     setup modal exactly as before, this only changes the starting
     value.

   CHANGELOG v0.23 -> v0.24:
   - Root cause of "animation happening behind the border": v0.23's
     animated layer used `inset: 0`, which positions relative to the
     PADDING box — i.e. strictly INSIDE the border. The colored sweep
     could never occupy the same pixels as the border ring at all; it
     wasn't a stacking/z-index problem, the geometry simply didn't
     overlap. Rebuilt using the same padding-box/border-box double-
     background gradient-border technique already proven working on the
     CTA button in this same file (no reported corner issues there) —
     applied directly to the card element itself rather than as a
     separate overlay div, so there's exactly one box establishing both
     the shape and the border painting.
   - Also fixed the border disappearing between sweeps: the gradient's
     "off" stops now use the actual resting border color (ash-lighter,
     or red for the highlighted card) instead of transparent, so the
     border always shows a solid color at rest, with the red/yellow/aqua
     band sweeping through it via animated background-position — rather
     than the border periodically vanishing wherever the old transparent
     gradient stops happened to land.
   - Removed the now-unused SWEEP_GRADIENT constant (replaced by the
     sweepGradient(baseColor) function, which needs the resting color
     baked in per-card).

   CHANGELOG v0.22 -> v0.23:
   - v0.22's fix didn't work: the STATIC (non-animated) border was also
     missing at the corners, which means the problem was never specific
     to the animation — it was the layering approach itself. Simplified
     significantly: the resting border is back to a real, native CSS
     `border` property directly on the card (browsers render border-
     radius on a real border reliably, no known corner issues). The
     animated sweep is now a single layer sitting INSIDE the card,
     clipped by the card's own `overflow: hidden` — bounded by the exact
     same border-radius curve as the visible border, rather than trying
     to independently reproduce that curve via a separate overlay (which
     is what both v0.21 and v0.22 attempted, and both failed at the
     corners). This is a deliberate departure from the real component's
     exact structure (which does use separate layered divs) in favor of
     reliable rendering — the tradeoff is losing the real slight glow
     bleed past the card edges, which isn't achievable with this
     simpler, clipped approach. Gradient opacity raised to 0.35 to stay
     visible now that it's a single wash instead of a dedicated glow +
     border-ring pair — an adjustable estimate, not a sourced value.

   CHANGELOG v0.21 -> v0.22:
   - Fixed the animation not reaching the card's rounded corners: v0.21
     kept a literal CSS `border` property directly on the card wrapper
     IN ADDITION to the animated gradient-border overlay div sitting on
     top of it — two borders competing for the same 1px ring, fighting
     at the curve. The real component avoids this by making the resting-
     state border its own separate absolutely-positioned div (confirmed
     from CSS: `_1vRR0fVUP6E-` — position:absolute, its own border, z-
     index:0), not a literal border on the card element. Restructured
     PromptCard to match that exact real layering: static-border div,
     animated-glow div, animated-border div, then the button — four
     consistently absolutely-positioned/layered pieces instead of one
     literal border competing with three overlay divs.

   CHANGELOG v0.20 -> v0.21:
   - Added the animated gradient-sweep border/glow effect on prompt
     cards, sourced directly from the real component's actual JS
     (chunk-GFXK4AUE.js, component `Bl`) and CSS, not inference:
     - Real gradient confirmed: transparent -5%/42%, red(#da3743, the
       PLAIN red — border-action, different from the lighter red used on
       the CTA button's border) 50%, yellow(#fdaf08) 64%,
       aqua(#3ddbb6) 78%, transparent 86%/120%, 90deg, 400% background-
       size.
     - Real keyframe shape confirmed: holds position for the first half
       of the cycle, sweeps for the second half. 5s, linear.
     - Real layered structure confirmed and replicated: a blurred (10px),
       low-opacity (0.15) glow layer that bleeds slightly past the card
       edges, plus a separate gradient-border sweep layer (same padding-
       box/border-box trick as the CTA button), both behind the button
       content.
     - Real card-padding (12px) and glow-blur/opacity tokens confirmed
       exact from the component's own token map.
   - One thing NOT fully replicated, flagged rather than guessed: the
     real site triggers this via JS (force-reflow restart + some
     external re-trigger) with a per-card stagger delay computed by a
     parent component that lives in a different, page-specific bundle
     not available for extraction. Implemented here as a simpler CSS-
     native infinite loop with the same real gradient/keyframe/timing,
     using an ESTIMATED 0.9s stagger between cards so the sweep still
     visibly travels card-to-card — the stagger value itself is a guess,
     everything else in the animation is sourced.
   - Noted but did not act on: the component's real token map also lists
     a card-fixed-width of 200px, which sits directly next to separate
     "modal" width tokens — likely belongs to a different, fixed-width
     modal context rather than this homepage instance, so the content-
     hugging width already confirmed via direct screenshots was kept.

   CHANGELOG v0.19 -> v0.20:
   - Prompt-card rows were left-aligned (flex-start, the flex default);
     real site centers each wrapped row independently within its
     available width — confirmed by comparing row-start positions across
     rows of different total width in a screenshot. Added
     justifyContent:'center' to the card container, which correctly
     centers per-line in a wrapping flex row, not just the set as a
     whole.
   - Increased the gap between the title block and the prompt-card area
     (32px -> 56px) — real site has noticeably more breathing room here.
     Estimate, not a confirmed CSS value.

   CHANGELOG v0.18 -> v0.19:
   - The "2-column grid" conclusion from v0.17 was wrong too — not from
     bad CSS reading this time, but from a coincidence in the reference
     screenshot: two similar-length prompt texts produced similar-width
     hugged boxes that looked like a fixed grid but weren't one. A
     screenshot with clearly different-length prompts made it
     unambiguous that cards genuinely hug their own content width.
     Converted PromptCard/AiCtaButton from width:100% grid-filling to
     display:inline-block with no forced width (shrink-to-fit), and the
     container from CSS grid to a flex-wrap row. Added a 340px max-width
     on PromptCard as a safety net so an unusually long prompt still
     wraps via its existing 2-line clamp instead of producing one huge
     unwrapped box — that ceiling is an estimate, not a confirmed value.
   - Also removed a `white-space: nowrap` I'd added to the prompt text in
     the same pass, which would have silently broken the 2-line-wrap
     behavior for longer prompts — caught before shipping.

   CHANGELOG v0.17 -> v0.18:
   - Removed the 40px min-height reservation on prompt card text (real,
     CSS-verified value — cards there deliberately reserve 2-line height
     regardless of actual content). Deliberate deviation, explicitly
     requested: single-line prompts now hug their real content height
     instead of matching the taller 2-line cards. Means card heights can
     now vary within the grid depending on prompt length.

   CHANGELOG v0.16 -> v0.17:
   - v0.16's "verified via @media boundaries" conclusion was itself
     unreliable, not just my earlier screenshot-eyeballing mistake:
     JCYe8YSQOJY-/LnpyZcdom14-/ji1ISvg9Wxc- are short, generic-looking
     hashed classnames almost certainly reused across multiple
     horizontal-scroller components sitewide (restaurant rows, dish
     carousels), so the "nowrap horizontal scroll" rule very likely
     belonged to a DIFFERENT scroller instance, not this AI prompt
     section specifically. Two screenshots at genuinely different widths
     (one wide, one narrower with the title stacking above instead of
     beside), both showing a real 2-column grid and never a single
     scrolling row, is stronger evidence than a media-query reading I
     can't fully verify without a live browser. Reverted to a 2-column
     CSS grid (repeat(2, minmax(160px, 1fr))), matching what both
     screenshots actually show at both widths. PromptCard/AiCtaButton
     back to width:100% so they fill their grid cell.
   - Fixed hover-lift getting clipped at the top edge: `overflow:hidden`
     had been set on the WHOLE AI section (to contain the blurred
     gradient's edges from bleeding past the rounded corners), which
     also clipped any card translating upward on :hover. Moved that
     overflow:hidden onto a dedicated absolutely-positioned wrapper
     around ONLY the gradient background layer — the content layer
     (title + cards) is now a sibling, outside any clipping context, so
     the hover lift renders in full.

   CHANGELOG v0.15 -> v0.16:
   - v0.15 was wrong on both changes, and wrong for the same reason: I
     eyeballed a screenshot instead of checking what the code actually
     says. Corrected by finding the real @media boundaries in the raw
     CSS this time, not my earlier flattened/regex extraction which had
     stripped that context out:
     - Gradient opacity: confirmed the ::after rule (opacity:.1,
       blur(2px)) sits OUTSIDE any @media block — it's the real,
       unconditional value at every width. v0.15's bump to 0.35 with no
       blur had no code basis at all. Reverted to the real .1/blur(2px).
     - Layout: confirmed the unconditional desktop (≥1056px) rule is
       `flex-wrap:nowrap; overflow-x:auto` — fixed 196px cards in a
       single horizontal scrolling row. The 2-column stacked appearance
       only exists inside `@media (min-width:768px) and
       (max-width:1055px)` — a tablet-only override that v0.15 mistook
       for the desktop default because that's what the screenshot
       happened to show. Reverted PromptCard/AiCtaButton to width:196,
       flexShrink:0, and the container to nowrap+overflow-x:auto.

   CHANGELOG v0.14 -> v0.15:
   - Corrected against a direct screenshot — v0.14's CSS-based rebuild
     got two things wrong, apparently by reading rules for a different
     breakpoint than what this screenshot shows:
     - Background gradient bumped from 10% to 35% opacity and blur
       removed — the real wash is clearly, visibly tinted edge to edge
       in the screenshot, not barely-there like the extracted rule
       suggested.
     - Layout reverted from the fixed-196px wrapping row back to a
       2-column CSS grid (2 cards per row) — confirmed unambiguously by
       the screenshot. PromptCard and AiCtaButton switched from a fixed
       196px width to width:100% so they fill their grid cell.
   - Sparkle icon, card border/hover-lift treatment, and the CTA's
     gradient-border style all confirmed correct against this same
     screenshot — unchanged from v0.14.

   CHANGELOG v0.13 -> v0.14:
   - AI prompt section rebuilt from a deeper read of the real markup/CSS,
     not the earlier generalized pass. Real findings, all CSS-verified:
     - Background is NOT a solid pastel fill — it's a subtle 10%-opacity,
       blurred 3-color gradient wash (aqua #3ddbb6 -> yellow #fdaf08 ->
       red #e15b64, 270deg), sitting as a soft overlay behind a plain
       white surface. Replaced the flat pink/yellow gradient entirely.
     - "Powered by AI" now uses the real extracted sparkle icon, not a
       "⚡" emoji.
     - Prompt cards reuse the EXACT same bordered + hover-lift treatment
       as RestaurantCard (confirmed via the same shared CSS classes) —
       1px border, 8px radius, translateY(-6px) + shadow on hover, plus
       the real 1px inset margin trick between the button and its
       border. Previously a flat, non-interactive bordered box.
     - The "Describe your ideal spot" CTA was WRONG before: I'd assumed
       theme="primary" meant a solid red button. The real CSS shows a
       white-filled button with a GRADIENT BORDER (red -> yellow -> aqua,
       same color family as the background wash, via the standard
       two-layer padding-box/border-box background technique) and dark
       text, not white. New AiCtaButton component implements this
       correctly.
     - Cards switched from a 2-column CSS grid to a wrapping flex row of
       fixed 196px cards (the real, CSS-verified card width) with an 8px
       gap — closer to the real sizing.
   - NOT fully resolved: the real markup nests the prompt cards inside
     two separate scrolling <ul> groups in a way the minified, multi-
     breakpoint CSS couldn't be fully disambiguated from static
     extraction. Approximated with a simple wrapping row instead of
     guessing at the exact original scroll/grouping mechanics — flagged
     here rather than presented as verified.

   CHANGELOG v0.12 -> v0.13:
   - v0.12's fix was wrong: it shrank the time-slot gap from the real 8px
     (documented in design-system.md §4.9) down to 5px to force 3 pills
     into one row — masking the real problem instead of fixing it. The
     actual issue was the card being too narrow: 3 pills at the real
     70px width + real 8px gap need 226px of content room, and the
     236px card only left 220px after padding, 6px short. Restored the
     true 8px gap and widened the card to 258px instead (added
     box-sizing: border-box for certainty, 256px content box, 240px
     after 16px padding — comfortably above the 226px needed). Carousel
     scroll step updated 504 -> 548 to match the new card+gap width.

   CHANGELOG v0.11 -> v0.12:
   - Fixed the time-slot row wrapping to 2+1 instead of one row of 3: did
     the math — card content is 220px (236 - 16px padding), and 3 pills
     at the real 70px width leave only 10px total for 2 gaps. The
     previous 8px gap needed 16px, overflowing by 6px and wrapping the
     third pill. Tightened to 5px (10px total), which fits with a couple
     px to spare. Pill width itself untouched — 70px is the CSS-verified
     real value, so the gap was the right thing to adjust, not the pill.

   CHANGELOG v0.10 -> v0.11:
   - ScrollCarousel arrows are now conditionally rendered, not always
     visible: tracks the container's real scrollLeft/scrollWidth via a
     scroll + resize listener, and only shows the left arrow once
     actually scrolled away from the start, only shows the right arrow
     while there's still real content beyond the visible area. On
     initial load the left arrow is absent entirely (not just disabled),
     matching the observation exactly.
   - "Booked N times today" line and its icon bumped up (13px -> 14px,
     no weight -> 600 semibold; icon 14px -> 16px) to read less thin than
     before. NOTE: unlike the border/hover fix, this one isn't backed by
     an exact extracted CSS value — the real markup has this text as
     plain unstyled content inside a flex wrapper with no font-weight
     rule of its own, so its true rendered weight depends on inherited
     context I couldn't fully trace. This is a visual-match correction,
     flagged as such rather than presented as a confirmed value.

   CHANGELOG v0.9 -> v0.10:
   - Card border/hover added — real values already sitting in the
     uploaded CSS, no new upload needed: 1px ash-lighter border, 8px
     radius, overflow hidden on the card (class WiK1XyoVciU-); on hover,
     box-shadow "0 2px 4px #2d333f33" + translateY(-6px) on the card
     plus the image itself scales to 1.05 (class SXYe3u6-sdM-) — three
     separate real, verified hover effects, not a single guessed one.
     Hover implemented via onMouseEnter/Leave local state since inline
     styles can't express :hover.
   - Expanded BOOK_TODAY_RESTAURANTS from 4 to 15 entries so the carousel
     arrows have real overflow to scroll through on desktop — with only
     4 cards the row already fit the viewport and "Next" did nothing.

   CHANGELOG v0.8 -> v0.9:
   - "Book for lunch today" section header was missing its "View all"
     link entirely — added, right-aligned via flex justify-between,
     confirmed against the real section-header markup.
   - Replaced the hand-drawn "People" social-proof icon placeholder with
     the REAL icSocialProof icon (a trending-chart glyph, not a people
     glyph — this was only discoverable by reading the specific markup
     for this section, not the earlier generalized §4.9 extraction).
     No longer a flagged placeholder; it's a verified real asset now.
   - Converted the row from a horizontal-scroll div (which showed a
     native scrollbar) into a real carousel: new ScrollCarousel
     component with circular 42px prev/next arrow buttons (white bg, 1px
     ash-lighter border, soft shadow — exact values from the real
     arrow-button CSS), no visible scrollbar. Reusable for the dish
     carousel later without rebuilding it.
   - Per explicit instruction: star rating display (single star icon +
     numeric text) intentionally left as-is — the proportional 5-star
     row and the "hide the numeric rating" finding from the investigation
     were both explicitly declined, not silently applied.

   CHANGELOG v0.7 -> v0.8:
   - Font-substitution compensation applied to the hero eyebrow and
     title, same category of fix as the earlier Profile-page heading-
     weight correction (v0.3 of the original Flow 1 artifact): the CSS-
     verified literal values (18px eyebrow, 48px title) are correct for
     BrandonText, but BrandonText is a licensed webfont that can't load
     here, so the fallback stack (-apple-system/Segoe UI/Arial) renders
     at those same declared px sizes but visually larger — fallback
     fonts are wider/less condensed than BrandonText, so identical
     pixel values don't produce identical visual size. Eyebrow reduced
     18px -> 16px (line-height 24 -> 20), title reduced 48px -> 44px
     (line-height 56 -> 52), as a deliberate visual-match override, not
     a claim that these are the real site's literal token values.

   CHANGELOG v0.6 -> v0.7:
   - Root cause of the top/bottom padding imbalance: the hero was built
     as a fixed-height (288px) photo band with text absolutely centered
     inside it, then a search bar pulled up on top via a negative
     margin — meaning the text was centered against a taller reference
     frame than the search bar actually occupied, which visually reads
     as too much space above and too little below. Rebuilt as a normal-
     flow column (photo fills the container via absolute inset:0 sized
     to the content's natural height) with explicit, deliberate top/
     bottom padding (40px / 32px) instead of that as a side effect of
     overlap math.
   - Tightened field internal padding: 14px -> 12px horizontal on
     Date/Time/Party, field height 44 -> 40 (search input and button
     matched to 40 too, so the whole row reads as one consistent height).
   - Enlarged the down-chevrons: 16px -> 20px — too small to read clearly
     against the earlier size.
   - Fixed the location/cuisine field's right padding: it was sized via
     min-width, which let the box (and therefore its effective right-
     side padding) drift depending on content length. Switched to a
     fixed width (300px) with box-sizing:border-box so left/right
     padding is symmetric and deterministic regardless of content.

   CHANGELOG v0.5 -> v0.6:
   - Corrected against a direct screenshot of the real hero (settles the
     ambiguity flagged in v0.5): the search bar's Date/Time/Party fields
     are SEPARATE rounded white boxes with visible gaps and their own
     shadow — NOT one joined bar with hairline dividers, which is what
     the extracted CSS alone had suggested. Reverted to separate boxes.
   - Added the leading icons that were completely missing on those three
     fields — real extracted paths, already sitting in the uploaded HTML
     unused: calendar (data-test="icClock"'s sibling icCalendar, already
     had this one), clock (icClock), and person (icPerson).
   - Added the trailing down-chevron on Date/Time/Party that the person
     flagged as missing — present in the real markup, simply hadn't been
     added to any hero version yet.
   - Fixed a stray leftover closing </div> from the v0.5 "joined bar"
     structure that would have left the JSX slightly over-nested even
     though it still balanced overall.

   CHANGELOG v0.4 -> v0.5:
   - Hero section rebuilt against exact CSS pulled from the already-
     uploaded NYC homepage file (no new upload needed — this data was
     sitting unused since the original extraction session):
     - Text alignment corrected: centered, not right-aligned.
     - Eyebrow text corrected: 18px with 0.125rem letter-spacing (was
       12px, too small).
     - Title corrected: 48px/56px (was 40px).
     - Photo overlay tint corrected to the real value, #2f2d41 at ~70%
       opacity (was an arbitrary dark navy) — the placeholder hatch
       pattern is now tinted to this color family instead of a made-up
       one, so it's "the right color, no real photo" rather than a
       guess in both dimensions.
     - Search bar rebuilt from separately-boxed fields into ONE
       continuous joined bar with 1px hairline dividers between fields
       (rgba(0,0,0,.08)) and rounded corners only at the two ends —
       matches the real component structure exactly.
     - Added the real search-input icon (data-test="icSearch") — a
       distinct, non-rotated magnifying glass path, different from the
       header's icSearchTransparent. Previously reused the header's
       rotated icon here, which isn't the same real icon.
     - Field height corrected to 48px; "Let's go" button min-width
       corrected to 144px.
   - One thing NOT resolved from CSS alone: the extracted stylesheet had
     two conflicting rule sets for the hero container/text color
     (one photo-background/white-text, one white-background/dark-text)
     without enough context here to tell which @media breakpoint each
     belongs to. Went with the photo-overlay/white-text composition since
     that's what both reference screenshots (Adelaide + NYC) show
     unambiguously — flagged rather than silently picking one.

   CHANGELOG v0.3 -> v0.4:
   - Homepage rebuilt against the real NYC homepage HTML/CSS (previously
     compared only loosely against a screenshot). Section order now
     matches the real page: Hero -> "Book for lunch today" row -> AI
     prompt section -> dish carousel -> FAQ -> Footer. Previously the AI
     section came first with no restaurant row, FAQ, or footer at all.
   - Hero search bar was missing its main field entirely — added the
     "Location, Restaurant, or Cuisine" text input between party size and
     "Let's go".
   - AI prompt section was structurally wrong: rebuilt from a single
     4-across row into the real two-column layout (heading + subtitle +
     "Powered by AI ⚡" tag on the left, 2x2 prompt grid on the right).
   - Fixed a logic bug: "Describe your ideal spot" is the real page's
     persistent CTA button and should never disappear. v0.3 was
     replacing it with the goal-aware prompt when a goal was set — PRD
     §9A says to EXTEND the prompt set, not swap a card out. The
     goal-aware prompt is now a genuine 5th addition alongside it.
   - Added "Book for lunch today in New York City" restaurant-card row —
     the exact card CSS (§4.9) had already been extracted in an earlier
     session but was sitting unused; new RestaurantCard component reuses
     it (16:9 image, red star row, meta line, social-proof line, 70px/
     32px time-slot pills).
   - Added FAQ accordion and full Footer (Discover/OpenTable/More/
     Businesses columns + legal line) — neither existed before.
   - New FLAGGED PLACEHOLDER icon: social-proof "people" icon (real one
     not extracted, hand-drawn two-person glyph instead, same treatment
     as other flagged icons).
   - Scope note: intentionally still omitting ~15 other real-page
     sections (OpenTable Icons, Sapphire ad, Diners' Choice Awards,
     outdoor dining, "locals rave" reviews, editorial cards, neighborhood
     link grid, etc.) — none relate to goals/recommendations, discussed
     and agreed in chat before building.

   CHANGELOG v0.2 -> v0.3:
   - Fixed a real cadence mismatch: the goal-setup modal's stepper asked
     "meals per WEEK" while the Dashboard displayed that same number as a
     MONTHLY target ("N of 3 meals this month") — using a weekly figure
     as a monthly one, off by ~4x. Modal copy and the Profile row summary
     ("meals/week" -> "meals/month") now both say month, matching the
     Dashboard's cadence and PRD §8/§12's monthly assumption. Stepper max
     also raised 14 -> 30 since a monthly ceiling of 14 was too low.
   - Adjusted sample activity data so the default demo state shows
     genuine in-progress ("2 of 3 meals this month, 1 more to reach your
     goal") instead of an already-completed state — previously the
     default stepper value (3) happened to exactly match the sample
     counted-count (3), so the very first view of the Dashboard showed
     "goal reached," which undersold the ongoing-progress experience.
     Casa Mono flipped from counted to not-counted; Activity log's
     counted/not-counted split updates automatically since it reads from
     the same array.

   CHANGELOG v0.1 -> v0.2:
   - Added Flow 3 (Goal-Aware Recommendations), three new screens per PRD
     §9: Homepage (AI prompt row + goal-aware dish carousel), Search
     results (Goal-aligned filter checkbox + "Best match for your goal"
     sort option + inline badge, in working modal/dropdown overlays),
     Booking confirmation (goal-alignment micro-toggle).
   - All three screens read `savedGoal` from shared App state, same as
     Flow 2 — set a goal in Flow 1 and Flow 3's copy/badges/carousel
     adapt to it live (protein/sodium/plant-forward get tailored dish
     names and prompt text; goals with tracking:'none' show no goal
     touchpoints, matching the Flow 2 design decision already made).
   - New real asset extracted: exact star icon path + confirmed brand-red
     color (#DA3743, not black/yellow) from location-landing CSS/HTML.
   - New FLAGGED PLACEHOLDERS (no photo assets available, per original
     instruction to call these out rather than fake them): homepage hero
     background, all dish-carousel images, all search-result images, and
     the booking-confirmation restaurant thumbnail. All use a visibly
     hatched placeholder box rather than a plain rectangle, so they read
     as obvious stand-ins even without reading the code.
   - New icons hand-drawn (no OpenTable equivalent found in the reference
     set, flagged same as the Flow 1/2 additions): filter/sliders icon
     for the "Filters" button.
   - Per deliverable-plan §5 ("every state of the filter modal" and "full
     Sort dropdown redesign" are explicitly not required at full
     fidelity): the filter modal shows other sections (Price,
     Experiences, etc.) as collapsed/inert rows, fully building out only
     Special features, where the new "Goal-aligned" checkbox lives.

   - Lock icon on the "reach your goal" tile: exact path (data-test=
     "icPrivacy") extracted from Rewards Hub HTML — real icon, not a
     placeholder.
   - Progress bar colors verified against Regulars page CSS: track uses
     ash-lightest, fill + leading marker use #fdcf6a (the actual computed
     value of --otkit-color-background-accent-yellow-hover) — NOT #fdaf08
     as the earlier design-system doc guessed from screenshot color-
     matching alone. This is the corrected, CSS-verified value.
   - Filter pills (Goal activity log): exact CSS extracted from Points
     Activity page (radius 32px pill, 1px ash-lighter border, 4px 16px
     padding, 16px/500 text).
   - FLAGGED PLACEHOLDER: the empty-state illustration (a treasure-chest
     icon on the real Points Activity page) is loaded from an external
     SVG file OpenTable serves, not inline path data, so it could not be
     extracted. Hand-drawn placeholder used instead, same as the profile
     photo camera icon from Flow 1.
   - FLAGGED PLACEHOLDER: the dashboard hero band uses a real food-
     photography background image on the live site. No such image asset
     is available here, so a solid dark panel is used in its place.
   - Sample activity data (5 example reservations, 3 counted / 2 not) is
     included so the Dashboard and Activity log have something real to
     render and demonstrate — this is clearly fabricated demo data, not
     a live booking backend (out of scope per PRD §5), and both screens
     derive their counts from the same array so the numbers stay
     internally consistent with each other.
   ============================================================================ */

const C = {
  white: "#ffffff",
  black: "#000000",
  ashDarker: "#141a26",
  ashDark: "#2d333f",
  ash: "#6f737b",
  ashLight: "#91949a",
  ashLighter: "#d8d9db",
  ashLightest: "#f1f2f4",
  red: "#da3743",
  redLight: "#e15b64",
  redDark: "#931b23",
  redLightest: "#fceeef",
  yellowLight: "#fdaf08",
  yellowLightest: "#fff8eb",
  progressFill: "#fdcf6a", // CSS-verified real fill/marker color (see sourcing notes above)
  green: "#2f864d", // foreground-success token, used for "goal reached" state
  teal: "#247f9e",
  avatarBlue: "#4a6fde",
  // AI/Concierge gradient family — exact tokens confirmed from the design
  // tokens file, used for the "Find the right table" section's subtle
  // background wash and the "Describe your ideal spot" gradient border:
  aiRed: "#e15b64", // --otkit-color-background-danger (red-light)
  aiYellow: "#fdaf08", // --otkit-color-background-accent-yellow (yellow-light)
  aiAqua: "#3ddbb6", // --otkit-color-background-accent-aqua-secondary (aqua-lighter)
};

const FONT =
  'BrandonText, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

/* NOTE on heading weights: OpenTable's real token value for all title/
   headline styles is font-weight 800, set on BrandonText — a licensed
   webfont that can't be loaded in this environment. Requesting 800 on the
   fallback stack (-apple-system/Segoe UI/Arial) renders visibly heavier
   than BrandonText's actual 800 cut, so headings here are pinned to 700 to
   match the real site's visual weight rather than its literal token value. */
const type = {
  titleLarge: { fontSize: 32, lineHeight: "40px", fontWeight: 700 },
  titleMedium: { fontSize: 24, lineHeight: "28px", fontWeight: 700 },
  titleSmall: { fontSize: 18, lineHeight: "24px", fontWeight: 700 },
  bodyLarge: { fontSize: 16, lineHeight: "24px", fontWeight: 400 },
  bodyMedium: { fontSize: 14, lineHeight: "20px", fontWeight: 400 },
  bodySmall: { fontSize: 12, lineHeight: "16px", fontWeight: 400 },
  labelMedium: { fontSize: 14, lineHeight: "14px", fontWeight: 400 },
};

/* ---------------------------------------------------------------------------
   ICONS — exact paths extracted from OpenTable's rendered HTML (viewBox 0 0 24 24)
--------------------------------------------------------------------------- */
const Ic = {
  Calendar: ({ size = 24, color = C.ashDark }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7 4a1 1 0 0 1 2 0v1h6V4a1 1 0 1 1 2 0v1h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2V4ZM5 7v2h14V7H5Zm0 4v8h14v-8H5Z"
        fill={color}
      />
    </svg>
  ),
  Bell: ({ size = 24, color = C.ashDark }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 3C13.1046 3 14 3.89543 14 5C14 5.25067 13.9539 5.49056 13.8697 5.71167C16.4097 6.33341 17.7717 8.30631 17.9736 11.1797C19.2676 12.6301 20 14.5083 20 16.5C20 17.0523 19.5523 17.5 19 17.5H5C4.44772 17.5 4 17.0523 4 16.5C4 14.5085 4.73217 12.6304 6.02577 11.1793L6.04698 10.9247C6.31056 8.18962 7.66614 6.31476 10.1298 5.71039C10.0461 5.49056 10 5.25067 10 5C10 3.89543 10.8954 3 12 3ZM12 7.5C9.29095 7.5 8.09835 8.89581 8.00468 11.63C7.99611 11.8801 7.89409 12.1179 7.71876 12.2964C6.85627 13.1747 6.28625 14.2878 6.08298 15.5H17.917L17.8636 15.2221C17.6243 14.1179 17.0772 13.1074 16.2808 12.2972C16.1052 12.1186 16.0031 11.8805 15.9946 11.6302C15.9016 8.89592 14.7091 7.5 12 7.5Z"
        fill={color}
      />
      <path d="M14 18.5C14 19.6048 13.1048 20.5 12 20.5C10.8952 20.5 10 19.6048 10 18.5H14Z" fill={color} />
    </svg>
  ),
  Reward: ({ size = 24, color = C.ashDark }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M19.56 7.09c.126-.35.19-.718.19-1.09A2.89 2.89 0 0 0 17 3c-1.4 0-4.28 1.56-5.61 2.87C10.27 5 7.84 4 6.75 4a2.5 2.5 0 0 0-2.5 2.5c.003.21.034.418.09.62A2 2 0 0 0 3 9v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-1.44-1.91ZM17 5c.41 0 .75.46.75 1s-.34 1-.75 1h-2.89c1.18-1.11 2.37-2 2.89-2ZM6.75 6a4.54 4.54 0 0 1 1.83 1H6.75a.5.5 0 0 1 0-1ZM5 9h6v2H5V9Zm0 4h6v6H5v-6Zm14 6h-6v-6h6v6Zm0-8h-6V9h6v2Z"
        fill={color}
      />
    </svg>
  ),
  Search: ({ size = 24, color = C.ashDark }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13,15.9291111 L13,21.5 C13,21.7761424 12.7761424,22 12.5,22 L11.5,22 C11.2238576,22 11,21.7761424 11,21.5 L11,15.9291111 C7.60770586,15.4438815 5,12.5264719 5,9 C5,5.13400675 8.13400675,2 12,2 C15.8659932,2 19,5.13400675 19,9 C19,12.5264719 16.3922941,15.4438815 13,15.9291111 Z M12,4 C9.23857625,4 7,6.23857625 7,9 C7,11.7614237 9.23857625,14 12,14 C14.7614237,14 17,11.7614237 17,9 C17,6.23857625 14.7614237,4 12,4 Z"
        fill={color}
        fillRule="nonzero"
        transform="translate(12,12) rotate(-45) translate(-12,-12)"
      />
    </svg>
  ),
  Location: ({ size = 20, color = C.ashDark }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 7a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm1 3a1 1 0 1 0-2 0 1 1 0 0 0 2 0Z" fill={color} />
      <path
        d="M4 10a8 8 0 1 1 16 0c0 2.813-2.433 6.59-7.3 11.33a1 1 0 0 1-1.4 0C6.433 16.59 4 12.813 4 10Zm14 0a6 6 0 0 0-12 0c0 1.21.8 4 6 9.21 5.2-5.21 6-8 6-9.21Z"
        fill={color}
      />
    </svg>
  ),
  ChevronDown: ({ size = 16, color = C.ashDark }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.11 11.354a.5.5 0 0 1 0-.708l.708-.707a.5.5 0 0 1 .707 0L12 12.414l2.475-2.475a.5.5 0 0 1 .707 0l.707.707a.5.5 0 0 1 0 .707l-3.535 3.536a.498.498 0 0 1-.708 0l-3.535-3.535Z"
        fill={color}
      />
    </svg>
  ),
  ChevronRight: ({ size = 20, color = C.ashDark }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="m11.01 6.353 4.95 4.95a.5.5 0 0 1 0 .707l-4.95 4.95a.5.5 0 0 1-.707 0l-.707-.707a.5.5 0 0 1 0-.707l3.89-3.89-3.89-3.888a.5.5 0 0 1 0-.707l.707-.708a.5.5 0 0 1 .707 0Z"
        fill={color}
      />
    </svg>
  ),
  Close: ({ size = 20, color = C.ashDark }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="m17.303 5.99.707.707a.5.5 0 0 1 0 .707L13.415 12l4.597 4.596a.5.5 0 0 1 0 .707l-.708.707a.5.5 0 0 1-.707 0L12 13.415l-4.596 4.597a.5.5 0 0 1-.707 0l-.707-.708a.5.5 0 0 1 0-.707L10.586 12 5.99 7.404a.5.5 0 0 1 0-.707l.707-.707a.5.5 0 0 1 .707 0L12 10.586l4.596-4.596a.5.5 0 0 1 .707 0Z"
        fill={color}
      />
    </svg>
  ),
  Cuisine: ({ size = 20, color = C.ashDark }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 2h5a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-1v8a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-8H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm0 9h5V4h-1v4.5a.5.5 0 0 1-1 0V4H8v4.5a.5.5 0 0 1-1 0V4H6v7ZM19.45 2a.55.55 0 0 1 .55.55V21a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-4h-1a2 2 0 0 1-2-2V7.45A5.45 5.45 0 0 1 19.45 2ZM18 15V4.32a3.46 3.46 0 0 0-2 3.13V15h2Z"
        fill={color}
      />
    </svg>
  ),
  Dietary: ({ size = 20, color = C.ashDark }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M19.595 8.557c-.146.345-.4.627-.723.808.39.237.678.53.775.89.321 1.2-1.572 2.81-2.542 3.542-.125.094-.26.17-.404.225-.435.998-1.693 2.05-2.425 2.603-.124.094-.26.17-.403.225-.436.999-1.693 2.051-2.425 2.603a1.669 1.669 0 0 1-1.213.326c-.892-.11-2.463-.384-3.35-1.005l-1.001 1.002a1 1 0 0 1-1.415-1.415l1.002-1.001c-.62-.887-.894-2.457-1.005-3.35a1.669 1.669 0 0 1 .326-1.213c.552-.732 1.604-1.99 2.603-2.425.055-.143.13-.278.225-.403.138-.183.307-.4.5-.627.47-.557 1.075-1.185 1.689-1.575.138-.087.277-.163.414-.223.056-.143.131-.279.225-.404.641-.848 1.954-2.404 3.075-2.565.16-.022.317-.017.467.023.36.097.653.386.89.775.18-.323.463-.577.808-.723 1.118-.474 3.46-1.309 4.338-.43.878.877.043 3.219-.43 4.337ZM7.711 17.594c.057.211 2.182.888 2.783.727.416-.112 1.264-.932 1.728-1.499-.934-.17-2.071-.48-2.697-1.023-.47.585-1.133 1.32-1.815 1.781l.001.014Zm3.685-5.799a.812.812 0 0 0 .059-.149c.16-.6-.464-2.712-.682-2.77-.185-.05-1.414 1.043-1.866 1.736.536.552.856 1.595 1.044 2.513a11.463 11.463 0 0 1 1.445-1.33Zm6.802-1.152c-.058-.217-2.17-.842-2.77-.681-.413.11-1.258.903-1.728 1.456.972.178 2.159.507 2.762 1.092.693-.453 1.786-1.68 1.736-1.867Zm-3.974-1.676a.817.817 0 0 0 .06-.15c.16-.6-.465-2.712-.682-2.77-.186-.05-1.414 1.043-1.867 1.737.537.552.857 1.594 1.044 2.513a11.467 11.467 0 0 1 1.445-1.33Zm3.946-.947c.44-.439.954-2.581.795-2.74-.159-.16-2.333.322-2.773.762-.212.212-.431.824-.586 1.42.076.37.13.72.168 1.01.277.036.61.087.961.157.598-.163 1.22-.394 1.435-.609Zm-4.847 7.472c.6-.16 2.105-1.803 2.046-2.02-.058-.217-2.17-.842-2.77-.682-.6.161-2.116 1.765-2.06 1.976.057.21 2.183.887 2.784.726Zm-7.399-1.741c-.16.6.516 2.726.727 2.783.21.056 1.815-1.46 1.975-2.06.161-.6-.464-2.712-.681-2.77-.217-.058-1.86 1.446-2.02 2.047Z"
        fill={color}
      />
    </svg>
  ),
  Dining: ({ size = 20, color = C.ashDark }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20 19a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2v-8.608c-.644-.51-.997-1.324-1-2.38a.996.996 0 0 1 .2-.612l2.993-3.99A.999.999 0 0 1 7 3h10c.331 0 .625.161.807.41l2.987 3.982.006.008a.995.995 0 0 1 .2.611c-.002 1.057-.356 1.87-1 2.38v8.61Zm-4-8.372c-.51.255-1.192.372-2 .372s-1.49-.117-2-.372c-.51.255-1.192.372-2 .372s-1.49-.117-2-.372c-.51.255-1.192.372-2 .372v8h3v-5a1 1 0 0 1 1-1h4a.997.997 0 0 1 1 1v5h3v-8c-.808 0-1.49-.117-2-.372Zm2.984-2.316L16.5 5h-9L5.016 8.313C5.078 8.84 5.336 9 6 9c.483 0 .824-.05 1.008-.124a1 1 0 0 1 1.984 0C9.176 8.95 9.518 9 10 9c.483 0 .824-.05 1.008-.124a1 1 0 0 1 1.984 0C13.176 8.95 13.517 9 14 9s.824-.05 1.008-.124a1 1 0 0 1 1.984 0C17.176 8.95 17.517 9 18 9c.665 0 .922-.159.984-.688ZM13 15h-2v4h2v-4Z"
        fill={color}
      />
    </svg>
  ),
  /* FLAGGED ADDITION — no OpenTable equivalent exists; hand-drawn to match
     the site's single-path, 24x24, #2D333F icon convention. */
  /* Bullseye-with-arrow, per direct request replacing the previous
     hand-drawn ring-only target icon. Only a raster PNG reference was
     provided (no vector source), so this is a hand-built approximation
     matching that reference's composition — 3 concentric rings, solid
     center dot, and a diagonal arrow piercing through toward the top-
     right with a triangular head and small tail fletching — not a
     pixel-perfect trace. */
  /* Bullseye-with-arrow, real vector SVG source provided directly by
     the user (replacing the earlier hand-drawn approximation, which
     was built from a raster PNG reference and didn't hold up visually).
     Paths and transforms kept exactly as given; only the hardcoded
     fill="#000000" swapped for the color prop so it responds like
     every other icon in this file, and width/height/viewBox adapted to
     this component's size prop convention (real source is a 512x512
     canvas with no explicit viewBox, so 0 0 512 512 is used here). */
  Target: ({ size = 20, color = C.ashDark }) => (
    <svg width={size} height={size} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0 0 C1.0828125 0.29729004 1.0828125 0.29729004 2.1875 0.60058594 C10.54871549 2.96482076 18.40008459 6.38807912 26.3125 9.9375 C27.2202417 10.34452148 28.1279834 10.75154297 29.06323242 11.17089844 C35.30845546 14.04585554 41.17446662 17.3520747 47 21 C45.69958023 23.9100166 44.37946909 25.81182315 41.99609375 27.91796875 C41.13274414 28.71750977 41.13274414 28.71750977 40.25195312 29.53320312 C39.04984254 30.62920707 37.83630753 31.71282005 36.61132812 32.78320312 C32.44019205 36.70154308 31.24958671 39.53995288 30.99243164 45.27075195 C30.99617798 46.12672974 30.99617798 46.12672974 31 47 C26.33250538 46.38845928 22.55082721 44.4045766 18.4375 42.25 C-22.71947413 21.32051875 -70.23980869 17.22426454 -114.28125 31.40234375 C-139.68816924 39.8798541 -162.37373972 52.71070997 -182 71 C-182.56058105 71.52207031 -183.12116211 72.04414063 -183.69873047 72.58203125 C-217.66886127 104.59515538 -236.25812051 149.77961506 -238.125 196.1015625 C-238.70163683 226.87955319 -231.64260239 256.94892424 -217 284 C-216.26330078 285.4540625 -216.26330078 285.4540625 -215.51171875 286.9375 C-197.77332821 321.31500054 -166.66848921 347.05620282 -132 363 C-130.84628906 363.53367187 -129.69257813 364.06734375 -128.50390625 364.6171875 C-88.0927593 382.00704561 -39.36100547 382.60947577 1.58276367 366.74536133 C9.27556797 363.6041685 16.69148164 359.94458193 24 356 C24.61214355 355.67386719 25.22428711 355.34773438 25.85498047 355.01171875 C38.31708852 348.32976602 49.05314298 340.14989377 59.30859375 330.48046875 C62 328 62 328 64.6484375 325.890625 C93.06730723 303.04223139 110.82001693 259.46433687 115.4140625 224.578125 C117.44483638 205.02659025 117.51081678 184.17751506 113 165 C112.82307617 164.22205078 112.64615234 163.44410156 112.46386719 162.64257812 C108.93751085 147.42869533 103.94838596 133.1203492 96.62768555 119.3137207 C94.82960538 115.88810998 93.50803554 112.85076212 93 109 C94.97806641 108.98646484 94.97806641 108.98646484 96.99609375 108.97265625 C103.13364882 108.29070569 106.06829432 104.85003135 110.0625 100.4375 C110.73732422 99.72658203 111.41214844 99.01566406 112.10742188 98.28320312 C113.75802351 96.53895033 115.38698401 94.77894444 117 93 C120.43203677 94.14401226 120.58798677 94.51659526 122.19921875 97.55078125 C122.59979492 98.30141846 123.00037109 99.05205566 123.41308594 99.82543945 C123.83364258 100.64616943 124.25419922 101.46689941 124.6875 102.3125 C125.12739258 103.16481201 125.56728516 104.01712402 126.02050781 104.89526367 C151.82105136 155.84807246 155.18497298 213.82151133 138.01367188 268.00439453 C127.98925971 297.62856053 110.97321359 324.02058983 89.41552734 346.51708984 C88.13444449 347.8591556 86.87266783 349.21958521 85.61328125 350.58203125 C78.19670695 358.37635976 69.68737084 364.7054979 61 371 C60.37464355 371.45407227 59.74928711 371.90814453 59.10498047 372.37597656 C13.45064729 405.11208174 -43.51135102 415.60800345 -98.43383789 406.93774414 C-152.30923754 397.51808626 -201.24924539 365.32860117 -232.7109375 320.86328125 C-237.98136591 313.19482332 -242.64201826 305.21674095 -247 297 C-247.55228271 295.96141846 -247.55228271 295.96141846 -248.11572266 294.90185547 C-272.82092306 247.57392895 -276.78419466 189.09651079 -261.31640625 138.3125 C-252.98137875 112.4151735 -240.41406441 88.88242579 -223 68 C-220.88406335 65.28166146 -218.76965282 62.56229947 -216.6640625 59.8359375 C-216.11492187 59.23007813 -215.56578125 58.62421875 -215 58 C-214.34 58 -213.68 58 -213 58 C-212.773125 57.443125 -212.54625 56.88625 -212.3125 56.3125 C-210.62449964 53.33840412 -208.53323483 51.27991135 -206 49 C-205.34 49 -204.68 49 -204 49 C-204 48.34 -204 47.68 -204 47 C-202.43059199 45.56187327 -200.79125965 44.1996995 -199.125 42.875 C-197.60132813 41.66070312 -197.60132813 41.66070312 -196.046875 40.421875 C-195.04140625 39.62265625 -194.0359375 38.8234375 -193 38 C-192.22140625 37.34515625 -191.4428125 36.6903125 -190.640625 36.015625 C-137.68952091 -8.17115842 -65.07716848 -18.02100056 0 0 Z"
        fill={color}
        transform="translate(295,77)"
      />
      <path
        d="M0 0 C1.09559656 3.28678968 0.96458631 5.14737563 0.65454102 8.57299805 C0.55436172 9.71395432 0.45418243 10.85491058 0.35096741 12.03044128 C0.23643723 13.26176285 0.12190704 14.49308441 0.00390625 15.76171875 C-0.10848892 17.02264847 -0.22088409 18.28357819 -0.33668518 19.5827179 C-0.63635341 22.93192743 -0.94143924 26.28055391 -1.24914551 29.62902832 C-1.56191537 33.0471995 -1.86757312 36.46600569 -2.17382812 39.88476562 C-2.77598885 46.59044932 -3.38529859 53.29545491 -4 60 C-3.34 59.67 -2.68 59.34 -2 59 C-0.61623109 58.79844196 0.7748287 58.6456322 2.16748047 58.51928711 C3.02953094 58.43927963 3.89158142 58.35927216 4.77975464 58.27684021 C5.71610748 58.19450638 6.65246033 58.11217255 7.6171875 58.02734375 C8.58471954 57.93997452 9.55225159 57.85260529 10.54910278 57.7625885 C12.60514302 57.57819551 14.66137407 57.3959199 16.71777344 57.21557617 C19.82813641 56.94162756 22.93748593 56.65781031 26.046875 56.37304688 C35.72553753 55.50452396 45.27640878 54.7153952 55 55 C50.39631605 60.51267982 45.51768283 65.65321372 40.45947266 70.74926758 C39.6228862 71.59563782 38.78629974 72.44200806 37.92436218 73.31402588 C35.17410903 76.09402632 32.41990749 78.87007686 29.6640625 81.64453125 C29.19339088 82.11850019 28.72271926 82.59246913 28.23778486 83.08080077 C23.79200542 87.55731388 19.34419355 92.0317984 14.89153481 96.50146961 C9.21882773 102.19611839 3.55644493 107.90062169 -2.09245145 113.61889344 C-6.07959995 117.65332564 -10.07821852 121.67616103 -14.08544695 125.69064826 C-16.47306662 128.08321122 -18.8554119 130.48051549 -21.22550583 132.89045143 C-23.87001988 135.57379025 -26.53276163 138.23766677 -29.20068359 140.89770508 C-30.36367226 142.09069466 -30.36367226 142.09069466 -31.55015564 143.30778503 C-36.22395969 147.91989726 -39.41844555 150.20937785 -46 151 C-48.99758911 150.86470032 -48.99758911 150.86470032 -51.87158203 150.4387207 C-64.39176784 149.52292644 -73.63183317 151.47630737 -83.39292526 159.50082207 C-94.6578884 169.38609725 -104.90921189 180.36233138 -115.14489746 191.29095459 C-119.72136478 196.14642987 -124.37763292 200.92379029 -129.02734375 205.70898438 C-138.09680829 215.0657823 -147.07894355 224.50170731 -156 234 C-155.78846786 234.74883453 -155.57693573 235.49766907 -155.35899353 236.26919556 C-155.08446854 237.25495575 -154.80994354 238.24071594 -154.52709961 239.25634766 C-154.11698891 240.71991196 -154.11698891 240.71991196 -153.69859314 242.21304321 C-150.83771827 253.62617367 -152.91747893 265.84147803 -158.6953125 275.97265625 C-166.20306392 287.0215131 -175.95298561 294.07950043 -189 297 C-203.75352653 297.89193768 -215.03694061 296.34756162 -227 287 C-227.61617187 286.52175781 -228.23234375 286.04351562 -228.8671875 285.55078125 C-237.79205946 277.67706088 -241.85741448 266.13895305 -242.90625 254.58984375 C-243.24023781 241.8008939 -238.56916167 229.58968564 -230 220 C-217.36829303 209.50630215 -205.05804076 206.85727977 -189 208 C-185.18653581 208.70604504 -181.65230729 209.72505812 -178 211 C-177.57984965 210.50308781 -177.15969931 210.00617561 -176.72681713 209.49420547 C-172.61559796 204.70392324 -168.31114908 200.31500047 -163.65942383 196.05371094 C-162.21610045 194.71654756 -160.77366102 193.37842958 -159.33198547 192.03948975 C-158.57828485 191.34019096 -157.82458424 190.64089218 -157.0480442 189.92040253 C-152.14466545 185.34164917 -147.30955395 180.6907057 -142.46942616 176.04528427 C-138.2451249 171.9981644 -133.99691158 167.98530932 -129.67895508 164.03808594 C-108.97838921 147.17749172 -108.97838921 147.17749172 -97.62201405 124.49052429 C-97.50272746 120.89871192 -97.58715092 117.33913718 -97.74609375 113.75 C-98.29445736 99.17293821 -92.76133333 90.67874375 -83.07630444 80.17599106 C-73.26934027 69.73952383 -62.85188899 59.87929019 -52.40055817 50.09570479 C-46.62113443 44.67913849 -40.93674345 39.16680241 -35.25673151 33.64637613 C-23.60372159 22.32481047 -11.84234014 11.12345674 0 0 Z"
        fill={color}
        transform="translate(432,25)"
      />
      <path
        d="M0 0 C-1.5391801 3.66752005 -3.75485452 5.98580573 -6.5703125 8.765625 C-7.46621094 9.65507812 -8.36210937 10.54453125 -9.28515625 11.4609375 C-10.22230469 12.38132813 -11.15945313 13.30171875 -12.125 14.25 C-13.07988637 15.19484856 -14.03431859 16.14015633 -14.98828125 17.0859375 C-17.32109087 19.39518338 -19.65844086 21.69963203 -22 24 C-23.09054687 23.52949219 -24.18109375 23.05898437 -25.3046875 22.57421875 C-49.95900403 12.26478388 -74.20445892 11.17300984 -99.22265625 21.3515625 C-120.94690238 30.62683781 -136.46485559 47.60406621 -146 69 C-154.46344883 90.99994414 -154.34325359 114.57132998 -145.625 136.4375 C-144.77312925 138.30240623 -143.89882944 140.15726707 -143 142 C-142.59394531 142.88558594 -142.18789062 143.77117187 -141.76953125 144.68359375 C-131.93309807 164.55838103 -113.78733682 178.41162169 -93.4765625 186.3828125 C-69.60195609 194.1868606 -45.37205465 191.83857845 -22.8125 181.25 C-6.68903491 172.76624387 4.94225262 160.52756694 14 145 C14.5053125 144.13375 15.010625 143.2675 15.53125 142.375 C26.24838255 122.50909576 27.24816502 98.76290603 21.125 77.421875 C19.85209285 73.55011575 18.37583748 69.83355897 16.63671875 66.1484375 C15.79604921 63.31182249 16.13526996 61.83278102 17 59 C18.91772461 56.59643555 18.91772461 56.59643555 21.40234375 54.13671875 C22.29244141 53.25048828 23.18253906 52.36425781 24.09960938 51.45117188 C25.03611328 50.53916016 25.97261719 49.62714844 26.9375 48.6875 C27.87013672 47.75615234 28.80277344 46.82480469 29.76367188 45.86523438 C36.71943681 39 36.71943681 39 39 39 C46.78184977 53.85266759 53.17997985 68.35346315 56 85 C56.13148438 85.76183594 56.26296875 86.52367187 56.3984375 87.30859375 C60.71202023 118.14488111 51.54842646 150.26876471 33 175 C30.72235401 177.68132633 28.3921373 180.28268605 25.98046875 182.84375 C23.96791357 184.94816542 23.96791357 184.94816542 22.36328125 187.28125 C21.91339844 187.8484375 21.46351563 188.415625 21 189 C20.34 189 19.68 189 19 189 C19 189.66 19 190.32 19 191 C16.93420467 192.81850304 14.86624698 194.51344087 12.6875 196.1875 C12.0466748 196.68217773 11.40584961 197.17685547 10.74560547 197.68652344 C-14.91272962 217.28016114 -46.46754044 226.44632787 -78.74902344 222.67919922 C-111.93270411 217.64599443 -140.86828721 201.0485875 -161.28515625 174.31738281 C-180.71906354 147.90757299 -187.63402441 114.91238463 -183.17553711 82.6027832 C-178.92678642 56.53025462 -166.13592273 34.83131854 -148 16 C-147.40703125 15.34386719 -146.8140625 14.68773437 -146.203125 14.01171875 C-108.78776156 -26.27462554 -44.61297821 -25.42864525 0 0 Z"
        fill={color}
        transform="translate(298,175)"
      />
    </svg>
  ),
  /* Real "icPoints" icon (data-test="icPoints"), exact path — confirmed
     directly from the real Booking Confirmation page's "OpenTable
     Regulars" section. REPLACES the previous incorrect use of the gift/
     Reward icon there, which was the wrong icon for this context. */
  Points: ({ size = 20, color = C.ashDark }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M19.818 10.865 13.325 3.59A1.774 1.774 0 0 0 12 3c-.508 0-.99.215-1.325.59l-6.492 7.276a1.702 1.702 0 0 0 0 2.269l6.492 7.275c.334.375.817.59 1.325.59a1.77 1.77 0 0 0 1.325-.59l6.494-7.275a1.707 1.707 0 0 0-.001-2.27Zm-1.668.385h-2.82l-1.173-4.475 3.994 4.475Zm-6.16-6.748L12 4.5l.01.002 1.768 6.748h-3.556l1.767-6.748ZM8.67 11.25h-2.82l3.992-4.475-1.172 4.475Zm-2.82 1.5h2.82l1.172 4.475-3.992-4.475Zm6.152 6.778h-.006l-1.775-6.778h3.556l-1.775 6.778Zm2.154-2.303 1.172-4.475h2.822l-3.994 4.475Z"
        fill={color}
      />
    </svg>
  ),
  /* Real "icPlus" icon (data-test="icPlus"), exact filled-path version,
     confirmed from the real Booking Confirmation page's "Add a special
     menu" button. Kept separate from the existing hand-drawn stroke-
     based Ic.Plus (used for the Search Results map's placeholder zoom
     controls) so that map's own "not a real integration" flagging isn't
     muddied by suddenly using a real sourced icon there. */
  PlusFilled: ({ size = 16, color = C.ashDark }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 6a1 1 0 0 1 1 1v4h4a1 1 0 1 1 0 2h-4v4a1 1 0 1 1-2 0v-4H7a1 1 0 1 1 0-2h4V7a1 1 0 0 1 1-1Z"
        fill={color}
      />
    </svg>
  ),
  /* PLACEHOLDER — not an extracted OpenTable icon; no exact SVG was found
     for the profile-photo camera badge. Hand-drawn generic camera glyph. */
  Camera: ({ size = 16, color = C.ashDark }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9 3a1 1 0 0 0-.8.4L7 5H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3l-1.2-1.6A1 1 0 0 0 15 3H9Zm3 5a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"
        fill={color}
      />
    </svg>
  ),
  Check: ({ size = 14, color = C.white }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.55 17.6 4 12.05l1.4-1.4 4.15 4.15L18.6 5.75 20 7.15l-10.45 10.45Z" fill={color} />
    </svg>
  ),
  /* Real triangle warning icon, exact path extracted from Profile page HTML
     (replaces v0.1's Unicode "⚠" character). */
  Warning: ({ size = 20, color = C.yellowLight }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11.125 3.51a1.003 1.003 0 0 1 1.746 0L21.87 19.52a.994.994 0 0 1-.873 1.48H3a.994.994 0 0 1-.873-1.48L11.125 3.51Zm-.127 6.055v3.976c0 .275.224.497.5.497h1c.276 0 .5-.222.5-.497V9.565a.499.499 0 0 0-.5-.498h-1c-.276 0-.5.223-.5.498Zm.5 6.461c-.276 0-.5.223-.5.497v.995c0 .274.224.497.5.497h1c.276 0 .5-.223.5-.497v-.995a.499.499 0 0 0-.5-.497h-1Z"
        fill={color}
      />
    </svg>
  ),
  /* Real lock icon, exact path (data-test="icPrivacy") extracted from
     Rewards Hub HTML — used there as the overlay on locked reward tiles;
     reused here identically for the "reach your goal" milestone tile. */
  Lock: ({ size = 24, color = C.white }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 15.732V17a1 1 0 1 1-2 0v-1.268A2 2 0 0 1 12 12a2 2 0 0 1 1 3.732Z" fill={color} />
      <path
        d="M7 6a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v2.535c1.196.692 2 1.984 2 3.465v6a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4v-6c0-1.48.804-2.773 2-3.465V6Zm2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H9Zm2-6a2 2 0 0 0-2 2v2h6V6a2 2 0 0 0-2-2h-2Z"
        fill={color}
      />
    </svg>
  ),
  /* PLACEHOLDER — the real empty-state illustration on Points Activity is
     an external SVG file (chest-2YUSKCC6.svg) OpenTable serves, not
     inline path data, so it could not be extracted. Hand-drawn open-chest
     line art used instead, matching the "simple line-art icon" pattern
     described in the design system for empty states. */
  EmptyChest: ({ size = 64, color = C.ashLighter }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none">
      <rect x="3" y="10" width="18" height="9" rx="1.5" stroke={color} strokeWidth="1.5" />
      <path d="M3 10 5 5h14l2 5" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 10v-2a3 3 0 0 1 6 0v2" stroke={color} strokeWidth="1.5" />
      <path d="M9 10h6" stroke={color} strokeWidth="1.5" />
    </svg>
  ),
  /* New icon for the "book from a recommended restaurant" tile — no
     existing OpenTable icon fits, so this reuses the fork/bottle glyph
     already established for cuisine rows (§4.2) rather than inventing a
     new shape from scratch. */
  Restaurant: ({ size = 22, color = C.ashDark }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 2h5a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-1v8a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-8H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm0 9h5V4h-1v4.5a.5.5 0 0 1-1 0V4H8v4.5a.5.5 0 0 1-1 0V4H6v7ZM19.45 2a.55.55 0 0 1 .55.55V21a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-4h-1a2 2 0 0 1-2-2V7.45A5.45 5.45 0 0 1 19.45 2ZM18 15V4.32a3.46 3.46 0 0 0-2 3.13V15h2Z"
        fill={color}
      />
    </svg>
  ),
  /* New icon for the "mark a dish as goal-aligned" tile — checkmark in a
     ring, built from the same check glyph already used elsewhere. */
  CheckCircle: ({ size = 22, color = C.ashDark }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Z" fill={color} />
      <path d="m10.5 15.3-3.2-3.2 1.4-1.4 1.8 1.8 4.8-4.8 1.4 1.4Z" fill={color} />
    </svg>
  ),
  /* Real star icon — exact path extracted from location-landing CSS/HTML
     (restaurant-card rating). Confirmed real color: brand red (#DA3743),
     not black outline or yellow, per design-system §4.9 sourcing note. */
  Star: ({ size = 16, color = C.red }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2.5 15.09 8.76 22 9.77l-5 4.87 1.18 6.88L12 18.27l-6.18 3.25L7 14.64l-5-4.87 6.91-1.01L12 2.5Z"
        fill={color}
      />
    </svg>
  ),
  /* Real filter/sliders icon, exact path provided directly — REPLACES
     the hand-drawn placeholder used since the original build. */
  Filter: ({ size = 18, color = C.ashDark }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5 5a1 1 0 0 1 2 0v5.268a2 2 0 0 1 0 3.464V19a1 1 0 1 1-2 0v-5.268a2 2 0 0 1 0-3.464V5ZM17 19v-2.268a2 2 0 0 1 0-3.464V5a1 1 0 1 1 2 0v8.268a2 2 0 0 1 0 3.464V19a1 1 0 1 1-2 0ZM11 9.732a2 2 0 0 1 0-3.464V5a1 1 0 1 1 2 0v1.268a2 2 0 0 1 0 3.464V19a1 1 0 1 1-2 0V9.732Z"
        fill={color}
      />
    </svg>
  ),
  /* Real social-proof icon (data-test="icSocialProof") — REPLACES the
     hand-drawn "People" placeholder from v0.4. Turns out the real icon
     isn't a people glyph at all, it's a trending-chart icon; only found
     this once digging into the specific "Book for lunch today" markup
     rather than generalizing from the earlier §4.9 extraction. */
  SocialProof: ({ size = 16, color = C.ashDark }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M15.5 5h5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5V8.414l-4.646 4.647a.5.5 0 0 1-.708 0L12 11.414 6.414 17H19v-2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6.5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H5v8.586l6.646-6.647a.5.5 0 0 1 .707 0L14 10.586 17.586 7H15.5a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5Z"
        fill={color}
      />
    </svg>
  ),
  /* Real search-input icon (data-test="icSearch") — a distinct, non-
     rotated magnifying glass, exact path from the hero search bar's
     location/cuisine field. Different from the header's icSearchTransparent
     (which IS rotated) — confirmed these are two separate real icons in
     OpenTable's set, not one reused inconsistently. */
  SearchInput: ({ size = 18, color = C.ashDark }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4.93 14.828a7 7 0 1 1 10.556-.757l3.939 3.94a.5.5 0 0 1 0 .707l-.707.707a.5.5 0 0 1-.707 0l-3.94-3.94a7.002 7.002 0 0 1-9.142-.657Zm1.413-8.485a5 5 0 1 0 7.071 7.071 5 5 0 0 0-7.07-7.07Z"
        fill={color}
      />
    </svg>
  ),
  /* Real clock icon (data-test="icClock"), exact path — leads the Time
     field in the hero search bar. */
  Clock: ({ size = 18, color = C.ashDark }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M11 7.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5V11h1.5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-5Z"
        fill={color}
      />
      <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-2 0a7 7 0 1 0-14 0 7 7 0 0 0 14 0Z" fill={color} />
    </svg>
  ),
  /* Real person icon (data-test="icPerson"), exact path — leads the
     Party size field in the hero search bar. */
  Person: ({ size = 18, color = C.ashDark }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.002 8a5 5 0 1 1 7.572 4.288c2.43.594 4.162 2.108 5.192 4.543A3 3 0 0 1 17.004 21H7a3 3 0 0 1-2.763-4.169c1.03-2.435 2.759-3.949 5.19-4.543A4.995 4.995 0 0 1 7.002 8Zm2 0A2.999 2.999 0 1 0 15 8a3 3 0 1 0-6 0Zm-2.31 10.949a.994.994 0 0 0 .316.051h9.987a1 1 0 0 0 .95-1.314C17.13 15.229 15.15 14 12.002 14c-3.15 0-5.13 1.229-5.943 3.686a.999.999 0 0 0 .634 1.263Z"
        fill={color}
      />
    </svg>
  ),
  /* Real carousel arrow icons (data-test="icBack" / "icAdvance"), exact
     paths — used by the ScrollCarousel component for prev/next controls. */
  Back: ({ size = 24, color = C.ashDark }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12.303 6.353a.5.5 0 0 1 .707 0l.707.708a.5.5 0 0 1 0 .707l-3.889 3.889 3.89 3.889a.5.5 0 0 1 0 .707l-.708.707a.5.5 0 0 1-.707 0l-4.95-4.95a.5.5 0 0 1 0-.707l4.95-4.95Z"
        fill={color}
      />
    </svg>
  ),
  Advance: ({ size = 24, color = C.ashDark }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="m11.01 6.353 4.95 4.95a.5.5 0 0 1 0 .707l-4.95 4.95a.5.5 0 0 1-.707 0l-.707-.707a.5.5 0 0 1 0-.707l3.89-3.89-3.89-3.888a.5.5 0 0 1 0-.707l.707-.708a.5.5 0 0 1 .707 0Z"
        fill={color}
      />
    </svg>
  ),
  /* Real "Powered by AI" sparkle icon, exact path — REPLACES the "⚡"
     emoji placeholder used since v0.4. */
  Sparkle: ({ size = 16, color = C.ashDark }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.723 8.979a7.038 7.038 0 0 1-3.744 3.744l-1.573.665a.665.665 0 0 0 0 1.224l1.573.665a7.038 7.038 0 0 1 3.744 3.744l.665 1.573a.665.665 0 0 0 1.224 0l.665-1.573a7.038 7.038 0 0 1 3.744-3.744l1.573-.665a.665.665 0 0 0 0-1.224l-1.573-.665a7.038 7.038 0 0 1-3.744-3.744l-.665-1.573a.665.665 0 0 0-1.224 0l-.665 1.573ZM10 10.674A8.938 8.938 0 0 0 13.326 14 8.938 8.938 0 0 0 10 17.326 8.938 8.938 0 0 0 6.674 14 8.938 8.938 0 0 0 10 10.674ZM16.62 3.252a.413.413 0 0 1 .76 0l.43 1.015a3.615 3.615 0 0 0 1.923 1.924l1.015.428a.413.413 0 0 1 0 .762l-1.208.51a3.1 3.1 0 0 0-1.65 1.649l-.51 1.208a.413.413 0 0 1-.76 0l-.43-1.015a3.615 3.615 0 0 0-1.923-1.924l-1.015-.428a.413.413 0 0 1 0-.762l1.015-.428a3.615 3.615 0 0 0 1.924-1.924l.428-1.015Z"
        fill={color}
      />
    </svg>
  ),
  /* FLAGGED — everything below this line is hand-drawn, not extracted
     from any real source (no HTML/CSS was available for the search
     results page). Built for the search-results rebuild only. */
  Heart: ({ size = 16, color = C.ashDark }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 21s-7.5-4.6-10-9.2C.5 8.6 2 5 5.5 5c2 0 3.4 1 4.5 2.4C11.1 6 12.5 5 14.5 5 18 5 19.5 8.6 22 11.8 19.5 16.4 12 21 12 21Z"
        fill="none"
        stroke={color}
        strokeWidth="1.6"
      />
    </svg>
  ),
  InfoCircle: ({ size = 14, color = C.ash }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Z"
        fill={color}
      />
      <circle cx="12" cy="8" r="1.1" fill={color} />
      <path d="M12 11a1 1 0 0 1 1 1v5a1 1 0 0 1-2 0v-5a1 1 0 0 1 1-1Z" fill={color} />
    </svg>
  ),
  Ticket: ({ size = 14, color = C.ashDark }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8Zm9 0v1.5M12 12.75v1.5M12 17v-1.5"
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  ),
  Plus: ({ size = 16, color = C.ashDark }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 5v14M5 12h14" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  Minus: ({ size = 16, color = C.ashDark }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 12h14" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  Compass: ({ size = 18, color = C.ashDark }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 11a8 8 0 1 1 16 0 8 8 0 0 1-16 0Zm8-10v2M11 21v2M1 11h2M19 11h2"
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path d="m14 8-4 4 4 4 4-4Z" fill={color} />
    </svg>
  ),
  Expand: ({ size = 16, color = C.ashDark }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9 3H3v6M15 3h6v6M9 21H3v-6M15 21h6v-6"
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  Pin: ({ size = 22, color = C.red }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z"
        fill={color}
      />
    </svg>
  ),
  /* Everything below is real, exact paths sourced directly from the
     actual Concierge page outerHTML/CSS provided — not hand-drawn. */
  ArrowUp: ({ size = 24, color = C.ashDark }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2.862 4.875c-.369-1.253.93-2.346 2.102-1.768l15.318 7.548c1.116.55 1.116 2.14 0 2.69L4.964 20.893c-1.172.578-2.47-.515-2.102-1.768l.96.282-.96-.282L4.958 12 2.862 4.875ZM6.748 13l-1.646 5.596L18.488 12 5.102 5.404 6.748 11H9a1 1 0 1 1 0 2H6.748Zm12.65-.552ZM4.08 19.1Z"
        fill={color}
      />
    </svg>
  ),
  Bookmark: ({ size = 24, color = C.ashDark }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7 3h10a2 2 0 0 1 2 2v15.606a.5.5 0 0 1-.726.445L12 17.87l-6.274 3.183A.5.5 0 0 1 5 20.605V5a2 2 0 0 1 2-2Zm10 2H7v13.337l5-2.57 5 2.57V5Z"
        fill={color}
      />
    </svg>
  ),
  ThumbsUp: ({ size = 16, color = C.ashDark }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2 10.07h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2v-10ZM15 9.1h5c1.044 0 1.909.63 1.993 1.68l.012.32-1.683 7.367A2.008 2.008 0 0 1 18.36 20.1H9c-1.105 0-2-.909-2-2.03v-6.43a2 2 0 0 1 .412-1.215l4.847-6.33c.477-.818 2.07-1.426 3.34-.894a2.204 2.204 0 0 1 1.04 3.167L15 9.1Zm.197-3.504c.057-.13-.265-.508-.37-.551-.143-.06-.588-.17-.827-.097-.172.053-5 6.692-5 6.692v6.429c0 .023 9.36.03 9.36.03-.005 0-.005-.001.003-.034l.009-.043 1.581-7.151H12.5l2.697-5.275Z"
        fill={color}
      />
    </svg>
  ),
  ThumbsDown: ({ size = 16, color = C.ashDark }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2 13.93v-10h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2ZM15 14.9l1.64 2.733A2.204 2.204 0 0 1 15.6 20.8c-1.271.53-2.864-.078-3.341-.896l-4.847-6.33A2 2 0 0 1 7 12.36V5.931c0-1.121.895-2.03 2-2.03h9.36c.954 0 1.775.683 1.962 1.632l1.683 7.368-.012.318c-.084 1.05-.95 1.682-1.993 1.682h-5Zm.197 3.504L12.5 13.13h7.453l-1.581-7.152a4.228 4.228 0 0 0-.01-.043c-.007-.033-.007-.034-.002-.034 0 0-9.36.007-9.36.03v6.429s4.828 6.64 5 6.692c.239.072.684-.037.828-.097.104-.043.426-.42.369-.55Z"
        fill={color}
      />
    </svg>
  ),
  /* "icWideDiamondSparkle" — the premium-badge icon, distinct from the
     regular Sparkle icon used for "Powered by AI" elsewhere. */
  DiamondSparkle: ({ size = 16, color = C.ashDark }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="m11.507 8.27.225-.195c1.702-1.56 4.33-1.526 5.975.083l.011.01 4.232 4.498-3.128 4.872-.013.017a4.743 4.743 0 0 1-3.837 1.949h-6.93a4.743 4.743 0 0 1-3.836-1.949l-.013-.017-3.128-4.872 4.23-4.496.011-.01a4.329 4.329 0 0 1 5.978-.084l.223.195Zm-5.139.949-2.62 2.785h3.474l3.144-2.739-.085-.073-.009-.009a2.83 2.83 0 0 0-3.904.036Zm3.137 2.785h4.004l-2.002-1.744-2.002 1.744Zm6.288 0h3.474l-2.62-2.784a2.849 2.849 0 0 0-3.906-.035l-.008.008-.084.072 3.144 2.739Zm-7.371 1.5 3.067 4.5h.027l3.068-4.5H8.422Zm-1.816 0h-3.22l2.045 3.185a3.244 3.244 0 0 0 2.611 1.315h1.632l-3.068-4.5Zm6.726 4.5h1.64c1.034 0 2.003-.49 2.612-1.315l2.046-3.185H16.4l-3.068 4.5ZM18.922 6.532a2.262 2.262 0 0 0-1.439-1.439l-.707-.24c-.348-.12-.348-.599 0-.707l.707-.24a2.262 2.262 0 0 0 1.439-1.438l.24-.707c.12-.348.599-.348.707 0l.24.707c.227.683.755 1.21 1.438 1.439l.707.24c.348.12.348.599 0 .707l-.707.24a2.262 2.262 0 0 0-1.439 1.438l-.24.707c-.12.348-.599.348-.707 0l-.24-.707Z"
        fill={color}
      />
    </svg>
  ),
  /* Concierge loader — center "stars" icon, always visible, doesn't
     rotate. */
  ConciergeStar: ({ size = 20, color = C.ashDark }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.3029 5.54076C17.5177 5.61363 17.5177 6.02212 17.3029 6.095C16.685 6.30473 15.9204 6.63887 15.4437 7.11548C14.9671 7.5921 14.633 8.3567 14.4233 8.97469C14.3504 9.18944 13.9419 9.18944 13.869 8.97469C13.6593 8.3567 13.3251 7.5921 12.8485 7.11548C12.3719 6.63887 11.6073 6.30473 10.9893 6.095C10.7746 6.02212 10.7746 5.61363 10.9893 5.54076C11.6073 5.33103 12.3719 4.99688 12.8485 4.52027C13.3251 4.04365 13.6593 3.27905 13.869 2.66106C13.9419 2.44631 14.3504 2.44631 14.4233 2.66106C14.633 3.27905 14.9671 4.04365 15.4437 4.52027C15.9204 4.99688 16.685 5.33103 17.3029 5.54076ZM12.3777 11.0289C12.4338 11.0566 12.49 11.0837 12.5463 11.1103C12.8372 11.2477 13.1298 11.3702 13.4121 11.4784C13.5488 11.5309 13.683 11.5799 13.8136 11.6257C14.1876 11.7569 14.1876 12.4922 13.8136 12.6233C13.683 12.6691 13.5488 12.7182 13.4121 12.7706C13.1298 12.8788 12.8372 13.0014 12.5463 13.1387C12.49 13.1653 12.4338 13.1925 12.3777 13.2202C11.7065 13.5515 11.0564 13.9627 10.575 14.4602C10.1072 14.9436 9.71824 15.5915 9.40241 16.264C9.36682 16.3398 9.33217 16.4159 9.29843 16.4921C9.15578 16.8143 9.02958 17.1386 8.91924 17.4497C8.87622 17.571 8.8356 17.6903 8.79736 17.8068C8.67041 18.1933 7.95886 18.1933 7.83191 17.8068C7.79367 17.6903 7.75305 17.571 7.71003 17.4497C7.59969 17.1386 7.47349 16.8143 7.33084 16.4921C7.2971 16.4159 7.26244 16.3398 7.22686 16.264C6.91103 15.5915 6.52206 14.9436 6.0543 14.4602C5.57288 13.9627 4.92278 13.5515 4.25161 13.2202C4.1955 13.1925 4.13925 13.1653 4.08294 13.1387C3.79203 13.0014 3.49949 12.8788 3.21721 12.7706C3.08052 12.7182 2.94624 12.6691 2.81571 12.6233C2.44164 12.4922 2.44164 11.7569 2.81571 11.6257C2.94624 11.5799 3.08052 11.5309 3.21721 11.4784C3.49949 11.3702 3.79203 11.2477 4.08294 11.1103C4.13926 11.0837 4.1955 11.0566 4.25161 11.0289C4.92278 10.6975 5.57288 10.2863 6.0543 9.78882C6.52206 9.30547 6.91103 8.65758 7.22686 7.98504C7.26244 7.90926 7.2971 7.83317 7.33084 7.75696C7.47349 7.43473 7.59969 7.11048 7.71003 6.79935C7.75305 6.67802 7.79367 6.55869 7.83191 6.44225C7.95886 6.05571 8.67041 6.05571 8.79736 6.44225C8.8356 6.55869 8.87622 6.67802 8.91924 6.79935C9.02958 7.11048 9.15578 7.43473 9.29843 7.75696C9.33217 7.83317 9.36683 7.90926 9.40241 7.98504C9.71824 8.65758 10.1072 9.30547 10.575 9.78882C11.0564 10.2863 11.7065 10.6975 12.3777 11.0289ZM9.13776 11.1797C9.48176 11.5351 9.87216 11.8488 10.2807 12.1245C9.87216 12.4003 9.48176 12.7139 9.13776 13.0694C8.83191 13.3854 8.55847 13.7391 8.31464 14.1099C8.0708 13.7391 7.79736 13.3854 7.49151 13.0694C7.14751 12.7139 6.75711 12.4003 6.34861 12.1245C6.75711 11.8488 7.14751 11.5351 7.49151 11.1797C7.79736 10.8636 8.0708 10.5099 8.31463 10.1391C8.55847 10.5099 8.83191 10.8636 9.13776 11.1797Z"
        fill={color}
      />
    </svg>
  ),
  ConciergeOutline1: ({ color = C.ashDark }) => (
    <svg width="100%" height="100%" viewBox="0 0 30 34" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <path
        d="M13.4688 2.07129C14.3537 1.54611 15.4413 1.51401 16.3516 1.97363L16.5312 2.07129L21.7998 5.19824L21.8096 5.20508L21.8203 5.21094L27.1631 8.20996C28.0602 8.71378 28.6324 9.63923 28.6895 10.6572L28.6943 10.8623L28.6201 16.9883V17.0117L28.6943 23.1377C28.7067 24.1666 28.1909 25.125 27.3379 25.6836L27.1631 25.79L21.8203 28.7891L21.8096 28.7949L21.7998 28.8018L16.5312 31.9287C15.6463 32.4539 14.5587 32.486 13.6484 32.0264L13.4688 31.9287L8.2002 28.8018L8.19043 28.7949L8.17969 28.7891L2.83691 25.79C1.93977 25.2862 1.36764 24.3608 1.31055 23.3428L1.30566 23.1377L1.37988 17.0117V16.9883L1.30566 10.8623C1.29327 9.83341 1.80911 8.87495 2.66211 8.31641L2.83691 8.20996L8.17969 5.21094L8.19043 5.20508L8.2002 5.19824L13.4688 2.07129Z"
        stroke={color}
        strokeWidth="2"
      />
    </svg>
  ),
  ConciergeOutline2: ({ color = C.ashDark }) => (
    <svg width="100%" height="100%" viewBox="0 0 34 32" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <path
        d="M2.52734 17.7676C1.80712 16.78 1.76216 15.4624 2.39258 14.4336L2.52734 14.2324L3.29395 13.1807C3.88086 12.3761 4.21334 11.416 4.25098 10.4238L4.25488 10.2246L4.25195 8.92383C4.24963 7.70148 4.98791 6.60837 6.10254 6.14648L6.33105 6.0625L7.56934 5.66309C8.51697 5.35707 9.35031 4.77567 9.96387 3.99512L10.084 3.83594L10.8467 2.78223C11.5633 1.79201 12.8024 1.34153 13.9756 1.62305L14.209 1.68945L15.4463 2.09375C16.3929 2.40325 17.409 2.42326 18.3643 2.15234L18.5537 2.09375L19.791 1.68945C20.953 1.30953 22.2203 1.6741 23.0039 2.5918L23.1533 2.78223L23.916 3.83594C24.4999 4.64287 25.311 5.25626 26.2432 5.59863L26.4307 5.66309L27.6689 6.0625C28.9098 6.46306 29.7505 7.61994 29.748 8.92383L29.7451 10.2246C29.7432 11.2205 30.039 12.1927 30.5918 13.0176L30.7061 13.1807L31.4727 14.2324C32.1929 15.22 32.2378 16.5376 31.6074 17.5664L31.4727 17.7676L30.7061 18.8193C30.1191 19.6239 29.7867 20.584 29.749 21.5762L29.7451 21.7754L29.748 23.0762L29.7383 23.3193C29.6497 24.4418 28.9377 25.4225 27.8975 25.8535L27.6689 25.9375L26.4307 26.3369C25.483 26.6429 24.6497 27.2243 24.0361 28.0049L23.916 28.1641L23.1533 29.2178C22.4367 30.208 21.1976 30.6585 20.0244 30.377L19.791 30.3105L18.5537 29.9062C17.6071 29.5968 16.591 29.5767 15.6357 29.8477L15.4463 29.9062L14.209 30.3105C13.047 30.6905 11.7797 30.3259 10.9961 29.4082L10.8467 29.2178L10.084 28.1641C9.50006 27.3571 8.68899 26.7437 7.75684 26.4014L7.56934 26.3369L6.33105 25.9375C5.16787 25.562 4.35662 24.5221 4.26172 23.3193L4.25195 23.0762L4.25488 21.7754C4.25678 20.7795 3.96096 19.8073 3.4082 18.9824L3.29395 18.8193L2.52734 17.7676Z"
        stroke={color}
        strokeWidth="2"
      />
    </svg>
  ),
  /* Real capture: outline-3's path is identical to outline-2's — not an
     extraction error, the source SVGs themselves are the same shape. */
  ConciergeOutline3: ({ color = C.ashDark }) => (
    <svg width="100%" height="100%" viewBox="0 0 34 32" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <path
        d="M2.52734 17.7676C1.80712 16.78 1.76216 15.4624 2.39258 14.4336L2.52734 14.2324L3.29395 13.1807C3.88086 12.3761 4.21334 11.416 4.25098 10.4238L4.25488 10.2246L4.25195 8.92383C4.24963 7.70148 4.98791 6.60837 6.10254 6.14648L6.33105 6.0625L7.56934 5.66309C8.51697 5.35707 9.35031 4.77567 9.96387 3.99512L10.084 3.83594L10.8467 2.78223C11.5633 1.79201 12.8024 1.34153 13.9756 1.62305L14.209 1.68945L15.4463 2.09375C16.3929 2.40325 17.409 2.42326 18.3643 2.15234L18.5537 2.09375L19.791 1.68945C20.953 1.30953 22.2203 1.6741 23.0039 2.5918L23.1533 2.78223L23.916 3.83594C24.4999 4.64287 25.311 5.25626 26.2432 5.59863L26.4307 5.66309L27.6689 6.0625C28.9098 6.46306 29.7505 7.61994 29.748 8.92383L29.7451 10.2246C29.7432 11.2205 30.039 12.1927 30.5918 13.0176L30.7061 13.1807L31.4727 14.2324C32.1929 15.22 32.2378 16.5376 31.6074 17.5664L31.4727 17.7676L30.7061 18.8193C30.1191 19.6239 29.7867 20.584 29.749 21.5762L29.7451 21.7754L29.748 23.0762L29.7383 23.3193C29.6497 24.4418 28.9377 25.4225 27.8975 25.8535L27.6689 25.9375L26.4307 26.3369C25.483 26.6429 24.6497 27.2243 24.0361 28.0049L23.916 28.1641L23.1533 29.2178C22.4367 30.208 21.1976 30.6585 20.0244 30.377L19.791 30.3105L18.5537 29.9062C17.6071 29.5968 16.591 29.5767 15.6357 29.8477L15.4463 29.9062L14.209 30.3105C13.047 30.6905 11.7797 30.3259 10.9961 29.4082L10.8467 29.2178L10.084 28.1641C9.50006 27.3571 8.68899 26.7437 7.75684 26.4014L7.56934 26.3369L6.33105 25.9375C5.16787 25.562 4.35662 24.5221 4.26172 23.3193L4.25195 23.0762L4.25488 21.7754C4.25678 20.7795 3.96096 19.8073 3.4082 18.9824L3.29395 18.8193L2.52734 17.7676Z"
        stroke={color}
        strokeWidth="2"
      />
    </svg>
  ),
  ConciergeOutline4: ({ color = C.ashDark }) => (
    <svg width="100%" height="100%" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <path
        d="M10.3576 29.622C6.74488 28.1256 3.87429 25.255 2.37784 21.6422C0.88144 18.0295 0.881445 13.9702 2.37784 10.3575C3.87429 6.74476 6.74488 3.87417 10.3576 2.37771C13.9703 0.881314 18.0297 0.881314 21.6424 2.37771C25.2551 3.87417 28.1257 6.74476 29.6222 10.3575C31.1186 13.9702 31.1186 18.0295 29.6222 21.6422C28.1257 25.255 25.2551 28.1256 21.6424 29.622C18.0297 31.1184 13.9703 31.1184 10.3576 29.622Z"
        stroke={color}
        strokeWidth="1.92"
      />
    </svg>
  ),
};

/* ---------------------------------------------------------------------------
   LOGO — real OpenTable logo (mark + "OpenTable" wordmark), exact SVG paths
   provided directly by the person. Includes both the two-circle mark
   (#da3743) and the wordmark typography as vector paths (#333), so no
   separate text element is needed alongside it.
--------------------------------------------------------------------------- */
function Logo({ height = 26 }) {
  const width = height * (428 / 95);
  return (
    <svg width={width} height={height} viewBox="0 0 428 95" xmlns="http://www.w3.org/2000/svg" aria-label="OpenTable">
      <path
        d="M83.36 0a47.5 47.5 0 1047.46 47.5A47.48 47.48 0 0083.36 0zm0 59.37A11.87 11.87 0 1195.22 47.5a11.87 11.87 0 01-11.87 11.87zM0 47.5a11.87 11.87 0 1111.87 11.87A11.87 11.87 0 010 47.5"
        fill="#da3743"
      />
      <path
        d="M243.82 38.41a12.14 12.14 0 0112.42 12.54c0 .41-.06 1.35-.12 1.76a1.38 1.38 0 01-1.29 1.23h-17.34a6.5 6.5 0 006.74 6.27 9 9 0 005.8-2 1.13 1.13 0 011.76 0l2.28 3a1.14 1.14 0 01-.12 1.76 15.27 15.27 0 01-10.08 3.69c-8.08 0-13.71-6.45-13.71-14.19s5.64-14.06 13.66-14.06zm5 10.73a5 5 0 00-5.21-4.69c-3.28 0-5.39 2-5.74 4.69h11zm65.6-21.16H286.9a1.11 1.11 0 00-1.11 1.11v4.81a1.11 1.11 0 001.11 1.11h9.94v30a1.15 1.15 0 001.16 1.07h5.45a1.15 1.15 0 001.11-1.11v-30h9.94a1.11 1.11 0 001.11-1.11v-4.77a1.11 1.11 0 00-1.15-1.11zm41.45 10.44a19.15 19.15 0 00-6.62 1.17V29.26a1.34 1.34 0 00-1.25-1.28h-4.75a1.39 1.39 0 00-1.25 1.28v35.53a1.34 1.34 0 001.29 1.29H346a1.3 1.3 0 001.3-1.29v-2.1a11.83 11.83 0 009 4c7.4.04 12.7-6.41 12.7-14.19 0-7.88-5.07-14.09-13.09-14.09zm-.64 21.63a6.21 6.21 0 01-6-3.75v-9.68a10.7 10.7 0 015.62-1.52c4.45 0 6.74 3.63 6.74 7.45s-2.11 7.49-6.33 7.49zm45.85-21.63a12.14 12.14 0 0112.42 12.54c0 .41-.06 1.35-.12 1.76a1.38 1.38 0 01-1.29 1.23h-17.31a6.5 6.5 0 006.74 6.27 9 9 0 005.8-2 1.13 1.13 0 011.76 0l2.28 3a1.14 1.14 0 01-.12 1.76 15.27 15.27 0 01-10.08 3.69c-8.08 0-13.71-6.45-13.71-14.19s5.63-14.07 13.66-14.07zm5 10.73a5 5 0 00-5.21-4.69c-3.28 0-5.39 2-5.74 4.69h11zM212.95 38.41a11.69 11.69 0 00-8.84 4v-2.12a1.3 1.3 0 00-1.29-1.29h-2.88a1.3 1.3 0 00-1.29 1.29v35.52a1.34 1.34 0 001.29 1.29h4.75a1.39 1.39 0 001.31-1.29v-10.2a20.1 20.1 0 006.5 1.11c8.08 0 13.42-6.21 13.42-14.13-.02-8.2-5.59-14.18-12.97-14.18zm-1.35 21.63a10.7 10.7 0 01-5.6-1.54v-9.65a6.21 6.21 0 016-3.75c4.22 0 6.39 3.69 6.39 7.5s-2.34 7.44-6.79 7.44zm64.5-21.63a10.92 10.92 0 00-8.71 3.91v-2a1.3 1.3 0 00-1.29-1.29H263a1.3 1.3 0 00-1.29 1.29v24.5a1.34 1.34 0 001.29 1.26h4.34c1.29 0 1.7-.29 1.7-1.29V49.31a6 6 0 015.86-4.22c3.28 0 4.69 2.17 4.69 5.69v14a1.3 1.3 0 001.29 1.29h4.75a1.34 1.34 0 001.29-1.29v-14c.02-6.57-2.21-12.37-10.82-12.37zm49.18 0a34.18 34.18 0 00-9.28 1.35 1.24 1.24 0 00-.88 1.64l.59 3a1.17 1.17 0 001.52 1.17 33.86 33.86 0 017.62-1c2.87 0 3.87 1.64 3.75 5.1a19.85 19.85 0 00-5.21-.76c-6.85 0-10.78 3.69-10.78 8.5 0 5.8 3.75 9.26 9.14 9.26a11.85 11.85 0 008.49-3.4v1.46a1.3 1.3 0 001.29 1.29h2.64a1.3 1.3 0 001.29-1.29V50.19c.02-7.38-1.74-11.78-10.17-11.78zm3.16 20a5.81 5.81 0 01-4.86 2.87 3.57 3.57 0 01-3.92-3.78c0-2.4 1.7-3.87 4.8-3.87a10.79 10.79 0 014 .82v4zM173.86 28a19.45 19.45 0 00-19.37 19.5 19.4 19.4 0 0038.8 0A19.49 19.49 0 00173.86 28zm0 7.53a12.09 12.09 0 0111.9 12 11.87 11.87 0 11-11.9-12.03zm208.84 30.6a1.31 1.31 0 001.3-1.29v-4.77a1.3 1.3 0 00-1.29-1.29h-.21a1.25 1.25 0 01-1.16-1.16V29.36a1.39 1.39 0 00-1.34-1.29h-4.7a1.39 1.39 0 00-1.3 1.29V61.5a5 5 0 004.65 4.66h4zm34.83-22.22a5.24 5.24 0 1110.47 0 5.24 5.24 0 11-10.47 0zm9.36 0a4.14 4.14 0 10-8.24 0 4.13 4.13 0 108.24 0zm-6.13-2.89h2.11c1.17 0 2.17.47 2.17 1.81a1.64 1.64 0 01-1 1.53l1.28 2.31H424l-1-1.94h-1.14v1.94h-1.14v-5.65zm1.86 2.81a1 1 0 001.19-.95.91.91 0 00-1.14-.92h-.78v1.86h.72z"
        fill="#333"
      />
    </svg>
  );
}

/* ---------------------------------------------------------------------------
   GOAL CONFIG
   `tracking` documents how each goal will be measured on the future
   Nutrition Goals dashboard (Flow 2) — decided here so Flow 2 has a single
   source of truth to build against rather than inventing it per-goal later:
     'target' — has a self-declared monthly frequency (the stepper). Dashboard
                shows "N of [target] meals this [period]" — a real fraction,
                never a silently-assumed one.
     'tally'  — no meaningful per-meal target exists (there's no dish
                attribute that means "weight-management-friendly" the way
                "high protein" is a dish attribute, and there's no wearable/
                scale integration per PRD §4 to measure the outcome either).
                Dashboard shows a running count with no denominator, e.g.
                "4 goal-aligned meals this month" — real progress, honestly
                presented, instead of a fabricated "X of Y".
     'none'   — "Just exploring": no active goal, so no tracking module at
                all. Only affects recommendation ranking (light nudges).
--------------------------------------------------------------------------- */
/* Goal set revised per direct discussion — all 5 real goals now get the
   frequency stepper (hasFrequency:true, tracking:"target"); only "Just
   exploring" has neither, matching the modal's new visual split (5
   goals in the grid, "Just exploring" set apart below its own "Not
   sure yet?" label). The previous "tally" tracking type (used by
   Manage weight / Balanced eating) is no longer needed with this set. */
const GOALS = [
  { id: "protein", label: "More protein", hasFrequency: true, freqNoun: "protein-forward", tracking: "target" },
  { id: "fiber", label: "More fiber", hasFrequency: true, freqNoun: "high-fiber", tracking: "target" },
  { id: "plant", label: "More plant-forward", hasFrequency: true, freqNoun: "plant-forward", tracking: "target" },
  { id: "sugar", label: "Less added sugar", hasFrequency: true, freqNoun: "low-sugar", tracking: "target" },
  { id: "balanced", label: "More balanced meals", hasFrequency: true, freqNoun: "balanced", tracking: "target" },
  { id: "exploring", label: "Just exploring", hasFrequency: false, tracking: "none" },
];

function goalSummary(saved) {
  if (!saved) return null;
  const g = GOALS.find((x) => x.id === saved.goalId);
  if (!g) return null;
  return g.hasFrequency ? `${g.label} · ${saved.frequency} meals/month` : g.label;
}

/* ---------------------------------------------------------------------------
   HEADER — global logged-in header, confirmed structure from live HTML
--------------------------------------------------------------------------- */
function Header({ onNavigate }) {
  return (
    <div style={{ fontFamily: FONT }}>
      <div style={{ background: C.ashLightest, borderBottom: `1px solid ${C.ashLighter}` }}>
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "flex",
            justifyContent: "flex-end",
            gap: 20,
            padding: "6px 24px",
            color: C.ash,
            fontSize: 12,
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
            Mobile <Ic.ChevronDown size={16} color={C.ash} />
          </span>
          <span>For Businesses</span>
          <span>FAQs</span>
          <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
            EN <Ic.ChevronDown size={16} color={C.ash} />
          </span>
        </div>
      </div>

      <div style={{ background: C.white, borderBottom: `1px solid ${C.ashLighter}` }}>
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            <div
              style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
              onClick={() => onNavigate("home")}
              title="OpenTable home"
            >
              <Logo height={26} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
              <Ic.Location size={20} />
              <span style={{ ...type.bodyLarge, color: C.ashDark }}>New York City</span>
              <Ic.ChevronDown size={20} />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <span
              onClick={() => onNavigate("profile")}
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: C.avatarBlue,
                color: C.white,
                fontWeight: 700,
                fontSize: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontFamily: FONT,
              }}
              title="Profile"
            >
              GA
            </span>
            <span style={{ cursor: "pointer", display: "flex" }} title="Reservations">
              <Ic.Calendar />
            </span>
            <span style={{ cursor: "pointer", display: "flex" }} title="Updates">
              <Ic.Bell />
            </span>
            <span
              style={{ cursor: "pointer", display: "flex" }}
              title="Nutrition Goals"
              onClick={() => onNavigate("dashboard")}
            >
              <Ic.Target size={24} />
            </span>
            <span style={{ cursor: "pointer", display: "flex" }} title="Rewards Hub">
              <Ic.Reward />
            </span>
            <span
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                borderLeft: `1px solid ${C.ashLighter}`,
                paddingLeft: 12,
              }}
              title="Search"
            >
              <Ic.Search />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   LEFT NAV — account section nav, secondary Nutrition Goals entry per PRD §6
   Now navigation-aware: "Profile" and "Nutrition Goals" switch screens;
   other items stay visually present but inert (out of scope for this
   prototype).
--------------------------------------------------------------------------- */
function LeftNav({ activeScreen, onNavigate }) {
  // "Nutrition Goals" removed per direct instruction — redundant with
  // the header's Nutrition Goals (target) icon, which already links
  // directly to the Dashboard from every screen. (Earlier attempt at
  // this same request wrongly removed the Diner Profile page's
  // "Nutrition goals" row instead — reverted; this is the correct
  // item.)
  const items = [
    { label: "Profile", screen: "profile" },
    { label: "Reservations", screen: null },
    { label: "Saved Restaurants", screen: null },
    { label: "Settings", screen: "settings" },
    { label: "Payment Methods", screen: null },
  ];
  return (
    <nav style={{ width: 220, flexShrink: 0 }}>
      {items.map(({ label, screen }) => {
        const active = screen === activeScreen;
        return (
          <div
            key={label}
            onClick={() => screen && onNavigate(screen)}
            style={{
              padding: "10px 0",
              fontSize: 16,
              fontWeight: active ? 700 : 400,
              color: active ? C.ashDark : C.ash,
              cursor: screen ? "pointer" : "default",
            }}
          >
            {label}
          </div>
        );
      })}
    </nav>
  );
}

/* ---------------------------------------------------------------------------
   DINER PROFILE ROW — icon + title + summary (+ optional footnote) + chevron
   (NEW badge removed in v0.2)
--------------------------------------------------------------------------- */
function ProfileRow({ icon, title, summary, footnote, onClick, placeholder, first }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "24px 0",
        background: "none",
        border: "none",
        borderTop: first ? "none" : `1px solid ${C.ashLighter}`,
        cursor: "pointer",
        textAlign: "left",
        fontFamily: FONT,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
        <span style={{ marginTop: 2 }}>{icon}</span>
        <div>
          <h4 style={{ margin: 0, fontSize: 16, lineHeight: "24px", fontWeight: 700, color: C.ashDark }}>{title}</h4>
          <p style={{ margin: "4px 0 0", ...type.bodyMedium, color: summary ? C.ash : C.ashLight }}>
            {summary || placeholder}
          </p>
          {footnote && (
            <p style={{ margin: "2px 0 0", ...type.bodySmall, color: C.ash }}>{footnote}</p>
          )}
        </div>
      </div>
      <Ic.ChevronRight />
    </button>
  );
}

/* ---------------------------------------------------------------------------
   PROFILE PAGE
--------------------------------------------------------------------------- */
function ProfilePage({ savedGoal, onOpenGoalModal, onNavigate }) {
  return (
    <div style={{ fontFamily: FONT, minHeight: "100vh", background: C.ashLightest }}>
      <Header onNavigate={onNavigate} />

      <div style={{ background: C.white, borderBottom: `1px solid ${C.ashLighter}` }}>
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "32px 24px",
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div style={{ position: "relative" }}>
            <span
              style={{
                width: 96,
                height: 96,
                borderRadius: "50%",
                background: C.avatarBlue,
                color: C.white,
                fontWeight: 700,
                fontSize: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: FONT,
              }}
            >
              GA
            </span>
            <span
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: C.white,
                border: `1px solid ${C.ashLighter}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              title="Placeholder — exact OpenTable camera icon not extracted"
            >
              <Ic.Camera size={14} />
            </span>
          </div>
          <div>
            <h1 style={{ margin: 0, ...type.titleLarge, color: C.ashDark }}>Gaurav Agarwal</h1>
            <p style={{ margin: "4px 0 0", ...type.bodyMedium, color: C.ash }}>Member since August 2026</p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px", display: "flex", gap: 48 }}>
        <LeftNav activeScreen="profile" onNavigate={onNavigate} />

        <div style={{ flex: 1, maxWidth: 720 }}>
          <div
            style={{
              background: C.white,
              borderRadius: 4,
              padding: 24,
              borderBottom: `1px solid ${C.ashLighter}`,
            }}
          >
            <h2
              style={{
                margin: "0 0 24px",
                ...type.titleMedium,
                color: C.ashDark,
                display: "flex",
                alignItems: "baseline",
                gap: 12,
              }}
            >
              About you
              <span style={{ fontSize: 14, fontWeight: 400, color: C.teal, cursor: "pointer" }}>Privacy Policy</span>
            </h2>

            <h3 style={{ margin: "0 0 4px", ...type.titleSmall, color: C.ashDark }}>Diner profile</h3>
            <p style={{ margin: "0 0 8px", ...type.bodyMedium, color: C.ash }}>
              Fill out your diner profile to get better, more personalized recommendations.
            </p>

            <ProfileRow icon={<Ic.Cuisine />} title="Favorite cuisines" summary="American, Indian, Italian, Mexican, Vegetarian" first />
            <ProfileRow icon={<Ic.Cuisine />} title="Cuisines recommended less" summary="Fusion, Korean, Caribbean" />
            <ProfileRow
              icon={<Ic.Dietary />}
              title="Dietary preferences"
              summary="No red meat*, Vegetarian*, Vegan*"
              footnote="*Shared with restaurants when you make a booking"
            />
            <ProfileRow
              icon={<Ic.Dining />}
              title="Dining preferences"
              summary="Award winning, Business, Casual, Cozy, Fine Dining, Fun, Kid-friendly, Outdoor, Live music, Rooftop"
            />
            <ProfileRow
              icon={<Ic.Target />}
              title="Nutrition goals"
              summary={goalSummary(savedGoal)}
              placeholder="Set a goal to get personalized recommendations"
              onClick={onOpenGoalModal}
            />

          </div>

          <div
            style={{
              background: C.white,
              borderRadius: 4,
              padding: 24,
              marginTop: 24,
              borderBottom: `1px solid ${C.ashLighter}`,
            }}
          >
            <h3 style={{ margin: "0 0 4px", ...type.titleSmall, color: C.ashDark }}>Your details</h3>
            <p style={{ margin: "0 0 24px", ...type.bodyMedium, color: C.ash }}>
              Your information entered here will be shared with restaurants when you make a booking.
            </p>

            <FormField label="First name" value="Gaurav" />
            <FormField label="Last name" value="Agarwal" />
            <FormField label="Email address" value="gauravagarwal@clowmail.com" />
            <FormField label="Phone" value="0412345678" />

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", ...type.bodyMedium, color: C.ashDark, marginBottom: 6, fontWeight: 600 }}>
                Address
              </label>
              <span style={{ color: C.red, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>+ Add address</span>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", ...type.bodyMedium, color: C.ashDark, marginBottom: 6, fontWeight: 600 }}>
                Primary dining location
              </label>
              <select
                defaultValue=""
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "12px 14px",
                  border: `1px solid ${C.ashLighter}`,
                  borderRadius: 4,
                  fontSize: 16,
                  color: C.ashDark,
                  fontFamily: FONT,
                  background: C.white,
                }}
              >
                <option value="" disabled>
                  Select a location
                </option>
                <option>New York City</option>
                <option>San Francisco Bay Area</option>
                <option>Los Angeles</option>
              </select>
              <p style={{ margin: "6px 0 0", ...type.bodySmall, color: C.ash }}>
                Change your location to update the restaurants OpenTable suggests via email.
              </p>
            </div>

            <div style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ ...type.bodyLarge, color: C.ashDark, fontWeight: 600 }}>Professional profile</span>
              <span style={{ color: C.teal, fontSize: 14, cursor: "pointer" }}>Explain this</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <Checkbox checked={false} />
              <span style={{ ...type.bodyLarge, color: C.ashDark }}>
                I am an administrative professional who books reservations for others.
              </span>
            </div>

            <MonthDayField label="Birthday" />
            <MonthDayField label="Anniversary" />

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", ...type.bodyMedium, color: C.ashDark, marginBottom: 6, fontWeight: 600 }}>
                Special requests
              </label>
              <textarea
                placeholder="Add a special request"
                rows={2}
                maxLength={75}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "12px 14px",
                  border: `1px solid ${C.ashLighter}`,
                  borderRadius: 4,
                  fontSize: 16,
                  color: C.ashDark,
                  fontFamily: FONT,
                  resize: "vertical",
                }}
              />
              <p style={{ margin: "6px 0 0", ...type.bodySmall, color: C.ash, display: "flex", justifyContent: "space-between" }}>
                <span>
                  Requests you add here will be added to every reservation. Restaurants will do their best to
                  accommodate any special requests that you have.
                </span>
                <span style={{ flexShrink: 0, marginLeft: 12 }}>0/75</span>
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, margin: "8px 0 28px" }}>
              <Checkbox checked={true} />
              <span style={{ ...type.bodyLarge, color: C.ashDark }}>
                Collect points on eligible reservations and progress toward Gold status. Restrictions apply.{" "}
                <span style={{ color: C.red, cursor: "pointer" }}>Terms and conditions.</span>
              </span>
            </div>

            <button
              style={{
                width: "100%",
                padding: "14px 0",
                background: C.red,
                color: C.white,
                border: "none",
                borderRadius: 4,
                fontSize: 16,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: FONT,
              }}
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormField({ label, value }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", ...type.bodyMedium, color: C.ashDark, marginBottom: 6, fontWeight: 600 }}>
        {label}
      </label>
      <input
        readOnly
        value={value}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "12px 14px",
          border: `1px solid ${C.ashLighter}`,
          borderRadius: 4,
          fontSize: 16,
          color: C.ashDark,
          fontFamily: FONT,
        }}
      />
    </div>
  );
}

function MonthDayField({ label }) {
  const selectStyle = {
    padding: "12px 14px",
    border: `1px solid ${C.ashLighter}`,
    borderRadius: 4,
    fontSize: 16,
    color: C.ash,
    fontFamily: FONT,
    background: C.white,
  };
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", ...type.bodyMedium, color: C.ashDark, marginBottom: 6, fontWeight: 600 }}>
        {label}
      </label>
      <div style={{ display: "flex", gap: 12 }}>
        <select defaultValue="" style={{ ...selectStyle, flex: 1 }}>
          <option value="" disabled>
            Month
          </option>
          {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
        <select defaultValue="" style={{ ...selectStyle, flex: 1 }} disabled>
          <option value="" disabled>
            Day
          </option>
        </select>
      </div>
    </div>
  );
}

function Checkbox({ checked }) {
  return (
    <span
      style={{
        width: 20,
        height: 20,
        borderRadius: 4,
        border: `1px solid ${checked ? C.red : C.ashLighter}`,
        background: checked ? C.red : C.white,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        marginTop: 2,
      }}
    >
      {checked && <Ic.Check size={13} />}
    </span>
  );
}

/* ---------------------------------------------------------------------------
   CHIP — exact selector pattern per design-system §4.3
--------------------------------------------------------------------------- */
function Chip({ label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "16px 12px",
        minHeight: 56,
        borderRadius: 8,
        border: selected ? `3px solid ${C.red}` : `1px solid ${C.ashLighter}`,
        background: C.white,
        color: C.ashDark,
        fontSize: 16,
        fontWeight: 400,
        cursor: "pointer",
        textAlign: "center",
        fontFamily: FONT,
        boxSizing: "border-box",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}

/* ---------------------------------------------------------------------------
   STEPPER — flagged new control, see header comment
--------------------------------------------------------------------------- */
function Stepper({ value, onChange, min = 1, max = 30 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <button onClick={() => onChange(Math.max(min, value - 1))} aria-label="Decrease" style={stepperBtnStyle}>
        &#8722;
      </button>
      <span style={{ fontSize: 20, fontWeight: 700, color: C.ashDark, minWidth: 24, textAlign: "center" }}>
        {value}
      </span>
      <button onClick={() => onChange(Math.min(max, value + 1))} aria-label="Increase" style={stepperBtnStyle}>
        &#43;
      </button>
    </div>
  );
}
const stepperBtnStyle = {
  width: 36,
  height: 36,
  borderRadius: 4,
  border: `1px solid ${C.ashLighter}`,
  background: C.white,
  color: C.ashDark,
  fontSize: 18,
  fontWeight: 700,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  lineHeight: 1,
  fontFamily: FONT,
};

/* ---------------------------------------------------------------------------
   GOAL-SETUP MODAL — reuses exact chip-modal chrome per design-system §4.3/§5
--------------------------------------------------------------------------- */
function GoalModal({ initialGoal, onClose, onSave }) {
  const [selectedGoal, setSelectedGoal] = useState(initialGoal?.goalId || null);
  // Default bumped 3 -> 5 per direct instruction. This is a single
  // shared piece of state across ALL hasFrequency goals (Protein,
  // Reduce sodium, More plant-forward) — switching between goal chips
  // within the same modal session never resets it, so this one change
  // covers every goal's default, not just protein's.
  const [frequency, setFrequency] = useState(initialGoal?.frequency || 5);

  const selected = GOALS.find((g) => g.id === selectedGoal);
  const canSave = Boolean(selectedGoal);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(20,26,38,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        fontFamily: FONT,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: 760,
          maxWidth: "calc(100vw - 48px)",
          maxHeight: "calc(100vh - 64px)",
          overflowY: "auto",
          background: C.white,
          borderRadius: 8,
          boxShadow: "0 4px 4px rgba(0,0,0,0.15), 0 -4px 4px rgba(0,0,0,0.03)",
          padding: "32px 40px 40px",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 24,
            right: 24,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
            fontFamily: FONT,
          }}
        >
          <Ic.Close />
        </button>

        <h2 style={{ margin: "0 0 8px", ...type.titleMedium, color: C.ashDark, paddingRight: 32 }}>
          What are you working toward?
        </h2>
        <p style={{ margin: "0 0 24px", ...type.bodyMedium, color: C.ash }}>
          Choose one goal. You can update this anytime from your diner profile.
        </p>

        {/* Real goals only (excludes "Just exploring", now set apart
            below) — modal widened 640 -> 760 and Chip given
            whiteSpace:nowrap so every label (including "More balanced
            meals" and "Less added sugar") reliably fits on one line at
            desktop widths instead of wrapping. 5 goals in a 3-column
            grid naturally leaves the last row with 2 filled + 1 empty
            cell, matching how the grid already behaved with non-
            multiple-of-3 counts. */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
            marginBottom: 24,
          }}
        >
          {GOALS.filter((g) => g.id !== "exploring").map((g) => (
            <Chip key={g.id} label={g.label} selected={selectedGoal === g.id} onClick={() => setSelectedGoal(g.id)} />
          ))}
        </div>

        {/* "Just exploring" set apart from the goal grid — visually
            reads as an opt-out rather than a 6th equal goal, matching
            how the PRD already describes it in words ("no active goal,
            light suggestions only") but never showed visually until
            now. */}
        <p style={{ margin: "0 0 8px", ...type.bodySmall, color: C.ash, fontWeight: 600 }}>Not sure yet?</p>
        <button
          onClick={() => setSelectedGoal("exploring")}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "16px 12px",
            minHeight: 56,
            borderRadius: 8,
            border: selectedGoal === "exploring" ? `3px solid ${C.red}` : `1px solid ${C.ashLighter}`,
            background: C.white,
            color: C.ashDark,
            fontSize: 16,
            fontWeight: 400,
            cursor: "pointer",
            fontFamily: FONT,
            boxSizing: "border-box",
            marginBottom: selected?.hasFrequency ? 24 : 8,
          }}
        >
          <Ic.Sparkle size={16} color={C.ashDark} />
          Just exploring
        </button>

        {selected?.hasFrequency && (
          <div
            style={{
              background: C.ashLightest,
              borderRadius: 8,
              padding: "20px 24px",
              marginBottom: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <div>
              <p style={{ margin: 0, ...type.bodyLarge, color: C.ashDark, fontWeight: 600 }}>
                How many {selected.freqNoun} meals per month?
              </p>
              <p style={{ margin: "4px 0 0", ...type.bodySmall, color: C.ash }}>
                We'll show your progress toward this on the Nutrition Goals dashboard.
              </p>
            </div>
            <Stepper value={frequency} onChange={setFrequency} />
          </div>
        )}

        <button
          disabled={!canSave}
          onClick={() => canSave && onSave({ goalId: selectedGoal, frequency: selected?.hasFrequency ? frequency : null })}
          style={{
            width: "100%",
            padding: "14px 0",
            marginTop: 8,
            background: canSave ? C.red : C.ashLighter,
            color: canSave ? C.white : C.ashLight,
            border: "none",
            borderRadius: 4,
            fontSize: 16,
            fontWeight: 600,
            cursor: canSave ? "pointer" : "default",
            fontFamily: FONT,
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}

/* =============================================================================
   FLOW 2 — MONITOR PROGRESS
   Nutrition Goals dashboard (modeled on Rewards Hub) + Goal activity log
   (modeled on Points Activity). See sourcing notes in the top-of-file
   comment for exactly what's verified-real vs. placeholder here.
============================================================================= */

/* Static demo data — NOT a live booking backend (out of scope per PRD §5).
   Dashboard and Activity log both derive their counts from this same
   array, so the numbers they show always agree with each other. */
/* monthOffset: 0 = current month (August 2026, "today" per this app),
   -1 = one month back, etc. — added to support the month-switcher on
   the Activity Log; previously all entries were implicitly "this
   month" with no way to browse further back. */
const SAMPLE_ACTIVITY = [
  { id: 1, restaurant: "Gramercy Tavern", date: "Aug 24, 2026", counted: true, monthOffset: 0 },
  { id: 2, restaurant: "Union Square Cafe", date: "Aug 19, 2026", counted: true, monthOffset: 0 },
  {
    id: 3,
    restaurant: "The Odeon",
    date: "Aug 12, 2026",
    counted: false,
    reason: "No goal-aligned dish selected at booking",
    monthOffset: 0,
  },
  {
    id: 4,
    restaurant: "Casa Mono",
    date: "Aug 6, 2026",
    counted: false,
    reason: "No goal-aligned dish selected at booking",
    monthOffset: 0,
  },
  {
    id: 5,
    restaurant: "Blue Ribbon Sushi Bar",
    date: "Jul 29, 2026",
    counted: false,
    reason: "Booked outside the OpenTable app",
    monthOffset: -1,
  },
  { id: 6, restaurant: "Carbone", date: "Jul 18, 2026", counted: true, monthOffset: -1 },
  { id: 7, restaurant: "Estela", date: "Jul 9, 2026", counted: true, monthOffset: -1 },
  { id: 8, restaurant: "Blue Hill", date: "Jun 21, 2026", counted: true, monthOffset: -2 },
  {
    id: 9,
    restaurant: "Balthazar",
    date: "Jun 3, 2026",
    counted: false,
    reason: "No goal-aligned dish selected at booking",
    monthOffset: -2,
  },
];

const ACTIVITY_MONTH_LABELS = ["August 2026", "July 2026", "June 2026"];

/* Sample/static data, same treatment as every other dataset in this
   file — not wired to a real booking. */
const NEXT_RESERVATION = {
  restaurant: "Gramercy Tavern",
  date: "Sat, Aug 30",
  time: "7:00 PM",
  partySize: 2,
  goalAligned: true,
  dishCount: 3,
};
/* Scoped to the current month (monthOffset:0) specifically — this
   feeds the Dashboard's progress bar/milestone/tally, which are all
   meant to represent THIS month's progress. Previously unscoped, which
   worked only because every sample entry happened to be in the current
   month; adding past-month entries for the new month-switcher would
   have silently inflated this if left unscoped. */
const COUNTED_TOTAL = SAMPLE_ACTIVITY.filter((a) => a.counted && a.monthOffset === 0).length;

/* ---------------------------------------------------------------------------
   PROGRESS BAR — colors CSS-verified against Regulars page (see sourcing
   notes): ash-lightest track, #fdcf6a fill + 16px circular leading marker,
   fully rounded (real site uses a native <progress>; rebuilt here with
   divs for reliable cross-environment rendering, same visual output).
--------------------------------------------------------------------------- */
function ProgressBar({ value, max }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div style={{ position: "relative", width: "100%", height: 16 }}>
      <div
        style={{
          width: "100%",
          height: 16,
          borderRadius: 9999,
          background: C.ashLightest,
          overflow: "hidden",
        }}
      >
        <div style={{ width: `${pct}%`, height: "100%", background: C.progressFill, borderRadius: 9999 }} />
      </div>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: `${pct}%`,
          transform: "translate(-50%, -50%)",
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: C.progressFill,
        }}
      />
    </div>
  );
}

/* ---------------------------------------------------------------------------
   FILTER PILL — exact CSS extracted from Points Activity page:
   32px pill radius, 1px ash-lighter border, 4px 16px padding, 16px/500.
   Selected state uses the same red-border convention as chips (§4.3).
--------------------------------------------------------------------------- */
function FilterPill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        margin: 4,
        borderRadius: 32,
        padding: "4px 16px",
        background: C.white,
        border: active ? `2px solid ${C.red}` : `1px solid ${C.ashLighter}`,
        fontSize: 16,
        fontWeight: 500,
        lineHeight: "24px",
        color: C.ashDark,
        cursor: "pointer",
        fontFamily: FONT,
      }}
    >
      {label}
    </button>
  );
}

/* ---------------------------------------------------------------------------
   WAYS-TO-HIT-YOUR-GOAL TILE — mirrors Rewards Hub's "Ways to earn" white
   card pattern (§4.6), 1:1 chrome reuse; icon + content are new since this
   is new goal-specific copy.
--------------------------------------------------------------------------- */
function WaysTile({ icon, title, description, ctaLabel, onCtaClick }) {
  return (
    <div
      style={{
        flex: 1,
        background: C.white,
        borderRadius: 8,
        padding: 24,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      {icon}
      <h3 style={{ margin: 0, ...type.titleSmall, color: C.ashDark }}>{title}</h3>
      <p style={{ margin: 0, ...type.bodyMedium, color: C.ash }}>{description}</p>
      {ctaLabel && (
        <button
          onClick={onCtaClick}
          style={{
            marginTop: 8,
            alignSelf: "flex-start",
            display: "flex",
            alignItems: "center",
            gap: 4,
            background: "none",
            border: "none",
            padding: 0,
            color: C.red,
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: FONT,
          }}
        >
          {ctaLabel}
          <Ic.ChevronRight size={16} color={C.red} />
        </button>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   NUTRITION GOALS DASHBOARD — modeled 1:1 on Rewards Hub (hero + progress +
   milestone tiles + "Ways to earn"-style section), per PRD §8.
--------------------------------------------------------------------------- */
function DashboardScreen({ savedGoal, onNavigate, onOpenGoalModal }) {
  const goal = savedGoal ? GOALS.find((g) => g.id === savedGoal.goalId) : null;

  return (
    <div style={{ fontFamily: FONT, minHeight: "100vh", background: C.ashLightest }}>
      <Header onNavigate={onNavigate} />

      {/* Hero band — real photo provided directly by the user, replacing
          the previous solid-panel placeholder. The photo already has a
          natural dark-to-light gradient built into its left side (where
          the text sits), so background-position is anchored left to
          keep that dark region under the text rather than centering the
          crop, which would move the lighter plate into the text area. */}
      <div
        style={{
          backgroundImage: `url(${DASHBOARD_HERO_IMG})`,
          backgroundSize: "cover",
          backgroundPosition: "left center",
          backgroundColor: C.ashDarker,
          padding: "56px 24px",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <h1 style={{ margin: 0, fontSize: 36, lineHeight: "44px", fontWeight: 700, color: C.white }}>
            Nutrition Goals
          </h1>
          <p style={{ margin: "8px 0 0", ...type.bodyLarge, color: "#d8d9db" }}>
            Your progress toward your goals, in one place
          </p>
          {/* NEW — shows which goal is active with a direct edit
              entry point, reopening the same existing Goal-setup modal
              (no new modal built). Previously the Dashboard never
              actually named the active goal or let you touch it — the
              only edit path was Profile -> Diner Profile -> Nutrition
              goals row, a click deeper. */}
          {goal && goal.tracking !== "none" && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 16 }}>
              <Ic.Target size={18} color={C.white} />
              <span style={{ fontSize: 14, color: "#d8d9db" }}>
                Your goal: <strong style={{ color: C.white }}>{goal.label}</strong>
                {goal.hasFrequency && ` · ${savedGoal.frequency} meals/month`}
              </span>
              <button
                onClick={onOpenGoalModal}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  color: C.white,
                  fontSize: 14,
                  fontWeight: 700,
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontFamily: FONT,
                }}
              >
                Edit
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}>
        {!goal && (
          <div
            style={{
              background: C.white,
              borderRadius: 8,
              padding: 32,
              textAlign: "center",
              marginBottom: 32,
            }}
          >
            <h2 style={{ margin: "0 0 8px", ...type.titleSmall, color: C.ashDark }}>
              You haven't set a nutrition goal yet
            </h2>
            <p style={{ margin: "0 0 20px", ...type.bodyMedium, color: C.ash }}>
              Choose a goal and we'll personalize recommendations and track your progress here.
            </p>
            <button
              onClick={onOpenGoalModal}
              style={{
                padding: "12px 24px",
                background: C.red,
                color: C.white,
                border: "none",
                borderRadius: 4,
                fontSize: 16,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: FONT,
              }}
            >
              Set a goal
            </button>
          </div>
        )}

        {goal && goal.tracking === "target" && (
          <div style={{ display: "flex", gap: 24, marginBottom: 32, flexWrap: "wrap" }}>
            <div style={{ flex: 2, minWidth: 320, background: C.white, borderRadius: 8, padding: 24 }}>
              <h2 style={{ margin: "0 0 16px", ...type.titleSmall, color: C.ashDark }}>{goal.label}</h2>
              <ProgressBar value={Math.min(COUNTED_TOTAL, savedGoal.frequency)} max={savedGoal.frequency} />
              <p style={{ margin: "12px 0 0", ...type.bodyMedium, color: C.ashDark, fontWeight: 600 }}>
                {Math.min(COUNTED_TOTAL, savedGoal.frequency)} of {savedGoal.frequency} {goal.freqNoun} meals this
                month
              </p>
            </div>

            <div
              style={{
                flex: 1,
                minWidth: 240,
                background: C.white,
                borderRadius: 8,
                padding: 24,
                display: "flex",
                flexDirection: "column",
                gap: 12,
                justifyContent: "center",
              }}
            >
              {COUNTED_TOTAL < savedGoal.frequency ? (
                <>
                  <span
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: C.ashDark,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ic.Lock size={20} color={C.white} />
                  </span>
                  <p style={{ margin: 0, ...type.bodyMedium, color: C.ashDark }}>
                    {savedGoal.frequency - COUNTED_TOTAL} more {goal.freqNoun} booking
                    {savedGoal.frequency - COUNTED_TOTAL === 1 ? "" : "s"} to reach your goal this month
                  </p>
                </>
              ) : (
                <>
                  <span
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: C.green,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ic.Check size={20} color={C.white} />
                  </span>
                  <p style={{ margin: 0, ...type.bodyMedium, color: C.ashDark, fontWeight: 600 }}>
                    Goal reached for this month!
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {goal && goal.tracking === "tally" && (
          <div style={{ background: C.white, borderRadius: 8, padding: 24, marginBottom: 32 }}>
            <h2 style={{ margin: "0 0 8px", ...type.titleSmall, color: C.ashDark }}>{goal.label}</h2>
            <p style={{ margin: 0, fontSize: 32, lineHeight: "40px", fontWeight: 700, color: C.ashDark }}>
              {COUNTED_TOTAL}
            </p>
            <p style={{ margin: "4px 0 0", ...type.bodyMedium, color: C.ash }}>goal-aligned meals this month</p>
            <p style={{ margin: "16px 0 0", ...type.bodySmall, color: C.ash }}>
              There's no fixed target for this goal — every reservation you mark as goal-aligned adds to your
              tally.
            </p>
          </div>
        )}

        {goal && goal.tracking === "none" && (
          <div style={{ background: C.white, borderRadius: 8, padding: 32, marginBottom: 32 }}>
            <h2 style={{ margin: "0 0 8px", ...type.titleSmall, color: C.ashDark }}>Just exploring</h2>
            <p style={{ margin: "0 0 16px", ...type.bodyMedium, color: C.ash }}>
              We'll show light, low-pressure suggestions based on your interests. No target, no tracking — just
              nudges.
            </p>
            <button
              onClick={onOpenGoalModal}
              style={{
                padding: "10px 20px",
                background: C.white,
                color: C.ashDark,
                border: `1px solid ${C.ashLighter}`,
                borderRadius: 4,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: FONT,
              }}
            >
              Set a specific goal
            </button>
          </div>
        )}

        {/* NEW — "Your next reservation" card, sample/static data (same
            treatment as every other sample dataset in this file, not
            wired to a real booking) — placed right after the progress
            section since it's the most concrete, actionable thing on
            the page. Shows a goal-fit callout and a specific dish
            count, both tied to the active goal; omitted entirely for
            "Just exploring" (tracking:'none'), matching how every other
            tracking module on this page already behaves. */}
        {goal && goal.tracking !== "none" && (
          <>
            <h2 style={{ margin: "0 0 16px", ...type.titleLarge, color: C.ashDark, fontSize: 24, lineHeight: "28px" }}>
              Your next reservation
            </h2>
            <div style={{ display: "flex", gap: 20, background: C.white, borderRadius: 8, padding: 24, marginBottom: 32 }}>
            <ImagePlaceholder width={120} height={120} radius={4} label="[photo]" src={restaurantPhoto(0)} alt={NEXT_RESERVATION.restaurant} />
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: "0 0 4px", ...type.titleSmall, color: C.ashDark }}>{NEXT_RESERVATION.restaurant}</h3>
              <p style={{ margin: "0 0 12px", ...type.bodyMedium, color: C.ash }}>
                {NEXT_RESERVATION.date} · {NEXT_RESERVATION.time} · {NEXT_RESERVATION.partySize} people
              </p>
              {NEXT_RESERVATION.goalAligned && (
                <>
                  <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700, color: C.red, display: "flex", alignItems: "center", gap: 6 }}>
                    <Ic.Target size={16} color={C.red} />
                    Great fit for your goal
                  </p>
                  <p style={{ margin: "0 0 16px", ...type.bodyMedium, color: C.ash }}>
                    {NEXT_RESERVATION.dishCount} {goal.freqNoun || "goal-aligned"} dishes available
                  </p>
                </>
              )}
              <button
                onClick={() => onNavigate("booking")}
                style={{
                  padding: "10px 20px",
                  background: C.white,
                  color: C.ashDark,
                  border: `1px solid ${C.ashLighter}`,
                  borderRadius: 4,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: FONT,
                }}
              >
                View reservation
              </button>
            </div>
          </div>
          </>
        )}

        {goal && goal.tracking !== "none" && (
          <>
            <h2 style={{ margin: "0 0 16px", ...type.titleLarge, color: C.ashDark, fontSize: 24, lineHeight: "28px" }}>
              Ways to hit your goal
            </h2>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: 24 }}>
              <WaysTile
                icon={<Ic.Restaurant size={24} />}
                title="Book from a recommended restaurant"
                description={`We'll surface ${goal.label.toLowerCase()}-friendly restaurants across search and your homepage.`}
                ctaLabel="Find a goal-aligned table near you"
                onCtaClick={() => onNavigate("search")}
              />
              <WaysTile
                icon={<Ic.CheckCircle size={24} />}
                title="Mark a dish as goal-aligned at booking"
                description="Use the toggle at checkout to count a reservation toward your goal."
                ctaLabel="Explore goal-aligned dishes"
                onCtaClick={() => onNavigate("home")}
              />
            </div>

            <div
              onClick={() => onNavigate("activity")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                cursor: "pointer",
                width: "fit-content",
              }}
            >
              <span style={{ ...type.titleSmall, color: C.ashDark }}>Goal activity</span>
              <Ic.ChevronRight size={20} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   GOAL ACTIVITY LOG — modeled 1:1 on Points Activity (§4.7), per PRD §8.
--------------------------------------------------------------------------- */
function ActivityLogScreen({ savedGoal, onNavigate }) {
  const [filter, setFilter] = useState("all");
  // 0 = current month (August 2026), -1 = one month back, etc. Right
  // arrow disables at 0 (can't browse into the future); left arrow
  // disables at the oldest sample month available.
  const [monthOffset, setMonthOffset] = useState(0);

  const monthActivity = SAMPLE_ACTIVITY.filter((a) => a.monthOffset === monthOffset);
  const monthCountedTotal = monthActivity.filter((a) => a.counted).length;
  const filtered = monthActivity.filter((a) => {
    if (filter === "counted") return a.counted;
    if (filter === "not_counted") return !a.counted;
    return true;
  });

  const showEmptyState = !savedGoal;

  return (
    <div style={{ fontFamily: FONT, minHeight: "100vh", background: C.white }}>
      <Header onNavigate={onNavigate} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px", display: "flex", gap: 48 }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0, ...type.titleLarge, color: C.ashDark, fontSize: 28, lineHeight: "34px" }}>
            Goal activity
          </h1>
          <p style={{ margin: "8px 0 24px", ...type.bodyLarge, color: C.ash }}>
            {showEmptyState ? "0 goal-aligned meals" : `${monthCountedTotal} goal-aligned meals`}
          </p>

          {!showEmptyState && (
            /* Month switcher combined into the SAME row as the filter
               pills (was a separate row above it, taking up an extra
               ~50px of vertical space) — pills on the left, month
               switcher on the right, via justify-content:space-between.
               Still two independent controls: the pills filter WITHIN
               whichever month the switcher has selected. */
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
              <div style={{ display: "flex", marginLeft: -4 }}>
                <FilterPill label="All" active={filter === "all"} onClick={() => setFilter("all")} />
                <FilterPill
                  label="Counted toward goal"
                  active={filter === "counted"}
                  onClick={() => setFilter("counted")}
                />
                <FilterPill
                  label="Not counted"
                  active={filter === "not_counted"}
                  onClick={() => setFilter("not_counted")}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  onClick={() => setMonthOffset((m) => Math.max(m - 1, -(ACTIVITY_MONTH_LABELS.length - 1)))}
                  disabled={monthOffset <= -(ACTIVITY_MONTH_LABELS.length - 1)}
                  aria-label="Previous month"
                  style={{
                    background: "none",
                    border: "none",
                    padding: 4,
                    cursor: monthOffset <= -(ACTIVITY_MONTH_LABELS.length - 1) ? "default" : "pointer",
                    opacity: monthOffset <= -(ACTIVITY_MONTH_LABELS.length - 1) ? 0.3 : 1,
                    display: "flex",
                  }}
                >
                  <span style={{ display: "flex", transform: "rotate(180deg)" }}>
                    <Ic.ChevronRight size={20} color={C.ashDark} />
                  </span>
                </button>
                <span style={{ fontSize: 14, fontWeight: 600, color: C.ashDark, minWidth: 110, textAlign: "center" }}>
                  {ACTIVITY_MONTH_LABELS[-monthOffset]}
                </span>
                <button
                  onClick={() => setMonthOffset((m) => Math.min(m + 1, 0))}
                  disabled={monthOffset >= 0}
                  aria-label="Next month"
                  style={{
                    background: "none",
                    border: "none",
                    padding: 4,
                    cursor: monthOffset >= 0 ? "default" : "pointer",
                    opacity: monthOffset >= 0 ? 0.3 : 1,
                    display: "flex",
                  }}
                >
                  <Ic.ChevronRight size={20} color={C.ashDark} />
                </button>
              </div>
            </div>
          )}

          {showEmptyState ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                padding: "64px 0",
              }}
            >
              <Ic.EmptyChest size={64} />
              <h2 style={{ margin: "16px 0 4px", ...type.titleSmall, color: C.ashDark }}>No activity yet</h2>
              <p style={{ margin: 0, ...type.bodyMedium, color: C.ash }}>
                Book a reservation to start tracking your goal.
              </p>
            </div>
          ) : monthActivity.length === 0 ? (
            /* NEW — distinct from "no activity yet" above: this means no
               goal is set (or the app has never tracked anything at all).
               This case means a goal IS set and other months DO have
               activity, just not the one currently selected. */
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                padding: "64px 0",
              }}
            >
              <Ic.EmptyChest size={64} />
              <h2 style={{ margin: "16px 0 4px", ...type.titleSmall, color: C.ashDark }}>
                No activity in {ACTIVITY_MONTH_LABELS[-monthOffset]}
              </h2>
              <p style={{ margin: 0, ...type.bodyMedium, color: C.ash }}>Try a different month.</p>
            </div>
          ) : filtered.length === 0 ? (
            <p style={{ ...type.bodyMedium, color: C.ash, padding: "32px 0" }}>No reservations in this filter yet.</p>
          ) : (
            <div>
              {filtered.map((a) => (
                <div
                  key={a.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    padding: "16px 0",
                    borderBottom: `1px solid ${C.ashLighter}`,
                  }}
                >
                  <div>
                    <p style={{ margin: 0, ...type.bodyLarge, color: C.ashDark, fontWeight: 600 }}>{a.restaurant}</p>
                    <p style={{ margin: "2px 0 0", ...type.bodyMedium, color: C.ash }}>{a.date}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p
                      style={{
                        margin: 0,
                        ...type.bodyMedium,
                        fontWeight: 600,
                        color: a.counted ? C.green : C.ash,
                      }}
                    >
                      {a.counted ? "Counted toward goal" : "Not counted"}
                    </p>
                    {!a.counted && (
                      <p style={{ margin: "2px 0 0", ...type.bodySmall, color: C.ash, maxWidth: 240 }}>{a.reason}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ width: 320, flexShrink: 0, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: C.ashLightest, borderRadius: 8, padding: 20 }}>
            <h3 style={{ margin: "0 0 8px", ...type.titleSmall, color: C.ashDark }}>
              How is my progress calculated?
            </h3>
            <p style={{ margin: 0, ...type.bodyMedium, color: C.ash }}>
              Reservations you mark as goal-aligned at booking count automatically. If menu data clearly matches
              your goal, we may also count it — self-reported at booking always takes priority.
            </p>
          </div>
          <div style={{ background: C.ashLightest, borderRadius: 8, padding: 20 }}>
            <h3 style={{ margin: "0 0 8px", ...type.titleSmall, color: C.ashDark }}>
              Why didn't this reservation count?
            </h3>
            <p style={{ margin: 0, ...type.bodyMedium, color: C.ash }}>
              Usually because it was booked outside the OpenTable app or website, or no goal-aligned dish was
              selected at checkout.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   SETTINGS — Dining Preferences. Rebuilt against real outerHTML + a real
   screenshot for the entire page (not just the new section this time) —
   the real page has TWO main heading levels: "Dining Preferences" (page
   title) and "Communication Preferences" (a second large heading further
   down, confirmed sharing the same H3 class as the page title, just
   without its page-title modifier class), each containing several
   <fieldset>/<legend> categories. Real category structure:
   - "Customized Dining Experience": 3 checkboxes, each with its own
     indented explanatory paragraph below it (real copy, verbatim).
   - "Third Party Sharing": ONE shared intro paragraph ABOVE 2 plain
     checkboxes with no individual descriptions — a genuinely different
     pattern from the other categories, not just fewer words.
   - "Point of Sale Information": 1 checkbox with its own explanatory
     paragraph (same pattern as Customized Dining Experience).
   - NEW — "Nutrition & Goal Data": inserted directly after Point of
     Sale Information and before the "Communication Preferences" second
     heading — this is its real, correct position per PRD §6 ("alongside
     the existing checkbox categories"), not appended at the end.
   - "Communication Preferences" (second heading) > "Promotional Emails"
     (7 unchecked checkboxes, real copy), "Reservation Emails" (1 checked
     checkbox), "SMS Preferences" (2 plain-text sub-groups — "Booking
     updates"/"Waitlist updates" — each with one checked checkbox; these
     sub-labels are NOT styled like the uppercase category legends).
   - "Save Changes" button, real copy, real disabled/greyed styling.
   SettingsSection extended with an optional `intro` paragraph (for
   Third Party Sharing's shared-intro pattern) and SettingsCheckboxRow's
   `description` is now optional (Third Party Sharing's checkboxes have
   none). Inline "Privacy Policy" links styled as red text, matching the
   link-color convention already used elsewhere in this file.
--------------------------------------------------------------------------- */
function SettingsSection({ label, intro, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <p
        style={{
          margin: "0 0 12px",
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: C.ash,
        }}
      >
        {label}
      </p>
      {intro && <p style={{ margin: "0 0 16px", ...type.bodyMedium, color: C.ashDark }}>{intro}</p>}
      {children}
    </div>
  );
}

function PrivacyPolicyLink() {
  return (
    <span style={{ color: C.red, cursor: "pointer" }}>
      Privacy Policy
    </span>
  );
}

function SettingsCheckboxRow({ label, description, checked, onToggle }) {
  return (
    <label style={{ display: "flex", gap: 10, marginBottom: 20, cursor: "pointer" }} onClick={onToggle}>
      <Checkbox checked={checked} />
      <div>
        <p style={{ margin: 0, ...type.bodyLarge, fontWeight: 600, color: C.ashDark }}>{label}</p>
        {description && <p style={{ margin: "4px 0 0", ...type.bodyMedium, color: C.ash }}>{description}</p>}
      </div>
    </label>
  );
}

function SettingsScreen({ savedGoal, onNavigate }) {
  // Real checked states from the actual captured page for the 3
  // existing categories (all default-checked there); new toggles below
  // for the ones this exercise actually adds.
  const [shareWithGroups, setShareWithGroups] = useState(true);
  const [shareWithAffiliates, setShareWithAffiliates] = useState(true);
  const [shareProfilePhone, setShareProfilePhone] = useState(true);
  const [shareGroupCompanies, setShareGroupCompanies] = useState(true);
  const [shareBusinessPartners, setShareBusinessPartners] = useState(true);
  const [usePos, setUsePos] = useState(true);
  // Revised per direct discussion: the original two checkboxes here
  // ("personalize recommendations" / "track progress") were internal
  // feature toggles, not sharing controls — structurally different from
  // every other category on this page, which is all about data leaving
  // OpenTable to restaurants/partners/POS systems. Replaced with two
  // genuine sharing-focused checkboxes, matching that same pattern —
  // Option A from the discussion (per-checkbox explanation, matching
  // Customized Dining Experience's style, since nutrition/health-
  // adjacent data warrants the fuller disclosure per PRD §10's own
  // reasoning, not a bare checkbox).
  const [shareGoalWithRestaurants, setShareGoalWithRestaurants] = useState(true);
  const [shareGoalWithPartners, setShareGoalWithPartners] = useState(true);
  const [promoEmails, setPromoEmails] = useState({
    bestOf: false,
    newsletter: false,
    newToOt: false,
    productNews: false,
    otUpdates: false,
    restaurantWeeks: false,
    specials: false,
  });
  const [restaurantReviews, setRestaurantReviews] = useState(true);
  const [bookingSms, setBookingSms] = useState(true);
  const [waitlistSms, setWaitlistSms] = useState(true);
  const togglePromo = (key) => setPromoEmails((p) => ({ ...p, [key]: !p[key] }));

  return (
    <div style={{ fontFamily: FONT, minHeight: "100vh", background: C.ashLightest }}>
      <Header onNavigate={onNavigate} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px", display: "flex", gap: 48 }}>
        <LeftNav activeScreen="settings" onNavigate={onNavigate} />

        <div style={{ flex: 1, maxWidth: 720 }}>
          <div style={{ background: C.white, borderRadius: 8, padding: 32 }}>
            <h2 style={{ margin: "0 0 24px", fontSize: 24, lineHeight: "28px", fontWeight: 700, color: C.ashDark }}>
              Dining Preferences
            </h2>

            <SettingsSection label="Customized Dining Experience">
              <SettingsCheckboxRow
                label="Share your dining information with restaurant groups"
                description={
                  <>
                    When you book a reservation, we need to share some information with the restaurant to ensure
                    your booking is recorded, as described in our <PrivacyPolicyLink />. Some restaurants are part
                    of a larger restaurant group and may request that OpenTable share your information for the
                    purpose of improving and personalizing your dining experience on future visits if, in the
                    future, you book at restaurants within the same restaurant group. You can opt out of
                    restaurants sharing your dining information with their broader restaurant group by unchecking
                    the box above.
                  </>
                }
                checked={shareWithGroups}
                onToggle={() => setShareWithGroups((v) => !v)}
              />
              <SettingsCheckboxRow
                label={
                  <>
                    Allow restaurants to share your dining information with restaurant partners &amp; affiliates
                    to provide you with a better dining experience. This can include personalized offers and
                    promotions. See <PrivacyPolicyLink /> for details
                  </>
                }
                checked={shareWithAffiliates}
                onToggle={() => setShareWithAffiliates((v) => !v)}
              />
              <SettingsCheckboxRow
                label="Share your profile with OpenTable restaurants when booking with them over the phone or walking in"
                description={
                  <>
                    Sharing your profile allows you to have a more personalized dining experience. Details you
                    enter on your profile including name, phone number, email, important dates, and dietary
                    preferences will be shared with restaurants on the OpenTable network when you book a
                    reservation over the phone or walk in, just like when you book online. See <PrivacyPolicyLink />{" "}
                    for details.
                  </>
                }
                checked={shareProfilePhone}
                onToggle={() => setShareProfilePhone((v) => !v)}
              />
            </SettingsSection>

            <SettingsSection
              label="Third Party Sharing"
              intro={
                <>
                  We share your personal information as described in our <PrivacyPolicyLink /> to allow third
                  parties to provide marketing and offers relevant to you. You can modify how your information is
                  shared for these purposes below:
                </>
              }
            >
              <SettingsCheckboxRow
                label="Share with our group companies"
                checked={shareGroupCompanies}
                onToggle={() => setShareGroupCompanies((v) => !v)}
              />
              <SettingsCheckboxRow
                label="Share with other third party business partners"
                checked={shareBusinessPartners}
                onToggle={() => setShareBusinessPartners((v) => !v)}
              />
            </SettingsSection>

            <SettingsSection label="Point of Sale Information">
              <SettingsCheckboxRow
                label="Allow OpenTable to use Point of Sale information"
                description={
                  <>
                    In addition, OpenTable can receive information from the point of sale terminals at
                    participating restaurants about your dining experience to use for its own purposes, which we
                    analyze to provide aggregate information to the restaurant about their customers, as described
                    in our <PrivacyPolicyLink />. We also use the information we receive for our own purposes
                    described in the <PrivacyPolicyLink />. If you do not wish us to use this information for our
                    own purposes, you can turn off the option.
                  </>
                }
                checked={usePos}
                onToggle={() => setUsePos((v) => !v)}
              />
            </SettingsSection>

            {/* NEW — revised per direct discussion to be genuine sharing
                controls (Option A), matching the actual pattern every
                other category on this page follows, rather than the
                original internal feature-toggle framing. Real position
                unchanged: directly after Point of Sale Information and
                before the "Communication Preferences" second heading —
                per PRD §6 ("alongside the existing checkbox
                categories"). */}
            <SettingsSection label="Nutrition & Goal Data">
              <SettingsCheckboxRow
                label="Share my nutrition goal with restaurants when I book"
                description="Some restaurants may use your stated nutrition goal to prepare relevant dish suggestions or accommodate your visit. You can opt out of sharing this with restaurants by unchecking the box above."
                checked={shareGoalWithRestaurants}
                onToggle={() => setShareGoalWithRestaurants((v) => !v)}
              />
              <SettingsCheckboxRow
                label="Share my nutrition goal with OpenTable's restaurant partners & affiliates"
                description="This can be used to provide tailored offers and promotions based on your dietary preferences."
                checked={shareGoalWithPartners}
                onToggle={() => setShareGoalWithPartners((v) => !v)}
              />
            </SettingsSection>

            <h2 style={{ margin: "0 0 24px", fontSize: 24, lineHeight: "28px", fontWeight: 700, color: C.ashDark }}>
              Communication Preferences
            </h2>

            <SettingsSection label="Promotional Emails">
              <SettingsCheckboxRow
                label={
                  <>
                    Best-Of Lists. <span style={{ fontWeight: 400 }}>Stay current on trending restaurants, top picks &amp; must-try spots.</span>
                  </>
                }
                checked={promoEmails.bestOf}
                onToggle={() => togglePromo("bestOf")}
              />
              <SettingsCheckboxRow
                label={
                  <>
                    OpenTable Newsletter.{" "}
                    <span style={{ fontWeight: 400 }}>
                      From chef favorites to our favorite chefs, the Insider is your newsletter for all things dining.
                    </span>
                  </>
                }
                checked={promoEmails.newsletter}
                onToggle={() => togglePromo("newsletter")}
              />
              <SettingsCheckboxRow
                label={
                  <>
                    New to OpenTable. <span style={{ fontWeight: 400 }}>Be the first to try OpenTable's newest restaurants.</span>
                  </>
                }
                checked={promoEmails.newToOt}
                onToggle={() => togglePromo("newToOt")}
              />
              <SettingsCheckboxRow
                label={
                  <>
                    Product News.{" "}
                    <span style={{ fontWeight: 400 }}>
                      Be the first to know about new product features, access beta tests and provide product feedback.
                    </span>
                  </>
                }
                checked={promoEmails.productNews}
                onToggle={() => togglePromo("productNews")}
              />
              <SettingsCheckboxRow
                label={
                  <>
                    OpenTable Updates.{" "}
                    <span style={{ fontWeight: 400 }}>
                      Learn how to get the most out of your points, get holiday reminders, see recommendations
                      tailored just for you and more.
                    </span>
                  </>
                }
                checked={promoEmails.otUpdates}
                onToggle={() => togglePromo("otUpdates")}
              />
              <SettingsCheckboxRow
                label={
                  <>
                    Restaurant Weeks. <span style={{ fontWeight: 400 }}>Find out about Restaurant Weeks and other local dining events.</span>
                  </>
                }
                checked={promoEmails.restaurantWeeks}
                onToggle={() => togglePromo("restaurantWeeks")}
              />
              <SettingsCheckboxRow
                label={
                  <>
                    Specials and Offers.{" "}
                    <span style={{ fontWeight: 400 }}>
                      Access specials and offers from top restaurants. Including exclusive deals for OpenTable diners.
                    </span>
                  </>
                }
                checked={promoEmails.specials}
                onToggle={() => togglePromo("specials")}
              />
            </SettingsSection>

            <SettingsSection label="Reservation Emails">
              <SettingsCheckboxRow
                label={
                  <>
                    Restaurant Reviews.{" "}
                    <span style={{ fontWeight: 400 }}>
                      Easily review your dining experience. Plus, stay in the loop on all things restaurant reviews.
                    </span>
                  </>
                }
                checked={restaurantReviews}
                onToggle={() => setRestaurantReviews((v) => !v)}
              />
            </SettingsSection>

            <SettingsSection label="SMS Preferences">
              {/* Real structure: two plain-text sub-labels (NOT styled
                  like the uppercase category legends above), each with
                  its own single checkbox. */}
              <p style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 600, color: C.ashDark }}>Booking updates</p>
              <SettingsCheckboxRow
                label="Get reminders about bookings and notifications for availability alerts (standard text message rates may apply)."
                checked={bookingSms}
                onToggle={() => setBookingSms((v) => !v)}
              />
              <p style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 600, color: C.ashDark }}>Waitlist updates</p>
              <SettingsCheckboxRow
                label="Get table updates when your name is on the waitlist (standard text message rates may apply). This is required to use waitlist."
                checked={waitlistSms}
                onToggle={() => setWaitlistSms((v) => !v)}
              />
            </SettingsSection>

            <button
              style={{
                width: "100%",
                padding: "14px 0",
                background: C.ashLighter,
                color: C.ash,
                border: "none",
                borderRadius: 4,
                fontSize: 16,
                fontWeight: 600,
                cursor: "default",
                fontFamily: FONT,
              }}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =============================================================================
   FLOW 3 — GOAL-AWARE RECOMMENDATIONS
   Three touchpoints per PRD §9: AI search prompt + "Dishes for your goal"
   carousel (homepage), search-results filter/sort/badge additions, and a
   goal-alignment micro-toggle at booking confirmation.
============================================================================= */

/* PLACEHOLDER — used everywhere a real restaurant/dish photo would sit.
   Visibly hatched rather than a plain grey box so it reads as an obvious
   stand-in even without reading the code, not an intentional design
   choice. No photo assets were available for extraction (see top-of-file
   notes) — flagged here per the person's original instruction to call
   out missing images rather than fake them. */
/* Real hero photos, provided directly by the user — replacing the
   previous hatch-pattern / solid-panel placeholders. Embedded as base64
   data URIs (resized + compressed first) so they load reliably
   regardless of artifact hosting, matching this project's established
   approach for any embedded image. */
const HOMEPAGE_HERO_IMG = "data:image/jpeg;base64,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";
const DASHBOARD_HERO_IMG = "data:image/jpeg;base64,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";

function ImagePlaceholder({ width, height, radius = 8, label, src, alt }) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt || ""}
        width={width}
        height={height}
        style={{
          width,
          height,
          borderRadius: radius,
          objectFit: "cover",
          display: "block",
          flexShrink: 0,
        }}
      />
    );
  }
  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        background:
          "repeating-linear-gradient(45deg, #f1f2f4, #f1f2f4 10px, #e4e6e9 10px, #e4e6e9 20px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: C.ashLight,
        fontSize: 11,
        fontFamily: FONT,
        textAlign: "center",
        padding: 4,
        boxSizing: "border-box",
        flexShrink: 0,
      }}
    >
      {label}
    </div>
  );
}

/* Goal-specific copy helpers — centralize the tailored phrasing per goal so
   the three Flow 3 touchpoints (prompt, carousel, badge) all stay in sync
   with a single source instead of drifting apart. */
const GOAL_PROMPT = {
  protein: "What's a high-protein spot near me tonight?",
  fiber: "Where can I find a high-fiber meal nearby?",
  plant: "What's a great plant-forward spot near me?",
  sugar: "Where can I find a low-added-sugar option tonight?",
  balanced: "What's a well-balanced spot near me tonight?",
};
const GOAL_DISHES = {
  protein: [
    { name: "Grilled Ribeye", restaurant: "Gramercy Tavern", rating: "4.8" },
    { name: "Miso Glazed Salmon", restaurant: "Casa Mono", rating: "4.6" },
    { name: "Herb Roasted Chicken", restaurant: "Union Square Cafe", rating: "4.7" },
    { name: "Seared Tuna Bowl", restaurant: "The Odeon", rating: "4.5" },
    { name: "Prime Sirloin", restaurant: "Brooklyn Chop House", rating: "4.3" },
    { name: "Grilled Branzino", restaurant: "Gran Morsi", rating: "4.7" },
    { name: "Chicken Milanese", restaurant: "Eataly NYC Downtown", rating: "4.7" },
    { name: "Osso Buco", restaurant: "Serafina Tribeca", rating: "4.5" },
    { name: "Black Cod Miso", restaurant: "Nobu Downtown", rating: "4.8" },
    { name: "Veal Parmigiana", restaurant: "Cipriani Downtown", rating: "4.6" },
    { name: "Steak Frites", restaurant: "Balthazar", rating: "4.5" },
    { name: "Roast Chicken", restaurant: "The Clocktower", rating: "4.6" },
    { name: "Bistecca Fiorentina", restaurant: "Carbone", rating: "4.9" },
    { name: "Grass-Fed Lamb Chops", restaurant: "Blue Hill", rating: "4.8" },
    { name: "Duck Breast", restaurant: "Estela", rating: "4.7" },
  ],
  fiber: [
    { name: "Farro & Chickpea Bowl", restaurant: "Gramercy Tavern", rating: "4.8" },
    { name: "Lentil & Kale Salad", restaurant: "Union Square Cafe", rating: "4.7" },
    { name: "Roasted Vegetable Grain Bowl", restaurant: "Casa Mono", rating: "4.6" },
    { name: "Wild Rice & Mushroom Pilaf", restaurant: "The Odeon", rating: "4.5" },
    { name: "Black Bean & Quinoa Salad", restaurant: "Brooklyn Chop House", rating: "4.3" },
    { name: "Farro Risotto", restaurant: "Gran Morsi", rating: "4.7" },
    { name: "Whole Grain Pasta Primavera", restaurant: "Eataly NYC Downtown", rating: "4.7" },
    { name: "Barley & Root Vegetable Stew", restaurant: "Serafina Tribeca", rating: "4.5" },
    { name: "Edamame & Brown Rice Bowl", restaurant: "Nobu Downtown", rating: "4.8" },
    { name: "Chickpea & Vegetable Tagine", restaurant: "Cipriani Downtown", rating: "4.6" },
    { name: "Lentil Soup & Whole Grain Bread", restaurant: "Balthazar", rating: "4.5" },
    { name: "Bean & Barley Salad", restaurant: "The Clocktower", rating: "4.6" },
    { name: "Farro & Roasted Squash", restaurant: "Carbone", rating: "4.9" },
    { name: "Legume & Grain Medley", restaurant: "Blue Hill", rating: "4.8" },
    { name: "Whole Grain Bowl", restaurant: "Estela", rating: "4.7" },
  ],
  plant: [
    { name: "Charred Cauliflower", restaurant: "Gramercy Tavern", rating: "4.8" },
    { name: "Farro Grain Bowl", restaurant: "Union Square Cafe", rating: "4.7" },
    { name: "Roasted Beet Salad", restaurant: "Casa Mono", rating: "4.6" },
    { name: "Wild Mushroom Risotto", restaurant: "The Odeon", rating: "4.5" },
    { name: "Heirloom Tomato Salad", restaurant: "Brooklyn Chop House", rating: "4.3" },
    { name: "Roasted Root Vegetables", restaurant: "Gran Morsi", rating: "4.7" },
    { name: "Burrata & Charred Greens", restaurant: "Eataly NYC Downtown", rating: "4.7" },
    { name: "Wild Mushroom Ravioli", restaurant: "Serafina Tribeca", rating: "4.5" },
    { name: "Avocado & Edamame Salad", restaurant: "Nobu Downtown", rating: "4.8" },
    { name: "Grilled Vegetable Antipasto", restaurant: "Cipriani Downtown", rating: "4.6" },
    { name: "Market Vegetable Tart", restaurant: "Balthazar", rating: "4.5" },
    { name: "Squash & Sage Risotto", restaurant: "The Clocktower", rating: "4.6" },
    { name: "Caponata & Burrata", restaurant: "Carbone", rating: "4.9" },
    { name: "Farm Vegetable Plate", restaurant: "Blue Hill", rating: "4.8" },
    { name: "Charred Broccolini", restaurant: "Estela", rating: "4.7" },
  ],
  sugar: [
    { name: "Herb Grilled Chicken", restaurant: "Gramercy Tavern", rating: "4.8" },
    { name: "Unsweetened Grilled Salmon", restaurant: "Union Square Cafe", rating: "4.7" },
    { name: "Herb Roasted Branzino", restaurant: "Casa Mono", rating: "4.6" },
    { name: "Grilled Vegetable Plate", restaurant: "The Odeon", rating: "4.5" },
    { name: "Simple Grilled Steak", restaurant: "Brooklyn Chop House", rating: "4.3" },
    { name: "Herb Roasted Fish", restaurant: "Gran Morsi", rating: "4.7" },
    { name: "Grilled Chicken Paillard", restaurant: "Eataly NYC Downtown", rating: "4.7" },
    { name: "Roasted Vegetable Plate", restaurant: "Serafina Tribeca", rating: "4.5" },
    { name: "Herb Grilled Whitefish", restaurant: "Nobu Downtown", rating: "4.8" },
    { name: "Grilled Vegetable Antipasto", restaurant: "Cipriani Downtown", rating: "4.6" },
    { name: "Simple Roast Chicken", restaurant: "Balthazar", rating: "4.5" },
    { name: "Herb Grilled Salmon", restaurant: "The Clocktower", rating: "4.6" },
    { name: "Grilled Branzino", restaurant: "Carbone", rating: "4.9" },
    { name: "Herb Roasted Vegetables", restaurant: "Blue Hill", rating: "4.8" },
    { name: "Simple Grilled Fish", restaurant: "Estela", rating: "4.7" },
  ],
  balanced: [
    { name: "Seasonal Grain Bowl", restaurant: "Union Square Cafe", rating: "4.7" },
    { name: "Herb Roasted Chicken", restaurant: "Gramercy Tavern", rating: "4.8" },
    { name: "Roasted Beet Salad", restaurant: "Casa Mono", rating: "4.6" },
    { name: "Miso Glazed Salmon", restaurant: "The Odeon", rating: "4.5" },
    { name: "Steak & Vegetable Plate", restaurant: "Brooklyn Chop House", rating: "4.3" },
    { name: "Branzino & Farro", restaurant: "Gran Morsi", rating: "4.7" },
    { name: "Chicken Milanese Salad", restaurant: "Eataly NYC Downtown", rating: "4.7" },
    { name: "Osso Buco & Greens", restaurant: "Serafina Tribeca", rating: "4.5" },
    { name: "Black Cod & Vegetables", restaurant: "Nobu Downtown", rating: "4.8" },
    { name: "Veal & Roasted Vegetables", restaurant: "Cipriani Downtown", rating: "4.6" },
    { name: "Steak Frites Salad", restaurant: "Balthazar", rating: "4.5" },
    { name: "Roast Chicken & Greens", restaurant: "The Clocktower", rating: "4.6" },
    { name: "Bistecca & Vegetables", restaurant: "Carbone", rating: "4.9" },
    { name: "Lamb Chops & Farm Salad", restaurant: "Blue Hill", rating: "4.8" },
    { name: "Duck & Grain Bowl", restaurant: "Estela", rating: "4.7" },
  ],
};

/* ---------------------------------------------------------------------------
   AI PROMPT CARD — animated border sweep added, sourced directly from the
   real component (Bl in chunk-GFXK4AUE.js) and its CSS:
   - Real token confirmation: card padding 12px (already had this),
     border-radius 4px (kept at 8px here — deliberate, matches the
     bordered+hover-lift treatment shared with RestaurantCard, confirmed
     separately by direct screenshot evidence), glow-blur 10px,
     glow-opacity 0.15. Real card-fixed-width (200px) exists in the same
     token set but appears to belong to a different, fixed-width modal
     context (cardFixedWidthModal* tokens sit right next to it) — NOT
     overriding the hugging-width behavior already confirmed via direct
     screenshots for this homepage instance.
   - Real structure, in DOM order: staticBorder div, animatedGlow div,
     animatedBorder div, then the button — replicated exactly.
   - Real gradient (--sweep-gradient): transparent -5%, transparent 42%,
     border-action(red, #da3743 — the PLAIN red, not the lighter red used
     on the CTA button's border) 50%, border-accent-yellow(#fdaf08) 64%,
     border-accent-aqua-secondary(#3ddbb6) 78%, transparent 86%,
     transparent 120%, at 90deg, background-size 400% 100%.
   - Real keyframe shape (animation "xl9yl1LB5Ig-"): holds at
     background-position 177% 0 for the first half of the cycle, then
     sweeps to -46% 0 for the second half. 5s duration, linear.
   - Real mechanism note: the actual site runs this ONCE per trigger via
     JS (a forced-reflow restart trick fires it, then plays once, then
     something re-triggers it later) rather than a plain CSS loop — that
     JS-level orchestration (including the exact per-card stagger delay)
     lives in a different, page-specific bundle not available for
     extraction. Implemented here as a simpler CSS-native infinite loop
     with the same real keyframe shape/timing/colors, with an ESTIMATED
     per-card stagger delay (not a confirmed value) so the sweep still
     visibly travels card-to-card in sequence, matching what was
     described. Flagged as a simplification, not a verified match.
--------------------------------------------------------------------------- */
/* Gradient used for the border itself. Unlike the CTA button's version
   (which fades to fully transparent on both ends, fine since it's a
   plain white button with nothing needing to show through), this one's
   "off" stops use the actual resting border color instead of transparent
   — so the border always shows a solid color, with the red/yellow/aqua
   band sweeping THROUGH it via animated background-position, rather than
   the border periodically vanishing where the gradient is transparent. */
function sweepGradient(baseColor) {
  return `linear-gradient(90deg, ${baseColor} -5%, ${baseColor} 42%, ${C.red} 50%, ${C.aiYellow} 64%, ${C.aiAqua} 78%, ${baseColor} 86%, ${baseColor} 120%)`;
}

function PromptCard({ text, highlight, onClick, index = 0 }) {
  const [hovered, setHovered] = useState(false);
  const delay = index * 0.9; // ESTIMATED stagger — not a confirmed value, see note above
  return (
    <>
      {/* Real keyframe shape (animation "xl9yl1LB5Ig-" in the actual
          component): holds at 177% 0 for the first half of the cycle,
          sweeps to -46% 0 for the second half. Moved here (self-
          contained inside PromptCard) from its previous location inside
          HomeScreen's AI section JSX — that meant the keyframe was only
          ever defined when that specific section mounted, so PromptCard
          instances used elsewhere (Concierge's example prompts and
          follow-up chips) referenced an undefined keyframe and silently
          didn't animate. Registering it here guarantees it's always
          defined wherever PromptCard is used, matching the same
          self-contained pattern already used by ScrollCarousel's
          no-scrollbar style and ConciergeLoader's spin keyframe. */}
      <style>{`
        @keyframes promptSweep {
          0%, 50% { background-position: 177% 0; }
          100% { background-position: -46% 0; }
        }
      `}</style>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "relative",
          display: "inline-block",
          maxWidth: 340,
          borderRadius: 8,
          boxSizing: "border-box",
          /* Border width now uniform 1px for every card regardless of
             highlight — a 2px border was still rendering the sweep as a
             visibly thicker band than the 1px cards even after the base
             color was unified in v0.26, since border width directly
             determines how many pixels the border-box-clipped gradient
             occupies. Per direct instruction, all four cards should look
             identical; the goal-aware card is now distinguished only by
             its text content, not by any border/animation treatment. */
          border: "1px solid transparent",
          /* Simplified again from v0.23: that version's animated layer used
             `inset: 0`, which positions relative to the PADDING box (i.e.
             strictly INSIDE the border) — the colored sweep could never
             reach the same pixels as the border ring at all, which is
             exactly "animation happening behind the border." Switched to
             the same padding-box/border-box double-background technique
             already proven working on the CTA button below (no reported
             corner issues there) — applied directly to this single
             element rather than as a separate overlay div, so there's
             only one box establishing both the shape and the border-
             painting, with nothing competing for the same pixels.
             Base resting color now ALWAYS ash-lighter (grey), regardless
             of highlight — previously the goal-aware card used red as its
             resting color on top of ALSO being 2px thick, so it looked
             more saturated/heavier throughout, not just during the sweep.
             Border width is now uniform 1px too (see note above) — the
             goal-aware card is no longer visually distinguished by its
             border/animation at all, only by its text content. */
          background: `linear-gradient(${C.white}, ${C.white}) padding-box, ${sweepGradient(
            C.ashLighter
          )} border-box`,
          backgroundSize: "auto, 400% 100%",
          backgroundPosition: "0 0, 177% 0",
          backgroundRepeat: "no-repeat",
          animation: `promptSweep 5s linear ${delay}s infinite`,
          transition: "box-shadow .3s, transform .3s",
          /* Always-on subtle shadow (was 'none' at rest, only appearing
             on hover) — the light-grey border alone has poor contrast
             against a plain white page background (only really visible
             on the homepage because that section sits on a tinted
             gradient wash, not plain white). A resting shadow gives the
             card a distinct surface regardless of what it's placed on,
             which the homepage's AI section also benefits from, not
             just Concierge's plain-white context. */
          boxShadow: hovered ? "0 4px 8px rgba(45,51,63,0.15)" : "0 1px 3px rgba(45,51,63,0.12)",
          transform: hovered ? "translateY(-6px)" : "translateY(0)",
        }}
      >
      <button
        onClick={onClick}
        style={{
          display: "block",
          boxSizing: "border-box",
          padding: 12,
          border: "none",
          borderRadius: 6,
          background: "transparent",
          color: C.ashDark,
          textAlign: "left",
          cursor: "pointer",
          fontFamily: FONT,
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 14,
            fontWeight: 400,
            lineHeight: "20px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {text}
        </p>
      </button>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------------------
   AI CTA BUTTON ("Describe your ideal spot") — RESTORED per direct
   instruction (the v0.41 change unifying this with PromptCard's look and
   animated sweep was reverted; everything else from v0.41 — goal-prompt
   moved to first, seafood prompt removed — stays as-is). Real styling
   confirmed from CSS (class _4g0uM3QkOrE-): this is NOT a solid red
   primary button despite the theme="primary" attribute — it's a white-
   filled button with a GRADIENT BORDER (red -> yellow -> aqua, the same
   3-color family as the panel's background wash) using the standard
   two-layer background trick (one gradient clipped to padding-box for
   the solid fill, one clipped to border-box for the gradient ring).
   Dark text, not white. Does not participate in the animated sweep —
   that was the whole point of reverting.
--------------------------------------------------------------------------- */
function AiCtaButton({ onClick }) {
  return (
    <div style={{ display: "inline-block" }}>
      <button
        onClick={onClick}
        style={{
          height: 48,
          padding: "0 24px",
          boxSizing: "border-box",
          color: C.ashDark,
          border: "1px solid transparent",
          borderRadius: 4,
          background: `linear-gradient(${C.white}, ${C.white}) padding-box, linear-gradient(90deg, ${C.aiRed} 0%, ${C.aiYellow} 49.52%, ${C.aiAqua} 100%) border-box`,
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
          fontSize: 14,
          fontWeight: 500,
          whiteSpace: "nowrap",
          cursor: "pointer",
          fontFamily: FONT,
        }}
      >
        Describe your ideal spot
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   DISH CAROUSEL CARD — exact dims from location-landing CSS (§4.9):
   196x168 image, 8px radius, name badge overlaid top-left ON the photo
   (not below it — easy to get wrong).
--------------------------------------------------------------------------- */
/* Same border + hover-lift + image-zoom treatment as RestaurantCard (§4.9
   shared card pattern — border, radius, overflow hidden, translateY(-6px)
   + shadow on hover, image scale(1.05) inside its own clipped layer). Name
   badge stays absolutely positioned on top of the now-relatively-
   positioned image wrapper, unaffected by the added hover layers. */
function DishCard({ dish, index = 0 }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 258,
        boxSizing: "border-box",
        flexShrink: 0,
        background: C.white,
        border: `1px solid ${C.ashLighter}`,
        borderRadius: 8,
        overflow: "hidden",
        position: "relative",
        cursor: "pointer",
        transition: "all .3s",
        boxShadow: hovered ? "0 2px 4px rgba(45,51,63,0.2)" : "none",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
      }}
    >
      <div style={{ position: "relative", overflow: "hidden" }}>
        <div
          style={{
            transition: "transform .3s",
            transform: hovered ? "scale(1.05)" : "scale(1)",
          }}
        >
          <ImagePlaceholder width={258} height={220} radius={0} label="[dish photo]" src={dishPhoto(index)} alt={dish.name} />
        </div>
        <span
          style={{
            position: "absolute",
            left: 8,
            top: 8,
            background: "#ffffffd9",
            borderRadius: 4,
            padding: "4px 8px",
            fontSize: 12,
            lineHeight: "16px",
            fontWeight: 600,
            color: C.ashDark,
            maxWidth: 226,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {dish.name}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 4, padding: 8, fontSize: 14 }}>
        <span
          style={{
            color: C.ashDark,
            textDecoration: "underline",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {dish.restaurant}
        </span>
        <span style={{ color: C.ash }}>•</span>
        <Ic.Star size={13} />
        <span style={{ color: C.ashDark }}>{dish.rating}</span>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   TIME SLOT PILL — exact CSS from location-landing (§4.9): 70px wide,
   32px tall, red fill, 4px radius, 14px/700 white text.
--------------------------------------------------------------------------- */
function TimeSlotPill({ time }) {
  return (
    <span
      style={{
        width: 70,
        height: 32,
        lineHeight: "32px",
        textAlign: "center",
        background: C.red,
        color: C.white,
        borderRadius: 4,
        fontSize: 14,
        fontWeight: 700,
        cursor: "pointer",
        fontFamily: FONT,
        display: "inline-block",
      }}
    >
      {time}
    </span>
  );
}

/* ---------------------------------------------------------------------------
   RESTAURANT CARD (vertical) — updated with real border/hover CSS, exact
   values from location-landing (classes WiK1XyoVciU- / SXYe3u6-sdM-):
   1px ash-lighter border, 8px radius (0.5rem), overflow hidden. On hover:
   box-shadow "0 2px 4px #2d333f33" + translateY(-6px) on the card, plus
   the image itself scales to 1.05 — three real, verified effects, not
   guessed. Hover state handled via onMouseEnter/Leave since inline
   styles can't express :hover directly.
--------------------------------------------------------------------------- */
/* goalAligned adds a photo-overlay badge (Option B, discussed and agreed
   before building): a text-line badge like Search Results would make
   goal-aligned cards taller than non-aligned ones in the same row,
   which is visually jarring in a side-by-side carousel (unlike Search
   Results' single-column list, where that isn't an issue). An overlay
   adds zero height — every card stays the same height whether badged
   or not — reusing the same "badge on the photo" pattern already
   established by DishCard's name badge, just red instead of white to
   read as a distinct "goal" signal rather than a label. Same copy as
   Search Results ("Great fit for your goal") for message consistency,
   even though the visual container differs. */
function RestaurantCard({ name, rating, reviews, meta, bookedToday, times, goalAligned, index = 0 }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 258,
        boxSizing: "border-box",
        flexShrink: 0,
        background: C.white,
        border: `1px solid ${C.ashLighter}`,
        borderRadius: 8,
        overflow: "hidden",
        position: "relative",
        cursor: "pointer",
        transition: "all .3s",
        boxShadow: hovered ? "0 2px 4px rgba(45,51,63,0.2)" : "none",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
      }}
    >
      <div style={{ overflow: "hidden", position: "relative" }}>
        <div
          style={{
            transition: "transform .3s",
            transform: hovered ? "scale(1.05)" : "scale(1)",
          }}
        >
          <ImagePlaceholder width={258} height={132} radius={0} label="[restaurant photo]" src={restaurantPhoto(index)} alt={name} />
        </div>
        {goalAligned && (
          <span
            style={{
              position: "absolute",
              left: 8,
              top: 8,
              background: C.red,
              color: C.white,
              borderRadius: 4,
              padding: "4px 8px",
              fontSize: 12,
              lineHeight: "16px",
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            Great fit for your goal
          </span>
        )}
      </div>
      <div style={{ padding: 8 }}>
        <h4
          style={{
            margin: "0 0 4px",
            fontSize: 16,
            fontWeight: 700,
            color: C.ashDark,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {name}
        </h4>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
          <Ic.Star size={14} />
          <span style={{ fontSize: 14, fontWeight: 500, color: C.red }}>{rating}</span>
          <span style={{ fontSize: 14, color: C.ash }}>({reviews})</span>
        </div>
        <p
          style={{
            margin: "0 0 4px",
            fontSize: 14,
            color: C.ashDark,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {meta}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
          <Ic.SocialProof size={16} />
          <span style={{ fontSize: 14, fontWeight: 600, color: C.ashDark }}>Booked {bookedToday} times today</span>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {/* Real gap is 8px (design-system.md §4.9, time-slots-row) — my
              previous attempt shrank this to 5px instead of fixing the
              actual problem, which was the CARD being too narrow. 3 pills
              at the real 70px width + real 8px gap need 226px of content
              room; the 236px card only gave 220px after padding. Widened
              the card to 258px (256px content, 240px after padding —
              240 ≥ 226 with real margin to spare) and restored the true
              8px gap instead of compressing it away from its real value. */}
          {times.map((t) => (
            <span key={t} onClick={() => {}}>
              <TimeSlotPill time={t} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Expanded to 15 entries (was 4) so the carousel arrows have somewhere
   real to scroll to on desktop — with only 4 cards the full row already
   fit the viewport and "Next" had nothing to do. */
const BOOK_TODAY_RESTAURANTS = [
  { name: "Gramercy Tavern", rating: "4.8", reviews: "5,423", meta: "American • $$$$ • Flatiron", bookedToday: 61, times: ["12:00 PM", "12:15 PM", "12:30 PM"], goalAligned: true },
  { name: "Union Square Cafe", rating: "4.7", reviews: "3,109", meta: "American • $$$ • Union Square", bookedToday: 34, times: ["12:00 PM", "12:30 PM", "1:00 PM"], goalAligned: true },
  { name: "Casa Mono", rating: "4.6", reviews: "2,731", meta: "Spanish • $$$ • Gramercy", bookedToday: 28, times: ["12:15 PM", "12:45 PM", "1:15 PM"], goalAligned: false },
  { name: "The Odeon", rating: "4.5", reviews: "4,239", meta: "French • $$ • TriBeCa", bookedToday: 45, times: ["12:00 PM", "12:15 PM", "1:00 PM"], goalAligned: false },
  { name: "Brooklyn Chop House", rating: "4.3", reviews: "3,048", meta: "Steakhouse • $$$ • TriBeCa", bookedToday: 35, times: ["4:00 PM", "4:30 PM", "5:00 PM"], goalAligned: false },
  { name: "Gran Morsi", rating: "4.7", reviews: "893", meta: "Italian • $$$ • TriBeCa", bookedToday: 4, times: ["4:00 PM", "4:15 PM", "4:30 PM"], goalAligned: false },
  { name: "Eataly NYC Downtown", rating: "4.7", reviews: "1,996", meta: "Pizzeria • $$$ • Financial District", bookedToday: 39, times: ["4:15 PM", "4:45 PM", "5:15 PM"], goalAligned: false },
  { name: "Serafina Tribeca", rating: "4.5", reviews: "866", meta: "Italian • $$$ • TriBeCa", bookedToday: 17, times: ["4:00 PM", "4:15 PM", "4:30 PM"], goalAligned: false },
  { name: "Nobu Downtown", rating: "4.8", reviews: "2,214", meta: "Japanese • $$$$ • TriBeCa", bookedToday: 52, times: ["5:00 PM", "5:15 PM", "5:30 PM"], goalAligned: true },
  { name: "Cipriani Downtown", rating: "4.6", reviews: "1,542", meta: "Italian • $$$$ • SoHo", bookedToday: 22, times: ["5:00 PM", "5:30 PM", "6:00 PM"], goalAligned: false },
  { name: "Balthazar", rating: "4.5", reviews: "6,781", meta: "French • $$$ • SoHo", bookedToday: 73, times: ["4:30 PM", "5:00 PM", "5:30 PM"], goalAligned: false },
  { name: "The Clocktower", rating: "4.6", reviews: "1,128", meta: "British • $$$$ • Flatiron", bookedToday: 19, times: ["5:15 PM", "5:45 PM", "6:15 PM"], goalAligned: false },
  { name: "Carbone", rating: "4.9", reviews: "4,902", meta: "Italian • $$$$ • Greenwich Village", bookedToday: 88, times: ["9:00 PM", "9:15 PM", "9:30 PM"], goalAligned: true },
  { name: "Blue Hill", rating: "4.8", reviews: "1,367", meta: "American • $$$$ • Greenwich Village", bookedToday: 14, times: ["5:30 PM", "6:00 PM", "6:30 PM"], goalAligned: true },
  { name: "Estela", rating: "4.7", reviews: "1,809", meta: "American • $$$ • NoLIta", bookedToday: 29, times: ["5:00 PM", "5:15 PM", "5:30 PM"], goalAligned: false },
];

/* ---------------------------------------------------------------------------
   SCROLL CAROUSEL — real component structure per §4.9/homepage extraction:
   circular 42px arrow buttons (white bg, 1px ash-lighter border, soft
   shadow), NOT a visible scrollbar. Arrows drive scrollLeft on a hidden-
   overflow container via scrollBy — content shifts even with the native
   scrollbar suppressed, which is the standard technique for this pattern.
   Used for "Book for lunch today" (and reusable for the dish carousel).
--------------------------------------------------------------------------- */
/* ---------------------------------------------------------------------------
   CONCIERGE LOADER — real mechanics sourced from actual CSS: a static
   center "stars" icon (60% size) plus 4 full-size "outline" layers all
   continuously rotating via the same real stepped keyframe
   (_0jbAuuGVosY-: hold, 90deg, hold, 180deg, hold, 270deg, hold, 360deg
   over 4s), with only one outline opaque at a time. The CSS doesn't
   specify what cycles which outline is visible (that's JS not present
   in what was extracted) — implemented here as a 1s interval cycling
   through all 4, a reasonable inference matching the 4s/4-layer ratio.
   The 4 outline shapes are real, exact SVG paths, each with its own
   native aspect ratio (30x34, 34x32, 34x32 again — confirmed identical
   in the real source, not a mistake — and 32x32) rendered with
   preserveAspectRatio="none" to fill a uniform 32x32 container, a small
   approximation rather than reproducing each shape's exact native
   proportions. */
function ConciergeLoader({ size = 32 }) {
  const [active, setActive] = useState(1); // outline-2 is the real default-visible layer
  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % 4), 1000);
    return () => clearInterval(id);
  }, []);
  const outlines = [Ic.ConciergeOutline1, Ic.ConciergeOutline2, Ic.ConciergeOutline3, Ic.ConciergeOutline4];
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <style>{`
        @keyframes conciergeSpin {
          0%, 5%   { transform: rotate(0); }
          25%, 30% { transform: rotate(90deg); }
          50%, 55% { transform: rotate(180deg); }
          75%, 80% { transform: rotate(270deg); }
          100%     { transform: rotate(360deg); }
        }
      `}</style>
      <div style={{ position: "absolute", top: "20%", left: "20%", width: "60%", height: "60%" }}>
        <Ic.ConciergeStar size="100%" color={C.ashDark} />
      </div>
      {outlines.map((Outline, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            inset: 0,
            opacity: active === i ? 1 : 0,
            transition: "opacity .5s ease-out",
            animation: "conciergeSpin 4s ease-out infinite",
          }}
        >
          <Outline color={C.ashDark} />
        </div>
      ))}
    </div>
  );
}

function ScrollCarousel({ children, step = 548 }) {
  const scrollRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const [hoveredArrow, setHoveredArrow] = useState(null); // 'left' | 'right' | null

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateArrows();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows);
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * step, behavior: "smooth" });
    }
  };
  // Hover deepens the existing elevation shadow and turns the border red
  // — a different visual change than the pill fix above (that one had
  // two overlapping RED rings at the same offset; this is one border-
  // color change plus intensifying an ALREADY-different-purpose
  // elevation shadow, not a duplicate ring of the same effect).
  const arrowStyle = (side, isHovered) => ({
    position: "absolute",
    top: "50%",
    [side]: -8,
    transform: "translateY(-50%)",
    width: 42,
    height: 42,
    borderRadius: "50%",
    background: C.white,
    border: `1px solid ${isHovered ? C.red : C.ashLighter}`,
    boxShadow: isHovered ? "0 4px 12px rgba(153,153,153,0.55)" : "0 2px 8px rgba(153,153,153,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    zIndex: 5,
    transition: "border-color .2s, box-shadow .2s",
  });
  return (
    <div style={{ position: "relative" }}>
      {/* Hides the native scrollbar visually (cross-browser) while
          keeping the container genuinely scrollable via overflowX:auto
          below — trackpad/wheel/touch scrolling now works natively,
          not just the arrow-driven scrollBy. Injected once per
          carousel instance; harmless if it appears more than once. */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>
      <div
        ref={scrollRef}
        className="no-scrollbar"
        style={{ display: "flex", gap: 16, overflowX: "auto", scrollBehavior: "smooth" }}
      >
        {children}
      </div>
      {/* Arrows only render when there's actually somewhere to scroll to on
          that side — on initial load (scrolled to the start) the left
          arrow is absent entirely, not just disabled, and the right arrow
          disappears once fully scrolled to the end. Tracked via the
          container's real scrollLeft/scrollWidth on scroll + resize. */}
      {canLeft && (
        <button
          onClick={() => scroll(-1)}
          onMouseEnter={() => setHoveredArrow("left")}
          onMouseLeave={() => setHoveredArrow(null)}
          aria-label="Previous"
          style={arrowStyle("left", hoveredArrow === "left")}
        >
          <Ic.Back size={20} color={hoveredArrow === "left" ? C.red : C.ashDark} />
        </button>
      )}
      {canRight && (
        <button
          onClick={() => scroll(1)}
          onMouseEnter={() => setHoveredArrow("right")}
          onMouseLeave={() => setHoveredArrow(null)}
          aria-label="Next"
          style={arrowStyle("right", hoveredArrow === "right")}
        >
          <Ic.Advance size={20} color={hoveredArrow === "right" ? C.red : C.ashDark} />
        </button>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   FAQ ACCORDION — simple expand/collapse rows, matching the pattern seen
   at the bottom of both homepage screenshots (Adelaide + NYC).
--------------------------------------------------------------------------- */
const FAQ_ITEMS = [
  {
    q: "What healthy restaurants are there in New York City?",
    a: "OpenTable highlights restaurants with lighter, produce-forward menus across the city — look for the Healthy tag in Special features when filtering search results.",
  },
  {
    q: "Which restaurants in New York City have vegetarian or vegan options?",
    a: "Most restaurants on OpenTable list dietary tags on their menu pages. You can filter by Vegan-friendly or Vegetarian-friendly in the Special features section.",
  },
  {
    q: "How does OpenTable personalize recommendations for my nutrition goal?",
    a: "Once you set a goal in your Diner Profile, OpenTable ranks restaurants and dishes that fit it higher across search, your homepage, and AI search — without hiding anything else.",
  },
];

function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <div>
      {FAQ_ITEMS.map((item, i) => (
        <div
          key={item.q}
          style={{
            display: "flex",
            flexDirection: "column",
            borderBottom: i === FAQ_ITEMS.length - 1 ? "none" : `1px solid ${C.ashLighter}`,
          }}
        >
          {/* Icon is 34px (2.125rem), confirmed real; rotate transition
              is 0.4s, confirmed real.
              Font-substitution compensation (same category as the hero
              text fix): real CSS values are 18px title / 16px answer,
              correct for BrandonText — but that licensed webfont can't
              load here, so the fallback stack renders those exact px
              values visibly larger than the real site does. Reduced to
              16px/14px as a deliberate visual-match override, not a
              claim that these are the real site's literal values.
              Row padding: CSS read as ~0px, tightened to 6px on that
              basis — but direct visual comparison against the real site
              says that's too little (same category of misread as the
              AI-prompt-section layout mistake earlier — likely a class
              shared/reused across a different component context than
              assumed). Increased to 20px, now trusting the visual
              comparison over the CSS reading — flagged as an estimate,
              not a sourced value. */}
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            style={{
              position: "relative",
              width: "100%",
              padding: "20px 0",
              background: "none",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              fontFamily: FONT,
            }}
          >
            <span style={{ display: "block", paddingRight: 48, fontSize: 16, lineHeight: "22px", fontWeight: 600, color: C.ashDark }}>
              {item.q}
            </span>
            <span
              style={{
                position: "absolute",
                right: 0,
                top: "50%",
                transform: `translateY(-50%) ${openIndex === i ? "rotate(180deg)" : ""}`,
                transition: "transform .4s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 34,
                height: 34,
              }}
            >
              <Ic.ChevronDown size={24} />
            </span>
          </button>
          {openIndex === i && (
            <p style={{ margin: "0 0 16px", fontSize: 14, lineHeight: "22px", color: C.ashDark, maxWidth: 720 }}>
              {item.a}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   FOOTER — Discover / OpenTable / More / Our Sites / Businesses columns +
   legal line, per real site structure. Text-only (no partner logos —
   would need image assets not available here).
--------------------------------------------------------------------------- */
const FOOTER_COLUMNS = {
  Discover: ["Dining Rewards", "Private Dining", "OpenTable Icons", "Top 100 Restaurants", "Restaurants Near Me"],
  OpenTable: ["About Us", "Blog", "Careers", "Press"],
  More: ["OpenTable for iOS", "OpenTable for Android", "Affiliate Program", "Contact Us"],
  Businesses: ["Restaurant Reservation Software", "OpenTable For Restaurants", "Restaurant Resources"],
};

function Footer() {
  return (
    <div style={{ background: C.ashDarker, color: C.white, fontFamily: FONT, marginTop: 48 }}>
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "48px 24px 24px",
          display: "flex",
          gap: 48,
          flexWrap: "wrap",
        }}
      >
        {Object.entries(FOOTER_COLUMNS).map(([col, links]) => (
          <div key={col}>
            <h4 style={{ margin: "0 0 16px", fontSize: 13, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase" }}>
              {col}
            </h4>
            {links.map((l) => (
              <p key={l} style={{ margin: "0 0 10px", fontSize: 14, color: "#d8d9db" }}>
                {l}
              </p>
            ))}
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "16px 24px 32px", borderTop: "1px solid #2d333f", fontSize: 12, color: "#91949a" }}>
        <p style={{ margin: "16px 0 0" }}>
          Copyright © 2026 OpenTable, Inc. 425 Market St Ste 1200, San Francisco CA 94105 — All rights reserved.
        </p>
        <p style={{ margin: "8px 0 0" }}>OpenTable is part of Booking Holdings, the world leader in online travel and related services.</p>
        <p style={{ margin: "8px 0 0" }}>Booking.com · Priceline · KAYAK · agoda · OpenTable</p>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   HOMEPAGE — location-set photo-hero variant (§4.9) + AI prompt row +
   goal-aware dish carousel (falls back to generic Trending Dishes when no
   goal is set, matching how the real component behaves with no override).
--------------------------------------------------------------------------- */
const DEFAULT_PROMPTS = [
  "I'm craving something spicy, what can you find?",
  "Where's a good, relaxed spot for a first date?",
];

function HomeScreen({ savedGoal, onNavigate, onStartConcierge }) {
  const goal = savedGoal ? GOALS.find((g) => g.id === savedGoal.goalId) : null;
  const showGoalPrompt = goal && GOAL_PROMPT[goal.id];
  const dishes = goal && GOAL_DISHES[goal.id] ? GOAL_DISHES[goal.id] : null;

  return (
    <div style={{ fontFamily: FONT, minHeight: "100vh", background: C.white }}>
      <Header onNavigate={onNavigate} />

      {/* 1. HERO — restructured from fixed-height/absolute-overlap into a
          normal-flow column (photo fills via absolute inset:0 sized to
          match the content's natural height, rather than a hardcoded
          288px band + negative-margin overlap). That overlap math was the
          real cause of the top/bottom imbalance the person flagged — the
          text was vertically centered in a taller reference frame than
          the search bar actually occupied. Fixed by making top/bottom
          padding explicit and symmetric-by-design (40/32) instead of a
          side effect of overlap math.
          FLAGGED PLACEHOLDER -> now real: user-provided homepage hero
          photo replaces the hatch pattern. Since this photo (unlike the
          Dashboard's) has no built-in dark region, a separate
          translucent dark overlay div sits on top of it for text
          legibility, using the same tint color the hatch pattern was
          approximating (#2f2d41), now as a real semi-transparent wash
          instead of an opaque pattern standing in for one. */}
      <div style={{ position: "relative", width: "100%" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${HOMEPAGE_HERO_IMG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(47,45,65,0.6)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: "40px 24px 32px",
          }}
        >
          <p
            style={{
              margin: "0 0 8px",
              fontSize: 16,
              fontWeight: 700,
              lineHeight: "20px",
              letterSpacing: "0.125rem",
              textTransform: "uppercase",
              color: C.white,
            }}
          >
            New York City Restaurants
          </p>
          <h1 style={{ margin: "0 0 24px", fontSize: 44, lineHeight: "52px", fontWeight: 700, color: C.white }}>
            Book a table
          </h1>

          {/* Search bar — separate rounded boxes per screenshot evidence
              (see v0.6 note). This pass: tightened internal padding
              (14px -> 12px), reduced field height (44 -> 40, matching the
              search input/button too so the whole row reads as one
              height), enlarged the chevrons (16 -> 20, they read as too
              small), and gave the location/cuisine field a fixed width
              (was min-width, which let its right-side padding drift
              depending on content — fixed width makes left/right padding
              symmetric and deterministic). */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            <div
              style={{
                height: 40,
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "0 12px",
                background: C.white,
                borderRadius: 4,
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                fontSize: 14,
                fontWeight: 500,
                color: C.ashDark,
                whiteSpace: "nowrap",
              }}
            >
              <Ic.Calendar size={18} color={C.ashDark} />
              Aug 29, 2026
              <Ic.ChevronDown size={20} color={C.ashDark} />
            </div>
            <div
              style={{
                height: 40,
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "0 12px",
                background: C.white,
                borderRadius: 4,
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                fontSize: 14,
                fontWeight: 500,
                color: C.ashDark,
                whiteSpace: "nowrap",
              }}
            >
              <Ic.Clock size={18} color={C.ashDark} />
              7:00 PM
              <Ic.ChevronDown size={20} color={C.ashDark} />
            </div>
            <div
              style={{
                height: 40,
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "0 12px",
                background: C.white,
                borderRadius: 4,
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                fontSize: 14,
                fontWeight: 500,
                color: C.ashDark,
                whiteSpace: "nowrap",
              }}
            >
              <Ic.Person size={18} color={C.ashDark} />
              2 people
              <Ic.ChevronDown size={20} color={C.ashDark} />
            </div>
            <div
              style={{
                height: 40,
                width: 300,
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "0 14px",
                background: C.white,
                borderRadius: 4,
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }}
            >
              <Ic.SearchInput size={18} color={C.ashDark} />
              <span style={{ fontSize: 14, fontWeight: 400, color: C.ashLight }}>
                Location, Restaurant, or Cuisine
              </span>
            </div>
            <button
              onClick={() => onNavigate("search")}
              style={{
                height: 40,
                minWidth: 120,
                padding: "0 24px",
                background: C.red,
                color: C.white,
                border: "none",
                borderRadius: 4,
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: FONT,
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }}
            >
              Let's go
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px" }}>
        {/* 2. "Book for lunch today in New York City" — real section header
            has a "View all" link (was missing entirely), and the row is a
            proper arrow-driven carousel, not a scrollbar-visible overflow
            row (both per direct markup/CSS extraction). */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 24, lineHeight: "28px", fontWeight: 700, color: C.ashDark }}>
            Book for lunch today in New York City
          </h2>
          <span style={{ color: C.red, fontSize: 14, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
            View all
          </span>
        </div>
        <div style={{ marginBottom: 40 }}>
          <ScrollCarousel>
            {BOOK_TODAY_RESTAURANTS.map((r, i) => (
              <RestaurantCard key={r.name} {...r} index={i} goalAligned={Boolean(goal && r.goalAligned)} />
            ))}
          </ScrollCarousel>
        </div>

        {/* 3. AI search prompt section — layout corrected once more: the
            "2-column grid" conclusion (v0.17) was ALSO wrong, for a
            subtle reason — two prompt texts of similar length happened
            to produce similar-width hugged boxes, which looked like a
            fixed grid but wasn't one. A screenshot with more varied
            prompt lengths ("Find a great place for Italian food." vs
            "What are the best sushi restaurants in town?") makes it
            unambiguous: cards genuinely hug their own content width,
            not a shared column width. Switched from CSS grid to a
            flex-wrap row of auto/shrink-to-fit boxes (PromptCard/
            AiCtaButton now display:inline-block with no forced width),
            with a 340px max-width safety net so an unusually long
            prompt still wraps to its 2-line clamp instead of producing
            one giant unwrapped box — that ceiling is an estimate, not
            an extracted value, since no exact max-width was confirmed.
            Hover-lift-clipping fix (dedicated overflow:hidden wrapper
            around just the gradient layer) carries over unchanged. */}
        <div style={{ position: "relative", borderRadius: 8, padding: 32, marginBottom: 40, background: C.white }}>
          {/* @keyframes promptSweep now self-contained inside PromptCard
              itself (see that component's comment) — removed the
              duplicate injection that used to live here. */}
          <div style={{ position: "absolute", inset: 0, borderRadius: 8, overflow: "hidden" }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(270deg, #3ddbb6 5.46%, #fdaf08 61.54%, #e15b64 88.44%)",
                opacity: 0.1,
                filter: "blur(2px)",
              }}
            />
          </div>
          <div style={{ position: "relative", display: "flex", gap: 56, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ flex: "0 0 260px" }}>
              <h2 style={{ margin: "0 0 4px", fontSize: 24, lineHeight: "28px", fontWeight: 700, color: C.ashDark }}>
                Find the right table in New York City
              </h2>
              <p style={{ margin: "0 0 8px", ...type.bodyMedium, color: C.ash }}>
                Let OpenTable find the best spots for you.
              </p>
              <p style={{ margin: 0, fontSize: 12, color: C.ash, display: "flex", alignItems: "center", gap: 4 }}>
                Powered by AI
                <Ic.Sparkle size={14} color={C.ash} />
              </p>
            </div>
            {/* justifyContent:'center' — each wrapped row of cards centers
                independently within the available width, rather than all
                sitting flush against a shared left edge (flex-start). This
                is why row 1 and row 2 can start at slightly different left
                positions on the real site when their total row widths
                differ — confirmed by comparing row-start positions across
                a screenshot with mismatched prompt lengths. */}
            <div
              style={{
                flex: "1 1 420px",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 16,
                paddingTop: 8,
              }}
            >
              {/* Order per direct instruction: goal-aware prompt FIRST
                  (was last), seafood prompt removed entirely. "Describe
                  your ideal spot" reverted back to AiCtaButton (its own
                  distinct gradient-border styling, no sweep animation)
                  — only that one piece of v0.41 was reverted; the
                  reordering and removal above stay as they were. Index
                  props only apply to the animated PromptCard instances,
                  so the count naturally excludes the CTA.
                  All three now route to Concierge (onStartConcierge),
                  not Search Results — real behavior confirmed directly:
                  clicking any prompt or "Describe your ideal spot" opens
                  the dedicated Concierge chat screen, pre-filled with
                  the clicked prompt's text, not the search results page
                  these previously (incorrectly) linked to. */}
              {showGoalPrompt && (
                <PromptCard text={GOAL_PROMPT[goal.id]} index={0} onClick={() => onStartConcierge(GOAL_PROMPT[goal.id])} />
              )}
              {DEFAULT_PROMPTS.map((p, i) => (
                <PromptCard key={p} text={p} index={(showGoalPrompt ? 1 : 0) + i} onClick={() => onStartConcierge(p)} />
              ))}
              <AiCtaButton onClick={() => onStartConcierge("")} />
            </div>
          </div>
        </div>

        {/* 4. Dish carousel — enhanced to match "Book for lunch today":
            real arrow-driven ScrollCarousel (was a plain overflow-x
            scrollbar row), and card width matched to RestaurantCard's
            258px so both rows share the same column alignment down the
            page instead of using two different card widths (196px vs
            258px). Image height scaled proportionally (168px at 196px
            wide -> 220px at 258px wide, same ~1.17:1 aspect ratio). */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <h2 style={{ margin: 0, fontSize: 24, lineHeight: "28px", fontWeight: 700, color: C.ashDark }}>
              {dishes ? `${goal.label} dishes near you` : "Trending dishes in New York City"}
            </h2>
            <span style={{ color: C.red, fontSize: 14, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
              View all
            </span>
          </div>
          <p style={{ margin: "4px 0 16px", ...type.bodyMedium, color: C.ash }}>
            {dishes ? "Curated to match your nutrition goal." : "Explore dishes that diners are raving about."}
          </p>
          <ScrollCarousel>
            {(dishes || GOAL_DISHES.balanced).map((d, i) => (
              <DishCard key={d.name} dish={d} index={i} />
            ))}
          </ScrollCarousel>
        </div>

        {/* 5. FAQ accordion — heading margin-bottom corrected to the real
            16px (was 8px, confirmed from class eT-RxmO7imI-). Section-
            level spacing above (real margin-top:32px on the FAQ
            section) isn't set explicitly here since it naturally
            resolves via CSS margin-collapse against the dish carousel's
            existing marginBottom:40 above (collapse takes the larger of
            the two adjacent margins, ~40px, close enough to the real
            32px without double-stacking to 72px). */}
        <div>
          <h2 style={{ margin: "0 0 16px", fontSize: 24, lineHeight: "28px", fontWeight: 700, color: C.ashDark }}>
            Frequently asked questions
          </h2>
          <FaqAccordion />
        </div>
      </div>

      {/* 6. Footer */}
      <Footer />
    </div>
  );
}

/* ---------------------------------------------------------------------------
   SEARCH RESULTS — REBUILT against a direct screenshot comparison (no
   real HTML/CSS was available for this page, unlike the Homepage
   sections — everything here is careful visual matching, not sourced
   extraction; flagged inline wherever something is invented rather than
   confirmed).
   Real structural gaps this rebuild addresses:
   - Missing secondary search bar (dark band: Date/Time/Party/Search-
     input/red "Find a table" button) — added.
   - Quick-filter row was structurally wrong: "Featured" is a selected
     pill INSIDE the row (not a separate button), filter icon is
     icon-only (no "Filters" text), every category pill has an icon
     prefix, the pill matching the active search term shows as selected
     (red), and the row scrolls with a trailing arrow — all rebuilt.
   - Heading was missing the quoted search term and the results-count /
     "How are Featured results ranked" line entirely — added.
   - Result cards were missing: photo carousel dots, single merged meta
     line (was split across two lines), 5 time slots (was 3), optional
     "+1,000 pts" under slots, optional promo line — all added.
   - No map at all — added, clearly flagged as a placeholder (hatched
     background, hand-drawn pin icons at rough scattered positions, no
     real map tiles/integration).
--------------------------------------------------------------------------- */
const SORT_OPTIONS = ["Featured", "Highest Rated", "Distance", "Newest"];

/* FLAGGED — icon assignment per pill is a simplification: real distinct
   icons per cuisine/category (pizza slice, fish, birthday cake, etc.)
   weren't available, so every food-category pill reuses the existing
   Cuisine (fork/bottle) icon; only Romantic gets its own (Heart). */
const QUICK_FILTERS = [
  "Romantic",
  "Italian",
  "Brunch",
  "Mexican",
  "Pizza",
  "Seafood",
  "American",
  "Fun",
  "Japanese",
  "Birthdays",
  "Sushi",
];

const SEARCH_RESULTS = [
  {
    name: "Gran Morsi",
    rating: "4.7",
    reviews: "893",
    price: "$$$",
    cuisine: "Italian",
    neighborhood: "TriBeCa",
    bookedToday: 4,
    times: ["6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM"],
    points: false,
    promo: "Restaurant Week at Gran Morsi",
    goalAligned: true,
  },
  {
    name: "Bucatini",
    rating: "4.7",
    reviews: "283",
    price: "$$",
    cuisine: "Italian",
    neighborhood: "Midtown",
    bookedToday: 52,
    times: ["6:30 PM", "6:45 PM", "7:00 PM", "7:15 PM", "7:30 PM"],
    points: true,
    promo: null,
    goalAligned: false,
  },
  {
    name: "Gramercy Tavern",
    rating: "4.8",
    reviews: "5,423",
    price: "$$$$",
    cuisine: "American",
    neighborhood: "Flatiron",
    bookedToday: 61,
    times: ["6:00 PM", "6:15 PM", "6:30 PM", "7:00 PM", "7:15 PM"],
    points: false,
    promo: null,
    goalAligned: true,
  },
  {
    name: "Casa Mono",
    rating: "4.6",
    reviews: "2,731",
    price: "$$$",
    cuisine: "Spanish",
    neighborhood: "Gramercy",
    bookedToday: 28,
    times: ["6:15 PM", "6:45 PM", "7:15 PM", "7:45 PM", "8:15 PM"],
    points: true,
    promo: null,
    goalAligned: false,
  },
];

/* FLAGGED PLACEHOLDER — search top bar, dark band variant of the hero
   search bar. Reuses the same real icons (Calendar/Clock/Person/
   SearchInput) already confirmed elsewhere in this file; the dark
   background treatment and field layout here are visual-match
   estimates against the screenshot, not sourced values. */
function SearchTopBar({ query, onSearch }) {
  const fieldStyle = {
    height: 44,
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "0 14px",
    background: C.white,
    borderRadius: 4,
    fontSize: 14,
    fontWeight: 500,
    color: C.ashDark,
    whiteSpace: "nowrap",
  };
  return (
    <div style={{ background: C.ashDarker, padding: "16px 24px" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <div style={fieldStyle}>
          <Ic.Calendar size={18} color={C.ashDark} />
          Aug 29, 2026
          <Ic.ChevronDown size={16} color={C.ashDark} />
        </div>
        <div style={fieldStyle}>
          <Ic.Clock size={18} color={C.ashDark} />
          7:00 PM
          <Ic.ChevronDown size={16} color={C.ashDark} />
        </div>
        <div style={fieldStyle}>
          <Ic.Person size={18} color={C.ashDark} />
          2 people
          <Ic.ChevronDown size={16} color={C.ashDark} />
        </div>
        <div style={{ ...fieldStyle, flex: "1 1 220px", minWidth: 200 }}>
          <Ic.SearchInput size={18} color={C.ashDark} />
          {query}
        </div>
        <button
          onClick={onSearch}
          style={{
            height: 44,
            padding: "0 24px",
            background: C.red,
            color: C.white,
            border: "none",
            borderRadius: 4,
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: FONT,
          }}
        >
          Find a table
        </button>
      </div>
    </div>
  );
}

/* Simplified hover: was applying BOTH a border-color change AND a
   separate box-shadow ring at the same offset — two overlapping red
   outlines on a fully-rounded (9999px) pill rendered as an uneven/
   doubled outline instead of a clean ring. Dropped the box-shadow,
   keeping only the border-color change — same feedback, no glitch. */
function QuickFilterPill({ icon, label, active, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "8px 14px",
        borderRadius: 9999,
        border: active ? `1.5px solid ${C.red}` : `1px solid ${hovered ? C.red : C.ashLighter}`,
        background: C.white,
        color: active ? C.red : C.ashDark,
        fontSize: 14,
        fontWeight: 500,
        whiteSpace: "nowrap",
        cursor: "pointer",
        fontFamily: FONT,
        flexShrink: 0,
        transition: "border-color .2s",
      }}
    >
      {icon}
      {label}
    </button>
  );
}

/* FLAGGED PLACEHOLDER — carousel dots are static (first dot always
   "active"), no real swipe/paging behavior — just visually signaling
   that the real card shows multiple photos. */
function SearchResultCard({ r, goal, onNavigate, index = 0 }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        gap: 16,
        paddingBottom: 24,
        marginBottom: 24,
        borderBottom: `1px solid ${C.ashLighter}`,
      }}
    >
      <div style={{ position: "relative", flexShrink: 0 }}>
        <div style={{ overflow: "hidden", borderRadius: 8 }}>
          <div style={{ transition: "transform .3s", transform: hovered ? "scale(1.05)" : "scale(1)" }}>
            <ImagePlaceholder width={220} height={160} radius={0} label="[restaurant photo]" src={restaurantPhoto(index)} alt={r.name} />
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 8, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 4 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: i === 0 ? C.white : "rgba(255,255,255,0.5)",
              }}
            />
          ))}
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 700, color: C.ashDark }}>{r.name}</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4, fontSize: 14, flexWrap: "wrap" }}>
          <Ic.Star size={14} />
          <span style={{ color: C.red, fontWeight: 500 }}>{r.rating}</span>
          <span style={{ color: C.ash }}>({r.reviews})</span>
          <span style={{ color: C.ash }}>•</span>
          <span style={{ color: C.ashDark }}>{r.price}</span>
          <span style={{ color: C.ash }}>•</span>
          <span style={{ color: C.ashDark }}>{r.cuisine}</span>
          <span style={{ color: C.ash }}>•</span>
          <span style={{ color: C.ashDark }}>{r.neighborhood}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8, fontSize: 13 }}>
          <Ic.SocialProof size={14} />
          <span style={{ color: C.ashDark }}>Booked {r.bookedToday} times today</span>
        </div>
        {goal && r.goalAligned && (
          <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 700, color: C.red }}>Great fit for your goal</p>
        )}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: r.promo ? 8 : 0 }}>
          {r.times.map((t) => (
            <div key={t} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <span onClick={() => onNavigate("booking")}>
                <TimeSlotPill time={t} />
              </span>
              {r.points && <span style={{ fontSize: 11, color: C.teal, fontWeight: 600 }}>+1,000 pts</span>}
            </div>
          ))}
        </div>
        {r.promo && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: C.ashDark }}>
            <Ic.Ticket size={14} color={C.ash} />
            {r.promo}
          </div>
        )}
      </div>
    </div>
  );
}

/* FLAGGED PLACEHOLDER — no real map integration; hatched background
   matching the same "obvious stand-in" convention as ImagePlaceholder,
   with hand-drawn pin icons at rough scattered positions (not tied to
   real coordinates) and non-functional zoom/locate/expand controls
   included only for visual completeness. */
function MapPlaceholder() {
  const pins = [
    { left: "30%", top: "20%" },
    { left: "45%", top: "15%" },
    { left: "55%", top: "30%" },
    { left: "35%", top: "40%" },
    { left: "50%", top: "50%" },
    { left: "62%", top: "42%" },
    { left: "40%", top: "62%" },
    { left: "58%", top: "68%" },
    { left: "48%", top: "78%" },
  ];
  return (
    <div
      style={{
        position: "sticky",
        top: 24,
        width: "100%",
        /* Estimated to fit within the initial viewport without scrolling
           past the fold: accounts for the approximate stacked height of
           everything above this row (top micro-nav + header + search
           bar + quick-filter row + this row's own top padding, roughly
           260px) plus a small bottom margin. Previously used
           `calc(100vh - 48px)`, which assumes the map starts near the
           very top of the viewport — it doesn't, so that height
           overflowed well past the visible fold. Estimate, not an exact
           calculation (can't measure real layout from static styles
           alone) — may need further tuning. */
        height: "calc(100vh - 280px)",
        minHeight: 420,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: 8,
          overflow: "hidden",
          background: "repeating-linear-gradient(45deg, #e8eef0, #e8eef0 14px, #dde6e9 14px, #dde6e9 28px)",
        }}
      >
      <span
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          background: C.white,
          padding: "6px 10px",
          borderRadius: 4,
          fontSize: 11,
          color: C.ash,
          boxShadow: "0 2px 4px rgba(45,51,63,0.2)",
        }}
      >
        [map placeholder — no real map integration]
      </span>
      {pins.map((p, i) => (
        <span key={i} style={{ position: "absolute", left: p.left, top: p.top, transform: "translate(-50%,-100%)" }}>
          <Ic.Pin size={22} />
        </span>
      ))}
      <div
        style={{
          position: "absolute",
          left: 12,
          bottom: 12,
          background: C.white,
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 2px 4px rgba(45,51,63,0.2)",
        }}
      >
        <button
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 36,
            height: 36,
            border: "none",
            background: C.white,
            cursor: "pointer",
          }}
        >
          <Ic.Plus />
        </button>
        <div style={{ height: 1, background: C.ashLighter }} />
        <button
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 36,
            height: 36,
            border: "none",
            background: C.white,
            cursor: "pointer",
          }}
        >
          <Ic.Minus />
        </button>
      </div>
      <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 8 }}>
        <button
          style={{
            width: 36,
            height: 36,
            borderRadius: 4,
            border: "none",
            background: C.white,
            boxShadow: "0 2px 4px rgba(45,51,63,0.2)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ic.Compass size={18} />
        </button>
        <button
          style={{
            width: 36,
            height: 36,
            borderRadius: 4,
            border: "none",
            background: C.white,
            boxShadow: "0 2px 4px rgba(45,51,63,0.2)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ic.Expand size={16} />
        </button>
      </div>
      </div>
    </div>
  );
}

/* =============================================================================
   CONCIERGE — a dedicated full-page conversational screen, discovered via
   direct user report + real outerHTML/CSS for both states. This is NOT
   what homepage prompts previously led to (they incorrectly went to
   Search Results) — every prompt click and "Describe your ideal spot"
   now lead here instead.
============================================================================= */

const CONCIERGE_EXAMPLE_PROMPTS = [
  "Find a great place for Italian food.",
  "Show me places with a laid-back, casual vibe.",
  "What restaurants are walkable from here?",
];

/* Real, sourced from the actual populated-state HTML for the first two
   cards (San Sabino, Eataly NYC Downtown - La Pizza & La Pasta); the
   remaining 3 are filled in from the screenshot's visible text since the
   HTML capture didn't include their full detail. priceTier is filled-
   dollar-count out of 4, matching the real "$$$" + one faded "$" pattern
   confirmed in the source CSS (fAwKcPtLqSo-/_3JbEJDrCk58- — solid vs
   #0003 faded). A `null` time slot renders as unavailable (matching the
   real screenshot, where not every restaurant has 5 real openings). */
const CONCIERGE_RESULTS = {
  italian: {
    response: "I found a few great Italian matches for two on August 30 around 1:00 PM—check the restaurant cards below.",
    restaurants: [
      {
        name: "San Sabino",
        rating: "4.7",
        reviews: "670",
        priceTier: 3,
        cuisine: "Contemporary Italian",
        neighborhood: "West Village",
        times: ["12:30 PM", "12:45 PM", "1:00 PM", "1:15 PM", "1:30 PM"],
        summary: "Playful contemporary Italian-American seafood, including shrimp parm and pasta alle vongole.",
        premium: true,
      },
      {
        name: "La Bella Vita",
        rating: "4.4",
        reviews: "287",
        priceTier: 2,
        cuisine: "Italian",
        neighborhood: "Little Italy",
        times: [null, "12:15 PM", "12:30 PM", "12:45 PM", "1:00 PM"],
        summary: "Classic Little Italy spot with homemade pasta, seafood, and brick-oven pizza.",
        premium: false,
      },
      {
        name: "Locanda Verde Tribeca",
        rating: "4.7",
        reviews: "2,507",
        priceTier: 3,
        cuisine: "Italian",
        neighborhood: "TriBeCa",
        times: ["10:00 PM", "10:15 PM", null, "11:15 PM", "11:30 PM"],
        summary: "Bustling TriBeCa Italian taverna known for urban Italian cooking.",
        premium: false,
      },
      {
        name: "Eataly NYC Downtown - La Pizza & La Pasta",
        rating: "4.7",
        reviews: "1,996",
        priceTier: 3,
        cuisine: "Pizzeria",
        neighborhood: "Financial District",
        times: [null, "12:15 PM", null, "12:45 PM", "1:15 PM"],
        summary: "Eataly Downtown destination for Neapolitan pizza and handcrafted pasta.",
        premium: false,
      },
      {
        name: "Eataly NYC Downtown - La Piazza",
        rating: "4.5",
        reviews: "333",
        priceTier: 3,
        cuisine: "Italian",
        neighborhood: "Financial District",
        times: [null, null, null, "12:45 PM", "1:15 PM"],
        summary: "Laid-back Eataly gathering place for Italian plates, wine, and aperitivo.",
        premium: false,
      },
    ],
    followUps: ["Which one feels most romantic?", "Any with outdoor seating?", "What about something more casual?"],
  },
  default: {
    response: "Here are a few spots that could be a great fit — take a look below.",
    restaurants: [
      {
        name: "Gramercy Tavern",
        rating: "4.8",
        reviews: "5,423",
        priceTier: 4,
        cuisine: "American",
        neighborhood: "Flatiron",
        times: ["6:00 PM", "6:15 PM", "6:30 PM", "7:00 PM", "7:15 PM"],
        summary: "New American cooking in a warm, wood-beamed dining room.",
        premium: true,
      },
      {
        name: "Carbone",
        rating: "4.9",
        reviews: "4,902",
        priceTier: 4,
        cuisine: "Italian",
        neighborhood: "Greenwich Village",
        times: ["9:00 PM", "9:15 PM", "9:30 PM", null, null],
        summary: "Retro red-sauce Italian-American classics in a lively supper-club setting.",
        premium: false,
      },
    ],
    followUps: ["Something more casual?", "What's good for a birthday?", "Any with a view?"],
  },
};

function getConciergeResult(query) {
  const q = query.toLowerCase();
  if (q.includes("italian")) return CONCIERGE_RESULTS.italian;
  return CONCIERGE_RESULTS.default;
}

/* Reusable message input — the real component is shared between the
   empty-state top position and the populated-state bottom position,
   just different placeholder text ("Describe what you are looking
   for..." vs "Ask Concierge a question"), confirmed from both HTML
   captures using the identical class set. */
/* Real CSS confirmed: the input's outer wrapper (._3rxNSxPtpu4-) uses the
   exact same padding-box/border-box gradient-border trick (red -> yellow
   -> aqua) already established elsewhere in this file for the CTA
   button and PromptCard — not a plain grey 1px border like the first
   pass here used. The CSS literally specifies a 4px border-radius on
   that wrapper, which conflicts with the screenshot showing a clearly
   pill-shaped gradient border tracing a rounded input — likely because
   that 4px value belongs to a different context than this specific
   pill variant. Trusting the direct screenshot evidence over that one
   extracted value here, matching the established pattern in this
   project of preferring visual evidence when it conflicts with
   uncertain CSS attribution. */
function ConciergeInput({ value, onChange, onSend, placeholder, autoFocus }) {
  const canSend = value.trim().length > 0;
  return (
    <div
      style={{
        position: "relative",
        borderRadius: 9999,
        border: "1px solid transparent",
        background: `linear-gradient(${C.white}, ${C.white}) padding-box, linear-gradient(90deg, ${C.aiRed} 0%, ${C.aiYellow} 49.52%, ${C.aiAqua} 100%) border-box`,
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
        display: "flex",
        maxWidth: 748,
        width: "100%",
        margin: "0 auto",
        boxSizing: "border-box",
      }}
    >
      {/* Inline styles can't target ::placeholder, so this class +
          injected rule is needed to make just the placeholder regular
          weight while typed text stays 500 (medium) — was using the
          same fontWeight:500 for both, which read as bold for the
          placeholder specifically. */}
      <style>{`
        .concierge-input-textarea::placeholder { font-weight: 400; }
      `}</style>
      <textarea
        value={value}
        autoFocus={autoFocus}
        className="concierge-input-textarea"
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (canSend) onSend();
          }
        }}
        placeholder={placeholder}
        rows={1}
        style={{
          width: "100%",
          height: 24,
          resize: "none",
          border: "none",
          margin: "12px 64px 12px 20px",
          outline: "none",
          lineHeight: "24px",
          fontSize: 16,
          fontWeight: 500,
          color: C.ashDark,
          fontFamily: FONT,
          boxSizing: "border-box",
          background: "transparent",
        }}
      />
      <button
        onClick={() => canSend && onSend()}
        aria-label="Send message"
        style={{
          height: 32,
          width: 32,
          border: "none",
          background: canSend ? C.red : C.ashLighter,
          borderRadius: "50%",
          position: "absolute",
          bottom: 0,
          right: 0,
          margin: "8px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: canSend ? "pointer" : "default",
        }}
      >
        <Ic.ArrowUp size={20} color={C.white} />
      </button>
    </div>
  );
}

/* Restaurant-card-in-chat — real structure confirmed from HTML: photo
   carousel with dot indicators (reusing the same static-dots
   approximation as SearchResultCard, flagged there as a placeholder
   already), optional premium "diamond sparkle" badge, bookmark button,
   name, star+rating+review+price(with faded upper tiers)+cuisine+
   neighborhood meta line, 5 time slots (real TimeSlotPill, with null
   entries rendering as unavailable/greyed — matching the real page not
   every restaurant having 5 real openings), and an AI "match relevance"
   line using the same real sparkle icon already sourced elsewhere in
   this file, in a tinted background box (background-inset — ashLightest). */
function ConciergeRestaurantCard({ r, onNavigate, index = 0 }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        gap: 16,
        padding: 16,
        border: `1px solid ${C.ashLighter}`,
        borderRadius: 8,
        marginBottom: 16,
        transition: "box-shadow .3s, transform .3s",
        boxShadow: hovered ? "0 2px 4px rgba(45,51,63,0.2)" : "none",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
      }}
    >
      <div style={{ position: "relative", flexShrink: 0 }}>
        <ImagePlaceholder width={106} height={106} radius={4} label="[photo]" src={restaurantPhoto(index)} alt={r.name} />
        <div style={{ position: "absolute", bottom: 6, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 3 }}>
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: i === 0 ? C.white : "rgba(255,255,255,0.5)" }} />
          ))}
        </div>
        {r.premium && (
          <span
            style={{
              position: "absolute",
              top: 6,
              left: 6,
              background: C.white,
              borderRadius: 4,
              padding: "2px 6px",
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Ic.DiamondSparkle size={12} color={C.ashDark} />
          </span>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
          <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: C.ashDark, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {r.name}
          </h4>
          <button
            aria-label="Save restaurant to favorites"
            style={{ flexShrink: 0, background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}
          >
            <Ic.Bookmark size={20} color={C.ashDark} />
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8, fontSize: 14, flexWrap: "wrap", color: C.ashDark }}>
          <Ic.Star size={14} />
          <span>{r.rating}</span>
          <span>({r.reviews})</span>
          <span>•</span>
          <span>
            {"$".repeat(r.priceTier)}
            <span style={{ color: "#0003" }}>{"$".repeat(4 - r.priceTier)}</span>
          </span>
          <span>•</span>
          <span>{r.cuisine}</span>
          <span>•</span>
          <span>{r.neighborhood}</span>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
          {r.times.map((t, i) =>
            t ? (
              <span key={i} onClick={() => onNavigate("booking")}>
                <TimeSlotPill time={t} />
              </span>
            ) : (
              <span
                key={i}
                style={{
                  width: 70,
                  height: 32,
                  lineHeight: "32px",
                  textAlign: "center",
                  background: C.ashLightest,
                  color: C.ash,
                  borderRadius: 4,
                  fontSize: 12,
                  display: "inline-block",
                }}
              >
                —
              </span>
            )
          )}
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "flex-start", background: C.ashLightest, borderRadius: 4, padding: "4px 8px 4px 4px", fontSize: 13, color: C.ashDark }}>
          <Ic.Sparkle size={16} color={C.ashDark} />
          {r.summary}
        </div>
      </div>
    </div>
  );
}

function ConciergeScreen({ initialQuery, onNavigate }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [feedback, setFeedback] = useState({});
  const startedRef = useRef(false);
  const scrollRef = useRef(null);

  function sendMessage(text) {
    if (!text || !text.trim()) return;
    setInputValue("");
    setLoading(true);
    setTimeout(() => {
      const result = getConciergeResult(text);
      setMessages((prev) => [...prev, { query: text, ...result }]);
      setLoading(false);
    }, 1800);
  }

  useEffect(() => {
    if (initialQuery && !startedRef.current) {
      startedRef.current = true;
      sendMessage(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const isEmpty = messages.length === 0 && !loading;

  return (
    <div style={{ fontFamily: FONT, minHeight: "100vh", background: C.white, display: "flex", flexDirection: "column" }}>
      <Header onNavigate={onNavigate} />

      {/* Real heading: "Concierge" + "AI Beta" badge, confirmed exact
          from HTML. Gradient ambient background behind it in the real
          page is a 4-layer animated crossfade (9s cycle) — simplified
          here to a single static gradient wash, flagged as a
          deliberate simplification rather than the full effect. */}
      <div
        style={{
          position: "relative",
          padding: "20px 16px 8px",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, #fdc958 0%, #e15b64 0.01%, #fdc958 0.02%, #3ddbb6 50%, #fdc958 100%)",
            opacity: 0.15,
            pointerEvents: "none",
          }}
        />
        <h1 style={{ position: "relative", margin: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 18, fontWeight: 700, color: C.ashDark }}>
          Concierge
          <span
            style={{
              fontSize: 12,
              fontWeight: 400,
              lineHeight: "12px",
              padding: "2px 4px",
              borderRadius: 4,
              background: C.white,
              color: C.ashDark,
              border: `1px solid ${C.ashLighter}`,
            }}
          >
            AI Beta
          </span>
        </h1>
      </div>

      {isEmpty ? (
        /* EMPTY STATE — real structure: loader-style center icon (static
           here since nothing is loading yet — real page also shows the
           same spinner glyph at rest, just not animating), "Let's find
           the best restaurant for you." heading, input, then 3 real
           example prompts reusing the existing PromptCard (animated
           sweep) component. */
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "16px", maxWidth: 748, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.ash, marginBottom: 8 }}>
            <ConciergeLoader size={32} />
          </div>
          <p style={{ margin: "0 0 24px", fontSize: 24, lineHeight: "28px", fontWeight: 700, color: C.ashDark, textAlign: "center" }}>
            Let's find the best restaurant for you.
          </p>
          <ConciergeInput
            value={inputValue}
            onChange={setInputValue}
            onSend={() => sendMessage(inputValue)}
            placeholder="Describe what you are looking for..."
            autoFocus
          />
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16, marginTop: 32 }}>
            {CONCIERGE_EXAMPLE_PROMPTS.map((p, i) => (
              <PromptCard key={p} text={p} index={i} onClick={() => sendMessage(p)} />
            ))}
          </div>
        </div>
      ) : (
        /* POPULATED STATE — chat feed (user bubble, AI text, restaurant
           cards, real thumbs feedback, follow-up chips reusing the same
           real PromptCard sweep component — the follow-ups weren't in
           the captured HTML, flagged earlier as inferred placement)
           followed by the same real input pinned at the bottom. */
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
          <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "16px", maxWidth: 748, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>
            {messages.map((m, mi) => (
              <div key={mi} style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
                <p
                  style={{
                    margin: 0,
                    color: C.ashDark,
                    padding: "8px 12px",
                    borderRadius: 8,
                    background: C.ashLightest,
                    lineHeight: "24px",
                    fontWeight: 400,
                    fontSize: 16,
                    maxWidth: "70%",
                    width: "fit-content",
                    alignSelf: "flex-end",
                    wordBreak: "break-word",
                  }}
                >
                  {m.query}
                </p>
                <p style={{ margin: 0, lineHeight: "24px", fontWeight: 400, fontSize: 16, color: C.ashDark, whiteSpace: "pre-wrap" }}>{m.response}</p>
                <div>
                  {m.restaurants.map((r, i) => (
                    <ConciergeRestaurantCard key={r.name} r={r} onNavigate={onNavigate} index={i} />
                  ))}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => setFeedback((f) => ({ ...f, [mi]: "up" }))}
                    aria-label="Good response"
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}
                  >
                    <Ic.ThumbsUp size={16} color={feedback[mi] === "up" ? C.red : C.ashDark} />
                  </button>
                  <button
                    onClick={() => setFeedback((f) => ({ ...f, [mi]: "down" }))}
                    aria-label="Poor response"
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}
                  >
                    <Ic.ThumbsDown size={16} color={feedback[mi] === "down" ? C.red : C.ashDark} />
                  </button>
                </div>
                {mi === messages.length - 1 && !loading && m.followUps && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                    {m.followUps.map((f, i) => (
                      <PromptCard key={f} text={f} index={i} onClick={() => sendMessage(f)} />
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.ash, padding: "8px 0" }}>
                <ConciergeLoader size={32} />
                <span style={{ fontSize: 14 }}>Prepping a response...</span>
              </div>
            )}
          </div>
          <div style={{ padding: "16px", flexShrink: 0 }}>
            <ConciergeInput value={inputValue} onChange={setInputValue} onSend={() => sendMessage(inputValue)} placeholder="Ask Concierge a question" />
          </div>
        </div>
      )}
    </div>
  );
}

function SearchResultsScreen({ savedGoal, onNavigate }) {
  const goal = savedGoal ? GOALS.find((g) => g.id === savedGoal.goalId) : null;
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [sort, setSort] = useState("Featured");
  const [goalFilterChecked, setGoalFilterChecked] = useState(false);
  const [featuredHovered, setFeaturedHovered] = useState(false);
  const [filterHovered, setFilterHovered] = useState(false);
  const searchTerm = "italian";

  return (
    <div style={{ fontFamily: FONT, minHeight: "100vh", background: C.white }}>
      <Header onNavigate={onNavigate} />
      <SearchTopBar query={searchTerm} onSearch={() => {}} />

      {/* Quick-filter row REBUILT: "Featured" sort trigger now includes
          its chevron as real inline content (was an absolutely-
          positioned overlay that visually crowded the label). Featured
          pill + filter icon are now a FIXED left section — they no
          longer scroll away with the category pills, which was wrong
          before (everything shared one scroll container). A vertical
          divider separates the fixed section from the scrollable one.
          Category pills now use the real ScrollCarousel component
          (arrow-driven, no visible scrollbar) instead of a plain
          overflow-x row — matches the "carousel, not a scrollbar"
          requirement already established for the other two carousels
          on the homepage. Featured/Filter buttons now carry the same
          real hover treatment as QuickFilterPill (red ring shadow). */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "16px 24px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ position: "relative", flexShrink: 0 }}>
            <button
              onClick={() => setSortOpen((s) => !s)}
              onMouseEnter={() => setFeaturedHovered(true)}
              onMouseLeave={() => setFeaturedHovered(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 12px 8px 14px",
                borderRadius: 9999,
                border: `1.5px solid ${C.red}`,
                background: featuredHovered ? C.redLightest : C.white,
                color: C.red,
                fontSize: 14,
                fontWeight: 500,
                whiteSpace: "nowrap",
                cursor: "pointer",
                fontFamily: FONT,
                transition: "background .2s",
              }}
            >
              Featured
              <Ic.ChevronDown size={14} color={C.red} />
            </button>
            {sortOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 4px)",
                  left: 0,
                  background: C.white,
                  border: `1px solid ${C.ashLighter}`,
                  borderRadius: 4,
                  boxShadow: "0 2px 4px rgba(45,51,63,0.2)",
                  minWidth: 220,
                  zIndex: 30,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 16px",
                    borderBottom: `1px solid ${C.ashLighter}`,
                  }}
                >
                  <span style={{ fontSize: 14, fontWeight: 700, color: C.ashDark }}>Sort</span>
                  <button
                    onClick={() => setSortOpen(false)}
                    aria-label="Close"
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}
                  >
                    <Ic.Close size={16} />
                  </button>
                </div>
                {/* All options normalized to the same styling — "Best
                    match for your goal" was previously given red/bold
                    treatment for no real reason; it's just another sort
                    option, not something that needs to be emphasized
                    over the rest. */}
                {[...SORT_OPTIONS, ...(goal ? ["Best match for your goal"] : [])].map((opt) => (
                  <div
                    key={opt}
                    onClick={() => {
                      setSort(opt);
                      setSortOpen(false);
                    }}
                    style={{
                      padding: "10px 16px",
                      fontSize: 14,
                      color: C.ashDark,
                      fontWeight: 400,
                      cursor: "pointer",
                      background: sort === opt ? C.ashLightest : C.white,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setFilterOpen(true)}
            onMouseEnter={() => setFilterHovered(true)}
            onMouseLeave={() => setFilterHovered(false)}
            aria-label="Filters"
            style={{
              flexShrink: 0,
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: `1px solid ${filterHovered ? C.red : C.ashLighter}`,
              background: C.white,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "border-color .2s",
            }}
          >
            <Ic.Filter size={16} color={filterHovered ? C.red : C.ashDark} />
          </button>

          <div style={{ width: 1, height: 24, background: C.ashLighter, flexShrink: 0 }} />

          <div style={{ flex: 1, minWidth: 0 }}>
            <ScrollCarousel step={400}>
              {QUICK_FILTERS.map((label) => (
                <QuickFilterPill
                  key={label}
                  label={label}
                  active={label.toLowerCase() === searchTerm}
                  icon={
                    label === "Romantic" ? (
                      <Ic.Heart size={14} color={label.toLowerCase() === searchTerm ? C.red : C.ashDark} />
                    ) : (
                      <Ic.Cuisine size={14} color={label.toLowerCase() === searchTerm ? C.red : C.ashDark} />
                    )
                  }
                  onClick={() => {}}
                />
              ))}
            </ScrollCarousel>
          </div>
        </div>
      </div>

      {/* Two-column layout: result list + map. Heading/count moved INTO
          this row (was previously above it, full-width) so the map's
          top edge aligns with the "You searched for..." line, not the
          quick-filter row above it. "How are Featured results ranked"
          is right-aligned via justify-content:space-between — but that
          space-between now resolves within the LIST COLUMN's own width
          (this row lives inside the flex:'1 1 600px' column below, not
          the full 1280px row), so it right-aligns against the list
          column's right edge, not the page's — matching "right-aligned
          in the list column only, not the map's column." My earlier
          "move to the left" fix misread this as left-aligning the text
          itself rather than correctly scoping the container. */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 24px 40px", display: "flex", gap: 32 }}>
        <div style={{ flex: "1 1 600px", minWidth: 0 }}>
          <h1 style={{ margin: "0 0 4px", fontSize: 28, lineHeight: "34px", fontWeight: 700, color: C.ashDark }}>
            You searched for "{searchTerm}" in New York City
          </h1>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
            <p style={{ margin: 0, ...type.bodyMedium, color: C.ash }}>
              {SEARCH_RESULTS.length * 100 + 31} restaurants match "{searchTerm}"
            </p>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: C.ash, cursor: "pointer" }}>
              How are Featured results ranked
              <Ic.InfoCircle size={14} />
            </span>
          </div>
          {SEARCH_RESULTS.map((r, i) => (
            <SearchResultCard key={r.name} r={r} goal={goal} onNavigate={onNavigate} index={i} />
          ))}
        </div>
        <div style={{ flex: "1 1 420px", display: "none", minWidth: 0 }} className="search-map-column">
          <MapPlaceholder />
        </div>
        <style>{`
          @media (min-width: 900px) {
            .search-map-column { display: block !important; }
          }
        `}</style>
      </div>

      {/* Filter modal — reuses GoalModal-style chrome; only Special features
          is expanded per deliverable-plan §5 ("every state" not required) */}
      {filterOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(20,26,38,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            fontFamily: FONT,
          }}
          onClick={() => setFilterOpen(false)}
        >
          {/* Restructured into three parts: fixed header (title+close),
              scrollable middle (the filter sections), and a sticky
              footer with Apply/Reset — the "Show results" button was
              previously INSIDE the scrollable area, so it could
              disappear from view depending on scroll position. */}
          <div
            style={{
              width: 480,
              maxWidth: "calc(100vw - 48px)",
              maxHeight: "calc(100vh - 64px)",
              display: "flex",
              flexDirection: "column",
              background: C.white,
              borderRadius: 8,
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: "32px 32px 0", flexShrink: 0 }}>
              <button
                onClick={() => setFilterOpen(false)}
                aria-label="Close"
                style={{ position: "absolute", top: 24, right: 24, background: "none", border: "none", cursor: "pointer", fontFamily: FONT }}
              >
                <Ic.Close />
              </button>
              <h2 style={{ margin: "0 0 20px", ...type.titleMedium, color: C.ashDark, paddingRight: 32 }}>Filters</h2>
            </div>

            <div style={{ overflowY: "auto", padding: "0 32px" }}>
              {["Price", "Experiences", "Seating Options", "Neighborhoods", "Award-winning", "Top Rated"].map((s) => (
                <div
                  key={s}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "14px 0",
                    borderBottom: `1px solid ${C.ashLighter}`,
                    color: C.ashDark,
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                >
                  {s}
                  <Ic.ChevronRight />
                </div>
              ))}

              <div style={{ padding: "16px 0" }}>
                <h3 style={{ margin: "0 0 12px", ...type.titleSmall, color: C.ashDark }}>Special features</h3>
                {["Healthy", "Vegan-friendly", "Vegetarian-friendly"].map((f) => (
                  <label key={f} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, cursor: "pointer" }}>
                    <Checkbox checked={false} />
                    <span style={{ ...type.bodyLarge, color: C.ashDark }}>{f}</span>
                  </label>
                ))}
                {goal && (
                  <label
                    onClick={() => setGoalFilterChecked((c) => !c)}
                    style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
                  >
                    <Checkbox checked={goalFilterChecked} />
                    <span style={{ ...type.bodyLarge, color: C.ashDark }}>Goal-aligned</span>
                  </label>
                )}
              </div>

              {["Accessibility"].map((s) => (
                <div
                  key={s}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "14px 0",
                    borderTop: `1px solid ${C.ashLighter}`,
                    borderBottom: `1px solid ${C.ashLighter}`,
                    color: C.ashDark,
                    fontSize: 16,
                    fontWeight: 600,
                  }}
                >
                  {s}
                  <Ic.ChevronRight />
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 12, padding: "20px 32px", flexShrink: 0, borderTop: `1px solid ${C.ashLighter}` }}>
              <button
                onClick={() => setGoalFilterChecked(false)}
                style={{
                  flex: 1,
                  padding: "14px 0",
                  background: C.white,
                  color: C.ashDark,
                  border: `1px solid ${C.ashLighter}`,
                  borderRadius: 4,
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: FONT,
                }}
              >
                Reset
              </button>
              <button
                onClick={() => setFilterOpen(false)}
                style={{
                  flex: 1,
                  padding: "14px 0",
                  background: C.red,
                  color: C.white,
                  border: "none",
                  borderRadius: 4,
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: FONT,
                }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   BOOKING CONFIRMATION — two-column layout per §4.10; adds the goal-
   alignment micro-toggle as a sibling to "Select an occasion", per PRD
   §9's "reinforcement, not a new screen" note (built as its own screen
   here only because the deliverable outline lists it separately).
--------------------------------------------------------------------------- */
function BookingScreen({ savedGoal, onNavigate }) {
  const goal = savedGoal ? GOALS.find((g) => g.id === savedGoal.goalId) : null;
  const [goalAligned, setGoalAligned] = useState(null);
  const [emailOptIn, setEmailOptIn] = useState(false);

  return (
    <div style={{ fontFamily: FONT, minHeight: "100vh", background: C.ashLightest }}>
      <Header onNavigate={onNavigate} />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px", display: "flex", gap: 48 }}>
        <div style={{ flex: 1, maxWidth: 680 }}>
          {/* Real 3-step progress stepper, confirmed from the actual page
              markup — was entirely missing before. The real markup
              confirms the first 2 dots use a distinct "completed" CSS
              class from the 3rd/current dot (which also carries
              aria-current="step"), but the actual visual distinction
              between those two classes wasn't resolvable from HTML
              alone (no matching CSS was available). Simplified here to
              3 identical solid-red segments — a reasonable stand-in for
              "fully progressed to the final step," not a claim that the
              real page renders completed vs. current identically. */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: 4,
                  borderRadius: 2,
                  background: C.red,
                }}
              />
            ))}
          </div>

          <h1 style={{ margin: "0 0 20px", ...type.titleMedium, color: C.ashDark }}>You're almost done!</h1>

          {/* Real structure: 160x160 photo (was 72x72), restaurant name as
              a real link, and THREE separate icon+text rows (calendar/
              clock/person — real icons, already sourced elsewhere in this
              file) instead of one plain "·"-separated text line. */}
          <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
            <ImagePlaceholder width={160} height={160} radius={4} label="[restaurant photo]" src={restaurantPhoto(0)} alt="Gran Morsi" />
            <div>
              <h2 style={{ margin: "0 0 8px", ...type.titleSmall, color: C.red, cursor: "pointer" }}>Gran Morsi</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Ic.Calendar size={18} color={C.ashDark} />
                  <span style={{ fontSize: 14, color: C.ashDark }}>Fri, Aug 28</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Ic.Clock size={18} color={C.ashDark} />
                  <span style={{ fontSize: 14, color: C.ashDark }}>8:00 PM</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Ic.Person size={18} color={C.ashDark} />
                  <span style={{ fontSize: 14, color: C.ashDark }}>2 people (Standard seating)</span>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              background: "#e8f3f6",
              borderRadius: 4,
              padding: "12px 16px",
              marginBottom: 20,
              fontSize: 14,
              color: C.ashDark,
            }}
          >
            We're holding this table for you for <strong>4:56 minutes</strong>
          </div>

          {/* Real: "Add a special menu" is an actual button with the
              real filled plus icon (icPlus), not inline "+" text. */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 24 }}>
            <p style={{ margin: 0, fontSize: 14, color: C.ashDark }}>
              Change your mind and want a special menu? It's not too late
            </p>
            <button
              style={{
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                background: "none",
                border: `1px solid ${C.ashLighter}`,
                borderRadius: 4,
                fontSize: 14,
                fontWeight: 600,
                color: C.ashDark,
                cursor: "pointer",
                fontFamily: FONT,
                whiteSpace: "nowrap",
              }}
            >
              <Ic.PlusFilled size={16} color={C.ashDark} />
              Add a special menu
            </button>
          </div>

          {/* Real icPoints icon (diamond/gem shape) — was incorrectly
              using the gift/Reward icon here before. */}
          <h3 style={{ margin: "0 0 8px", ...type.titleSmall, color: C.ashDark }}>OpenTable Regulars</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
            <Ic.Points size={20} color={C.ashDark} />
            <span style={{ fontSize: 14, color: C.ashDark }}>100 points to be earned on this reservation.</span>
          </div>

          <h3 style={{ margin: "0 0 12px", ...type.titleSmall, color: C.ashDark }}>Diner details</h3>
          <p style={{ margin: "0 0 16px", fontSize: 14, color: C.ashDark }}>
            Gaurav Agarwal (<span style={{ color: C.red, cursor: "pointer" }}>Not Gaurav?</span>)
          </p>

          {/* Real phone field includes a country-code affordance (the
              real page has a full country-select dropdown here) — kept
              simplified rather than replicating the entire country
              list, but now visually indicates the prefix exists rather
              than looking like a plain text input. */}
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1, display: "flex", border: `1px solid ${C.ashLighter}`, borderRadius: 4, overflow: "hidden" }}>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0 12px",
                  background: C.ashLightest,
                  color: C.ash,
                  fontSize: 14,
                  borderRight: `1px solid ${C.ashLighter}`,
                }}
              >
                AU +61
              </span>
              <input
                readOnly
                value="0412345678"
                style={{ flex: 1, padding: "12px 14px", border: "none", fontSize: 16, fontFamily: FONT, boxSizing: "border-box" }}
              />
            </div>
            <input
              readOnly
              value="gauravagarwal@clowmail.com"
              style={{ flex: 1, padding: "12px 14px", border: `1px solid ${C.ashLighter}`, borderRadius: 4, fontSize: 16, fontFamily: FONT, background: C.ashLightest, color: C.ash, boxSizing: "border-box" }}
            />
          </div>

          {/* Real occasion options — was missing "Business Meal" and
              "Celebration". Special request is a real textarea
              (maxlength 75, real placeholder), not a plain input. */}
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <select
              defaultValue=""
              style={{ flex: 1, padding: "12px 14px", border: `1px solid ${C.ashLighter}`, borderRadius: 4, fontSize: 16, fontFamily: FONT, color: C.ash, background: C.white }}
            >
              <option value="" disabled>
                Select an occasion (optional)
              </option>
              <option>Birthday</option>
              <option>Anniversary</option>
              <option>Date night</option>
              <option>Business Meal</option>
              <option>Celebration</option>
            </select>
            <textarea
              placeholder="Add a special request (optional)"
              maxLength={75}
              rows={1}
              style={{
                flex: 1,
                padding: "12px 14px",
                border: `1px solid ${C.ashLighter}`,
                borderRadius: 4,
                fontSize: 16,
                fontFamily: FONT,
                resize: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Goal-alignment micro-toggle — this is this exercise's own
              addition (PRD §9D), not a real OpenTable field; no
              equivalent exists on the real page. Rebuilt as Option A
              from direct discussion: a Yes/No segmented pill pair
              instead of a single checkbox, reusing the exact same
              selected-pill treatment already established by FilterPill
              elsewhere (2px red border, no fill) rather than inventing
              a new selection pattern for this one field. goalAligned is
              now tri-state (null/true/false) instead of a plain
              boolean, since "unanswered" and "explicitly said no" are
              meaningfully different states with two buttons, unlike a
              single checkbox where they'd look identical. */}
          {goal && (
            <div style={{ marginBottom: 16, padding: "12px 14px", border: `1px solid ${C.ashLighter}`, borderRadius: 4 }}>
              <p style={{ margin: "0 0 10px", fontSize: 14, color: C.ashDark }}>
                Does this reservation fit your {goal.label.toLowerCase()} goal?
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => setGoalAligned(true)}
                  style={{
                    padding: "8px 20px",
                    borderRadius: 4,
                    border: goalAligned === true ? `2px solid ${C.red}` : `1px solid ${C.ashLighter}`,
                    background: C.white,
                    color: C.ashDark,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: FONT,
                  }}
                >
                  Yes
                </button>
                <button
                  onClick={() => setGoalAligned(false)}
                  style={{
                    padding: "8px 20px",
                    borderRadius: 4,
                    border: goalAligned === false ? `2px solid ${C.red}` : `1px solid ${C.ashLighter}`,
                    background: C.white,
                    color: C.ashDark,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: FONT,
                  }}
                >
                  Not this time
                </button>
              </div>
            </div>
          )}

          <label
            onClick={() => setEmailOptIn((v) => !v)}
            style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, cursor: "pointer" }}
          >
            <Checkbox checked={emailOptIn} />
            <span style={{ fontSize: 14, color: C.ashDark }}>
              Sign me up to receive dining offers and news from this restaurant by email.
            </span>
          </label>

          <button
            onClick={() => onNavigate("home")}
            style={{
              width: "100%",
              padding: "14px 0",
              background: C.red,
              color: C.white,
              border: "none",
              borderRadius: 4,
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: FONT,
            }}
          >
            Complete reservation
          </button>

          <p style={{ margin: "16px 0 0", ...type.bodySmall, color: C.ash }}>
            By clicking "Complete reservation" you agree to the{" "}
            <span style={{ color: C.red, cursor: "pointer" }}>OpenTable Terms of Use</span> and{" "}
            <span style={{ color: C.red, cursor: "pointer" }}>Privacy Policy</span>.
          </p>
        </div>

        <div style={{ width: 320, flexShrink: 0 }}>
          <h3 style={{ margin: "0 0 8px", ...type.titleSmall, color: C.ashDark }}>A note from the restaurant</h3>
          {/* Real restaurant policy text, verbatim, including the
              specific contact email — was previously paraphrased and
              dropped the email address entirely. */}
          <p style={{ margin: 0, ...type.bodyMedium, color: C.ash }}>
            Thank you for your reservation! If you have any questions or concerns, please reach out to us directly
            at info@granmorsi.com. We look forward to seeing you soon!
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   TOAST
--------------------------------------------------------------------------- */
function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div
      style={{
        position: "fixed",
        bottom: 32,
        left: "50%",
        transform: "translateX(-50%)",
        background: C.ashDarker,
        color: C.white,
        padding: "14px 24px",
        borderRadius: 4,
        fontSize: 14,
        fontFamily: FONT,
        boxShadow: "0 4px 4px rgba(0,0,0,0.15)",
        zIndex: 60,
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      <Ic.Check size={16} color={C.white} />
      {message}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   ROOT
--------------------------------------------------------------------------- */
export default function App() {
  const [screen, setScreen] = useState("home");
  const [modalOpen, setModalOpen] = useState(false);
  // Default goal pre-selected on load ("More protein", the modal's default
  // stepper frequency of 5/month) so Dashboard, Activity log, Homepage,
  // Search results, and Booking confirmation all show goal-relevant
  // content by default instead of their empty/no-goal states. Still
  // fully editable via the Goal-setup modal as before.
  const [savedGoal, setSavedGoal] = useState({ goalId: "protein", frequency: 5 });
  const [toast, setToast] = useState(false);
  // Concierge is a screen state like any other (not a real page
  // navigation/new tab, per direct instruction) — reachable ONLY via
  // prompt clicks / "Describe your ideal spot" on the homepage, no
  // explicit header entry point. conciergeQuery carries the clicked
  // prompt's text so ConciergeScreen can auto-send it on arrival;
  // reset to null when leaving so a fresh visit starts at the empty
  // state instead of replaying the last query.
  const [conciergeQuery, setConciergeQuery] = useState(null);
  const startConcierge = (text) => {
    setConciergeQuery(text);
    setScreen("concierge");
  };

  return (
    <div>
      {screen === "home" && <HomeScreen savedGoal={savedGoal} onNavigate={setScreen} onStartConcierge={startConcierge} />}
      {screen === "profile" && (
        <ProfilePage savedGoal={savedGoal} onOpenGoalModal={() => setModalOpen(true)} onNavigate={setScreen} />
      )}
      {screen === "dashboard" && (
        <DashboardScreen savedGoal={savedGoal} onNavigate={setScreen} onOpenGoalModal={() => setModalOpen(true)} />
      )}
      {screen === "activity" && <ActivityLogScreen savedGoal={savedGoal} onNavigate={setScreen} />}
      {screen === "settings" && <SettingsScreen savedGoal={savedGoal} onNavigate={setScreen} />}
      {screen === "search" && <SearchResultsScreen savedGoal={savedGoal} onNavigate={setScreen} />}
      {screen === "booking" && <BookingScreen savedGoal={savedGoal} onNavigate={setScreen} />}
      {screen === "concierge" && (
        <ConciergeScreen
          initialQuery={conciergeQuery}
          onNavigate={(s) => {
            setConciergeQuery(null);
            setScreen(s);
          }}
        />
      )}

      {modalOpen && (
        <GoalModal
          initialGoal={savedGoal}
          onClose={() => setModalOpen(false)}
          onSave={(g) => {
            setSavedGoal(g);
            setModalOpen(false);
            setToast(true);
          }}
        />
      )}

      {toast && <Toast message="Nutrition goals saved" onDone={() => setToast(false)} />}
    </div>
  );
}
