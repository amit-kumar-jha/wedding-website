export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/80 py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 text-xs text-slate-500">
        <span>© {new Date().getFullYear()} Pragya &amp; Amit</span>
        <span>Made with ❤️ and a lot of chai</span>
      </div>
    </footer>
  );
}
