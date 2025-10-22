import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-4xl text-center space-y-8">
        <Image
          src="/logo.png"
          alt="Logo de ProofLift"
          width={96}
          height={96}
          className="mx-auto"
          priority
        />

        <h1 className="text-6xl font-bold text-primary">
          Bienvenido a ProofLift
        </h1>
        <p className="text-2xl text-muted-foreground">
          Tu comunidad de fitness. Entrena, comparte y crece con nosotros.
        </p>
        
        <div className="flex gap-4 justify-center mt-8">
          <Link 
            href="/login"
            className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition"
          >
            Iniciar Sesión
          </Link>
          <Link 
            href="/register"
            className="px-8 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition"
          >
            Registrarse
          </Link>
        </div>
      </div>
    </div>
  );
}