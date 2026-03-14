const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#1A1F2E" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  )
}

export default function Home() {
  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .login-card { animation: fadeUp .4s ease both; }
        .login-btn:hover {
          border-color: #B8BFCF !important;
          background: #FAFBFD !important;
          box-shadow: 0 2px 8px rgba(0,0,0,.06);
        }
      `}</style>

      <main style={{
        fontFamily: 'var(--font-plus-jakarta-sans, "Plus Jakarta Sans", sans-serif)',
        background: '#F5F6FA',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#1A1F2E',
      }}>
        <div className="login-card" style={{
          background: '#fff',
          borderRadius: '20px',
          width: '400px',
          padding: '40px',
          boxShadow: '0 2px 4px rgba(0,0,0,.04), 0 12px 40px rgba(0,0,0,.08)',
        }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
            <div style={{
              width: '38px', height: '38px', background: '#1B3A8C', borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '17px', flexShrink: 0,
            }}>🏢</div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#1A1F2E' }}>VMS KTI</div>
              <div style={{ fontSize: '11px', color: '#9AA1B4', marginTop: '1px' }}>Visitor Management System</div>
            </div>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1A1F2E', margin: '0 0 6px', letterSpacing: '-.01em' }}>
              Masuk ke akun Anda
            </h1>
            <p style={{ fontSize: '13.5px', color: '#6B7385', lineHeight: 1.6, margin: 0 }}>
              Silakan masuk ke akun Anda agar dapat mengajukan reservasi kunjungan.
            </p>
          </div>

          {/* OAuth Buttons */}
          <a
            href={`${backendUrl}/auth/google`}
            className="login-btn"
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
              padding: '13px 16px', background: '#fff', border: '1.5px solid #E4E7EF',
              borderRadius: '12px', fontSize: '14px', fontWeight: 500, color: '#1A1F2E',
              cursor: 'pointer', fontFamily: 'inherit', marginBottom: '10px',
              transition: 'border-color .15s, box-shadow .15s, background .15s',
              textDecoration: 'none',
            }}
          >
            <span style={{ width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <GoogleIcon />
            </span>
            Lanjutkan dengan Google
          </a>

          <button
            type="button"
            className="login-btn"
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
              padding: '13px 16px', background: '#fff', border: '1.5px solid #E4E7EF',
              borderRadius: '12px', fontSize: '14px', fontWeight: 500, color: '#1A1F2E',
              cursor: 'pointer', fontFamily: 'inherit',
              transition: 'border-color .15s, box-shadow .15s, background .15s',
            }}
          >
            <span style={{ width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <AppleIcon />
            </span>
            Lanjutkan dengan Apple
          </button>

        </div>
      </main>
    </>
  )
}
