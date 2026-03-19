// public/js/register.js
// Handles client-side registration form validation + sends data to backend

document.addEventListener("DOMContentLoaded", () => {
  const form          = document.getElementById("registerForm");
  const toggle        = document.getElementById("togglePassword");
  const password      = document.getElementById("password");
  const confirmPass   = document.getElementById("confirmPassword");
  const submitBtn     = document.getElementById("submitBtn");
  const messageEl     = document.getElementById("message");

  // ── Password visibility toggle ────────────────────────────────────────
  if (toggle && password) {
    toggle.addEventListener("click", () => {
      const isPassword = password.type === "password";
      password.type = isPassword ? "text" : "password";
      toggle.classList.toggle("fa-eye", !isPassword);
      toggle.classList.toggle("fa-eye-slash", isPassword);
    });
  }

  // ── Form submission handler ───────────────────────────────────────────
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      // Reset message
      messageEl.style.display = "none";
      messageEl.textContent = "";

      // Get and trim values
      const username      = document.getElementById("username")?.value?.trim();
      const passValue     = password?.value?.trim();
      const confirmValue  = confirmPass?.value?.trim();

      // ── Client-side validation ──────────────────────────────────────
      if (!username || !passValue || !confirmValue) {
        showMessage("All fields are required", "error");
        return;
      }

      if (username.length < 3 || username.length > 50) {
        showMessage("Username must be between 3 and 50 characters", "error");
        return;
      }

      if (passValue.length < 6) {
        showMessage("Password must be at least 6 characters long", "error");
        return;
      }

      if (passValue !== confirmValue) {
        showMessage("Passwords do not match", "error");
        return;
      }

      // Disable button & show loading state
      submitBtn.disabled = true;
      submitBtn.textContent = "Creating account...";

      try {
        const response = await fetch("http://localhost:5000/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            username,
            password: passValue
          })
        });

        let data;
        try {
          data = await response.json();
        } catch {
          throw new Error("Invalid response from server");
        }

        if (response.ok && data.success) {
          showMessage("Account created successfully! Redirecting to login...", "success");
          setTimeout(() => {
            window.location.href = "index.html";
          }, 1600);
        } else {
          showMessage(data.message || "Registration failed. Please try again.", "error");
        }
      } catch (err) {
        console.error("Registration error:", err);
        showMessage(
          "Cannot connect to the server.<br>Make sure backend is running on port 5000.",
          "error"
        );
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "REGISTER";
      }
    });
  }

  // ── Helper function to show messages ──────────────────────────────────
  function showMessage(text, type = "error") {
    messageEl.textContent = text;
    messageEl.style.color = type === "success" ? "#22c55e" : "#ef4444";
    messageEl.style.display = "block";
  }
});