// R.I.S.E. VSL timeline, transcribed from the production package (Pacific
// Ridgeway rebrand). Times are in seconds; the composition runs at 30fps.
// Each b-roll segment carries the VO line as karaoke captions; card segments
// show their designed on-screen text instead.

export const RISE_FPS = 30;
export const sec = (s: number) => Math.round(s * RISE_FPS);

export const RISE_COLORS = {
  navy: "#0D1F3C",
  navyDeep: "#081428",
  gold: "#C9A84C",
  goldBright: "#E4C976",
  white: "#FFFFFF",
  sub: "#9DB0C4",
  dim: "#6B7E92",
};

export type Segment =
  | {
      kind: "broll";
      start: number; // seconds
      end: number;
      clip: string;
      vo?: string; // becomes karaoke captions
      overlay?: "form"; // optional lower overlay
    }
  | {
      kind: "card";
      start: number;
      end: number;
      card:
        | { type: "text"; lines: { t: string; gold?: boolean }[] }
        | { type: "split" }
        | { type: "stat"; number: string; label: string }
        | { type: "rise" }
        | { type: "outcomes" }
        | { type: "end" };
      vo?: string;
    };

export const SEGMENTS: Segment[] = [
  { kind: "broll", start: 0, end: 7, clip: "c4.mp4" }, // quiet open — tax forms
  {
    kind: "broll",
    start: 7,
    end: 22,
    clip: "c5.mp4",
    vo: "If you earned a good income this year and still felt like you paid too much — you're probably right.",
  },
  {
    kind: "card",
    start: 22,
    end: 32,
    vo: "Most people who earn well don't have a tax problem. They have a planning problem.",
    card: {
      type: "text",
      lines: [
        { t: "A tax problem." },
        { t: "Or a planning problem?", gold: true },
      ],
    },
  },
  {
    kind: "broll",
    start: 32,
    end: 65,
    clip: "c2.mp4",
    vo: "Every year, millions of Americans hand their information to a preparer, get a number back, and pay it. No questions. No strategy.",
  },
  {
    kind: "card",
    start: 65,
    end: 80,
    vo: "There's a difference between preparing a return and building a tax strategy.",
    card: { type: "split" },
  },
  {
    kind: "broll",
    start: 80,
    end: 92,
    clip: "c6.mp4",
    vo: "When we look at someone's return — really look at it — we almost never see just a tax return. We see a story.",
  },
  {
    kind: "broll",
    start: 92,
    end: 105,
    clip: "c1.mp4",
    vo: "We see credits never claimed. Contributions not optimized. Prior years where someone overpaid — money that can still be recovered.",
  },
  {
    kind: "card",
    start: 105,
    end: 115,
    vo: "On average, we identify over forty-four thousand dollars in potential tax savings for the people we work with.",
    card: { type: "stat", number: "$44,000", label: "Avg. Tax Savings Identified*" },
  },
  {
    kind: "card",
    start: 115,
    end: 125,
    vo: "That's not a loophole. That's money that was always yours.",
    card: {
      type: "text",
      lines: [
        { t: "That's not a loophole." },
        { t: "That's money that was always yours.", gold: true },
      ],
    },
  },
  {
    kind: "card",
    start: 125,
    end: 135,
    vo: "That's exactly what the R.I.S.E. program was built for.",
    card: { type: "rise" },
  },
  {
    kind: "broll",
    start: 135,
    end: 150,
    clip: "c3.mp4",
    vo: "We find what was missed. We recover what's still recoverable. And we build a forward strategy so you stop leaving money behind.",
  },
  {
    kind: "card",
    start: 150,
    end: 160,
    vo: "Then the work goes deeper — savings, retirement, a financial picture that reflects what you've worked for.",
    card: { type: "outcomes" },
  },
  {
    kind: "broll",
    start: 160,
    end: 172,
    clip: "c0.mp4",
    vo: "It doesn't matter if you're a W-2 earner, self-employed, or running a business. If you're paying income taxes, there's more opportunity than you've been shown.",
  },
  {
    kind: "broll",
    start: 172,
    end: 180,
    clip: "c6.mp4",
    overlay: "form",
    vo: "Right below this video, fill out the form. Let's find out what's been left on the table.",
  },
  {
    kind: "card",
    start: 180,
    end: 187,
    vo: "Start keeping more of what you earn.",
    card: { type: "end" },
  },
];

export const RISE_DURATION = sec(187);

// ---------------------------------------------------------------------------
// Karaoke caption lines built from each b-roll segment's VO.
// ---------------------------------------------------------------------------
export type CaptionWord = { text: string; start: number; end: number };
export type CaptionLine = { words: CaptionWord[] };

const chunk = (words: string[], size: number): string[][] => {
  const out: string[][] = [];
  for (let i = 0; i < words.length; i += size) out.push(words.slice(i, i + size));
  return out;
};

export const RISE_CAPTIONS: CaptionLine[] = (() => {
  const lines: CaptionLine[] = [];
  for (const s of SEGMENTS) {
    // Skip cards (they show their own text) and the form-overlay shot.
    if (s.kind !== "broll" || !s.vo || s.overlay) continue;
    const startF = sec(s.start) + 8;
    const endF = sec(s.end) - 8;
    const words = s.vo.split(/\s+/);
    const groups = chunk(words, 4);
    const totalWords = words.length;
    const per = (endF - startF) / totalWords;
    let idx = 0;
    for (const g of groups) {
      const wl: CaptionWord[] = g.map((w) => {
        const st = Math.round(startF + idx * per);
        const en = Math.round(startF + (idx + 1) * per);
        idx++;
        return { text: w, start: st, end: en };
      });
      lines.push({ words: wl });
    }
  }
  return lines;
})();

export const RISE_CAPTION_HOLD = 10;
