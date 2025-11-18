"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  /** Path or absolute URL to the PDF. Default expects the file at /PragyaAmitWeddingInvitation.pdf */
  pdfSrc?: string;
  /** Optional public filename to suggest to the user */
  downloadName?: string;
};

export default function InvitationCard({
  pdfSrc = "/PragyaAmitWeddingInvitation.pdf",
  downloadName = "PragyaAmitInvitation.pdf",
}: Props) {
  const [open, setOpen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  function openInNewTab() {
    window.open(pdfSrc, "_blank", "noopener");
  }

  function downloadPdf() {
    // create an anchor to trigger download
    const a = document.createElement("a");
    a.href = pdfSrc;
    a.download = downloadName;
    // If pdfSrc is a cross-origin URL that doesn't allow download, the browser will fallback to open instead.
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  async function printPdf() {
    // open a new tab with the PDF then call print (works if same-origin or browser allows)
    const w = window.open(pdfSrc, "_blank", "noopener");
    if (!w) return;
    // try to call print after it loads — may be blocked by pop-up blockers in some browsers
    try {
      w.focus();
      // wait a bit for the PDF to load then call print
      setTimeout(() => {
        try {
          w.print();
        } catch {
          // ignore print errors; user can manually print in the opened tab
        }
      }, 1000);
    } catch {
      // ignore
    }
  }

  return (
    <section id="invitation" className="scroll-mt-24">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-6xl"
      >
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/60 to-slate-800/50 p-4 shadow-lg">
          <div className="flex flex-col sm:flex-row items-center sm:items-stretch gap-4">
            {/* preview area */}
            <div className="w-full sm:w-56">
              <div
                role="button"
                onClick={() => setOpen(true)}
                onKeyDown={(e) => e.key === "Enter" && setOpen(true)}
                tabIndex={0}
                aria-label="Open invitation preview"
                className="relative cursor-pointer overflow-hidden rounded-xl border border-white/8 bg-black/30"
              >
                {/* small iframe preview */}
                <iframe
                  src={pdfSrc}
                  title="Invitation preview"
                  className="h-40 w-full border-0 bg-white/5"
                  style={{ display: "block" }}
                />

                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity">
                  <div className="rounded-full bg-white/8 px-3 py-1 text-xs text-white backdrop-blur-sm">Preview Invitation</div>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => setOpen(true)}
                  className="flex-1 rounded-md bg-gradient-to-r from-pink-500 to-violet-600 px-3 py-2 text-xs font-semibold text-white shadow"
                >
                  View
                </button>

                <button
                  onClick={downloadPdf}
                  className="rounded-md border border-white/8 px-3 py-2 text-xs text-slate-100 hover:bg-white/5"
                >
                  Download
                </button>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-slate-100">Wedding Invitation</h3>
              <p className="mt-1 text-sm text-slate-300">
                Tap <strong>View</strong> to open the invitation or download the PDF to save/print.
              </p>

              <dl className="mt-4 grid grid-cols-1 gap-2 text-sm text-slate-300">
                <div className="flex justify-between">
                  <dt className="text-slate-400">Event</dt>
                  <dd className="text-slate-100">Wedding Ceremony</dd>
                </div>

                <div className="flex justify-between">
                  <dt className="text-slate-400">Date & Time</dt>
                  <dd className="text-slate-100">26 Nov 2025 · 10:30 PM</dd>
                </div>

                <div className="flex justify-between">
                  <dt className="text-slate-400">Venue</dt>
                  <dd className="text-slate-100">  <a
            href="https://maps.app.goo.gl/7CMXXq2MQmAUJseZ6"
            target="_blank"
            rel="noreferrer"
            className="inline-flex text-xs text-pink-300 hover:text-pink-200"
          >
            <span className="font-semibold">📍 Vaikuntham</span>, Shiv Puri, Bhagalpur
          </a></dd>
                </div>
              </dl>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={openInNewTab}
                  className="rounded-md bg-slate-800/60 px-3 py-2 text-xs text-slate-100 hover:bg-slate-800/80"
                >
                  Open in new tab
                </button>

                <button
                  onClick={printPdf}
                  className="rounded-md border border-white/8 px-3 py-2 text-xs text-slate-100 hover:bg-white/4"
                >
                  Print
                </button>

                <a
                  href={pdfSrc}
                  download={downloadName}
                  className="ml-auto inline-flex items-center rounded-md bg-gradient-to-r from-sky-500 to-emerald-400 px-3 py-2 text-xs font-semibold text-white"
                >
                  Download Invitation
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modal viewer */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.98, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.98, y: 12 }}
              transition={{ duration: 0.18 }}
              className="relative z-10 w-full max-w-4xl rounded-2xl bg-slate-900/95 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-4 border-b border-white/6 p-3">
                <div className="text-sm font-medium text-slate-100">Invitation — Pragya & Amit</div>
                <div className="flex items-center gap-2">
                  <button
                    className="rounded-md bg-slate-800/60 px-3 py-1 text-xs text-slate-100 hover:bg-slate-800/80"
                    onClick={() => downloadPdf()}
                  >
                    Download
                  </button>
                  <button
                    className="rounded-md border border-white/8 px-3 py-1 text-xs text-slate-100"
                    onClick={() => printPdf()}
                  >
                    Print
                  </button>
                  <button
                    aria-label="Close"
                    onClick={() => setOpen(false)}
                    className="rounded-md bg-black/40 px-3 py-1 text-xs text-white"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="h-[75vh]">
                <iframe
                  ref={iframeRef}
                  src={pdfSrc}
                  title="Invitation full preview"
                  className="h-full w-full border-0"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
