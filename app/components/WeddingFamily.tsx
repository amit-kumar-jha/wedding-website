
"use client";

import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Person = {
  id: string | number;
  side: "groom" | "bride";
  name: string;
  role?: string;
  relation?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  img?: string;
};

const sampleData: Person[] = [
  { id: 1, side: "groom", name: "Amit Jha", role: "Groom", relation: "Self", address: "Patna" },
  { id: 3, side: "groom", name: "Anil Jha", role: "Father of Groom", relation: "Father" },
  { id: 5, side: "groom", name: "Gauri Devi", role: "Mother of Groom", relation: "Mother" },
  { id: 21, side: "groom", name: "Late Suryakant Jha", role: "Grandfather", relation: "Grandfather" },
  { id: 22, side: "groom", name: "Gita Devi", role: "GrandMother", relation: "GrandMother" },
  { id: 11, side: "groom", name: "Sunil Kumar Jha", role: "Uncle", relation: "Uncle" },
  { id: 12, side: "groom", name: "Subhita Devi", role: "Aunt", relation: "Aunt" },
  { id: 7, side: "groom", name: "Ashish Kumar Jha", role: "Brother", relation: "Brother" },
  { id: 8, side: "groom", name: "Vineet Kumar Jha", role: "Brother", relation: "Brother" },
  { id: 9, side: "groom", name: "Bandhana Mishra", role: "Sister", relation: "Sister" },
  { id: 10, side: "groom", name: "Ugan Mishra", role: "Jijaji", relation: "Brother-in-law" },
  { id: 2, side: "bride", name: "Pragya Mishra", role: "Bride", relation: "Self", address: "Bhagalpur" },
  { id: 4, side: "bride", name: "Manoj Kumar Mishra", role: "Father of Bride", relation: "Father" },
  { id: 6, side: "bride", name: "Anita Mishra", role: "Mother of Bride", relation: "Mother" },
  { id: 19, side: "bride", name: "Upendra Prasad Mishra", role: "Grandfather", relation: "Grandfather" },
  { id: 20, side: "bride", name: "Anar Devi", role: "GrandMother", relation: "GrandMother" },
  { id: 13, side: "bride", name: "Sakshi Mishra", role: "Sister", relation: "Sister" },
  { id: 14, side: "bride", name: "Prachi Mishra", role: "Sister", relation: "Sister" },
  { id: 15, side: "bride", name: "Prem Mishra", role: "Brother", relation: "Brother" },
  { id: 16, side: "bride", name: "Pushpa Rani", role: "Aunt", relation: "Aunt" },
  { id: 18, side: "bride", name: "Ajay Mishra", role: "Uncle", relation: "Uncle" },
];

function initials(name = "") {
  return name
    .split(" ")
    .map((s) => s[0] || "")
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function downloadCSV(rows: Person[]) {
  const header = ["Name", "Role", "Relation", "Side", "Phone", "Email", "Address", "Notes"];
  const lines = rows.map((r) =>
    [
      r.name || "",
      r.role || "",
      r.relation || "",
      r.side || "",
      r.phone || "",
      r.email || "",
      r.address || "",
      (r.notes || "").replace(/\n/g, " "),
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );
  const csv = [header.join(","), ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `wedding-family-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Small Toast component for non-blocking feedback */
function Toast({ message, onClose }: { message: string | null; onClose: () => void }) {
  useEffect(() => {
    if (!message) return;
    const id = setTimeout(onClose, 2500);
    return () => clearTimeout(id);
  }, [message, onClose]);
  if (!message) return null;
  return (
    <div className="fixed right-4 bottom-6 z-50">
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8 }}
        className="rounded-md bg-black/85 px-4 py-2 text-sm text-white shadow-lg"
      >
        {message}
      </motion.div>
    </div>
  );
}

export default function WeddingFamilyAdvanced({ data = sampleData }: { data?: Person[] }) {
  // state
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"all" | "groom" | "bride">("all");
  const [openId, setOpenId] = useState<string | number | null>(null);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [toast, setToast] = useState<string | null>(null);
  const [debouncedQ, setDebouncedQ] = useState(query);

  // debounce search input
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQ(query.trim().toLowerCase()), 220);
    return () => clearTimeout(id);
  }, [query]);

  const counts = useMemo(() => {
    const total = data.length;
    const groom = data.filter((d) => d.side === "groom").length;
    const bride = data.filter((d) => d.side === "bride").length;
    return { total, groom, bride };
  }, [data]);

  const visible = useMemo(() => {
    const q = debouncedQ;
    return data.filter((p) => {
      if (tab !== "all" && p.side !== tab) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        (p.role || "").toLowerCase().includes(q) ||
        (p.relation || "").toLowerCase().includes(q) ||
        (p.address || "").toLowerCase().includes(q)
      );
    });
  }, [data, debouncedQ, tab]);

  // robust copy: secure clipboard + fallback
  async function handleCopy(p: Person) {
    const text = `${p.name}${p.role ? " — " + p.role : ""}${
      p.phone ? "\nPhone: " + p.phone : ""
    }${p.email ? "\nEmail: " + p.email : ""}${p.address ? "\nAddress: " + p.address : ""}`;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        setToast("Contact copied to clipboard");
        return;
      }

      // fallback
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.top = "-9999px";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      const success = document.execCommand("copy");
      document.body.removeChild(textarea);

      if (success) {
        setToast("Contact copied to clipboard");
      } else {
        setToast("Copy failed — please long-press to copy manually");
      }
    } catch (err) {
      console.error(err);
      setToast("Copy failed — try manually");
    }
  }

  return (
    <section id="wedding-family-advanced" className="scroll-mt-24">
      {/* header / controls */}
<div className="mb-4">
  <div className="flex flex-col gap-3 items-center ">
    <div className="flex-1 min-w-0 text-center sm:text-left">
      <h2 className="text-2xl font-extrabold tracking-tight">Wedding Party & Families</h2>
      <p className="mt-1 text-sm text-slate-400">Meet the families — tap a card for details.</p>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs justify-center sm:justify-start">
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-800/40 px-3 py-1 text-slate-200">
          <span className="font-semibold">{counts.total}</span>
          <span className="text-slate-300">members</span>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-600 to-violet-600 px-3 py-1 text-white">
          <span className="font-semibold">{counts.groom}</span>
          <span className="text-xs/normal">Groom</span>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-emerald-400 px-3 py-1 text-white">
          <span className="font-semibold">{counts.bride}</span>
          <span className="text-xs/normal">Bride</span>
        </div>
      </div>
    </div>

    {/* controls area */}
    <div className="flex flex-col gap-2 w-full sm:w-auto sm:flex-row sm:items-center sm:gap-3 items-center">
      {/* search - full width on small screens */}
      <div className="w-full sm:w-auto">
        <label className="relative flex items-center rounded-md bg-slate-900/60 px-3 py-2 w-full">
          <svg className="h-4 w-4 text-slate-400 mr-2 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
          </svg>
          <input
            aria-label="Search family"
            placeholder="Search name, role, relation..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent placeholder:text-slate-400 outline-none text-sm text-white w-full"
          />
          {query && (
            <button aria-label="Clear search" onClick={() => setQuery("")} className="ml-2 text-xs text-slate-400 hover:text-white">Clear</button>
          )}
        </label>
      </div>

      {/* view toggle + chips + actions */}
      <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-end">
        <div className="inline-flex items-center rounded-md bg-slate-900/60 p-1" role="tablist" aria-label="View mode">
          <button onClick={() => setView("grid")} aria-pressed={view === "grid"} className={`p-2 rounded-md ${view === "grid" ? "bg-slate-800/90 text-white" : "text-slate-300"}`} title="Grid view">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path d="M3 3h4v4H3V3zM3 9h4v4H3V9zM9 3h4v4H9V3zM9 9h4v4H9V9zM15 3h2v2h-2V3zM15 9h2v2h-2V9z"/></svg>
          </button>
          <button onClick={() => setView("list")} aria-pressed={view === "list"} className={`p-2 rounded-md ${view === "list" ? "bg-slate-800/90 text-white" : "text-slate-300"}`} title="List view">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path d="M3 5h14v2H3V5zm0 4h14v2H3V9zm0 4h14v2H3v-2z"/></svg>
          </button>
        </div>

        <div className="flex gap-2 justify-center">
          <button onClick={() => setTab("all")} className={`px-3 py-1 rounded-full text-sm ${tab === "all" ? "bg-white/6 text-white" : "bg-slate-800/40 text-slate-300"}`}>All</button>
          <button onClick={() => setTab("groom")} className={`px-3 py-1 rounded-full text-sm ${tab === "groom" ? "bg-gradient-to-r from-pink-500 to-violet-600 text-white" : "bg-slate-800/40 text-slate-300"}`}>Groom</button>
          <button onClick={() => setTab("bride")} className={`px-3 py-1 rounded-full text-sm ${tab === "bride" ? "bg-gradient-to-r from-sky-500 to-emerald-400 text-white" : "bg-slate-800/40 text-slate-300"}`}>Bride</button>
        </div>

        <div className="flex gap-2 justify-center">
          <button onClick={() => downloadCSV(visible)} className="rounded-md bg-slate-800/60 px-3 py-1 text-xs text-slate-100 hover:bg-slate-800/80">Export CSV</button>
          <button onClick={() => window.print()} className="rounded-md bg-gradient-to-r from-pink-500 to-violet-600 px-3 py-1 text-xs font-semibold text-white">Print</button>
        </div>
      </div>
    </div>
  </div>
</div>


      {/* main content: responsive grid/list */}
      <div
        className={
          view === "grid"
            ? "mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4"
            : "mt-6 space-y-3"
        }
      >
        {visible.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-white/8 bg-slate-900/50 p-6 text-center text-sm text-slate-300">
            No family members found for “{query}”
          </div>
        ) : (
          visible.map((p) => {
            const isOpen = openId === p.id;
            return (
              <motion.article
                key={p.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className={`relative rounded-2xl border border-white/6 p-4 shadow-md backdrop-blur-sm ${
                  view === "grid" ? "bg-gradient-to-br from-slate-900/60 to-slate-800/60 hover:scale-[1.01] transition-transform" : "bg-slate-900/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* avatar */}
                  <div className="flex-shrink-0 relative">
                    {p.img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.img} alt={p.name} className="h-14 w-14 sm:h-16 sm:w-16 rounded-full object-cover ring-2 ring-white/6" />
                    ) : (
                      <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-lg sm:text-xl font-bold text-white ring-2 ring-white/6">
                        {initials(p.name)}
                      </div>
                    )}

                    <span
                      aria-hidden
                      className={`absolute -bottom-1 -right-1 inline-flex items-center justify-center h-5 w-5 sm:h-6 sm:w-6 rounded-full text-[10px] sm:text-[11px] font-semibold text-white ${p.side === "groom" ? "bg-gradient-to-r from-pink-500 to-violet-600" : "bg-gradient-to-r from-sky-500 to-emerald-400"}`}
                      title={p.side === "groom" ? "Groom's side" : "Bride's side"}
                    >
                      {p.side === "groom" ? "G" : "B"}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-baseline gap-2">
                          <h3 className="text-sm sm:text-base font-semibold text-slate-100 leading-5 truncate">{p.name}</h3>
                          {p.role && <div className="text-xs sm:text-sm text-slate-400 truncate">{p.role}</div>}
                        </div>
                        {p.relation && <div className="mt-1 text-xs text-slate-400">{p.relation}</div>}
                        {p.address && <div className="mt-2 text-xs text-slate-400 line-clamp-2">{p.address}</div>}
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <div className="text-xs px-2 py-1 rounded-md text-white" style={{ background: p.side === "groom" ? "linear-gradient(90deg,#f472b6,#7c3aed)" : "linear-gradient(90deg,#60a5fa,#34d399)" }}>
                          {p.side === "groom" ? "Groom" : "Bride"}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setOpenId(isOpen ? null : p.id)}
                            aria-expanded={isOpen}
                            aria-controls={`member-${p.id}`}
                            className="text-xs sm:text-sm text-slate-300 hover:text-white"
                          >
                            {isOpen ? "Hide" : "Details"}
                          </button>

                          <button
                            onClick={() => handleCopy(p)}
                            title="Copy contact"
                            className="inline-flex items-center gap-1 rounded-md border border-white/6 px-2 py-1 text-xs sm:text-sm text-slate-200 hover:bg-white/4"
                          >
                            <svg className="h-3 w-3 sm:h-4 sm:w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="9" y="9" width="11" height="11" rx="2"/><rect x="3" y="3" width="11" height="11" rx="2"/></svg>
                            Copy
                          </button>
                        </div>
                      </div>
                    </div>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`member-${p.id}`}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.22 }}
                          className="mt-3 overflow-hidden text-sm text-slate-300"
                        >
                          <div className="space-y-2">
                            {p.phone && <div><span className="font-medium text-slate-200">Phone: </span><a className="text-pink-300 underline" href={`tel:${p.phone}`}>{p.phone}</a></div>}
                            {p.email && <div><span className="font-medium text-slate-200">Email: </span><a className="text-pink-300 underline" href={`mailto:${p.email}`}>{p.email}</a></div>}
                            {p.address && <div><span className="font-medium text-slate-200">Address: </span>{p.address}</div>}
                            {p.notes && <div><span className="font-medium text-slate-200">Notes: </span>{p.notes}</div>}
                          </div>

                          <div className="mt-3 flex gap-2 flex-wrap">
                            {p.address && (
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.address)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full bg-slate-800/60 px-3 py-1 text-xs font-medium text-white hover:bg-slate-800/80"
                              >
                                Open in Maps
                              </a>
                            )}
                            <button
                              onClick={() => {
                                const v = [p.name, p.role, p.phone, p.email, p.address].filter(Boolean).join(" • ");
                                // quick copy short info
                                try {
                                  if (navigator.clipboard && window.isSecureContext) {
                                    navigator.clipboard.writeText(v).then(() => setToast("Quick info copied"));
                                  } else {
                                    const ta = document.createElement("textarea");
                                    ta.value = v;
                                    ta.style.position = "fixed";
                                    ta.style.top = "-9999px";
                                    document.body.appendChild(ta);
                                    ta.select();
                                    document.execCommand("copy");
                                    document.body.removeChild(ta);
                                    setToast("Quick info copied");
                                  }
                                } catch {
                                  setToast("Could not copy");
                                }
                              }}
                              className="rounded-md border border-white/8 px-3 py-1 text-xs text-slate-100"
                            >
                              Copy Short Info
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.article>
            );
          })
        )}
      </div>

      {/* toast */}
      <AnimatePresence>{toast && <Toast message={toast} onClose={() => setToast(null)} />}</AnimatePresence>

      {/* print helper */}
      <div className="hidden print:block">
        <style>{`@media print { body { background: #fff !important; color: #000 !important } .no-print { display: none !important } }`}</style>
      </div>
    </section>
  );
}
