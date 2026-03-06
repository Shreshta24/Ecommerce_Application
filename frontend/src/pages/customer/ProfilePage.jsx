import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { apiRequest } from "../../api";

export function CustomerProfilePage() {
  const { user, token, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [pw, setPw] = useState({ currentPassword: "", newPassword: "" });
  const [pwMsg, setPwMsg] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!token) return;
      setLoading(true);
      setError("");
      try {
        const data = await apiRequest("/api/auth/me", {}, token);
        setProfile(data);
        updateUser({ name: data.name, email: data.email, role: data.role, address: data.address });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (!user) return null;

  const saveProfile = async (e) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setError("");
    try {
      const updated = await apiRequest(
        "/api/auth/me",
        { method: "PUT", body: JSON.stringify({ name: profile.name, address: profile.address }) },
        token
      );
      setProfile(updated);
      updateUser({ name: updated.name, address: updated.address });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setPwMsg("");
    try {
      const res = await apiRequest(
        "/api/auth/reset-password",
        { method: "POST", body: JSON.stringify(pw) },
        token
      );
      setPw({ currentPassword: "", newPassword: "" });
      setPwMsg(res.message || "Password updated");
    } catch (err) {
      setPwMsg(err.message);
    }
  };

  return (
    <div className="dashboard-section">
      <div className="section-header">
        <h1 className="gradient-text">My Profile</h1>
        <p style={{ color: "var(--text-muted)" }}>Manage your details and reset your password.</p>
      </div>

      {loading && <div className="loading-state">Loading profile...</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="glass-card" style={{ padding: "1.5rem" }}>
        <h3 style={{ marginTop: 0 }}>Profile Details</h3>
        <form onSubmit={saveProfile} className="checkout-form">
          <label className="full-width">
            Name
            <input
              value={profile?.name || user.name || ""}
              onChange={(e) => setProfile((p) => ({ ...(p || {}), name: e.target.value }))}
              required
            />
          </label>
          <label className="full-width">
            Email
            <input value={profile?.email || user.email || ""} disabled />
          </label>

          <label className="full-width">
            Address line 1
            <input
              value={profile?.address?.line1 || ""}
              onChange={(e) =>
                setProfile((p) => ({
                  ...(p || {}),
                  address: { ...(p?.address || {}), line1: e.target.value },
                }))
              }
            />
          </label>
          <label className="full-width">
            Address line 2
            <input
              value={profile?.address?.line2 || ""}
              onChange={(e) =>
                setProfile((p) => ({
                  ...(p || {}),
                  address: { ...(p?.address || {}), line2: e.target.value },
                }))
              }
            />
          </label>
          <label>
            City
            <input
              value={profile?.address?.city || ""}
              onChange={(e) =>
                setProfile((p) => ({
                  ...(p || {}),
                  address: { ...(p?.address || {}), city: e.target.value },
                }))
              }
            />
          </label>
          <label>
            State
            <input
              value={profile?.address?.state || ""}
              onChange={(e) =>
                setProfile((p) => ({
                  ...(p || {}),
                  address: { ...(p?.address || {}), state: e.target.value },
                }))
              }
            />
          </label>
          <label>
            Postal Code
            <input
              value={profile?.address?.postalCode || ""}
              onChange={(e) =>
                setProfile((p) => ({
                  ...(p || {}),
                  address: { ...(p?.address || {}), postalCode: e.target.value },
                }))
              }
            />
          </label>
          <label>
            Country
            <input
              value={profile?.address?.country || ""}
              onChange={(e) =>
                setProfile((p) => ({
                  ...(p || {}),
                  address: { ...(p?.address || {}), country: e.target.value },
                }))
              }
            />
          </label>

          <button type="submit" className="full-width" disabled={saving}>
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>

      <div className="glass-card" style={{ padding: "1.5rem", marginTop: "1.25rem" }}>
        <h3 style={{ marginTop: 0 }}>Reset Password</h3>
        <form onSubmit={resetPassword} className="checkout-form">
          <label className="full-width">
            Current password
            <input
              type="password"
              value={pw.currentPassword}
              onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })}
              required
            />
          </label>
          <label className="full-width">
            New password
            <input
              type="password"
              value={pw.newPassword}
              onChange={(e) => setPw({ ...pw, newPassword: e.target.value })}
              required
            />
          </label>
          <button type="submit" className="full-width">Update Password</button>
        </form>
        {pwMsg ? (
          <div style={{ marginTop: 10, color: pwMsg.toLowerCase().includes("updated") ? "#4ade80" : "#ef4444" }}>
            {pwMsg}
          </div>
        ) : null}
      </div>
    </div>
  );
}

