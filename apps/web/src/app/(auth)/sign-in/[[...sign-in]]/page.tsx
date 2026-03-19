export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="w-full max-w-md space-y-6 p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Connexion</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Connectez-vous à votre compte ChatBot AI
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6 text-center text-muted-foreground">
          Clerk SignIn component à configurer
        </div>
      </div>
    </div>
  );
}
