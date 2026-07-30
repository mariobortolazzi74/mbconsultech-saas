import Link from 'next/link'
import { signInWithMagicLink } from './actions'
import Image from 'next/image'

export default async function Login(props: {
  searchParams: Promise<{ message: string }>
}) {
  const searchParams = await props.searchParams;
  
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center mb-6">
          <Image src="/assets/logo.png" alt="MB Consultech Logo" width={250} height={64} className="h-16 w-auto" />
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Accesso Area Riservata
        </h2>
        <p className="mt-2 text-center text-sm text-zinc-400">
          Laboratorio Virtuale & Ticketing
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-zinc-900 py-8 px-4 shadow-2xl sm:rounded-2xl border border-zinc-800 sm:px-10">
          <form className="space-y-6" action={signInWithMagicLink}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
                Indirizzo Email Aziendale
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-3 border border-zinc-700 rounded-md shadow-sm placeholder-zinc-500 bg-zinc-950 text-white focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors"
                  placeholder="nome@azienda.com"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.3)] text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
              >
                Invia Magic Link
              </button>
            </div>
            
            {searchParams?.message && (
              <div className="mt-4 p-4 rounded-md bg-zinc-950 border border-emerald-900/50">
                <p className="text-sm text-emerald-400 text-center">
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
