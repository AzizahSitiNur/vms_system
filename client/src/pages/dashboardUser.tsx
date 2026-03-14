export default function DashboardPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-slate-50">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Login berhasil</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-4 text-base text-slate-300">
          Selamat datang di dashboard!
        </p>
      </div>
    </main>
  )
}