export default function Navbar() {
  const items = [
    { href: "#story", label: "Our Story" },
    { href: "#countdown", label: "Countdown" },
    { href: "#wedding-family-advanced", label: "Families" },
    { href: "#events", label: "Events" },
    { href: "#timeline", label: "Timeline" },
    { href: "#gallery", label: "Gallery" },
    { href: "#travel", label: "Travel" },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="#top" className="font-semibold tracking-tight">
          Pragya &amp; Amit
        </a>
        <div className="hidden gap-6 text-sm md:flex">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-slate-300 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}