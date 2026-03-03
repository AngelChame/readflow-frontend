"use client";

import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { label: "Inicio", href: "#inicio" },
  { label: "Cómo Funciona", href: "#como-funciona" },
  { label: "Metodología", href: "#metodologia" },
  { label: "Equipo", href: "#equipo" },
];

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-10 py-6 bg-black/10 backdrop-blur-md border-b border-white/10 transition-all">
      {/* Logo */}
      <Link href="#inicio" className="flex items-center gap-2">
        <Image
          src="/logo/logo.svg"
          alt="ReadFlow Logo"
          width={40}
          height={40}
        />
        <span className="text-white text-xl font-normal">ReadFlow</span>
      </Link>

      {/* Navegación */}
      <nav
        className="hidden md:flex items-center gap-6"
        aria-label="Navegación principal"
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={(e) => {
              e.preventDefault();
              const element = document.querySelector(link.href);
              if (element) {
                element.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="text-white text-xl hover:opacity-80 transition-opacity"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Botones de auth */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="px-6 py-3 rounded-3xl bg-white/10 text-white text-xl hover:opacity-90 transition-opacity"
        >
          Acceso
        </button>
        <button
          type="button"
          className="px-6 py-3 rounded-3xl bg-white text-black text-xl hover:opacity-90 transition-opacity"
        >
          Registro
        </button>
      </div>
    </header>
  );
}
