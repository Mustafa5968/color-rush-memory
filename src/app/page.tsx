import GameBoard from '../components/GameBoard';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black text-white selection:bg-yellow-400 selection:text-black overflow-x-hidden">
      <div className="container mx-auto px-4 py-8 flex flex-col items-center relative z-0">

        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10 animate-pulse delay-700"></div>

        <header className="mb-8 text-center">
          <h1 className="text-6xl sm:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500 drop-shadow-sm">
            COLOR RUSH
          </h1>
          <p className="mt-2 text-slate-400 font-medium tracking-wide">MEMORY MATCH CHALLENGE</p>
        </header>

        <GameBoard />

        <footer className="mt-16 text-xs text-slate-600">
          © {new Date().getFullYear()} Color Rush. Test your memory.
        </footer>
      </div>
    </main>
  );
}
