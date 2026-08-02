export default function RootPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-2 px-4 text-center">
      <h1 className="text-xl font-semibold">Esta es una plataforma multi-tienda</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        Accedé a una tienda específica usando su dirección, por ejemplo{' '}
        <code className="rounded bg-secondary px-1.5 py-0.5">/nombre-de-la-tienda</code>.
      </p>
    </div>
  );
}
