// components/SeatingChart.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Interactive Seating Chart
 *
 * Usage: import and render <SeatingChart /> inside a page or component.
 *
 * No external libraries required. Data persists to localStorage under key "wedding_seating_v1".
 */

type Guest = { id: string; name: string };
type Seat = { id: string; guestId?: string };
type Table = { id: string; title: string; seats: Seat[]; x?: number; y?: number };

const STORAGE_KEY = "wedding_seating_v1";

function uid(prefix = "") {
  return prefix + Math.random().toString(36).slice(2, 9);
}

export default function SeatingChart() {
  // guests roster
  const [guests, setGuests] = useState<Guest[]>([]);
  // tables with seats
  const [tables, setTables] = useState<Table[]>([]);
  const [newGuestName, setNewGuestName] = useState("");
  const [selectedTableType, setSelectedTableType] = useState<"round" | "rect">(
    "round"
  );

  // load initial data from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setGuests(parsed.guests || []);
        setTables(parsed.tables || []);
        return;
      }
    } catch (e) {
      // ignore
    }

    // default seed: two small tables and sample guests
    const seedGuests = [
      { id: uid("g_"), name: "Amit" },
      { id: uid("g_"), name: "Alka" },
      { id: uid("g_"), name: "Rahul" },
      { id: uid("g_"), name: "Priya" },
    ];
    const seedTables: Table[] = [
      { id: uid("t_"), title: "Table 1", seats: Array.from({ length: 6 }).map(() => ({ id: uid("s_") })) },
      { id: uid("t_"), title: "Table 2", seats: Array.from({ length: 6 }).map(() => ({ id: uid("s_") })) },
    ];
    setGuests(seedGuests);
    setTables(seedTables);
  }, []);

  // persist to localStorage on changes
  useEffect(() => {
    const payload = { guests, tables };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      // ignore
    }
  }, [guests, tables]);

  // helper: find guest by id
  const findGuest = (id?: string) => guests.find((g) => g.id === id);

  // add guest to roster (not assigned)
  function addGuest(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    const g = { id: uid("g_"), name: trimmed };
    setGuests((s) => [...s, g]);
    setNewGuestName("");
  }

  // create a new table with given seat count
  function addTable(seatCount = 6) {
    const t: Table = { id: uid("t_"), title: `Table ${tables.length + 1}`, seats: Array.from({ length: seatCount }).map(() => ({ id: uid("s_") })) };
    setTables((s) => [...s, t]);
  }

  // change seat count on a table (recreate seats — best used before assignment)
  function setSeatCount(tableId: string, count: number) {
    setTables((ts) => ts.map((t) => t.id === tableId ? { ...t, seats: Array.from({ length: count }).map(() => ({ id: uid("s_") })) } : t));
  }

  // remove table
  function removeTable(tableId: string) {
    // return any assigned guests to roster (by removing guestId)
    setTables((ts) => ts.filter((t) => t.id !== tableId));
  }

  // drag & drop handlers (HTML5)
  function onDragStartGuest(e: React.DragEvent, guestId: string) {
    e.dataTransfer.setData("text/plain", `guest:${guestId}`);
    // allow drop effect
    e.dataTransfer.effectAllowed = "move";
  }

  function onDragStartFromSeat(e: React.DragEvent, guestId?: string) {
    if (!guestId) { e.preventDefault(); return; }
    e.dataTransfer.setData("text/plain", `guest:${guestId}`);
    e.dataTransfer.effectAllowed = "move";
  }

  function onAllowDrop(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  // drop onto seat
  function onDropToSeat(e: React.DragEvent, tableId: string, seatId: string) {
    e.preventDefault();
    const raw = e.dataTransfer.getData("text/plain");
    if (!raw) return;
    const [, id] = raw.split(":");
    if (!id) return;
    // remove guest from any other seat
    setTables((ts) =>
      ts.map((t) => ({
        ...t,
        seats: t.seats.map((s) => (s.guestId === id ? { ...s, guestId: undefined } : s)),
      }))
    );

    // assign guest to this seat
    setTables((ts) =>
      ts.map((t) =>
        t.id === tableId ? { ...t, seats: t.seats.map((s) => (s.id === seatId ? { ...s, guestId: id } : s)) } : t
      )
    );

    // ensure guest exists in roster (should already)
    setGuests((gs) => {
      if (gs.find((x) => x.id === id)) return gs;
      return [...gs, { id, name: "Unknown" }];
    });
  }

  // remove guest assignment from a seat (returns to roster)
  function unassignFromSeat(tableId: string, seatId: string) {
    setTables((ts) =>
      ts.map((t) => (t.id === tableId ? { ...t, seats: t.seats.map((s) => (s.id === seatId ? { ...s, guestId: undefined } : s)) } : t))
    );
  }

  // drop onto roster area -> unassign (puts them back into pool)
  function onDropToRoster(e: React.DragEvent) {
    e.preventDefault();
    const raw = e.dataTransfer.getData("text/plain");
    if (!raw) return;
    const [, id] = raw.split(":");
    if (!id) return;
    // remove from seats
    setTables((ts) =>
      ts.map((t) => ({ ...t, seats: t.seats.map((s) => (s.guestId === id ? { ...s, guestId: undefined } : s)) }))
    );
  }

  // export plan
  function exportPlan() {
    const data = { guests, tables };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "seating-plan.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  // import plan
  function importPlan(file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (parsed.guests && parsed.tables) {
          setGuests(parsed.guests);
          setTables(parsed.tables);
        } else {
          alert("Invalid plan file");
        }
      } catch (e) {
        alert("Failed to parse file");
      }
    };
    reader.readAsText(file);
  }

  // print view (open print dialog)
  function handlePrint() {
    window.print(); // ensure print CSS friendly
  }

  // get unassigned guests
  const assignedGuestIds = new Set<string>();
  tables.forEach((t) => t.seats.forEach((s) => s.guestId && assignedGuestIds.add(s.guestId)));
  const unassignedGuests = guests.filter((g) => !assignedGuestIds.has(g.id));

  // small UI bits
  return (
    <section className="scroll-mt-24 my-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Seating Chart</h2>
            <p className="mt-1 text-sm text-slate-400">Drag guests onto seats — export or print the plan.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button onClick={() => addTable(6)} className="rounded-full bg-pink-500 px-3 py-2 text-sm text-white">+ Add Table</button>
            <button onClick={() => { if (tables.length) setTables((t)=>t.slice(0, -1)); }} className="rounded-full border px-3 py-2 text-sm">Remove Last</button>
            <button onClick={() => exportPlan()} className="rounded-full border px-3 py-2 text-sm">Export JSON</button>
            <label className="rounded-full border px-3 py-2 text-sm cursor-pointer">
              Import
              <input type="file" accept="application/json" className="sr-only" onChange={(e)=>importPlan(e.target.files?.[0] ?? null)} />
            </label>
            <button onClick={handlePrint} className="rounded-full border px-3 py-2 text-sm">Print</button>
            <button onClick={() => { localStorage.removeItem(STORAGE_KEY); setGuests([]); setTables([]); }} className="rounded-full border px-3 py-2 text-sm text-red-500">Reset</button>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: ROSTER */}
          <div className="col-span-1">
            <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
              <h3 className="font-semibold">Guest Roster</h3>

              <form onSubmit={(e)=>{ e.preventDefault(); addGuest(newGuestName); }} className="mt-3 flex gap-2">
                <input value={newGuestName} onChange={(e)=>setNewGuestName(e.target.value)} placeholder="Add guest name" className="flex-1 rounded-md bg-slate-950/60 px-3 py-2 text-sm" />
                <button type="submit" className="rounded-md bg-pink-500 px-3 py-2 text-sm text-white">Add</button>
              </form>

              <div className="mt-4 space-y-2 max-h-72 overflow-auto">
                {unassignedGuests.length === 0 && <div className="text-sm text-slate-400">No unassigned guests</div>}
                {unassignedGuests.map((g) => (
                  <motion.div key={g.id} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center justify-between gap-2 rounded-md border border-white/6 bg-slate-800/50 p-2">
                    <div className="text-sm">{g.name}</div>
                    <div className="flex gap-2">
                      <button draggable onDragStart={(e)=>onDragStartGuest(e, g.id)} title="Drag to seat" className="rounded px-2 py-1 text-xs border">Drag</button>
                      <button onClick={()=>{ /* quick assign to first free seat */ 
                        let assigned=false;
                        setTables(ts => ts.map(t=> {
                          if(assigned) return t;
                          const seats = t.seats.map(s => {
                            if(!assigned && !s.guestId) { assigned=true; return {...s, guestId:g.id} }
                            return s;
                          });
                          return {...t, seats};
                        }));
                      }} className="rounded px-2 py-1 text-xs border">Auto</button>
                      <button onClick={()=>setGuests(gs=>gs.filter(x=>x.id!==g.id))} className="rounded px-2 py-1 text-xs border text-red-400">Remove</button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Drop unassign area */}
            <div onDragOver={onAllowDrop} onDrop={onDropToRoster} className="mt-3 rounded-md border border-white/6 bg-slate-900/40 p-3 text-sm text-slate-400">
              Drag here to unassign (return to roster)
            </div>
          </div>

          {/* MIDDLE & RIGHT: Tables */}
          <div className="col-span-2 space-y-4">
            <div className="flex flex-wrap gap-4">
              {/* quick controls */}
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-3">
                <div className="text-xs text-slate-400">Add table type</div>
                <div className="mt-2 flex gap-2">
                  <button onClick={()=>addTable(6)} className="rounded px-3 py-1 text-sm border">6 seats</button>
                  <button onClick={()=>addTable(8)} className="rounded px-3 py-1 text-sm border">8 seats</button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tables.map((t) => (
                <div key={t.id} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                  <div className="flex items-center justify-between">
                    <strong>{t.title}</strong>
                    <div className="flex gap-2">
                      <button onClick={()=>setSeatCount(t.id, Math.max(1, t.seats.length - 1))} className="text-xs px-2 py-1 border rounded">-</button>
                      <div className="text-xs px-2 py-1 border rounded bg-slate-800/50">{t.seats.length} seats</div>
                      <button onClick={()=>setSeatCount(t.id, t.seats.length + 1)} className="text-xs px-2 py-1 border rounded">+</button>
                      <button onClick={()=>removeTable(t.id)} className="text-xs px-2 py-1 border rounded text-red-400">Delete</button>
                    </div>
                  </div>

                  {/* seats visual */}
                  <div className="mt-4 flex flex-wrap gap-3">
                    {t.seats.map((s) => {
                      const g = findGuest(s.guestId);
                      return (
                        <div
                          key={s.id}
                          onDragOver={onAllowDrop}
                          onDrop={(e) => onDropToSeat(e, t.id, s.id)}
                          className="min-w-[120px] flex-1 rounded-lg border border-white/6 bg-slate-800/50 p-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="text-sm font-medium">{g ? g.name : <span className="text-slate-400">Empty</span>}</div>
                            <div className="flex gap-1">
                              {g && <button draggable onDragStart={(e)=>onDragStartFromSeat(e, g.id)} title="Drag guest" className="text-xs px-2 py-1 border rounded">Drag</button>}
                              {g && <button onClick={()=>unassignFromSeat(t.id, s.id)} className="text-xs px-2 py-1 border rounded text-red-400">Remove</button>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 text-sm text-slate-400">
          Tip: drag a guest from the roster (or from a seat) and drop onto any seat. Use Export to share the plan with coordinators.
        </div>
      </div>
    </section>
  );
}
