export function Footer() {
  return (
    <footer className="w-full py-10 bg-[#c5c5c5] flex items-center justify-center">
      <p className="font-bold text-black text-xl text-center">
        © {new Date().getFullYear()} ReadFlow — Todos los derechos reservados
      </p>
    </footer>
  );
}
