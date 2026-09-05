"use client";

import { useEffect, useState } from "react";
import { createClient } from "../lib/supabase";

type ProfileForm = {
  full_name: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  linkedin_url: string;
  github_url: string;
  portfolio_url: string;
  work_authorization: string;
  available_start: string;
  willing_to_relocate: boolean;
  salary_min: string;
  salary_max: string;
};

const emptyProfile: ProfileForm = {
  full_name: "",
  phone: "",
  email: "",
  city: "",
  state: "",
  linkedin_url: "",
  github_url: "",
  portfolio_url: "",
  work_authorization: "",
  available_start: "",
  willing_to_relocate: true,
  salary_min: "",
  salary_max: "",
};

export default function DatabaseProfile() {
  const [form, setForm] = useState<ProfileForm>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data) {
        setForm({
          full_name: data.full_name ?? "",
          phone: data.phone ?? "",
          email: data.email ?? user.email ?? "",
          city: data.city ?? "",
          state: data.state ?? "",
          linkedin_url: data.linkedin_url ?? "",
          github_url: data.github_url ?? "",
          portfolio_url: data.portfolio_url ?? "",
          work_authorization: data.work_authorization ?? "",
          available_start: data.available_start ?? "",
          willing_to_relocate: data.willing_to_relocate ?? true,
          salary_min: data.salary_min?.toString() ?? "",
          salary_max: data.salary_max?.toString() ?? "",
        });
      } else {
        setForm((current) => ({
          ...current,
          full_name:
            user.user_metadata?.full_name ??
            user.user_metadata?.name ??
            "",
          email: user.email ?? "",
        }));
      }

      setLoading(false);
    }

    loadProfile();
  }, []);

  function update(
    field: keyof ProfileForm,
    value: string | boolean
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function saveProfile() {
    setSaving(true);
    setMessage("");

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("Please sign in again.");
      setSaving(false);
      return;
    }

    const { error } = await supabase.from("profiles").upsert(
      {
        user_id: user.id,
        full_name: form.full_name,
        phone: form.phone,
        email: form.email,
        city: form.city,
        state: form.state,
        linkedin_url: form.linkedin_url,
        github_url: form.github_url,
        portfolio_url: form.portfolio_url,
        work_authorization: form.work_authorization,
        available_start: form.available_start,
        willing_to_relocate: form.willing_to_relocate,
        salary_min: form.salary_min
          ? Number(form.salary_min)
          : null,
        salary_max: form.salary_max
          ? Number(form.salary_max)
          : null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    setMessage(
      error ? `Could not save: ${error.message}` : "Profile saved securely."
    );
    setSaving(false);
  }

  if (loading) {
    return <div className="content">Loading your profile...</div>;
  }

  return (
    <div className="content">
      <section className="profiletop">
        <div>
          <span>MY PROFILE</span>
          <h2>Your verified application information.</h2>
          <p>
            Babblu uses these saved answers as the source of truth.
          </p>
        </div>

        <button
          className="primary"
          onClick={saveProfile}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save profile"}
        </button>
      </section>

      {message && (
        <section className="card">
          <strong>{message}</strong>
        </section>
      )}

      <section className="card">
        <div className="formgrid">
          <ProfileField
            label="Full name"
            value={form.full_name}
            onChange={(value) => update("full_name", value)}
          />
          <ProfileField
            label="Phone"
            value={form.phone}
            onChange={(value) => update("phone", value)}
          />
          <ProfileField
            label="Email"
            value={form.email}
            onChange={(value) => update("email", value)}
          />
          <ProfileField
            label="City"
            value={form.city}
            onChange={(value) => update("city", value)}
          />
          <ProfileField
            label="State"
            value={form.state}
            onChange={(value) => update("state", value)}
          />
          <ProfileField
            label="Work authorization"
            value={form.work_authorization}
            onChange={(value) =>
              update("work_authorization", value)
            }
          />
          <ProfileField
            label="Available to start"
            value={form.available_start}
            onChange={(value) =>
              update("available_start", value)
            }
          />
          <ProfileField
            label="Minimum salary"
            value={form.salary_min}
            type="number"
            onChange={(value) => update("salary_min", value)}
          />
          <ProfileField
            label="Maximum salary"
            value={form.salary_max}
            type="number"
            onChange={(value) => update("salary_max", value)}
          />
        </div>

        <div className="linksrow">
          <ProfileField
            label="LinkedIn"
            value={form.linkedin_url}
            onChange={(value) => update("linkedin_url", value)}
          />
          <ProfileField
            label="GitHub"
            value={form.github_url}
            onChange={(value) => update("github_url", value)}
          />
          <ProfileField
            label="Portfolio"
            value={form.portfolio_url}
            onChange={(value) => update("portfolio_url", value)}
          />
        </div>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginTop: "24px",
          }}
        >
          <input
            type="checkbox"
            checked={form.willing_to_relocate}
            onChange={(event) =>
              update(
                "willing_to_relocate",
                event.target.checked
              )
            }
          />
          Willing to relocate within the United States
        </label>
      </section>
    </div>
  );
}

function ProfileField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}