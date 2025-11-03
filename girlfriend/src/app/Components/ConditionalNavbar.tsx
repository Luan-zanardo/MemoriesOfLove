'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function ConditionalNavbar() {
  const pathname = usePathname();

  // páginas sem navbar
  const hideNavbar =
    pathname === '/login' ||
    pathname === '/register' ||
    (pathname ? pathname.startsWith('/auth') : false);

  if (hideNavbar) return null;

  return <Navbar />;
}