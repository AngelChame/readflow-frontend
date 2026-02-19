import Link from 'next/link';
import ThemeSwitch from "../atoms/ThemeSwitch";

export default function Sidebar() {
  return (
    <aside className=" w-64 h-screen bg-white flex flex-col p-4">
      
      <div className="flex items-center justify-center gap-3 mb-8 px-2 pt-8">
        <img src="./logo/logo-main.svg" alt="Logo ReadFlow" width={24} height={24} />
        <h2 className="text-xl font-medium text-black">ReadFlow</h2>
      </div>
	
    
      <nav className="flex-1 flex flex-col gap-2 pt-15 pb-10">
        <Link href="/dashboard" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg text-gray-700 font-medium transition-colors">
          <img src="./icons/add-ad.svg" alt=""/>
          <span className="font-medium text-black">Nuevo resumen</span>
        </Link>
        <Link href="/history" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg text-gray-700 font-medium transition-colors">
          <img src="./icons/archive.svg" alt=""/>
          <span className="font-medium text-black">Historial</span>
        </Link>
        <Link href="/stats" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg text-gray-700 font-medium transition-colors">
          <img src="./icons/stats.svg" alt=""/>
          <span className="font-medium text-black">Estadísticas</span>
        </Link>
      </nav>

      
      <div className="mt-auto pt-4">
        <Link href="/login" className="flex items-center gap-2 p-2 text-red-600 hover:bg-red-50 rounded-lg font-medium block">
          <img src="./icons/logout.svg" alt=""/>
          <span className="font-medium text-black">Cerrar sesión</span>
        </Link>
      </div>
      <ThemeSwitch />
    </aside>
  );
}