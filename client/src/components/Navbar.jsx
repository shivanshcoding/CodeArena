import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-black text-white p-4 flex justify-between">
      <Link href="/" className="font-bold text-xl">CodeArena</Link>
      <div className="space-x-4">
        <Link href="/problems">Problems</Link>
      </div>
    </nav>
  );
}
