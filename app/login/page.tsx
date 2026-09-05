"use client";

import { useState } from "react";
import { createClient } from "../../lib/supabase";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function signInWithGoogle() {
    setLoading(true);
    setMessage("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#f5f1e8",
        padding: "24px",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "white",
          padding: "40px",
          borderRadius: "20px",
          textAlign: "center",
        }}
      >
        <h1>Welcome to Babblu</h1>
        <p>Sign in to access your private job-search workspace.</p>

        <button
          onClick={signInWithGoogle}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            marginTop: "24px",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          {loading ? "Connecting..." : "Continue with Google"}
        </button>

        {message && <p style={{ color: "crimson" }}>{message}</p>}
      </section>
    </main>
  );
}