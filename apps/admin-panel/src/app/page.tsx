import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';

export default function RootPage() {
  redirect(getSession() ? '/dashboard' : '/login');
}
