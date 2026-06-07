import { db, hasConfig } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

// Notify active React pages to reload their data state when sync completes
function notifySync() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("portfolio-data-sync"));
  }
}

/**
 * Fetches all portfolio data (projects, experience, skills, profile) from Firestore 
 * and caches it in LocalStorage, triggering custom events for the UI.
 */
export async function syncFromFirestore() {
  if (!hasConfig || !db) return;
  try {
    const docRef = doc(db, "portfolio", "data");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.projects) localStorage.setItem("portfolio_projects", JSON.stringify(data.projects));
      if (data.experience) localStorage.setItem("portfolio_experience", JSON.stringify(data.experience));
      if (data.skills) localStorage.setItem("portfolio_skills", JSON.stringify(data.skills));
      if (data.profile) localStorage.setItem("portfolio_profile", JSON.stringify(data.profile));
      notifySync();
    } else {
      // If Firestore is empty/newly configured, initialize it with current local content
      await syncToFirestore();
    }
  } catch (error) {
    console.error("Error syncing from Firestore:", error);
  }
}

/**
 * Uploads all cached LocalStorage data to Firestore.
 */
export async function syncToFirestore() {
  if (!hasConfig || !db) return;
  try {
    const docRef = doc(db, "portfolio", "data");
    const data = {
      projects: JSON.parse(localStorage.getItem("portfolio_projects") || "[]"),
      experience: JSON.parse(localStorage.getItem("portfolio_experience") || "[]"),
      skills: JSON.parse(localStorage.getItem("portfolio_skills") || "[]"),
      profile: JSON.parse(localStorage.getItem("portfolio_profile") || "{}"),
      updatedAt: new Date().toISOString()
    };
    await setDoc(docRef, data);
  } catch (error) {
    console.error("Error syncing to Firestore:", error);
  }
}
