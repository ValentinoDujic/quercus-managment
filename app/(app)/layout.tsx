import { Navigation } from '@/components/Navigation';

export default function AppLayout({children}: {children: React.ReactNode}) {
  return (
    <>
      <Navigation />
      <main className="md:ml-64 pb-16 md:pb-0 min-h-screen">
        {children}
      </main>
    </>
  );
}
