import { Navigation } from '@/components/Navigation';
import { MesProvider } from '@/context/MesContext';

export default function AppLayout({children}: {children: React.ReactNode}) {
  return (
    <MesProvider>
      <Navigation />
      <main className="md:ml-20 pb-16 md:pb-0 min-h-screen transition-all duration-300">
        {children}
      </main>
    </MesProvider>
  );
}
