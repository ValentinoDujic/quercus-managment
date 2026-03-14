'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Hammer, TreePine, LogOut } from 'lucide-react';

const navItems = [
  { name: 'Nadzorna ploča', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Radni terminal', href: '/worker', icon: Hammer },
];

export function Navigation() {
  const pathname = usePathname() || '';

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-20 hover:w-64 transition-all duration-300 overflow-hidden group bg-quercus-primary text-white h-screen fixed top-0 left-0 z-20 shadow-xl">
        <Link href="/" className="p-6 flex items-center gap-3 border-b border-white/10 hover:bg-white/5 transition-colors shrink-0">
          <TreePine className="w-8 h-8 text-quercus-accent shrink-0" />
          <span className="text-xl font-bold tracking-tight opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-300">Quercus MES</span>
        </Link>
        <nav className="flex-1 p-4 space-y-2 overflow-x-hidden">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-white/20 text-white font-medium'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
                title={item.name}
              >
                <Icon className="w-6 h-6 shrink-0" />
                <span className="opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-300">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/10 overflow-x-hidden">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            title="Odjava"
          >
            <LogOut className="w-6 h-6 shrink-0" />
            <span className="opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-300">
              Odjava
            </span>
          </Link>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 z-20 pb-safe">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? 'text-quercus-primary' : 'text-gray-500 hover:text-quercus-primary'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : ''}`} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
        <Link
          href="/"
          className="flex flex-col items-center justify-center w-full h-full space-y-1 text-gray-500 hover:text-quercus-primary"
        >
          <LogOut className="w-6 h-6" />
          <span className="text-[10px] font-medium">Odjava</span>
        </Link>
      </nav>
    </>
  );
}
