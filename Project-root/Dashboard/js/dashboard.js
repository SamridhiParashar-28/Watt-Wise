// Dashboard/js/dashboard.js

document.addEventListener("DOMContentLoaded", () => {
  // ── Basic client-side auth check ──
  const isLoggedIn  = localStorage.getItem("isLoggedIn") === "true";
  const username    = localStorage.getItem("username") || "Guest";

  if (!isLoggedIn) {
    alert("Please sign in first.");
    window.location.href = "../public/index.html";
    return;
  }

  // Show username in header
  const userEl = document.getElementById("current-user");
  if (userEl) userEl.textContent = username;

  // Show fake/current timestamp
  const updateEl = document.getElementById("last-update");
  if (updateEl) {
    const now = new Date();
    updateEl.textContent = now.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short"
    });
  }

  // ── Logout handler ──
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("username");
      // localStorage.removeItem("token");  // if you add JWT later
      window.location.href = "../public/index.html";
    });
  }

  // ── Placeholder: later fetch real data from backend ──
  // For now we show dummy values so the dashboard doesn't look empty

  // Dummy data (replace with real fetch later)
  const dummyData = {
    todayUsage: "14.8",
    todayChange: "+12% from yesterday",
    monthUsage: "287.4",
    monthChange: "-3.1% from last month",
    peakHour: "18:00 – 19:00 (3.2 kW)",
    hasAnomaly: true
  };

  // Fill cards
  document.getElementById("today-usage").textContent = dummyData.todayUsage + " kWh";
  document.getElementById("today-change").textContent = dummyData.todayChange;
  document.getElementById("month-usage").textContent = dummyData.monthUsage + " kWh";
  document.getElementById("month-change").textContent = dummyData.monthChange;
  document.getElementById("peak-hour").textContent = dummyData.peakHour;

  // Show/hide anomaly alert
  const alertCard = document.getElementById("anomaly-alert");
  if (dummyData.hasAnomaly && alertCard) {
    alertCard.style.display = "block";
  }

  // ── Simple Chart.js example (daily trend) ──
  const ctx = document.getElementById("consumptionChart")?.getContext("2d");
  if (ctx) {
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'kWh per day',
          data: [18.2, 21.5, 19.8, 24.1, 22.7, 17.3, 15.9],
          borderColor: '#00ff41',
          backgroundColor: 'rgba(0, 255, 65, 0.12)',
          tension: 0.3,
          fill: true,
          pointBackgroundColor: '#00ff41',
          pointBorderColor: '#000',
          pointBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: '#00cc33' },
            grid: { color: 'rgba(0, 255, 65, 0.08)' }
          },
          x: {
            ticks: { color: '#00cc33' },
            grid: { display: false }
          }
        },
        plugins: {
          legend: { labels: { color: '#00ff41' } }
        }
      }
    });
  }

  // ── Future improvements (you can start working on these next) ──
  // 1. fetch('/api/usage/latest') → real numbers
  // 2. fetch('/api/usage/history') → real chart data
  // 3. Simple anomaly check: if today > 1.5 × 7-day avg → show alert
  // 4. Connect real CSV parsed data from backend
});