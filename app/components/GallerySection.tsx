"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Photo = {
  src: string;
  alt?: string;
  driveView?: string;
  albumLink?: string;
};

/**
 * Set to `true` while photos are not ready.
 * When you want the real gallery + lightbox, set this to `false`.
 */
const COMING_SOON = true;

const defaultPhotos: Photo[] = [
  {
    src: "https://images.pexels.com/photos/169211/pexels-photo-169211.jpeg",
    alt: "Couple holding hands",
    driveView: "https://drive.google.com/file/d/FILE_ID_1/view?usp=sharing",
    albumLink: "#",
  },
  {
    src: "https://images.pexels.com/photos/1117647/pexels-photo-1117647.jpeg",
    alt: "Haldi ceremony",
    driveView: "https://drive.google.com/file/d/FILE_ID_2/view?usp=sharing",
    albumLink: "#",
  },
  {
    src: "https://images.pexels.com/photos/267596/pexels-photo-267596.jpeg",
    alt: "Wedding decor",
    driveView: "https://drive.google.com/file/d/FILE_ID_3/view?usp=sharing",
    albumLink: "#",
  },
  {
    src: "https://images.pexels.com/photos/1393985/pexels-photo-1393985.jpeg",
    alt: "Mehndi design",
    driveView: "https://drive.google.com/file/d/FILE_ID_4/view?usp=sharing",
    albumLink: "#",
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay } }),
};

export default function GallerySection({ photos = defaultPhotos }: { photos?: Photo[] }) {
  // keep original lightbox state in place but won't be used when COMING_SOON=true
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [scale, setScale] = useState(1);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Lightbox helpers (unused while COMING_SOON)
  const open = (idx: number) => {
    setOpenIndex(idx);
    setIsLoaded(false);
    setScale(1);
  };
  const close = () => {
    setOpenIndex(null);
    setIsLoaded(false);
    setScale(1);
  };
  const next = () => setOpenIndex((i) => (i === null ? null : Math.min(photos.length - 1, i + 1)));
  const prev = () => setOpenIndex((i) => (i === null ? null : Math.max(0, i - 1)));

  // keyboard nav (won't trigger while COMING_SOON because openIndex stays null)
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (openIndex === null) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [openIndex, photos.length]);

  // touch handlers (kept for future use)
  function onTouchStart(e: React.TouchEvent) {
    setTouchStartX(e.touches[0].clientX);
  }
  function onTouchMove(e: React.TouchEvent) {
    if (touchStartX === null) return;
    const dx = e.touches[0].clientX - touchStartX;
    if (dx > 80) {
      prev();
      setTouchStartX(null);
    } else if (dx < -80) {
      next();
      setTouchStartX(null);
    }
  }
  function onTouchEnd() {
    setTouchStartX(null);
  }

  // download helper (kept)
  function downloadCurrent() {
    if (openIndex === null) return;
    const url = photos[openIndex].src;
    const a = document.createElement("a");
    a.href = url;
    a.download = url.split("/").pop() || `photo-${openIndex + 1}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  const hasPhotos = photos && photos.length > 0;

  return (
    <section id="gallery" className="scroll-mt-24">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="mb-6 text-center">
        <motion.h2 variants={fadeInUp} className="text-2xl font-semibold tracking-tight">
          Photo Gallery
        </motion.h2>
        <motion.p variants={fadeInUp} className="mt-2 text-sm text-slate-400 max-w-xl mx-auto">
          {COMING_SOON
            ? "Photos are coming soon — we can’t wait to share our memories with you. Stay tuned!"
            : "Tap a photo to view it larger. Use the Drive link to see full-resolution images."}
        </motion.p>
      </motion.div>

      {/* If coming soon, show polished placeholders */}
      {COMING_SOON ? (
        <>
          {/* Large banner */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 rounded-2xl border border-white/8 bg-gradient-to-br from-slate-900/80 to-slate-800/70 p-6 shadow-lg"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold">Photos — Coming Soon ✨</h3>
                <p className="mt-2 text-sm text-slate-300 max-w-lg">
                  We’re preparing beautiful photos from our special moments. They will be uploaded shortly after the ceremony.
                </p>
              </div>

              <div className="flex gap-3">
                <a
                  href="mailto:?subject=Notify me when photos are live&body=Please notify me when the wedding photos are available."
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow"
                >
                  Notify me
                </a>

                <button
                  onClick={() => {
                    const el = document.getElementById("gallery-placeholders");
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/40 px-4 py-2 text-sm font-medium text-slate-100"
                >
                  View placeholders
                </button>
              </div>
            </div>
          </motion.div>

          {/* Placeholder grid */}
          <div id="gallery-placeholders" className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: Math.max(4, hasPhotos ? photos.length : 4) }).map((_, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.03 }}
                className="relative overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-br from-slate-800/60 to-slate-700/50 p-0"
              >
                {/* If you have a preview image, show it but still show Coming Soon overlay.
                    Otherwise the gradient placeholder is shown. */}
                {hasPhotos && photos[idx] ? (
                  <img src={photos[idx].src} alt="" className="h-44 md:h-52 w-full object-cover opacity-30" />
                ) : (
                  <div className="h-44 md:h-52 w-full bg-gradient-to-br from-slate-700/70 via-slate-600/60 to-slate-700/70 animate-pulse" />
                )}

                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="text-sm font-semibold text-white">Coming Soon...</div>
                    <div className="mt-2 text-xs text-slate-300">Full-resolution photos will be available after the wedding.</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        // FULL gallery (existing, advanced implementation) — unchanged
        <>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {photos.map((p, i) => (
              <motion.button
                key={p.src + i}
                onClick={() => open(i)}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-slate-900/50 p-0"
                aria-label={`Open photo ${i + 1}`}
              >
                <div className="relative h-44 md:h-52 w-full bg-gray-800/30">
                  <img src={p.src} alt={p.alt || `Photo ${i + 1}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-400 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.button>
            ))}
          </div>

          {/* Lightbox & advanced viewer (kept as earlier) */}
          <AnimatePresence>
            {openIndex !== null && (
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={close}
                aria-modal="true"
                role="dialog"
                aria-label="Image viewer"
              >
                <motion.div className="absolute inset-0 bg-black/80" initial={{ opacity: 0 }} animate={{ opacity: 0.85 }} exit={{ opacity: 0 }} />

                <motion.div
                  ref={modalRef}
                  tabIndex={-1}
                  className="relative z-10 max-w-[1100px] w-full mx-auto"
                  initial={{ y: 20, scale: 0.98, opacity: 0 }}
                  animate={{ y: 0, scale: 1, opacity: 1 }}
                  exit={{ y: 12, opacity: 0 }}
                  transition={{ duration: 0.32 }}
                  onClick={(e) => e.stopPropagation()}
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                >
                  <div className="rounded-2xl bg-slate-900/80 p-4 shadow-2xl">
                    <div className="flex flex-col lg:flex-row gap-4">
                      {/* Image */}
                      <div className="flex-1 flex items-center justify-center overflow-hidden rounded-md bg-black">
                        {!isLoaded && (
                          <div className="flex h-64 w-full items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/40" />
                          </div>
                        )}

                        <img
                          src={photos[openIndex].src}
                          alt={photos[openIndex].alt}
                          onLoad={() => {
                            setIsLoaded(true);
                          }}
                          onError={() => setIsLoaded(true)}
                          onDoubleClick={() => setScale((s) => (s === 1 ? 2 : 1))}
                          style={{
                            transform: `scale(${scale})`,
                            transition: "transform 0.2s ease",
                            maxHeight: "75vh",
                          }}
                          className="max-w-full object-contain rounded-md"
                          draggable={false}
                        />
                      </div>

                      {/* Right panel */}
                      <div className="w-full lg:w-64 shrink-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-lg font-semibold text-slate-100">{photos[openIndex].alt ?? `Photo ${openIndex + 1}`}</h3>
                            <div className="mt-1 text-xs text-slate-400">Photo {openIndex + 1} of {photos.length}</div>
                          </div>

                          <button onClick={close} className="rounded-full bg-black/40 p-1 text-white hover:bg-black/60" aria-label="Close viewer">✕</button>
                        </div>

                        <div className="mt-4 flex flex-col gap-2">
                          {photos[openIndex].albumLink && (
                            <a href={photos[openIndex].albumLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-full bg-slate-800/60 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800/80">Open Album</a>
                          )}

                          {photos[openIndex].driveView && (
                            <a href={photos[openIndex].driveView} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-violet-600 px-3 py-2 text-sm font-semibold text-white shadow">View in Google Drive</a>
                          )}

                          <button onClick={() => downloadCurrent()} className="inline-flex items-center justify-center rounded-full border border-white/8 px-3 py-2 text-sm font-medium text-slate-100">Download</button>

                          <div className="mt-2 flex items-center gap-2">
                            <button onClick={() => setScale((s) => Math.max(1, s - 0.5))} className="rounded-md border border-white/6 px-2 py-1 text-sm">−</button>
                            <button onClick={() => setScale((s) => Math.min(4, s + 0.5))} className="rounded-md border border-white/6 px-2 py-1 text-sm">＋</button>
                            <button onClick={() => { setScale(1); }} className="rounded-md border border-white/6 px-2 py-1 text-sm">Reset</button>
                          </div>

                          <div className="mt-4 flex gap-2">
                            <button onClick={prev} disabled={openIndex === 0} className="flex-1 rounded-md border border-white/6 px-3 py-2 text-sm disabled:opacity-40">← Prev</button>
                            <button onClick={next} disabled={openIndex === photos.length - 1} className="flex-1 rounded-md border border-white/6 px-3 py-2 text-sm disabled:opacity-40">Next →</button>
                          </div>
                        </div>

                        {/* thumbnails */}
                        <div className="mt-4 hidden lg:block">
                          <div className="flex gap-2 overflow-x-auto py-2">
                            {photos.map((thumb, idx) => (
                              <button key={thumb.src + idx} onClick={() => setOpenIndex(idx)} className={`h-14 w-14 shrink-0 overflow-hidden rounded-md ${idx === openIndex ? "ring-2 ring-pink-400" : "border border-white/6"}`} aria-label={`Open ${idx + 1}`}>
                                <img src={thumb.src} alt={thumb.alt} className="h-full w-full object-cover" />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 text-xs text-slate-400">Tip: double-click image to quick zoom. Use arrow keys or swipe to navigate.</div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </section>
  );
}
