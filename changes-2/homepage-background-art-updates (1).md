# Homepage Background Art — Code Updates

Scope: 4 files. Apply as find-and-replace using the exact `OLD` block → `NEW` block pairs below. Each `OLD` block is copied verbatim from the current codebase and is unique within its file, so it's safe to use as a str_replace anchor.

Note on item 1 (animated draw-in SVG icons for the "Book Consultation" cards): **already implemented** in `BookingCategories.jsx` — `KundliWheelIcon`, `PalmistryIcon`, `CareerBriefcaseIcon`, `MarriageRingsIcon`, `MuhuratSunClockIcon`, `VastuCompassIcon` all use framer-motion `pathLength` draw animation with a `key={isHovered ? 'hover' : 'idle'}` remount trick to replay on hover. No changes needed there.

The remaining 3 changes below cover: Rashi box mandala corners, and contextual background art for Testimonials, Contact, and Booking Form (currently all three have flat, undecorated backgrounds).

---

## 1. `src/components/sections/RashiBox.jsx` — add mandala corners

**Why:** matches the same corner-mandala treatment already used in `BookingCategories.jsx`, requested explicitly.

### Edit 1a — add import

```
OLD:
import SectionHeading from '../ui/SectionHeading';

NEW:
import SectionHeading from '../ui/SectionHeading';
import MandalaArt from '../ui/MandalaArt';
```

### Edit 1b — insert mandala elements + open a z-index wrapper

```
OLD:
      <FloatingAstrologyArt primaryColor={colors.primary} />
      <SectionHeading>Daily Horoscope & Rashi</SectionHeading>

NEW:
      <FloatingAstrologyArt primaryColor={colors.primary} />
      <MandalaArt
        variant={2}
        size="550px"
        opacity={0.13}
        style={{ position: 'absolute', top: '-280px', left: '-280px', zIndex: 0, pointerEvents: 'none' }}
      />
      <MandalaArt
        variant={1}
        size="480px"
        opacity={0.1}
        style={{ position: 'absolute', bottom: '-240px', right: '-240px', zIndex: 0, pointerEvents: 'none' }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
      <SectionHeading>Daily Horoscope & Rashi</SectionHeading>
```

> Note: corners are intentionally reversed (top-left/bottom-right) compared to `BookingCategories` (top-right/bottom-left) since these two sections sit back-to-back — keeps the same visual language without looking like a copy-pasted mirror image when scrolling.

### Edit 1c — close the new wrapper div at the end of the section

```
OLD:
        </div>
      </div>
    </section>
  );
};

export default RashiBox;

NEW:
        </div>
      </div>
      </div>
    </section>
  );
};

export default RashiBox;
```

---

## 2. `src/components/sections/Testimonials.jsx` — quote marks + twinkling stars

**Context chosen:** large faint quotation marks in opposite corners (literal "what people say") + a handful of twinkling stars echoing the 5-star ratings already in each card.

### Edit 2a — imports + new background art component

```
OLD:
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import SectionHeading from '../ui/SectionHeading';

const Testimonials = () => {

NEW:
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import SectionHeading from '../ui/SectionHeading';
import MandalaArt from '../ui/MandalaArt';

const QUOTE_MARK_SVG = `<path fill="currentColor" d="M9 7c-3 0-5 2.5-5 6s2 6 5 6h1v-4H9c-1 0-2-1-2-3s1-3 2-3h1V7H9zm10 0c-3 0-5 2.5-5 6s2 6 5 6h1v-4h-1c-1 0-2-1-2-3s1-3 2-3h1V7h-1z"/>`;

const TestimonialStarsAndQuotes = ({ primaryColor = 'var(--color-primary)' }) => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
    <motion.div
      animate={{ opacity: [0.08, 0.18, 0.08], rotate: [0, -4, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      style={{ position: 'absolute', top: '4%', left: '2%', width: 90, height: 90, color: primaryColor }}
    >
      <svg viewBox="0 0 24 24" width="100%" height="100%" dangerouslySetInnerHTML={{ __html: QUOTE_MARK_SVG }} />
    </motion.div>
    <motion.div
      animate={{ opacity: [0.08, 0.18, 0.08], rotate: [0, 4, 0] }}
      transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      style={{ position: 'absolute', bottom: '6%', right: '3%', width: 100, height: 100, color: primaryColor, transform: 'scaleX(-1)' }}
    >
      <svg viewBox="0 0 24 24" width="100%" height="100%" dangerouslySetInnerHTML={{ __html: QUOTE_MARK_SVG }} />
    </motion.div>
    {[
      { top: '15%', left: '30%', size: 14, dur: 3.2 },
      { top: '65%', left: '18%', size: 10, dur: 4 },
      { top: '25%', right: '22%', size: 12, dur: 3.6 },
      { top: '70%', right: '30%', size: 16, dur: 4.4 },
    ].map((star, i) => (
      <motion.span
        key={i}
        animate={{ opacity: [0.15, 0.5, 0.15], scale: [0.8, 1.15, 0.8] }}
        transition={{ duration: star.dur, repeat: Infinity, delay: i * 0.6, ease: 'easeInOut' }}
        style={{ position: 'absolute', top: star.top, left: star.left, right: star.right, fontSize: star.size, color: '#FFD700' }}
      >
        ★
      </motion.span>
    ))}
  </div>
);

const Testimonials = () => {
```

### Edit 2b — split `className="section container"` so the art can bleed full-width, insert the art, open container wrapper

```
OLD:
    <motion.section 
      id="testimonials"
      className="section container"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <SectionHeading>What People Say</SectionHeading>

NEW:
    <motion.section 
      id="testimonials"
      className="section"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      <MandalaArt
        variant={1}
        size="520px"
        opacity={0.1}
        style={{ position: 'absolute', top: '-260px', right: '-260px', zIndex: 0, pointerEvents: 'none' }}
      />
      <TestimonialStarsAndQuotes primaryColor="var(--color-primary)" />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
      <SectionHeading>What People Say</SectionHeading>
```

> Why split `.section` from `.container`: `.container` caps width at 1200px and centers it. When it's combined on the same element as `.section`, any absolutely-positioned background decoration gets boxed into that same 1200px column instead of being able to sit closer to the true section edges. Splitting them (outer = full-width `.section`, inner = `.container` holding the actual content) is the same pattern `BookingCategories.jsx` already uses.

### Edit 2c — close the new container wrapper

```
OLD:
      </motion.div>
    </motion.section>
  );
};

export default Testimonials;

NEW:
      </motion.div>
      </div>
    </motion.section>
  );
};

export default Testimonials;
```

---

## 3. `src/components/sections/ContactDetails.jsx` — signal-ping rings

**Context chosen:** expanding concentric rings (like a call/WhatsApp ping) since Phone/WhatsApp is the primary CTA here — reads as "reaching out," not generic decoration.

### Edit 3a — imports + new background art component

```
OLD:
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import SectionHeading from '../ui/SectionHeading';
import { Phone, Mail, MapPin } from 'lucide-react';

NEW:
import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import SectionHeading from '../ui/SectionHeading';
import MandalaArt from '../ui/MandalaArt';
import { Phone, Mail, MapPin } from 'lucide-react';

const ContactSignalArt = ({ primaryColor = 'var(--color-primary)' }) => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
    {[0, 1, 2].map((i) => (
      <motion.div
        key={`ping-a-${i}`}
        animate={{ scale: [1, 2.2], opacity: [0.35, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: i * 1.3, ease: 'easeOut' }}
        style={{ position: 'absolute', top: '18%', left: '8%', width: 140, height: 140, borderRadius: '50%', border: `2px solid ${primaryColor}` }}
      />
    ))}
    {[0, 1, 2].map((i) => (
      <motion.div
        key={`ping-b-${i}`}
        animate={{ scale: [1, 2.2], opacity: [0.3, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, delay: 1 + i * 1.3, ease: 'easeOut' }}
        style={{ position: 'absolute', bottom: '14%', right: '6%', width: 120, height: 120, borderRadius: '50%', border: `2px solid ${primaryColor}` }}
      />
    ))}
  </div>
);
```

### Edit 3b — split `.section .section--alt .container`, insert art, open container wrapper

```
OLD:
    <section id="contact" className="section section--alt container">
      <SectionHeading>Contact Us</SectionHeading>

NEW:
    <section id="contact" className="section section--alt" style={{ position: 'relative', overflow: 'hidden' }}>
      <MandalaArt
        variant={2}
        size="500px"
        opacity={0.1}
        style={{ position: 'absolute', top: '-250px', left: '-250px', zIndex: 0, pointerEvents: 'none' }}
      />
      <ContactSignalArt primaryColor={colors.primary} />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
      <SectionHeading>Contact Us</SectionHeading>
```

### Edit 3c — close the new container wrapper

```
OLD:
        </motion.div>
      </div>
    </section>
  );
};

export default ContactDetails;

NEW:
        </motion.div>
      </div>
      </div>
    </section>
  );
};

export default ContactDetails;
```

---

## 4. `src/components/sections/BookingForm.jsx` — clock + calendar motif

**Context chosen:** a slowly rotating clock outline + a gently floating calendar outline, since this section is literally "Schedule Your Session." Reuses the same ambient, low-opacity treatment as the other sections for visual consistency.

### Edit 4a — import + new background art component

```
OLD:
import { OmIcon, StarMapIcon } from '../ui/Icons';
import { motion, AnimatePresence } from 'framer-motion';

const BookingForm = () => {

NEW:
import { OmIcon, StarMapIcon } from '../ui/Icons';
import { motion, AnimatePresence } from 'framer-motion';
import MandalaArt from '../ui/MandalaArt';

const BookingFormOrbitArt = ({ primaryColor = 'var(--color-primary)' }) => (
  <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      style={{ position: 'absolute', top: '10%', right: '6%', width: 160, height: 160, color: primaryColor, opacity: 0.1 }}
    >
      <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    </motion.div>
    <motion.div
      animate={{ y: [0, -14, 0], opacity: [0.08, 0.16, 0.08] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      style={{ position: 'absolute', bottom: '8%', left: '5%', width: 120, height: 120, color: primaryColor }}
    >
      <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 10h18" />
        <path d="M8 3v4" />
        <path d="M16 3v4" />
      </svg>
    </motion.div>
  </div>
);

const BookingForm = () => {
```

### Edit 4b — split `.section .container`, insert art, open container wrapper

```
OLD:
  return (
    <section id="booking-form" className="section container">
      <SectionHeading>Schedule Your Session</SectionHeading>

NEW:
  return (
    <section id="booking-form" className="section" style={{ position: 'relative', overflow: 'hidden' }}>
      <MandalaArt
        variant={1}
        size="480px"
        opacity={0.09}
        style={{ position: 'absolute', bottom: '-240px', right: '-240px', zIndex: 0, pointerEvents: 'none' }}
      />
      <BookingFormOrbitArt primaryColor={theme.colors.primary} />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
      <SectionHeading>Schedule Your Session</SectionHeading>
```

### Edit 4c — close the new container wrapper

```
OLD:
        </form>
      </motion.div>
    </section>
  );
};

export default BookingForm;

NEW:
        </form>
      </motion.div>
      </div>
    </section>
  );
};

export default BookingForm;
```

---

## Checklist for the agent after applying all edits

- [ ] Confirm no unclosed/mismatched JSX tags in all 4 files (each file gets exactly one extra opening `<div>` and one matching extra closing `</div>` — the edits above are written as matched pairs, so a diff tool should show equal open/close counts).
- [ ] Confirm `MandalaArt` import path resolves (`../ui/MandalaArt`) in all 3 newly-added files (Testimonials, ContactDetails, BookingForm) — it was already imported in BookingCategories.jsx and RashiBox.jsx (after edit 1a) so the component itself needs no changes.
- [ ] Visually check opacity values (0.09–0.13 range used throughout) — if any corner mandala looks too strong or too faint against the specific section's background variant (`--color-surface` vs `--color-surface-variant`), adjust only the `opacity` prop, nothing else.
- [ ] Confirm the new decorative layers don't block clicks/taps on real content — every new art component has `pointerEvents: 'none'`, so this should already be safe, but verify on mobile.
- [ ] Run `prefers-reduced-motion` check — none of the new decorative elements currently branch on `useReducedMotion()`. If you want them to respect it (recommended for consistency with `ServiceCard.jsx` and `MandalaArt.jsx`, which already do), wrap each `animate` prop with a `shouldReduceMotion ? {} : {...}` guard using `useReducedMotion()` from framer-motion in each new component.

---

## 5. Fix: make the Book Consultation icon draw-in actually visible

**Problem:** `BookingCategories.jsx` already has `pathLength` draw animation on each icon (Kundli wheel, Palmistry, Career, Marriage, Muhurat, Vastu), but it's easy to miss — icons render at 32px, animate in 0.6s, and only replay on hover. There's no dedicated first-impression reveal when the section scrolls into view, so on first load it just appears fully drawn.

### Edit 5a — trigger the draw-in on scroll-into-view, not just on mount

```
OLD:
const pathVariant = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (custom = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 0.6, ease: "easeInOut", delay: custom },
      opacity: { duration: 0.2, delay: custom }
    }
  })
};

NEW:
const pathVariant = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (custom = 0) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.1, ease: "easeInOut", delay: custom },
      opacity: { duration: 0.3, delay: custom }
    }
  })
};
```

> Duration bumped from 0.6s → 1.1s so the drawing motion is actually perceivable instead of flashing.

### Edit 5b — for EACH of the 6 icon components, change how the animation is driven

Right now every icon (`KundliWheelIcon`, `PalmistryIcon`, `CareerBriefcaseIcon`, `MarriageRingsIcon`, `MuhuratSunClockIcon`, `VastuCompassIcon`) opens with the same pattern:

```
OLD (repeats 6 times, once per icon component):
const KundliWheelIcon = ({ isHovered }) => (
  <svg key={isHovered ? 'hover' : 'idle'} width="32" height="32" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">

NEW:
const KundliWheelIcon = ({ isHovered }) => {
  const [hasDrawn, setHasDrawn] = React.useState(false);
  return (
  <motion.svg 
    key={isHovered && hasDrawn ? 'hover' : 'idle'} 
    width="40" height="40" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
    onViewportEnter={() => setHasDrawn(true)}
    viewport={{ once: false, margin: "-10%" }}
  >
```

(Apply the same param/import changes to all 6 icon components — swap the opening `<svg key=... width="32" height="32" ...>` line for the `<motion.svg key={isHovered && hasDrawn ? 'hover' : 'idle'} ... width="40" height="40" ...>` version with the `hasDrawn` state and `onViewportEnter` handler, using each icon's own component name.)

And each icon's closing tag:

```
OLD (repeats 6 times):
    <circle cx="24" cy="24" r="2" fill="currentColor" />
  </svg>
);

NEW (Kundli + Vastu, which have the center dot):
    <circle cx="24" cy="24" r="2" fill="currentColor" />
  </motion.svg>
  );
};
```

```
OLD (Palmistry, Career, Marriage, Muhurat — no center dot, closes differently):
  </svg>
);

NEW:
  </motion.svg>
  );
};
```

Adjust the specific last line/closing per icon to match what's actually there — the key change is just `</svg>` → `</motion.svg>` plus closing the new `{ ... }` function body with `);};` instead of `);`.

**Why this approach:** `onViewportEnter` fires the first time the icon scrolls into view, flipping `hasDrawn` to `true` — after that, the `key` toggle on hover (existing behavior) keeps working for replay-on-hover. Before the icon has been seen once, hovering does nothing extra (avoids a jarring double-animation on fast scroll-past). Stroke width bumped 1.8 → 2.2 and render size 32px → 40px so the line-drawing motion has enough visual weight to actually read as "revealing," not just appearing.

### Edit 5c — increase the icon circle container size in ServiceCard.jsx to fit the larger icons

```
OLD:
      {IconComponent && (
        <div style={{ 
          width: '64px', 
          height: '64px', 

NEW:
      {IconComponent && (
        <div style={{ 
          width: '76px', 
          height: '76px', 
```

Keep everything else in that block (`borderRadius: '50%'`, hover scale, etc.) unchanged — just the two `64px` values become `76px` to comfortably fit the larger 40px icons with breathing room.
