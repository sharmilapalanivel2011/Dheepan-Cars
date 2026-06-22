import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserProfile.css";

const UserProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState("profile");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({ username: "", email: "", phone: "" });
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [addressForm, setAddressForm] = useState({ fullName: "", address: "", city: "", postalCode: "", country: "" });

  useEffect(() => {
    if (user) {
      setForm({ username: user.username || "", email: user.email || "", phone: user.phone || "" });
      if (user.address) setAddressForm(user.address);
    }
  }, [user]);

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const flash = (msg, isError = false) => {
    if (isError) { setError(msg); setSuccess(""); }
    else { setSuccess(msg); setError(""); }
    setTimeout(() => { setSuccess(""); setError(""); }, 3500);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await axios.put("http://localhost:5000/update-profile", {
        email: user.email, username: form.username, phone: form.phone,
      });
      if (res.data.success) { flash("Profile updated successfully ✓"); setEditing(false); }
      else flash(res.data.message || "Update failed", true);
    } catch { flash("Something went wrong", true); }
    finally { setSaving(false); }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await axios.put("http://localhost:5000/save-address", {
        email: user.email, address: addressForm,
      });
      if (res.data.success) flash("Address saved successfully ✓");
      else flash(res.data.message || "Failed to save address", true);
    } catch { flash("Something went wrong", true); }
    finally { setSaving(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) { flash("New passwords do not match", true); return; }
    setSaving(true);
    try {
      const res = await axios.put("http://localhost:5000/change-password", {
        email: user.email, currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword,
      });
      if (res.data.success) { flash("Password changed successfully ✓"); setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" }); }
      else flash(res.data.message || "Password change failed", true);
    } catch { flash("Something went wrong", true); }
    finally { setSaving(false); }
  };

  const handleLogout = () => { logout(); navigate("/"); };

  if (!user) return (
    <div className="up-wrap"><div className="up-empty"><span>🔒</span><p>Please login to view your profile.</p></div></div>
  );

  return (
    <div className="up-wrap">
      <aside className="up-sidebar">
        <div className="up-avatar-block">
          <div className="up-avatar">{getInitials(user.username)}</div>
          <h2 className="up-username">{user.username}</h2>
          <p className="up-useremail">{user.email}</p>
        </div>
        <nav className="up-nav">
          {[{ key: "profile", icon: "👤", label: "My Profile" }, { key: "address", icon: "📍", label: "Address" }, { key: "password", icon: "🔑", label: "Change Password" }].map(({ key, icon, label }) => (
            <button key={key} className={`up-nav-item ${tab === key ? "up-nav-item--active" : ""}`} onClick={() => { setTab(key); setEditing(false); setError(""); setSuccess(""); }}>
              <span>{icon}</span> {label}
            </button>
          ))}
         <div className="up-nav-divider" />
<button className="up-nav-item up-nav-item--danger" onClick={handleLogout}>
  <span>🚪</span> Sign Out
</button>

{/* ✅ NEW */}
<button className="up-nav-item up-nav-item--admin" onClick={() => navigate("/admin-login")}>
  <span>🔐</span> Admin Login
</button>
        
        
        </nav>
      </aside>

      <main className="up-main">
        {success && <div className="up-flash up-flash--success">{success}</div>}
        {error && <div className="up-flash up-flash--error">{error}</div>}

        {tab === "profile" && (
          <div className="up-section">
            <div className="up-section-header">
              <div><h2 className="up-section-title">Personal Information</h2><p className="up-section-desc">Manage your name and phone number.</p></div>
              {!editing && <button className="up-btn up-btn--outline" onClick={() => setEditing(true)}>✏️ Edit</button>}
            </div>
            {!editing ? (
              <div className="up-info-grid">
                <div className="up-info-item"><span className="up-info-label">Username</span><span className="up-info-value">{user.username || "—"}</span></div>
                <div className="up-info-item"><span className="up-info-label">Email</span><span className="up-info-value">{user.email || "—"}</span></div>
                <div className="up-info-item"><span className="up-info-label">Phone</span><span className="up-info-value">{user.phone || "Not added"}</span></div>
              </div>
            ) : (
              <form className="up-form" onSubmit={handleSaveProfile}>
                <div className="up-field"><label className="up-label">Username</label><input className="up-input" type="text" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required /></div>
                <div className="up-field"><label className="up-label">Email</label><input className="up-input" type="email" value={form.email} disabled style={{ opacity: 0.5, cursor: "not-allowed" }} /></div>
                <div className="up-field"><label className="up-label">Phone</label><input className="up-input" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                <div className="up-form-actions">
                  <button type="button" className="up-btn up-btn--outline" onClick={() => setEditing(false)}>Cancel</button>
                  <button type="submit" className="up-btn up-btn--primary" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
                </div>
              </form>
            )}
          </div>
        )}

        {tab === "address" && (
          <div className="up-section">
            <div className="up-section-header"><div><h2 className="up-section-title">Saved Address</h2><p className="up-section-desc">Your default delivery address.</p></div></div>
            <form className="up-form" onSubmit={handleSaveAddress}>
              <div className="up-field"><label className="up-label">Full Name</label><input className="up-input" type="text" placeholder="Recipient's full name" value={addressForm.fullName} onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })} required /></div>
              <div className="up-field"><label className="up-label">Street Address</label><input className="up-input" type="text" placeholder="House No, Street, Area" value={addressForm.address} onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })} required /></div>
              <div className="up-row">
                <div className="up-field"><label className="up-label">City</label><input className="up-input" type="text" placeholder="Chennai" value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} required /></div>
                <div className="up-field"><label className="up-label">Postal Code</label><input className="up-input" type="text" placeholder="600001" value={addressForm.postalCode} onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })} required /></div>
              </div>
              <div className="up-field"><label className="up-label">Country</label><input className="up-input" type="text" placeholder="India" value={addressForm.country} onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })} required /></div>
              <div className="up-form-actions"><button type="submit" className="up-btn up-btn--primary" disabled={saving}>{saving ? "Saving..." : "Save Address"}</button></div>
            </form>
          </div>
        )}

        {tab === "password" && (
          <div className="up-section">
            <div className="up-section-header"><div><h2 className="up-section-title">Change Password</h2><p className="up-section-desc">Use a strong password with at least 8 characters.</p></div></div>
            <form className="up-form" onSubmit={handleChangePassword}>
              <div className="up-field"><label className="up-label">Current Password</label><input className="up-input" type="password" placeholder="Enter current password" value={pwForm.currentPassword} onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} required /></div>
              <div className="up-field"><label className="up-label">New Password</label><input className="up-input" type="password" placeholder="Enter new password" value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} required minLength={8} /></div>
              <div className="up-field"><label className="up-label">Confirm New Password</label><input className="up-input" type="password" placeholder="Repeat new password" value={pwForm.confirmPassword} onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })} required /></div>
              <div className="up-form-actions"><button type="submit" className="up-btn up-btn--primary" disabled={saving}>{saving ? "Updating..." : "Update Password"}</button></div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserProfile;