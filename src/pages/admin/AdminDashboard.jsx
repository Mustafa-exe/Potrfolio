import { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { getProjects, saveProjects } from "../../data/projects";
import { getExperience, saveExperience } from "../../data/experience";
import { getSkills, saveSkills } from "../../data/skills";
import { getProfile, saveProfile } from "../../data/profile";
import { sanitizeObject, checkRateLimit } from "../../utils/security";
import "./Admin.css";

const SECTIONS = [
  { key: "projects", label: "Projects" },
  { key: "experience", label: "Experience" },
  { key: "skills", label: "Skills" },
  { key: "profile", label: "Profile" },
];

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export default function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("projects");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Data state
  const [projects, setProjects] = useState(() => getProjects());
  const [experience, setExperience] = useState(() => getExperience());
  const [skills, setSkills] = useState(() => getSkills());
  const [profile, setProfile] = useState(() => getProfile());

  const handleLogout = () => {
    logout();
    navigate("/admin", { replace: true });
  };

  // ===== Projects CRUD =====
  const saveProjectItem = useCallback(
    (item) => {
      if (!checkRateLimit("save_project", 15)) return;
      const safe = sanitizeObject(item);
      let updated;
      if (editingItem) {
        updated = projects.map((p) => (p.id === safe.id ? safe : p));
      } else {
        updated = [{ ...safe, id: generateId() }, ...projects];
      }
      setProjects(updated);
      saveProjects(updated);
      setShowModal(false);
      setEditingItem(null);
    },
    [projects, editingItem]
  );

  const deleteProject = useCallback(
    (id) => {
      const updated = projects.filter((p) => p.id !== id);
      setProjects(updated);
      saveProjects(updated);
    },
    [projects]
  );

  // ===== Experience CRUD =====
  const saveExperienceItem = useCallback(
    (item) => {
      if (!checkRateLimit("save_experience", 15)) return;
      const safe = sanitizeObject(item);
      let updated;
      if (editingItem) {
        updated = experience.map((e) => (e.id === safe.id ? safe : e));
      } else {
        updated = [{ ...safe, id: generateId() }, ...experience];
      }
      setExperience(updated);
      saveExperience(updated);
      setShowModal(false);
      setEditingItem(null);
    },
    [experience, editingItem]
  );

  const deleteExperience = useCallback(
    (id) => {
      const updated = experience.filter((e) => e.id !== id);
      setExperience(updated);
      saveExperience(updated);
    },
    [experience]
  );

  // ===== Skills CRUD =====
  const saveSkillCategory = useCallback(
    (item) => {
      if (!checkRateLimit("save_skill", 15)) return;
      const safe = sanitizeObject(item);
      let updated;
      if (editingItem) {
        updated = skills.map((s, i) =>
          i === editingItem.index ? safe : s
        );
      } else {
        updated = [...skills, safe];
      }
      setSkills(updated);
      saveSkills(updated);
      setShowModal(false);
      setEditingItem(null);
    },
    [skills, editingItem]
  );

  const deleteSkillCategory = useCallback(
    (index) => {
      const updated = skills.filter((_, i) => i !== index);
      setSkills(updated);
      saveSkills(updated);
    },
    [skills]
  );

  // ===== Profile Save =====
  const saveProfileData = useCallback(
    (data) => {
      if (!checkRateLimit("save_profile", 10)) return;
      const safe = sanitizeObject(data);
      const updated = { ...profile, ...safe };
      setProfile(updated);
      saveProfile(updated);
      setShowModal(false);
    },
    [profile]
  );

  const openAdd = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const openEdit = (item, index) => {
    setEditingItem(index !== undefined ? { ...item, index } : item);
    setShowModal(true);
  };

  return (
    <div className="admin-dashboard-page" id="admin-dashboard">
      <div className="dashboard-panel">
        <div className="dashboard-panel-header">
          <span className="dashboard-title">Admin Dashboard</span>
          <button className="dashboard-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="dashboard-tabs">
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              className={`dashboard-tab-btn ${activeSection === s.key ? "active" : ""}`}
              onClick={() => {
                setActiveSection(s.key);
                setShowModal(false);
                setEditingItem(null);
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="dashboard-body">
          {/* Projects Section */}
          {activeSection === "projects" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <p className="mt" style={{ margin: 0 }}>Project Records</p>
                <button className="sb-btn" style={{ margin: 0, width: "auto", padding: "0.4rem 1rem" }} onClick={openAdd}>
                  + Add Project
                </button>
              </div>
              <div className="admin-items-list" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {projects.map((p) => (
                  <div key={p.id} className="mi">
                    <div>
                      <div className="mn">{p.title || p.name}</div>
                      <div className="ms">{p.category || p.tag}</div>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button className="db" style={{ borderColor: "var(--border)", color: "var(--text)" }} onClick={() => openEdit(p)}>
                        Edit
                      </button>
                      <button className="db" onClick={() => deleteProject(p.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {projects.length === 0 && (
                  <p style={{ color: "var(--faint)", fontSize: "13.5px", padding: "2rem 0", textAlign: "center" }}>
                    No projects found. Add one to get started.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Experience Section */}
          {activeSection === "experience" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <p className="mt" style={{ margin: 0 }}>Experience Records</p>
                <button className="sb-btn" style={{ margin: 0, width: "auto", padding: "0.4rem 1rem" }} onClick={openAdd}>
                  + Add Experience
                </button>
              </div>
              <div className="admin-items-list" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {experience.map((e) => (
                  <div key={e.id} className="mi">
                    <div>
                      <div className="mn">{e.role || e.title}</div>
                      <div className="ms">{e.company}</div>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button className="db" style={{ borderColor: "var(--border)", color: "var(--text)" }} onClick={() => openEdit(e)}>
                        Edit
                      </button>
                      <button className="db" onClick={() => deleteExperience(e.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {experience.length === 0 && (
                  <p style={{ color: "var(--faint)", fontSize: "13.5px", padding: "2rem 0", textAlign: "center" }}>
                    No experience records found.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Skills Section */}
          {activeSection === "skills" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <p className="mt" style={{ margin: 0 }}>Skill Categories</p>
                <button className="sb-btn" style={{ margin: 0, width: "auto", padding: "0.4rem 1rem" }} onClick={openAdd}>
                  + Add Category
                </button>
              </div>
              <div className="admin-items-list" style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {skills.map((cat, i) => (
                  <div key={i} className="mi">
                    <div>
                      <div className="mn">{cat.category}</div>
                      <div className="ms">{cat.items.map((s) => s.name).join(", ")}</div>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button className="db" style={{ borderColor: "var(--border)", color: "var(--text)" }} onClick={() => openEdit(cat, i)}>
                        Edit
                      </button>
                      <button className="db" onClick={() => deleteSkillCategory(i)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Profile Section */}
          {activeSection === "profile" && (
            <div>
              <p className="mt" style={{ marginBottom: "1.5rem" }}>Modify Profile Info</p>
              <ProfileForm profile={profile} onSave={saveProfileData} />
            </div>
          )}
        </div>
      </div>

      {/* Modal overlays for Add/Edit */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="admin-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            id="ao"
            style={{ display: "flex", opacity: 1, pointerEvents: "all" }}
            onClick={() => {
              setShowModal(false);
              setEditingItem(null);
            }}
          >
            <motion.div
              className="ap"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 18 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aph">
                <span className="apt-title">
                  {editingItem ? "Edit Entry" : "Add New Entry"}
                </span>
                <button className="apc" onClick={() => {
                  setShowModal(false);
                  setEditingItem(null);
                }}>
                  &#x2715;
                </button>
              </div>
              <div className="apb">
                {activeSection === "projects" && (
                  <ProjectForm
                    item={editingItem}
                    onSave={saveProjectItem}
                    onCancel={() => {
                      setShowModal(false);
                      setEditingItem(null);
                    }}
                  />
                )}
                {activeSection === "experience" && (
                  <ExperienceForm
                    item={editingItem}
                    onSave={saveExperienceItem}
                    onCancel={() => {
                      setShowModal(false);
                      setEditingItem(null);
                    }}
                  />
                )}
                {activeSection === "skills" && (
                  <SkillForm
                    item={editingItem}
                    onSave={saveSkillCategory}
                    onCancel={() => {
                      setShowModal(false);
                      setEditingItem(null);
                    }}
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ===== Form Components =====

function ProjectForm({ item, onSave, onCancel }) {
  const [form, setForm] = useState(
    item || {
      title: "",
      description: "",
      image: "",
      tags: [],
      category: "Frontend",
      liveUrl: "",
      githubUrl: "",
      featured: false,
    }
  );
  const [tagsInput, setTagsInput] = useState(
    item ? (item.tags || item.stack || []).join(", ") : ""
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      title: form.title || form.name || "",
      category: form.category || form.tag || "Project",
      description: form.description || form.desc || "",
      liveUrl: form.liveUrl || form.live || "",
      githubUrl: form.githubUrl || form.github || "",
      tags: tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="fg">
        <label className="fl">Title / Name</label>
        <input
          className="fi"
          value={form.title || form.name || ""}
          onChange={(e) => setForm({ ...form, title: e.target.value, name: e.target.value })}
          required
        />
      </div>
      <div className="fg">
        <label className="fl">Description</label>
        <textarea
          className="ft"
          value={form.description || form.desc || ""}
          onChange={(e) => setForm({ ...form, description: e.target.value, desc: e.target.value })}
          required
        />
      </div>
      <div className="fr2">
        <div className="fg">
          <label className="fl">Category / Tag</label>
          <input
            className="fi"
            value={form.category || form.tag || ""}
            onChange={(e) => setForm({ ...form, category: e.target.value, tag: e.target.value })}
            required
          />
        </div>
        <div className="fg">
          <label className="fl">Tech Stack (comma separated)</label>
          <input
            className="fi"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
          />
        </div>
      </div>
      <div className="fr2">
        <div className="fg">
          <label className="fl">Live URL</label>
          <input
            className="fi"
            value={form.liveUrl || form.live || ""}
            onChange={(e) => setForm({ ...form, liveUrl: e.target.value, live: e.target.value })}
          />
        </div>
        <div className="fg">
          <label className="fl">GitHub URL</label>
          <input
            className="fi"
            value={form.githubUrl || form.github || ""}
            onChange={(e) => setForm({ ...form, githubUrl: e.target.value, github: e.target.value })}
          />
        </div>
      </div>
      <div className="fg" style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <input
          type="checkbox"
          checked={form.featured || false}
          onChange={(e) => setForm({ ...form, featured: e.target.checked })}
          style={{ width: 16, height: 16, accentColor: "var(--ice)" }}
        />
        <label className="fl" style={{ margin: 0 }}>Featured Project</label>
      </div>
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.5rem" }}>
        <button type="submit" className="sb-btn">
          Save
        </button>
        <button type="button" className="sb-btn dng" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function ExperienceForm({ item, onSave, onCancel }) {
  const [form, setForm] = useState(
    item || {
      company: "",
      role: "",
      duration: "",
      description: "",
      type: "work",
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      role: form.role || form.title || "",
      period: form.period || form.duration || "",
      desc: form.desc || form.description || "",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="fr2">
        <div className="fg">
          <label className="fl">Role / Position</label>
          <input
            className="fi"
            value={form.role || form.title || ""}
            onChange={(e) => setForm({ ...form, role: e.target.value, title: e.target.value })}
            required
          />
        </div>
        <div className="fg">
          <label className="fl">Company</label>
          <input
            className="fi"
            value={form.company || ""}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
            required
          />
        </div>
      </div>
      <div className="fr2">
        <div className="fg">
          <label className="fl">Period / Duration</label>
          <input
            className="fi"
            value={form.period || form.duration || ""}
            onChange={(e) => setForm({ ...form, period: e.target.value, duration: e.target.value })}
            required
          />
        </div>
        <div className="fg">
          <label className="fl">Type</label>
          <input
            className="fi"
            value={form.type || ""}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            placeholder="e.g., Internship, Full-time"
          />
        </div>
      </div>
      <div className="fg">
        <label className="fl">Description</label>
        <textarea
          className="ft"
          value={form.description || form.desc || ""}
          onChange={(e) => setForm({ ...form, description: e.target.value, desc: e.target.value })}
          required
        />
      </div>
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.5rem" }}>
        <button type="submit" className="sb-btn">
          Save
        </button>
        <button type="button" className="sb-btn dng" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function SkillForm({ item, onSave, onCancel }) {
  const [category, setCategory] = useState(item?.category || "");
  const [icon, setIcon] = useState(item?.icon || "");
  const [itemsText, setItemsText] = useState(
    item
      ? item.items.map((s) => `${s.name}:${s.level}`).join("\n")
      : ""
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const items = itemsText
      .split("\n")
      .map((line) => {
        const [name, level] = line.split(":").map((s) => s.trim());
        return name ? { name, level: parseInt(level) || 50 } : null;
      })
      .filter(Boolean);

    onSave({ category, icon, items });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="fg">
        <label className="fl">Category Name</label>
        <input
          className="fi"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
      </div>
      <div className="fg">
        <label className="fl">Icon Label (short, e.g. FE, BE)</label>
        <input
          className="fi"
          value={icon}
          onChange={(e) => setIcon(e.target.value)}
          placeholder="e.g., FE, BE, DB"
        />
      </div>
      <div className="fg">
        <label className="fl">Skills (Name:Percentage, one per line)</label>
        <textarea
          className="ft"
          value={itemsText}
          onChange={(e) => setItemsText(e.target.value)}
          placeholder="Flutter:90&#10;Firebase:85"
          rows={6}
          required
        />
      </div>
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.5rem" }}>
        <button type="submit" className="sb-btn">
          Save
        </button>
        <button type="button" className="sb-btn dng" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function ProfileForm({ profile, onSave }) {
  const [form, setForm] = useState({ ...profile });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="fg">
        <label className="fl">Name</label>
        <input
          className="fi"
          value={form.name || ""}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </div>
      <div className="fg">
        <label className="fl">Title</label>
        <input
          className="fi"
          value={form.title || ""}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
      </div>
      <div className="fg">
        <label className="fl">Bio</label>
        <textarea
          className="ft"
          value={form.bio || ""}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          required
        />
      </div>
      <div className="fg">
        <label className="fl">Email</label>
        <input
          className="fi"
          type="email"
          value={form.email || ""}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
      </div>
      <div className="fr2">
        <div className="fg">
          <label className="fl">GitHub URL</label>
          <input
            className="fi"
            value={form.social?.github || ""}
            onChange={(e) =>
              setForm({ ...form, social: { ...form.social, github: e.target.value } })
            }
          />
        </div>
        <div className="fg">
          <label className="fl">LinkedIn URL</label>
          <input
            className="fi"
            value={form.social?.linkedin || ""}
            onChange={(e) =>
              setForm({ ...form, social: { ...form.social, linkedin: e.target.value } })
            }
          />
        </div>
      </div>
      <div className="fg">
        <label className="fl">Location</label>
        <input
          className="fi"
          value={form.location || ""}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
      </div>
      <button type="submit" className="sb-btn">
        Save Profile
      </button>
    </form>
  );
}
