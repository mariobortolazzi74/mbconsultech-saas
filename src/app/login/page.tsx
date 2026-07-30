import Link from 'next/link'
import { login, signup, signInWithOAuth } from './actions'
import Image from 'next/image'
import { Provider } from '@supabase/supabase-js'

// --- Icone SVG in-line per le piattaforme OAuth ---
const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
)

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
)

const MicrosoftIcon = () => (
  <svg viewBox="0 0 21 21" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path fill="#f25022" d="M1 1h9v9H1z"/><path fill="#00a4ef" d="M1 11h9v9H1z"/><path fill="#7fba00" d="M11 1h9v9h-9z"/><path fill="#ffb900" d="M11 11h9v9h-9z"/></svg>
)

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.19 2.24-.88 3.61-.83 1.88.16 3.19.98 4.09 2.24-3.52 1.83-2.92 6.64.48 7.92-.81 1.68-1.55 3.31-3.26 2.84M12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25"/></svg>
)

export default async function Login(props: {
  searchParams: Promise<{ message: string }>
}) {
  const searchParams = await props.searchParams;
  
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center mb-6">
          <Image src="/assets/logo.png" alt="MB Consultech Logo" width={250} height={64} className="h-16 w-auto" />
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-muted">
          Sign in to your Virtual Laboratory
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[420px]">
        <div className="bg-surface py-8 px-4 sm:px-10 border border-border sm:rounded-xl shadow-2xl">
          
          {/* Griglia OAuth */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <form action={async () => { "use server"; await signInWithOAuth('google' as Provider) }}>
              <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-background hover:bg-[#252525] border border-border rounded-lg text-sm font-medium text-foreground transition-colors">
                <GoogleIcon />
                <span>Google</span>
              </button>
            </form>
            <form action={async () => { "use server"; await signInWithOAuth('azure' as Provider) }}>
              <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-background hover:bg-[#252525] border border-border rounded-lg text-sm font-medium text-foreground transition-colors">
                <MicrosoftIcon />
                <span>Microsoft</span>
              </button>
            </form>
            <form action={async () => { "use server"; await signInWithOAuth('github' as Provider) }}>
              <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-background hover:bg-[#252525] border border-border rounded-lg text-sm font-medium text-foreground transition-colors">
                <GithubIcon />
                <span>GitHub</span>
              </button>
            </form>
            <form action={async () => { "use server"; await signInWithOAuth('apple' as Provider) }}>
              <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-background hover:bg-[#252525] border border-border rounded-lg text-sm font-medium text-foreground transition-colors">
                <AppleIcon />
                <span>Apple</span>
              </button>
            </form>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-surface text-muted">or continue with</span>
            </div>
          </div>

          {/* Form Email / Password */}
          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none block w-full px-3 py-2.5 border border-border rounded-lg shadow-sm placeholder-muted bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors"
                placeholder="name@company.com"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none block w-full px-3 py-2.5 border border-border rounded-lg shadow-sm placeholder-muted bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div className="pt-2 flex gap-3">
              <button
                formAction={login}
                className="flex-1 flex justify-center py-2.5 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-background transition-colors"
              >
                Sign in
              </button>
              <button
                formAction={signup}
                className="flex-1 flex justify-center py-2.5 px-4 border border-border rounded-lg text-sm font-medium text-foreground bg-background hover:bg-[#252525] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 focus:ring-offset-background transition-colors"
              >
                Sign up
              </button>
            </div>
            
            {searchParams?.message && (
              <div className="mt-4 p-3 rounded-lg bg-background border border-border">
                <p className="text-sm text-center text-foreground">
                  {searchParams.message}
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
