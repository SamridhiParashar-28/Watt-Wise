// auth.js - Updated to talk to backend server at localhost:3000

// ==================== IndexedDB Setup (optional - keep if you want client-side token storage) ====================
const DB_NAME = "AppAuthDB";
const DB_VERSION = 1;
const STORE_NAME = "auth";

let dbInstance = null;

function openDB() {
  return new Promise((resolve, reject) => {
    if (dbInstance) return resolve(dbInstance);

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
  });
}

async function saveAuthData(token, user = {}) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.put({
      id: "current",
      token,
      user,
      timestamp: Date.now()
    });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// ==================== Login Form Logic ====================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const toggle = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("password");
  const submitBtn = document.getElementById("submitBtn");
  const errorEl = document.getElementById("error-message") || document.createElement("div");

  // Create error element if it doesn't exist in HTML
  if (!document.getElementById("error-message")) {
    errorEl.id = "error-message";
    errorEl.style.color = "#dc2626";
    errorEl.style.fontSize = "0.9rem";
    errorEl.style.marginTop = "8px";
    errorEl.style.textAlign = "center";
    form.appendChild(errorEl);
  }

  if (!form || !toggle || !passwordInput || !submitBtn) {
    console.error("Login form elements missing");
    return;
  }

  // Password visibility toggle
  toggle.addEventListener("click", () => {
    const type = passwordInput.type === "password" ? "text" : "password";
    passwordInput.type = type;
    toggle.classList.toggle("fa-eye");
    toggle.classList.toggle("fa-eye-slash");
  });

  // Form submission - send to backend
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
      errorEl.textContent = "Please fill in both fields";
      errorEl.style.display = "block";
      return;
    }

    errorEl.style.display = "none";
    submitBtn.disabled = true;
    submitBtn.textContent = "Signing in...";

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Optional: store token/user in IndexedDB (if your backend returns a token later)
        if (data.token) {
          await saveAuthData(data.token, data.user || { username });
        }

        // Success - redirect or show dashboard
        alert("Login successful!"); // Replace with real redirect later
        window.location.href = "/dashboard.html"; // or your dashboard page
      } else {
        errorEl.textContent = data.message || "Invalid username or password";
        errorEl.style.display = "block";
      }
    } catch (err) {
      console.error("Login error:", err);
      errorEl.textContent = "Cannot connect to server. Is the backend running?";
      errorEl.style.display = "block";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Sign in";
    }
  });
});