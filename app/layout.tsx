import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Quercus MES',
  description: 'Manufacturing Execution System for Quercus Woodworking',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-quercus-bg min-h-screen text-slate-900`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
