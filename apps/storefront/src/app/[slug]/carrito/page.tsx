import { CartView } from '@/components/cart-view';

export default function CarritoPage({ params }: { params: { slug: string } }) {
  return <CartView slug={params.slug} />;
}
