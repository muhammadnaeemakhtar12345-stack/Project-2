import { jsPDF } from "jspdf";
import type { AnalysisResult } from "./types";

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN_X = 48;
const FOOTER_Y = PAGE_H - 36;

const COLORS = {
  white: [255, 255, 255] as const,
  bg: [247, 244, 255] as const,
  slate900: [15, 23, 42] as const,
  slate800: [30, 41, 59] as const,
  slate700: [51, 65, 85] as const,
  slate500: [100, 116, 139] as const,
  slate300: [203, 213, 225] as const,
  slate200: [226, 232, 240] as const,
  slate100: [241, 245, 249] as const,
  slate50: [248, 250, 252] as const,
  violet: [124, 58, 237] as const,
  violetSoft: [196, 181, 253] as const,
  fuchsia: [219, 39, 119] as const,
  sky: [37, 99, 235] as const,
  emerald: [5, 150, 105] as const,
  amber: [217, 119, 6] as const,
  rose: [225, 29, 72] as const,
  trafficR: [239, 68, 68] as const,
  trafficY: [245, 158, 11] as const,
  trafficG: [16, 185, 129] as const,
};

interface Cursor {
  doc: jsPDF;
  y: number;
  page: number;
  brand: { name: string; tagline: string };
}

const setFill = (c: Cursor, rgb: readonly [number, number, number]) =>
  c.doc.setFillColor(rgb[0], rgb[1], rgb[2]);
const setStroke = (c: Cursor, rgb: readonly [number, number, number]) =>
  c.doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
const setText = (c: Cursor, rgb: readonly [number, number, number]) =>
  c.doc.setTextColor(rgb[0], rgb[1], rgb[2]);

function ensureSpace(c: Cursor, h: number) {
  if (c.y + h > FOOTER_Y - 24) newPage(c);
}

function newPage(c: Cursor) {
  addFooter(c);
  c.doc.addPage();
  c.page += 1;
  setFill(c, COLORS.bg);
  c.doc.rect(0, 0, PAGE_W, PAGE_H, "F");
  c.y = MARGIN_X + 12;
}

function addFooter(c: Cursor) {
  setText(c, COLORS.slate500);
  c.doc.setFont("helvetica", "normal");
  c.doc.setFontSize(9);
  c.doc.text(`${c.brand.name} — ${c.brand.tagline}`, MARGIN_X, FOOTER_Y);
  c.doc.text(`Page ${c.page}`, PAGE_W - MARGIN_X, FOOTER_Y, { align: "right" });
}

function wrappedText(
  c: Cursor,
  text: string,
  opts: {
    size?: number;
    color?: readonly [number, number, number];
    weight?: "normal" | "bold";
    leading?: number;
    indent?: number;
    width?: number;
  } = {},
) {
  const size = opts.size ?? 10.5;
  const color = opts.color ?? COLORS.slate700;
  const weight = opts.weight ?? "normal";
  const leading = opts.leading ?? size * 1.45;
  const indent = opts.indent ?? 0;
  const width = opts.width ?? PAGE_W - 2 * MARGIN_X - indent;
  c.doc.setFont("helvetica", weight);
  c.doc.setFontSize(size);
  setText(c, color);
  const lines = c.doc.splitTextToSize(text, width) as string[];
  for (const line of lines) {
    ensureSpace(c, leading);
    c.doc.text(line, MARGIN_X + indent, c.y);
    c.y += leading;
  }
}

function sectionHeading(
  c: Cursor,
  title: string,
  rail: readonly [number, number, number] = COLORS.violet,
  eyebrow?: string,
) {
  c.y += 8;
  ensureSpace(c, 60);
  if (eyebrow) {
    setText(c, COLORS.slate500);
    c.doc.setFont("helvetica", "bold");
    c.doc.setFontSize(7.6);
    c.doc.text(eyebrow.toUpperCase(), MARGIN_X + 12, c.y);
    c.y += 11;
  }
  setFill(c, rail);
  c.doc.roundedRect(MARGIN_X, c.y - 12, 4, 22, 1.5, 1.5, "F");
  setText(c, COLORS.slate900);
  c.doc.setFont("helvetica", "bold");
  c.doc.setFontSize(16);
  c.doc.text(title, MARGIN_X + 12, c.y + 4);
  c.y += 18;
}

function badge(
  c: Cursor,
  x: number,
  y: number,
  label: string,
  fill: readonly [number, number, number],
  textColor: readonly [number, number, number] = COLORS.white,
) {
  c.doc.setFont("helvetica", "bold");
  c.doc.setFontSize(7.8);
  const w = c.doc.getTextWidth(label) + 14;
  setFill(c, fill);
  c.doc.roundedRect(x, y - 9, w, 14, 7, 7, "F");
  setText(c, textColor);
  c.doc.text(label, x + 7, y + 0.6);
  return w;
}

function severityFill(score: number): readonly [number, number, number] {
  if (score >= 85) return COLORS.emerald;
  if (score >= 70) return COLORS.violet;
  if (score >= 55) return COLORS.amber;
  return COLORS.rose;
}

function gradeFor(score: number): string {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

function scoreRing(c: Cursor, x: number, y: number, score: number, radius = 56) {
  const stroke = 8;
  const color = severityFill(score);
  // Track
  setStroke(c, COLORS.slate200);
  c.doc.setLineWidth(stroke);
  c.doc.circle(x, y, radius, "S");
  // Arc — approximate by drawing a series of short lines along the circle
  setStroke(c, color);
  c.doc.setLineWidth(stroke);
  const total = 360 * (Math.min(100, Math.max(0, score)) / 100);
  const steps = Math.max(2, Math.ceil(total / 4));
  let prevX = x + Math.cos((-90 * Math.PI) / 180) * radius;
  let prevY = y + Math.sin((-90 * Math.PI) / 180) * radius;
  for (let i = 1; i <= steps; i++) {
    const angle = (-90 + (total * i) / steps) * (Math.PI / 180);
    const nx = x + Math.cos(angle) * radius;
    const ny = y + Math.sin(angle) * radius;
    c.doc.line(prevX, prevY, nx, ny);
    prevX = nx;
    prevY = ny;
  }
  // Numbers
  setText(c, color);
  c.doc.setFont("helvetica", "bold");
  c.doc.setFontSize(28);
  c.doc.text(String(Math.round(score)), x, y + 4, { align: "center" });
  setText(c, COLORS.slate500);
  c.doc.setFont("helvetica", "normal");
  c.doc.setFontSize(8.5);
  c.doc.text("/ 100", x, y + 16, { align: "center" });
  // Grade letter
  setText(c, color);
  c.doc.setFont("helvetica", "bold");
  c.doc.setFontSize(20);
  c.doc.text(gradeFor(score), x, y + radius + 24, { align: "center" });
  setText(c, COLORS.slate500);
  c.doc.setFont("helvetica", "normal");
  c.doc.setFontSize(7.6);
  c.doc.text("GRADE", x, y + radius + 36, { align: "center" });
}

function coverPage(c: Cursor, result: AnalysisResult) {
  // Background
  setFill(c, COLORS.bg);
  c.doc.rect(0, 0, PAGE_W, PAGE_H, "F");

  // Top brand band — violet over fuchsia (faux gradient)
  setFill(c, COLORS.violet);
  c.doc.rect(0, 0, PAGE_W, 8, "F");
  setFill(c, COLORS.fuchsia);
  c.doc.rect(0, 8, PAGE_W, 2, "F");

  // Brand row
  const brandY = 60;
  // Logo mark
  setFill(c, COLORS.violet);
  c.doc.roundedRect(MARGIN_X, brandY - 16, 24, 24, 6, 6, "F");
  setText(c, COLORS.white);
  c.doc.setFont("helvetica", "bold");
  c.doc.setFontSize(13);
  c.doc.text("Q", MARGIN_X + 12, brandY + 1, { align: "center" });

  setText(c, COLORS.slate900);
  c.doc.setFont("helvetica", "bold");
  c.doc.setFontSize(15);
  c.doc.text(c.brand.name, MARGIN_X + 32, brandY - 4);
  setText(c, COLORS.slate500);
  c.doc.setFont("helvetica", "normal");
  c.doc.setFontSize(9);
  c.doc.text(c.brand.tagline, MARGIN_X + 32, brandY + 8);

  // Hairline
  setStroke(c, COLORS.slate200);
  c.doc.setLineWidth(0.6);
  c.doc.line(MARGIN_X, brandY + 22, PAGE_W - MARGIN_X, brandY + 22);

  // Title
  c.y = brandY + 70;
  setText(c, COLORS.slate900);
  c.doc.setFont("helvetica", "bold");
  c.doc.setFontSize(34);
  const title = result.paper.title || "Paper Synthesis Report";
  const titleLines = c.doc.splitTextToSize(title, PAGE_W - 2 * MARGIN_X) as string[];
  for (const line of titleLines.slice(0, 3)) {
    c.doc.text(line, MARGIN_X, c.y);
    c.y += 38;
  }

  // Subtitle pill: Date · Subject · Sections
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const subject = result.paper.fieldOfStudy || "Research synthesis";
  const sectionsLine = `${result.sections.length} section${result.sections.length === 1 ? "" : "s"}`;
  const subtitle = `${date}  ·  ${subject}  ·  ${sectionsLine}`;
  setFill(c, COLORS.violet);
  c.doc.setFont("helvetica", "bold");
  c.doc.setFontSize(9);
  const subW = c.doc.getTextWidth(subtitle) + 22;
  c.doc.roundedRect(MARGIN_X, c.y - 4, subW, 18, 9, 9, "F");
  setText(c, COLORS.white);
  c.doc.text(subtitle, MARGIN_X + 11, c.y + 8);
  c.y += 36;

  // Score ring (centered horizontally)
  scoreRing(c, PAGE_W / 2, c.y + 70, result.scores.overall, 60);
  c.y += 200;

  // Executive summary card
  ensureSpace(c, 110);
  setFill(c, COLORS.white);
  c.doc.roundedRect(MARGIN_X, c.y, PAGE_W - 2 * MARGIN_X, 110, 10, 10, "F");
  setFill(c, COLORS.violet);
  c.doc.rect(MARGIN_X, c.y, 4, 110, "F");

  setText(c, COLORS.violet);
  c.doc.setFont("helvetica", "bold");
  c.doc.setFontSize(7.8);
  c.doc.text("EXECUTIVE SUMMARY", MARGIN_X + 18, c.y + 18);

  setText(c, COLORS.slate800);
  c.doc.setFont("helvetica", "normal");
  c.doc.setFontSize(10.5);
  const summary =
    result.executiveSummary ||
    "No executive summary available for this paper.";
  const sumLines = c.doc.splitTextToSize(
    summary,
    PAGE_W - 2 * MARGIN_X - 36,
  ) as string[];
  let sy = c.y + 36;
  for (const line of sumLines.slice(0, 5)) {
    c.doc.text(line, MARGIN_X + 18, sy);
    sy += 14;
  }
  c.y += 124;

  // 4-column meta block
  ensureSpace(c, 70);
  const cols = [
    {
      label: "AUTHORS",
      value:
        result.paper.authors.length > 0
          ? result.paper.authors.slice(0, 4).join(", ")
          : "—",
    },
    { label: "YEAR", value: String(result.paper.year ?? "—") },
    { label: "VENUE", value: result.paper.venue ?? "—" },
    { label: "FIELD", value: result.paper.fieldOfStudy ?? "—" },
  ];
  const colW = (PAGE_W - 2 * MARGIN_X) / 4;
  for (let i = 0; i < cols.length; i++) {
    const x = MARGIN_X + i * colW;
    if (i > 0) {
      setStroke(c, COLORS.slate200);
      c.doc.setLineWidth(0.6);
      c.doc.line(x, c.y, x, c.y + 50);
    }
    setText(c, COLORS.slate500);
    c.doc.setFont("helvetica", "bold");
    c.doc.setFontSize(7.6);
    c.doc.text(cols[i].label, x + 12, c.y + 14);
    setText(c, COLORS.slate900);
    c.doc.setFont("helvetica", "normal");
    c.doc.setFontSize(10);
    const v = c.doc.splitTextToSize(cols[i].value, colW - 18) as string[];
    let vy = c.y + 30;
    for (const line of v.slice(0, 2)) {
      c.doc.text(line, x + 12, vy);
      vy += 12;
    }
  }
  c.y += 64;
}

function scoreBox(
  c: Cursor,
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
  value: number,
) {
  const fill = severityFill(value);
  setFill(c, COLORS.white);
  c.doc.roundedRect(x, y, w, h, 8, 8, "F");
  setStroke(c, COLORS.slate200);
  c.doc.setLineWidth(0.6);
  c.doc.roundedRect(x, y, w, h, 8, 8, "S");
  setText(c, COLORS.slate500);
  c.doc.setFont("helvetica", "bold");
  c.doc.setFontSize(7.6);
  c.doc.text(label.toUpperCase(), x + 12, y + 16);
  setText(c, fill);
  c.doc.setFont("helvetica", "bold");
  c.doc.setFontSize(20);
  c.doc.text(`${Math.round(value)}`, x + 12, y + 40);
  setText(c, COLORS.slate500);
  c.doc.setFont("helvetica", "normal");
  c.doc.setFontSize(8);
  c.doc.text("/ 100", x + 38, y + 40);
  // Mini bar
  const barY = y + h - 14;
  setFill(c, COLORS.slate100);
  c.doc.roundedRect(x + 12, barY, w - 24, 4, 2, 2, "F");
  setFill(c, fill);
  c.doc.roundedRect(x + 12, barY, ((w - 24) * Math.min(100, value)) / 100, 4, 2, 2, "F");
}

function scoresPage(c: Cursor, result: AnalysisResult) {
  newPage(c);
  sectionHeading(c, "Quality Scores", COLORS.violet, "How the paper rates");
  c.y += 4;

  const scores: Array<{ label: string; value: number }> = [
    { label: "Overall", value: result.scores.overall },
    { label: "Clarity", value: result.scores.clarity },
    { label: "Novelty", value: result.scores.novelty },
    { label: "Rigor", value: result.scores.rigor },
    { label: "Impact", value: result.scores.impact },
    { label: "Originality", value: result.plagiarismRisk.originality },
  ];
  const cols = 3;
  const gap = 12;
  const totalW = PAGE_W - 2 * MARGIN_X;
  const cellW = (totalW - gap * (cols - 1)) / cols;
  const cellH = 70;
  let i = 0;
  for (const s of scores) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    if (col === 0 && row > 0) c.y += cellH + gap;
    scoreBox(c, MARGIN_X + col * (cellW + gap), c.y, cellW, cellH, s.label, s.value);
    i++;
  }
  c.y += cellH + gap;

  // Originality verdict block
  c.y += 12;
  sectionHeading(c, "Originality verdict", COLORS.emerald, "Plagiarism guard");
  setFill(c, COLORS.white);
  c.doc.roundedRect(MARGIN_X, c.y, PAGE_W - 2 * MARGIN_X, 90, 8, 8, "F");
  setFill(c, COLORS.emerald);
  c.doc.rect(MARGIN_X, c.y, 4, 90, "F");

  // Grade badge
  badge(
    c,
    MARGIN_X + 18,
    c.y + 22,
    `GRADE ${result.plagiarismRisk.grade}`,
    severityFill(result.plagiarismRisk.originality),
  );

  setText(c, COLORS.slate500);
  c.doc.setFont("helvetica", "bold");
  c.doc.setFontSize(7.6);
  c.doc.text("ORIGINALITY", PAGE_W - MARGIN_X - 18, c.y + 22, {
    align: "right",
  });
  setText(c, severityFill(result.plagiarismRisk.originality));
  c.doc.setFont("helvetica", "bold");
  c.doc.setFontSize(20);
  c.doc.text(
    `${result.plagiarismRisk.originality}/100`,
    PAGE_W - MARGIN_X - 18,
    c.y + 44,
    { align: "right" },
  );

  setText(c, COLORS.slate800);
  c.doc.setFont("helvetica", "normal");
  c.doc.setFontSize(10);
  const rationale =
    result.plagiarismRisk.rationale || "No specific concerns detected.";
  const rLines = c.doc.splitTextToSize(
    rationale,
    PAGE_W - 2 * MARGIN_X - 200,
  ) as string[];
  let ry = c.y + 44;
  for (const line of rLines.slice(0, 4)) {
    c.doc.text(line, MARGIN_X + 18, ry);
    ry += 13;
  }
  c.y += 100;

  if (result.plagiarismRisk.suggestions.length > 0) {
    setText(c, COLORS.slate900);
    c.doc.setFont("helvetica", "bold");
    c.doc.setFontSize(11);
    c.doc.text("Suggestions to strengthen originality", MARGIN_X, c.y);
    c.y += 14;
    for (const s of result.plagiarismRisk.suggestions.slice(0, 6)) {
      ensureSpace(c, 18);
      setFill(c, COLORS.violet);
      c.doc.circle(MARGIN_X + 4, c.y - 3, 1.5, "F");
      setText(c, COLORS.slate700);
      c.doc.setFont("helvetica", "normal");
      c.doc.setFontSize(10);
      const lines = c.doc.splitTextToSize(
        s,
        PAGE_W - 2 * MARGIN_X - 14,
      ) as string[];
      let yy = c.y;
      for (const ln of lines) {
        c.doc.text(ln, MARGIN_X + 14, yy);
        yy += 13;
      }
      c.y = yy + 4;
    }
  }
}

function sectionsPages(c: Cursor, result: AnalysisResult) {
  if (result.sections.length === 0) return;
  newPage(c);
  sectionHeading(
    c,
    "Section-by-section synthesis",
    COLORS.fuchsia,
    "Synthesised reading",
  );
  c.y += 4;

  const railColors = [
    COLORS.violet,
    COLORS.fuchsia,
    COLORS.sky,
    COLORS.emerald,
    COLORS.amber,
    COLORS.rose,
  ];

  result.sections.forEach((s, i) => {
    ensureSpace(c, 110);
    const rail = railColors[i % railColors.length];

    // Section row
    setText(c, COLORS.slate500);
    c.doc.setFont("helvetica", "bold");
    c.doc.setFontSize(7.6);
    c.doc.text(`SECTION ${String(i + 1).padStart(2, "0")}`, MARGIN_X + 12, c.y);
    c.y += 12;

    setFill(c, rail);
    c.doc.roundedRect(MARGIN_X, c.y - 12, 4, 22, 1.5, 1.5, "F");
    setText(c, COLORS.slate900);
    c.doc.setFont("helvetica", "bold");
    c.doc.setFontSize(14);
    c.doc.text(s.name, MARGIN_X + 12, c.y + 3);
    c.y += 22;

    if (s.originalGist) {
      setText(c, COLORS.slate500);
      c.doc.setFont("helvetica", "bold");
      c.doc.setFontSize(7.6);
      c.doc.text("ORIGINAL GIST", MARGIN_X, c.y);
      c.y += 11;
      wrappedText(c, s.originalGist, { size: 10, color: COLORS.slate700 });
      c.y += 4;
    }

    if (s.keyPoints.length > 0) {
      setText(c, COLORS.slate500);
      c.doc.setFont("helvetica", "bold");
      c.doc.setFontSize(7.6);
      c.doc.text("KEY POINTS", MARGIN_X, c.y);
      c.y += 11;
      for (const k of s.keyPoints) {
        ensureSpace(c, 16);
        setFill(c, rail);
        c.doc.circle(MARGIN_X + 4, c.y - 3, 1.5, "F");
        const lines = c.doc.splitTextToSize(
          k,
          PAGE_W - 2 * MARGIN_X - 14,
        ) as string[];
        let yy = c.y;
        for (const ln of lines) {
          c.doc.setFont("helvetica", "normal");
          c.doc.setFontSize(10);
          setText(c, COLORS.slate700);
          c.doc.text(ln, MARGIN_X + 14, yy);
          yy += 13;
        }
        c.y = yy + 2;
      }
      c.y += 2;
    }

    if (s.rewrite) {
      // Quote slab
      setText(c, COLORS.violet);
      c.doc.setFont("helvetica", "bold");
      c.doc.setFontSize(7.6);
      c.doc.text("PLAGIARISM-FREE REWRITE", MARGIN_X, c.y);
      c.y += 12;

      const rewriteLines = c.doc.splitTextToSize(
        s.rewrite,
        PAGE_W - 2 * MARGIN_X - 26,
      ) as string[];
      const slabH = rewriteLines.length * 13 + 26;
      ensureSpace(c, slabH);

      setFill(c, COLORS.slate50);
      c.doc.roundedRect(MARGIN_X, c.y, PAGE_W - 2 * MARGIN_X, slabH, 8, 8, "F");
      setFill(c, COLORS.violet);
      c.doc.rect(MARGIN_X, c.y, 3, slabH, "F");

      setText(c, COLORS.slate800);
      c.doc.setFont("helvetica", "normal");
      c.doc.setFontSize(10);
      let yy = c.y + 18;
      for (const ln of rewriteLines) {
        c.doc.text(ln, MARGIN_X + 14, yy);
        yy += 13;
      }
      c.y += slabH + 12;
    }

    c.y += 8;
  });
}

function citationsPages(c: Cursor, result: AnalysisResult) {
  if (result.citations.length === 0) return;
  newPage(c);
  sectionHeading(c, "Smart citations", COLORS.sky, "Ready to cite");
  c.y += 4;

  result.citations.forEach((cit, i) => {
    ensureSpace(c, 90);
    setText(c, COLORS.slate500);
    c.doc.setFont("helvetica", "bold");
    c.doc.setFontSize(7.6);
    c.doc.text(cit.id.toUpperCase(), MARGIN_X, c.y);
    c.y += 11;

    if (cit.note) {
      wrappedText(c, cit.note, { size: 9.5, color: COLORS.slate500 });
      c.y += 2;
    }

    // APA
    setText(c, COLORS.slate900);
    c.doc.setFont("helvetica", "bold");
    c.doc.setFontSize(8.4);
    c.doc.text("APA", MARGIN_X, c.y);
    c.y += 4;
    wrappedText(c, cit.apa || "—", {
      size: 10,
      color: COLORS.slate700,
      indent: 0,
    });

    // MLA
    if (cit.mla) {
      setText(c, COLORS.slate900);
      c.doc.setFont("helvetica", "bold");
      c.doc.setFontSize(8.4);
      c.doc.text("MLA", MARGIN_X, c.y);
      c.y += 4;
      wrappedText(c, cit.mla, { size: 10, color: COLORS.slate700 });
    }

    // BibTeX (code slab)
    if (cit.bibtex) {
      const bibLines = (cit.bibtex.match(/.{1,90}/g) ?? [cit.bibtex]).flatMap(
        (l) => l.split("\n"),
      );
      const headerH = 18;
      const slabH = headerH + bibLines.length * 11 + 18;
      ensureSpace(c, slabH + 4);

      // Header
      setFill(c, COLORS.slate800);
      c.doc.roundedRect(MARGIN_X, c.y, PAGE_W - 2 * MARGIN_X, headerH, 6, 6, "F");
      // Reset bottom corners with rect
      setFill(c, COLORS.slate800);
      c.doc.rect(MARGIN_X, c.y + headerH - 6, PAGE_W - 2 * MARGIN_X, 6, "F");
      // Traffic dots
      setFill(c, COLORS.trafficR);
      c.doc.circle(MARGIN_X + 10, c.y + 9, 2.6, "F");
      setFill(c, COLORS.trafficY);
      c.doc.circle(MARGIN_X + 19, c.y + 9, 2.6, "F");
      setFill(c, COLORS.trafficG);
      c.doc.circle(MARGIN_X + 28, c.y + 9, 2.6, "F");
      setText(c, COLORS.slate300);
      c.doc.setFont("courier", "bold");
      c.doc.setFontSize(8);
      c.doc.text("BIBTEX", PAGE_W - MARGIN_X - 8, c.y + 12, { align: "right" });

      // Body
      setFill(c, COLORS.slate50);
      c.doc.rect(MARGIN_X, c.y + headerH, PAGE_W - 2 * MARGIN_X, slabH - headerH, "F");
      setFill(c, COLORS.violet);
      c.doc.rect(MARGIN_X, c.y + headerH, 3, slabH - headerH, "F");

      setText(c, COLORS.slate800);
      c.doc.setFont("courier", "normal");
      c.doc.setFontSize(8.5);
      let yy = c.y + headerH + 14;
      for (const ln of bibLines) {
        c.doc.text(ln, MARGIN_X + 12, yy);
        yy += 11;
      }
      c.y += slabH + 8;
    }

    // Divider
    if (i < result.citations.length - 1) {
      ensureSpace(c, 14);
      setStroke(c, COLORS.slate200);
      c.doc.setLineWidth(0.5);
      c.doc.line(MARGIN_X, c.y + 6, PAGE_W - MARGIN_X, c.y + 6);
      c.y += 18;
    }
  });
}

function endNote(c: Cursor) {
  c.y += 12;
  ensureSpace(c, 80);
  setFill(c, COLORS.white);
  c.doc.roundedRect(MARGIN_X, c.y, PAGE_W - 2 * MARGIN_X, 70, 10, 10, "F");
  setFill(c, COLORS.violet);
  c.doc.rect(MARGIN_X, c.y, 4, 70, "F");
  setText(c, COLORS.violet);
  c.doc.setFont("helvetica", "bold");
  c.doc.setFontSize(7.8);
  c.doc.text("FROM THE QUILIX TEAM", MARGIN_X + 16, c.y + 18);
  setText(c, COLORS.slate800);
  c.doc.setFont("helvetica", "normal");
  c.doc.setFontSize(10);
  const note =
    "This report was generated to help you read smarter and write more independently. Always verify quotations and citations against the original source before submission.";
  const lines = c.doc.splitTextToSize(note, PAGE_W - 2 * MARGIN_X - 32) as string[];
  let yy = c.y + 36;
  for (const ln of lines.slice(0, 3)) {
    c.doc.text(ln, MARGIN_X + 16, yy);
    yy += 13;
  }
}

export function generatePdfReport(
  result: AnalysisResult,
  brand: { name: string; tagline: string },
): jsPDF {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const c: Cursor = { doc, y: MARGIN_X + 12, page: 1, brand };
  coverPage(c, result);
  scoresPage(c, result);
  sectionsPages(c, result);
  citationsPages(c, result);
  endNote(c);
  addFooter(c);
  return doc;
}

export function downloadPdfReport(
  result: AnalysisResult,
  brand: { name: string; tagline: string },
  filename?: string,
) {
  const doc = generatePdfReport(result, brand);
  const ts = new Date().toISOString().slice(0, 19).replace(/[T:]/g, "-");
  const slug = brand.name.toLowerCase().replace(/\s+/g, "-");
  doc.save(filename ?? `${slug}-report-${ts}.pdf`);
}
