import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'CodeArena',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="bg-black text-white px-4 py-3 flex justify-between">
          <Link href="/" className="text-xl font-bold">CodeArena</Link>
          <Link href="/problems">Problems</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
