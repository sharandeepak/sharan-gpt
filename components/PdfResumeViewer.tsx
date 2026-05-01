"use client";

import * as React from "react";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PdfResumeViewerProps {
  src: string;
  downloadHref: string;
  filename: string;
  pageCount?: number;
  className?: string;
}

export function PdfResumeViewer({
  src,
  downloadHref,
  filename,
  pageCount,
  className,
}: PdfResumeViewerProps) {
  const iframeSrc = `${src}#toolbar=0&navpanes=0&view=FitH`;

  return (
    <div className={cn("flex h-full w-full flex-col gap-2", className)}>
      <div className="flex items-center justify-between gap-3 px-1">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="truncate font-mono text-[12px] text-fg-muted"
            title={filename}
          >
            {filename}
          </span>
          {typeof pageCount === "number" ? (
            <span className="font-mono text-[11px] text-fg-subtle">
              · {pageCount}p
            </span>
          ) : null}
        </div>
        <a
          href={src}
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Open resume in new tab"
          className="inline-flex items-center gap-1 font-mono text-[11px] text-fg-muted transition-colors hover:text-fg focus-visible:text-fg"
        >
          <span>Open in tab</span>
          <ExternalLink size={12} strokeWidth={1.6} />
        </a>
      </div>

      <div className="pdf-frame relative h-full w-full overflow-hidden">
        <iframe
          src={iframeSrc}
          title={filename}
          aria-label={`PDF preview of ${filename}`}
          className="h-full w-full"
        />
      </div>

      <p className="text-[12px] text-fg-muted md:hidden">
        If the preview doesn&apos;t load,{" "}
        <a
          href={downloadHref}
          className="text-accent underline-offset-2 hover:underline"
          download
        >
          download the PDF
        </a>
        .
      </p>
    </div>
  );
}

export default PdfResumeViewer;
