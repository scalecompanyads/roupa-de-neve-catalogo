"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("E-mail ou senha inválidos. Tente novamente.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="login-shell">
      <div className="login-card">
        <div className="login-brand">
          <span className="login-snowflake">❄</span>
          <h1>Nevou no Chile</h1>
          <p>Acesso ao painel administrativo</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <label>
            E-mail
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Senha
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          {error && <p className="login-error">{error}</p>}

          <button id="login-submit" type="submit" disabled={loading} className="login-btn">
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>

      <style>{`
        .login-shell {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #0a0f1e 0%, #0d1b35 50%, #0a1628 100%);
          padding: 1.5rem;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .login-card {
          width: 100%;
          max-width: 400px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 2.5rem;
          backdrop-filter: blur(20px);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.05),
            0 25px 50px rgba(0,0,0,0.5),
            0 0 80px rgba(100,160,255,0.06);
          animation: fadeUp 0.5s ease;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .login-brand {
          text-align: center;
          margin-bottom: 2rem;
        }

        .login-snowflake {
          font-size: 2.5rem;
          display: block;
          margin-bottom: 0.5rem;
          animation: spin 8s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .login-brand h1 {
          font-size: 1.4rem;
          font-weight: 700;
          color: #fff;
          margin: 0 0 0.25rem;
          letter-spacing: -0.02em;
        }

        .login-brand p {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.45);
          margin: 0;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
        }

        .login-form label {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          font-size: 0.78rem;
          font-weight: 600;
          color: rgba(255,255,255,0.6);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .login-form input {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px;
          padding: 0.75rem 1rem;
          color: #fff;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          width: 100%;
          box-sizing: border-box;
        }

        .login-form input::placeholder {
          color: rgba(255,255,255,0.2);
        }

        .login-form input:focus {
          border-color: rgba(100,160,255,0.5);
          box-shadow: 0 0 0 3px rgba(100,160,255,0.1);
        }

        .login-error {
          font-size: 0.82rem;
          color: #ff6b6b;
          background: rgba(255,107,107,0.1);
          border: 1px solid rgba(255,107,107,0.2);
          border-radius: 8px;
          padding: 0.6rem 0.8rem;
          margin: 0;
          text-align: center;
        }

        .login-btn {
          margin-top: 0.5rem;
          padding: 0.85rem;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          border: none;
          border-radius: 10px;
          color: #fff;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 15px rgba(59,130,246,0.35);
          letter-spacing: 0.01em;
        }

        .login-btn:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(59,130,246,0.45);
        }

        .login-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .login-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
