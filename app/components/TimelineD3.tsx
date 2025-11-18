// components/TimelineD3.tsx
"use client";

import * as d3 from "d3";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

type EventItem = {
  id?: string | number;
  label: string;
  date: string; // ISO string (use timezone offset like +05:30)
  link?: string; // optional anchor or URL to redirect when node clicked
  location?: string;
};

const DEFAULT_EVENTS: EventItem[] = [
  { label: "Haldi", date: "2025-11-25T11:00:00+05:30" },
  { label: "Mehndi & Sangeet", date: "2025-11-25T18:30:00+05:30" },
  { label: "Baarat", date: "2025-11-26T05:30:00+05:30" },
  { label: "Wedding", date: "2025-11-26T22:30:00+05:30" },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay } }),
};

export default function TimelineD3({ events = DEFAULT_EVENTS }: { events?: EventItem[] }) {
  // --- refs & state (all hooks declared unconditionally) ---
  const ref = useRef<SVGSVGElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const [hoverInfo, setHoverInfo] = useState<{ x: number; y: number; html: string } | null>(null);
  const [isNarrow, setIsNarrow] = useState<boolean>(false);

  // ---------- ResizeObserver: detect narrow layout ----------
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        setIsNarrow(w < 720); // breakpoint
      }
    });
    ro.observe(el);
    // initial
    setIsNarrow(el.getBoundingClientRect().width < 720);
    return () => ro.disconnect();
  }, []);

  // ---------- Desktop D3 timeline (runs but returns early on narrow) ----------
  useEffect(() => {
    if (!ref.current || !wrapperRef.current) return;
    if (isNarrow) return; // don't run D3 on narrow screens

    // parse events
    const parsed = events.map((d, i) => ({ ...d, _date: new Date(d.date), _i: i }));
    parsed.sort((a, b) => a._date.getTime() - b._date.getTime());

    const svg = d3.select(ref.current);
    const container = d3.select(wrapperRef.current);

    const bbox = wrapperRef.current.getBoundingClientRect();
    const width = Math.max(640, bbox.width || 900);
    const height = 160;
    const margin = { left: 48, right: 48, top: 12, bottom: 28 };

    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${width} ${height}`).attr("preserveAspectRatio", "xMidYMid meet");

    const minDate = d3.min(parsed, (d) => d._date) as Date;
    const maxDate = d3.max(parsed, (d) => d._date) as Date;
    const x = d3.scaleTime().domain([minDate, maxDate]).range([margin.left, width - margin.right]);

    const baselineY = height / 2;

    const defs = svg.append("defs");
    defs
      .append("linearGradient")
      .attr("id", "tg")
      .attr("x1", "0%")
      .attr("x2", "100%")
      .selectAll("stop")
      .data([
        { offset: "0%", color: "#f472b6" },
        { offset: "100%", color: "#7c3aed" },
      ])
      .enter()
      .append("stop")
      .attr("offset", (d) => d.offset)
      .attr("stop-color", (d) => d.color as string)
      .attr("stop-opacity", 1);

    svg
      .append("line")
      .attr("class", "timeline-baseline")
      .attr("x1", margin.left)
      .attr("y1", baselineY)
      .attr("x2", width - margin.right)
      .attr("y2", baselineY)
      .attr("stroke", "rgba(148,163,184,0.14)")
      .attr("stroke-width", 3)
      .attr("stroke-linecap", "round");

    // safe clamped now
    const domainArr = x.domain();
    const domainStart = domainArr[0] as Date;
    const domainEnd = domainArr[1] as Date;
    const now = new Date();
    const domainStartTs = domainStart.getTime();
    const domainEndTs = domainEnd.getTime();
    const nowTs = now.getTime();
    const clampedTs = Math.max(domainStartTs, Math.min(nowTs, domainEndTs));
    const clampedNow = new Date(clampedTs);
    const progressX = x(clampedNow);

    svg
      .append("line")
      .attr("class", "timeline-progress")
      .attr("x1", margin.left)
      .attr("y1", baselineY)
      .attr("x2", progressX)
      .attr("y2", baselineY)
      .attr("stroke", "url(#tg)")
      .attr("stroke-width", 3.5)
      .attr("stroke-linecap", "round")
      .attr("opacity", 0)
      .transition()
      .duration(900)
      .attr("opacity", 1);

    // connector path using only event x positions
    const line = d3
      .line<{ x: number; y: number }>()
      .x((d) => d.x)
      .y((d) => d.y)
      .curve(d3.curveMonotoneX);

    const points = parsed.map((d) => ({ x: x(d._date), y: baselineY + Math.sin(d._i) * 4 }));

    svg
      .append("path")
      .datum(points)
      .attr("d", line as any)
      .attr("fill", "none")
      .attr("stroke", "rgba(255,255,255,0.03)")
      .attr("stroke-width", 1.2);

    // nodes
    const nodes = svg.append("g").attr("class", "nodes");

    const node = nodes
      .selectAll("g.node")
      .data(parsed)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => `translate(${x(d._date)}, ${baselineY})`)
      .style("cursor", (d) => (d.link ? "pointer" : "default"))
      .on("mouseenter", (event, d) => {
        const [clientX, clientY] = d3.pointer(event, wrapperRef.current);
        const html = `<div class="font-semibold">${d.label}</div><div class="text-xs mt-1">${d._date.toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        })}</div>${d.location ? `<div class="text-xs text-slate-300 mt-1">${d.location}</div>` : ""}`;
        setHoverInfo({ x: clientX, y: clientY, html });
      })
      .on("mouseleave", () => setHoverInfo(null))
      .on("click", (_, d) => {
        if (d.link) {
          if (typeof d.link === "string" && d.link.startsWith("#")) {
            const el = document.querySelector(d.link);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
          } else {
            window.open(d.link, "_blank", "noopener");
          }
        }
      });

    node
      .append("circle")
      .attr("r", 0)
      .attr("fill", "rgba(244,114,182,0.06)")
      .transition()
      .duration(700)
      .delay((_: any, i: number) => i * 200)
      .attr("r", 20)
      .transition()
      .duration(1200)
      .attr("r", 22)
      .attr("opacity", 0.6);

    node
      .append("circle")
      .attr("r", 0)
      .attr("fill", "url(#tg)")
      .attr("stroke", "rgba(255,255,255,0.06)")
      .attr("stroke-width", 1)
      .transition()
      .duration(700)
      .delay((_: any, i: number) => i * 200)
      .attr("r", 8);

    node
      .append("text")
      .text((d) => d.label)
      .attr("text-anchor", "middle")
      .attr("y", -18)
      .attr("fill", "rgba(248,250,252,0.95)")
      .attr("font-size", 11)
      .style("pointer-events", "none");

    node
      .append("text")
      .text((d) => d._date.toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }))
      .attr("text-anchor", "middle")
      .attr("y", 24)
      .attr("fill", "rgba(148,163,184,0.95)")
      .attr("font-size", 10)
      .style("pointer-events", "none");

    // keyboard focus rects
    nodes
      .selectAll("rect.focus")
      .data(parsed)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d._date) - 14)
      .attr("y", baselineY - 14)
      .attr("width", 28)
      .attr("height", 28)
      .attr("fill", "transparent")
      .attr("tabindex", 0)
      .on("focus", (_, d) => {
        setHoverInfo({
          x: x(d._date),
          y: baselineY - 30,
          html: `<div class="font-semibold">${d.label}</div><div class="text-xs mt-1">${d._date.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}</div>`,
        });
      })
      .on("blur", () => setHoverInfo(null))
      .on("keydown", (event: any, d) => {
        if (event.key === "Enter" && d.link) {
          if (typeof d.link === "string" && d.link.startsWith("#")) {
            const el = document.querySelector(d.link);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
          } else {
            window.open(d.link, "_blank", "noopener");
          }
        }
      });

    // zoom / pan — transform nodes, path and progress/baseline only (no ticks)
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.6, 3])
      .translateExtent([
        [-width, 0],
        [width * 2, height],
      ])
      .on("zoom", (event) => {
        const t = event.transform;
        svg.selectAll("g.nodes, path").attr("transform", t.toString());
        svg.selectAll(".timeline-baseline").attr("transform", t.toString());
        svg.selectAll(".timeline-progress").attr("transform", t.toString());
      });

    (svg.node() as any).__zoom = undefined;
    svg.call(zoom as any);

    return () => {
      svg.on(".zoom", null);
    };
  }, [events, isNarrow]);

  // ---------- Tooltip DOM positioning effect (runs on desktop & mobile but ignores on narrow as needed) ----------
  useEffect(() => {
    const tooltip = tooltipRef.current;
    const wrapper = wrapperRef.current;
    if (!tooltip) return;
    if (!hoverInfo) {
      tooltip.style.opacity = "0";
      return;
    }
    tooltip.innerHTML = hoverInfo.html;
    tooltip.style.opacity = "1";
    if (wrapper) {
      const left = Math.max(8, hoverInfo.x - 100);
      const top = Math.max(8, hoverInfo.y - 70);
      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
    }
  }, [hoverInfo, isNarrow]);

  // ---------------- RENDER ----------------
  // Mobile / narrow: stacked vertical timeline
  if (isNarrow) {
    return (
      <section id="timeline" className="scroll-mt-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} custom={0} variants={fadeInUp} className="mb-4 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">Wedding Timeline</h2>
          <p className="mt-2 text-sm text-slate-400">A mobile-friendly stacked timeline — tap an event for details.</p>
        </motion.div>

        <div ref={wrapperRef} className="space-y-4">
          {events
            .slice()
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map((ev, idx) => {
              const dt = new Date(ev.date);
              const timeLabel = dt.toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
              return (
                <motion.article
                  key={ev.date + idx}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: idx * 0.06 }}
                  className="relative rounded-2xl border border-white/8 bg-gradient-to-br from-slate-900/70 to-slate-800/60 p-4 shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex w-12 flex-col items-center">
                      <span className="inline-flex h-3 w-3 shrink-0 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 ring-2 ring-slate-800" />
                      {idx !== events.length - 1 && <span className="mt-2 block h-full w-px bg-white/5 flex-1" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-sm font-semibold text-slate-100 truncate">{ev.label}</h3>
                        <div className="text-xs text-slate-400">{timeLabel}</div>
                      </div>

                      {ev.location && <div className="mt-2 text-xs text-slate-300">{ev.location}</div>}

                      <div className="mt-3 flex gap-2">
                        {ev.link ? (
                          <a
                            href={ev.link}
                            target={ev.link.startsWith("#") ? undefined : "_blank"}
                            rel={ev.link.startsWith("#") ? undefined : "noopener noreferrer"}
                            className="rounded-full bg-slate-800/60 px-3 py-1 text-xs font-medium text-white hover:bg-slate-800/80"
                          >
                            Open
                          </a>
                        ) : null}

                        <button
                          onClick={() =>
                            setHoverInfo({
                              x: 0,
                              y: 0,
                              html: `<div class="font-semibold">${ev.label}</div><div class="text-xs mt-1">${timeLabel}</div>${ev.location ? `<div class="text-xs mt-1">${ev.location}</div>` : ""}`,
                            })
                          }
                          className="rounded-full border border-white/8 px-3 py-1 text-xs text-slate-200"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
        </div>

        <div
          ref={tooltipRef}
          role="status"
          aria-live="polite"
          className={`pointer-events-auto mt-4 rounded-md bg-slate-900/95 px-3 py-2 text-sm text-white shadow-lg transition-opacity ${hoverInfo ? "opacity-100" : "opacity-0"}`}
          style={{ transform: "translateY(0)", transition: "opacity 160ms ease" }}
          dangerouslySetInnerHTML={hoverInfo ? { __html: hoverInfo.html } : undefined}
        />
      </section>
    );
  }

  // Desktop / wide: show D3 SVG timeline
  return (
    <section id="timeline" className="scroll-mt-24">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} custom={0} variants={fadeInUp} className="mb-4 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">Wedding Timeline</h2>
        <p className="mt-2 text-sm text-slate-400">A visual overview of all main events — pan/zoom, hover nodes for details.</p>
      </motion.div>

      <div ref={wrapperRef} className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-4">
        <svg ref={ref} className="w-full h-40" role="img" aria-label="Wedding timeline" />
        <div
          ref={tooltipRef}
          role="status"
          aria-live="polite"
          className="pointer-events-none absolute z-50 rounded-md bg-slate-900/95 px-3 py-2 text-sm text-white shadow-lg"
          style={{ opacity: 0, transition: "opacity 120ms ease", transform: "translateY(-4px)" }}
        />
      </div>
    </section>
  );
}
