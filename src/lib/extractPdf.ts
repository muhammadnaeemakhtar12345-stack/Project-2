"use client";

export interface ExtractedPdf {
  text: string;
  pages: number;
  filename: string;
  meta: { title: string | null; author: string | null };
  truncated: boolean;
}

const MAX_CHARS = 60_000;

interface PdfJsLib {
  GlobalWorkerOptions: { workerSrc: string };
  getDocument: (src: { data: ArrayBuffer }) => {
    promise: Promise<PdfDocument>;
  };
}

interface PdfDocument {
  numPages: number;
  getPage: (n: number) => Promise<PdfPage>;
  getMetadata: () => Promise<{ info?: { Title?: string; Author?: string } }>;
}

interface PdfPage {
  getTextContent: () => Promise<{
    items: Array<{ str: string; transform: number[] }>;
  }>;
}

let pdfjsPromise: Promise<PdfJsLib> | null = null;

function loadPdfJs(): Promise<PdfJsLib> {
  if (!pdfjsPromise) {
    pdfjsPromise = (async () => {
      const lib = (await import("pdfjs-dist")) as unknown as PdfJsLib;
      if (!lib.GlobalWorkerOptions.workerSrc) {
        lib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      }
      return lib;
    })();
  }
  return pdfjsPromise;
}

export async function extractPdfText(file: File): Promise<ExtractedPdf> {
  const pdfjs = await loadPdfJs();
  const buf = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: buf }).promise;
  const parts: string[] = [];
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent();
    const lines: string[] = [];
    let lastY: number | null = null;
    let buffer: string[] = [];
    for (const item of content.items) {
      const y = item.transform?.[5] ?? null;
      const s = item.str ?? "";
      if (lastY !== null && y !== null && Math.abs(y - lastY) > 2) {
        if (buffer.length) lines.push(buffer.join(" ").trim());
        buffer = [];
      }
      if (s.trim().length) buffer.push(s);
      lastY = y;
    }
    if (buffer.length) lines.push(buffer.join(" ").trim());
    parts.push(lines.filter(Boolean).join("\n"));
  }
  const meta: { Title?: string; Author?: string } = await doc
    .getMetadata()
    .then((m) => m.info ?? {})
    .catch(() => ({}));

  let text = parts.join("\n\n").replace(/\u0000/g, "").replace(/[ \t]+\n/g, "\n");
  text = text.replace(/\n{3,}/g, "\n\n").trim();

  let truncated = false;
  if (text.length > MAX_CHARS) {
    text = text.slice(0, MAX_CHARS);
    truncated = true;
  }

  return {
    text,
    pages: doc.numPages,
    filename: file.name,
    meta: {
      title: (meta.Title ?? "").toString().trim() || null,
      author: (meta.Author ?? "").toString().trim() || null,
    },
    truncated,
  };
}
