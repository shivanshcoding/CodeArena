
import './globals.css';
import Link from 'next/link';
import { AuthProvider } from '@/context/AuthContext'; // ✅ Make sure this path is correct

export const metadata = {
  title: 'CodeArena',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {/* Navbar */}
          <nav className="bg-black text-white px-4 py-3 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold">CodeArena</Link>
            <div className="space-x-4">
              <Link href="/problems">Problems</Link>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </div>
          </nav>

          {/* Page content */}
          <main className="p-4">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
