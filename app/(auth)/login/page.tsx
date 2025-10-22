import Link from 'next/link';
import Image from 'next/image';
import LoginForm from '@/app/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:block relative">
        <Image
          src="/man.jpg"
          alt="Fitness"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <Link
          href="/"
          aria-label="Ir al inicio"
          className="absolute top-4 left-4 z-10"
        >
          <Image
            src="/logo-white.png"
            alt="ProofLift"
            width={150}
            height={150}
            className="drop-shadow-md"
            priority
          />
        </Link>
      </div>

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary mb-2">
              Bienvenido de vuelta
            </h1>
            <p className="text-muted-foreground">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}