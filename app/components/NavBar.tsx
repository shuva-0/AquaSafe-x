"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/analyze", label: "Analyze" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-4
        bg-[#0B0F19]/80 backdrop-blur-xl border-b border-gray-800/60"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white text-sm font-black shadow-lg shadow-cyan-500/25">
          A
        </div>
        <span className="font-black text-sm tracking-tight bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          AquaSafe X∞
        </span>
      </Link>

      {/* Links */}
      <div className="flex items-center gap-1">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-4 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                active ? "text-white" : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {active && (
                <motion.div
                  className="absolute inset-0 rounded-lg bg-white/5 border border-gray-700"
                  layoutId="nav-active"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10">{link.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Status indicator */}
      <div className="flex items-center gap-2 text-xs text-emerald-400">
        <motion.span
          className="w-2 h-2 rounded-full bg-emerald-400"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        System Online
      </div>
    </motion.nav>
  );
}