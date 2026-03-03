// js/register.js – corrected backend port + minor improvements

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const toggle = document.getElementById("togglePassword");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");
  const submitBtn = document.getElementById("submitBtn");
  const messageEl = document.getElementById("message");

  // Toggle password visibility
  if (toggle && password) {
    toggle.addEventListener("click", () => {
      const type = password.type === "password" ? "text" : "password";
      password.type = type;
      toggle.classList.toggle("fa-eye");
      toggle.classList.toggle("fa-eye-slash");
    });
  }

  // Form submit
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = document.getElementById("username")?.value?.trim();
      const passValue = password?.value?.trim();
      const confirmValue = confirmPassword?.value?.trim();

      // Clear previous messages
      messageEl.style.display = "none";

      // Client-side checks
      if (!username || !passValue || !confirmValue) {
        messageEl.textContent = "All fields are required";
        messageEl.style.display = "block";
        return;
      }

      if (passValue !== confirmValue) {
        messageEl.textContent = "Passwords do not match";
        messageEl.style.display = "block";
        return;
      }

      if (passValue.length < 6) {
        messageEl.textContent = "Password must be at least 6 characters";
        messageEl.style.display = "block";
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Registering...";

      try {
        const response = await fetch("http://localhost:5000/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            password: passValue
          }),
          credentials: "include",           // ← good for future cookie/session support
        });

        const data = await response.json();

        if (response.ok && data.success) {
          messageEl.textContent = "Account created successfully! Redirecting to login...";
          messageEl.style.color = "#22c55e";   // green
          messageEl.style.display = "block";

          // Redirect to login after 2 seconds
          setTimeout(() => {
            window.location.href = "index.html";
          }, 2000);
        } else {
          messageEl.textContent = data.message || "Registration failed – username may already exist";
          messageEl.style.color = "#ef4444";   // red
          messageEl.style.display = "block";
        }
      } catch (err) {
        console.error("Registration error:", err);
        messageEl.textContent = "Cannot connect to server – is the backend running?";
        messageEl.style.color = "#ef4444";
        messageEl.style.display = "block";
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Register";
      }
    });
  }
});