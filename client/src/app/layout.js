import './globals.css';
import Navbar from '@/components/Navbar';
import '@/styles/register.css'

import { AuthProvider } from '@/context/AuthContext';

export const metadata = {
  title: 'CodeArena',
  description: 'GenAI-Powered DSA Practice Platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans bg-gray-50 text-gray-900">
        <AuthProvider>
          <Navbar />
          <main className="p-4">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}

