# chat_based_onboarding

## Workshop details — receipt printer section

A landing page section built around a single interaction: you click the
printer's key and a receipt feeds out of the slot with the workshop details
on it — date, time, language, format, duration, host, seats and price.

Open `index.html` in a browser. No build step, no dependencies.

| File | Purpose |
| --- | --- |
| `index.html` | Section markup and the workshop content |
| `styles.css` | Printer casing, paper, torn edge, feed animation |
| `script.js` | Print / reset state machine |

### How the feed works

The receipt lives in `.feed`, a clipping window that is `height: 0` at rest.
Printing animates that window to the paper's measured height while the paper
itself slides down by `--slide`, so the sheet appears to come out of the slot
rather than being wiped into view. Each line carries a `--i` index that
staggers its ink-in, which is what makes it read as printing line by line.

Once the feed lands, the window is released to `height: auto` so the section
still reflows on resize or late font loading.

### Editing the content

The details are plain markup — edit the `<dl class="specs">` rows in
`index.html`. Each row needs a `--i` one higher than the row above it so the
ink-in stagger stays in order.

### Accessibility

- The print key is a real `<button>` with `aria-expanded` / `aria-controls`;
  the whole printer body is a click target but never swallows the key's click.
- The receipt is `aria-live="polite"`, so its arrival is announced.
- `prefers-reduced-motion: reduce` prints instantly, with no feed, jitter or
  ink-in.
- Light and dark colour schemes are both handled.
