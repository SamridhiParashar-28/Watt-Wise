document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const toggle = document.getElementById("togglePassword");
  const passwordInput = document.getElementById("password");
  const submitBtn = document.getElementById("submitBtn");
  const errorEl = document.getElementById("error-message");

  // Password visibility toggle
  if (toggle && passwordInput) {
    toggle.addEventListener("click", () => {
      const type = passwordInput.type === "password" ? "text" : "password";
      passwordInput.type = type;
      toggle.classList.toggle("fa-eye");
      toggle.classList.toggle("fa-eye-slash");
    });
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = document.getElementById("username")?.value?.trim();
      const password = passwordInput?.value?.trim();

      if (!username || !password) {
        errorEl.textContent = "Please enter username and password";
        errorEl.style.display = "block";
        return;
      }

      errorEl.style.display = "none";
      submitBtn.disabled = true;
      submitBtn.textContent = "Signing in...";

      try {
        const response = await fetch("http://localhost:5000/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("username", username);
          
          // Optional: you can store a token later when you implement JWT
          // localStorage.setItem("token", data.token);

          errorEl.style.color = "#22c55e";
          errorEl.textContent = "Login successful! Redirecting...";
          errorEl.style.display = "block";

          setTimeout(() => {
            window.location.href = "../Dashboard/dashboard.html";
          }, 1200);
        } else {
          errorEl.textContent = data.message || "Invalid username or password";
          errorEl.style.display = "block";
        }
      } catch (err) {
        console.error("Login error:", err);
        errorEl.textContent = "Cannot connect to server. Is backend running?";
        errorEl.style.display = "block";
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Sign in";
      }
    });
  }
});