'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function ConditionalNavbar() {
  const pathname = usePathname();

  // páginas sem navbar
  const hideNavbar =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname.startsWith('/auth');

  if (hideNavbar) return null;

  return <Navbar />;
}