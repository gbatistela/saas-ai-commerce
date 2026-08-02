import { CheckoutForm } from '@/components/checkout-form';

export default function CheckoutPage({ params }: { params: { slug: string } }) {
  return (
    <div className="mx-auto max-w-md space-y-6">
      <h1 className="text-2xl font-semibold">Checkout</h1>
      <CheckoutForm slug={params.slug} />
    </div>
  );
}
