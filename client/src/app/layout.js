import './globals.css';
import Navbar from '@/components/Navbar';


import { AuthProvider } from '@/context/AuthContext';

export const metadata = {
  title: 'CodeArena',
  description: 'GenAI-Powered DSA Practice Platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground">
        <AuthProvider>
          <Navbar />
          <main className="container mx-auto px-4 py-6 md:py-8 flex-grow">{children}</main>
          <footer className="mt-auto py-6 text-center text-sm text-muted">
            <p>© {new Date().getFullYear()} CodeArena. All rights reserved.</p>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}

