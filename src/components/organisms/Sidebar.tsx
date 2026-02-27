import Link from 'next/link';
import { ThemeToggle } from '../atoms/theme-toggle';
import { IconAddAd } from '../atoms/icons/IconAddAd';
import { IconArchive } from '../atoms/icons/IconArchive';
import { IconStats } from '../atoms/icons/IconStats';
import { IconLogout } from '../atoms/icons/IconLogout';
import { LogoIcon } from '../atoms/LogoIcon';

export default function Sidebar() {
  return (
    <aside className=" w-64 h-screen bg-background-secondary flex flex-col p-4 border-r border-border shadow-sm transition-colors">

      <div className="flex items-center justify-center gap-3 mb-8 px-2 pt-8">
        <LogoIcon size={24} className="text-foreground" />
        <h2 className="text-xl font-medium text-foreground">ReadFlow</h2>
      </div>


      <nav className="flex-1 flex flex-col gap-8 pt-24 pb-10">
        <Link href="/dashboard" className="flex items-center gap-3 p-2 hover:bg-hover rounded-lg text-foreground font-base transition-colors group">
          <IconAddAd className="w-6 h-6 text-foreground transition-colors" />
          <span>Nuevo resumen</span>
        </Link>
        <Link href="/history" className="flex items-center gap-3 p-2 hover:bg-hover rounded-lg text-foreground font-base transition-colors group">
          <IconArchive className="w-6 h-6 text-foreground transition-colors" />
          <span>Historial</span>
        </Link>
        <Link href="/stats" className="flex items-center gap-3 p-2 hover:bg-hover rounded-lg text-foreground font-base transition-colors group">
          <IconStats className="w-6 h-6 text-foreground transition-colors" />
          <span>Estadísticas</span>
        </Link>
      </nav>

      <div className="flex justify-center">
        <ThemeToggle />
      </div>

      <div className="mt-auto pt-4">
        <Link href="/login" className="flex items-center gap-3 p-2 text-foreground hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-base transition-colors group">
          <IconLogout className="w-6 h-6 text-foreground group-hover:text-red-500 transition-colors" />
          <span className="group-hover:text-red-500 transition-colors">Cerrar sesión</span>
        </Link>
      </div>
    </aside>
  );
}