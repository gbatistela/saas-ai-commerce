import { LoginForm } from '@/components/login-form';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1 text-center">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">
            AI
          </div>
          <h1 className="text-xl font-semibold">Iniciar sesión</h1>
          <p className="text-sm text-muted-foreground">
            Entrá al panel de tu asistente de IA
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
