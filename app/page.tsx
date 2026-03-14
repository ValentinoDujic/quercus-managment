import Link from 'next/link';
import { LayoutDashboard, Hammer, TreePine } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="max-w-4xl w-full space-y-12 text-center">
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center p-4 bg-quercus-primary/10 rounded-full mb-4">
            <TreePine className="w-16 h-16 text-quercus-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900">
            Dobrodošli u <span className="text-quercus-primary">Quercus MES</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Sustav za upravljanje proizvodnjom. Odaberite svoj portal za nastavak.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <Link 
            href="/login"
            className="group relative flex flex-col items-center justify-center p-12 bg-white rounded-3xl shadow-sm border border-slate-200 hover:border-quercus-primary hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-quercus-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <LayoutDashboard className="w-16 h-16 text-quercus-primary mb-6 group-hover:scale-110 transition-transform duration-300" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Nadzorna ploča</h2>
            <p className="text-slate-500 text-center">Analitika, planiranje proizvodnje i izvještaji.</p>
          </Link>

          <Link 
            href="/worker"
            className="group relative flex flex-col items-center justify-center p-12 bg-white rounded-3xl shadow-sm border border-slate-200 hover:border-quercus-accent hover:shadow-md transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-quercus-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Hammer className="w-16 h-16 text-quercus-accent mb-6 group-hover:scale-110 transition-transform duration-300" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Radni terminal</h2>
            <p className="text-slate-500 text-center">Aktivni zadaci, praćenje vremena i status strojeva.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
