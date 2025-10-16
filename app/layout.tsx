import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AutorIA MVP",
  description: "Chat sobre documentos com múltiplas IAs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen bg-black text-white">
          <header className="border-b border-gray-800 bg-black">
            <div className="container mx-auto px-4 py-4">
              <nav className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  <div className="flex items-center gap-2">
                    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="2" y="2" width="46" height="40" rx="4" stroke="white" strokeWidth="2" fill="black"/>
                      <circle cx="15" cy="32" r="3" fill="#EF4444"/>
                      <circle cx="25" cy="20" r="3" fill="#EF4444"/>
                      <circle cx="35" cy="15" r="3" fill="#EF4444"/>
                      <line x1="15" y1="29" x2="25" y2="23" stroke="#EF4444" strokeWidth="2"/>
                      <line x1="25" y1="17" x2="35" y2="18" stroke="#EF4444" strokeWidth="2"/>
                      <path d="M 2 42 Q 10 46 20 46 Q 30 46 38 46 L 46 42" stroke="white" strokeWidth="2" fill="none"/>
                    </svg>
                    <span className="text-2xl font-bold">
                      Autor<span className="text-red-500">IA</span>
                    </span>
                  </div>
                </Link>
                <div className="flex gap-6">
                  <Link
                    href="/"
                    className="text-sm hover:text-red-500 transition-colors"
                  >
                    Documentos
                  </Link>
                  <Link
                    href="/settings"
                    className="text-sm hover:text-red-500 transition-colors"
                  >
                    Configurações
                  </Link>
                </div>
              </nav>
            </div>
          </header>
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </div>
        <Toaster theme="dark" />
      </body>
    </html>
  );
}
