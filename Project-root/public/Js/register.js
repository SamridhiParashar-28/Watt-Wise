document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const toggle = document.getElementById("togglePassword");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");
  const submitBtn = document.getElementById("submitBtn");
  const messageEl = document.getElementById("message");

  // Password visibility toggle
  if (toggle && password) {
    toggle.addEventListener("click", () => {
      const type = password.type === "password" ? "text" : "password";
      password.type = type;
      toggle.classList.toggle("fa-eye");
      toggle.classList.toggle("fa-eye-slash");
    });
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = document.getElementById("username")?.value?.trim();
      const passValue = password?.value?.trim();
      const confirmValue = confirmPassword?.value?.trim();

      messageEl.style.display = "none";

      if (!username || !passValue || !confirmValue) {
        messageEl.textContent = "All fields are required";
        messageEl.style.color = "#ef4444";
        messageEl.style.display = "block";
        return;
      }

      if (username.length < 3 || username.length > 50) {
        messageEl.textContent = "Username must be 3–50 characters";
        messageEl.style.color = "#ef4444";
        messageEl.style.display = "block";
        return;
      }

      if (passValue !== confirmValue) {
        messageEl.textContent = "Passwords do not match";
        messageEl.style.color = "#ef4444";
        messageEl.style.display = "block";
        return;
      }

      if (passValue.length < 6) {
        messageEl.textContent = "Password must be at least 6 characters";
        messageEl.style.color = "#ef4444";
        messageEl.style.display = "block";
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Registering...";

      try {
        const response = await fetch("http://localhost:5000/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password: passValue })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          messageEl.textContent = "Account created! Redirecting to login...";
          messageEl.style.color = "#22c55e";
          messageEl.style.display = "block";
          
          setTimeout(() => {
            window.location.href = "index.html";
          }, 1800);
        } else {
          messageEl.textContent = data.message || "Registration failed";
          messageEl.style.color = "#ef4444";
          messageEl.style.display = "block";
        }
      } catch (err) {
        messageEl.textContent = "Cannot connect to server. Is backend running?";
        messageEl.style.color = "#ef4444";
        messageEl.style.display = "block";
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "REGISTER";
      }
    });
  }
});