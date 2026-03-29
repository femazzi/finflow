import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="sticky top-0 bg-dark-900/80 backdrop-blur-sm border-b border-white/10 h-16 flex items-center justify-between px-8 z-40">
      <div />
      <ThemeToggle />
    </header>
  );
}
