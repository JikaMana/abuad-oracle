(function () {
  "use strict";

  var ADMIN_EMAIL = "burhantutors@gmail.com";
  var firebaseConfig = {
    apiKey: "AIzaSyDaIbNnFoxs43TSmfAleFK3oQPuQKog2DU",
    authDomain: "burhan-tutors-website.firebaseapp.com",
    projectId: "burhan-tutors-website",
    storageBucket: "burhan-tutors-website.firebasestorage.app",
    messagingSenderId: "359861270073",
    appId: "1:359861270073:web:516d9da8eb4e8c46613fe8",
  };

  function $(id) {
    return document.getElementById(id);
  }
  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "\u0026amp;")
      .replace(/</g, "\u0026lt;")
      .replace(/>/g, "\u0026gt;")
      .replace(/"/g, "\u0026quot;");
  }
  function when(iso) {
    if (!iso) return "—";
    var date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Africa/Lagos",
    });
  }
  function naira(value) {
    return "₦" + Number(value || 0).toLocaleString("en-NG");
  }
  function gate(title, copy, link) {
    $("admin-gate").hidden = false;
    $("admin-app").hidden = true;
    $("admin-gate").querySelector("h1").textContent = title;
    $("admin-gate-copy").innerHTML = esc(copy) + (link || "");
  }

  function prizeBlock(title, prize, lockedNote) {
    if (!prize) return "<p>" + esc(title) + ": nobody yet.</p>";
    var code = prize.code
      ? '<p class="oracle-admin-code">' +
        esc(prize.code) +
        '</p><button type="button" class="btn btn-clay" data-copy="' +
        esc(prize.code) +
        '">Copy code</button>'
      : "<p>" + esc(lockedNote) + "</p>";
    return (
      "<h2>" +
      esc(title) +
      "</h2><p><strong>" +
      esc(prize.name) +
      "</strong> · " +
      esc(prize.points) +
      " pts · " +
      esc(prize.average) +
      "% · " +
      esc(prize.tests) +
      " tests</p>" +
      code
    );
  }

  function paint(data) {
    $("admin-gate").hidden = true;
    $("admin-app").hidden = false;
    $("stat-accounts").textContent = data.accounts;
    $("stat-paid").textContent = data.paidNow;
    $("stat-revenue").textContent = naira(data.revenueNaira);
    $("stat-tests").textContent = data.tests;
    $("stat-active").textContent = data.activeToday;
    $("stat-today").textContent = data.testsToday;
    $("stat-week").textContent = data.testsThisWeek;
    $("stat-average").textContent = data.average + "%";
    var notes = [];
    if (data.authNote) notes.push(data.authNote);
    if (data.truncated) notes.push("Account count stops at 3,000.");
    if (data.scoresTruncated) notes.push("Practice figures use the latest 800 scored tests.");
    notes.push(
      (data.promo && data.promo.active ? "Free access is on until " : "Free access ended ") +
        (data.promo ? data.promo.until : "") +
        ". Paid access is " +
        naira(data.priceNaira) +
        ". " +
        data.profiles +
        " student profiles. " +
        data.newThisWeek +
        " new accounts this week. " +
        data.pendingPayments +
        " payments still pending. " +
        data.groqKeys +
        " Groq keys connected.",
    );
    $("admin-note").hidden = false;
    $("admin-note").textContent = notes.join(" ");
    $("admin-prizes").innerHTML =
      prizeBlock("Last week's winner", data.prize && data.prize.lastWeek, "") +
      prizeBlock(
        "This week, still locked",
        data.prize && data.prize.thisWeek,
        "No code yet. It stays locked until Monday 00:00, including for this leader.",
      ) +
      prizeBlock("This month's leader", data.prize && data.prize.thisMonth, "");
    var courses = data.courses || [];
    var max = courses.reduce(function (best, course) {
      return Math.max(best, course.tests);
    }, 1);
    $("admin-courses").innerHTML = courses.length
      ? courses
          .map(function (course) {
            return (
              '<div class="oracle-admin-course"><span>' +
              esc(course.course) +
              '</span><i style="width:' +
              Math.max(8, Math.round((course.tests / max) * 100)) +
              '%"></i><b>' +
              esc(course.tests) +
              " · " +
              esc(course.average) +
              "%</b></div>"
            );
          })
          .join("")
      : "<p>No completed tests yet.</p>";
    $("admin-accounts").innerHTML =
      (data.recentAccounts || [])
        .map(function (account) {
          return (
            "<tr><td>" +
            esc(account.email) +
            "</td><td>" +
            esc(when(account.joined)) +
            "</td><td>" +
            (account.paid ? "Paid" : "Free") +
            "</td></tr>"
          );
        })
        .join("") || '<tr><td colspan="3">No accounts yet.</td></tr>';
    $("admin-payments").innerHTML =
      (data.recentPayments || [])
        .map(function (payment) {
          return (
            "<tr><td>" +
            esc(payment.email) +
            "</td><td>" +
            esc(naira(payment.amount)) +
            "</td><td>" +
            esc(payment.status) +
            " · " +
            esc(when(payment.at)) +
            "</td></tr>"
          );
        })
        .join("") || '<tr><td colspan="3">No payments yet.</td></tr>';
    document.querySelectorAll("[data-copy]").forEach(function (button) {
      button.addEventListener("click", function () {
        var code = button.getAttribute("data-copy");
        if (navigator.clipboard) navigator.clipboard.writeText(code);
        button.textContent = "Copied";
      });
    });
  }

  async function load(user) {
    var token = await user.getIdToken();
    var res = await fetch("/api/admin", { headers: { Authorization: "Bearer " + token } });
    var data = await res.json().catch(function () {
      return {};
    });
    if (res.status === 403) {
      gate(
        "Not available on this account",
        data.error || "This dashboard is only for the Exam Oracle admin.",
      );
      return;
    }
    if (!res.ok) throw new Error(data.error || "The admin dashboard could not be loaded.");
    paint(data);
  }

  function start() {
    if (!window.firebase) {
      gate("Sign-in could not start", "Refresh the page and try again.");
      return;
    }
    if (!window.firebase.apps.length) window.firebase.initializeApp(firebaseConfig);
    window.firebase
      .auth()
      .setPersistence(window.firebase.auth.Auth.Persistence.LOCAL)
      .catch(function () {})
      .then(function () {
        window.firebase.auth().onAuthStateChanged(function (user) {
          if (!user) {
            gate(
              "Sign in first",
              "Use your Exam Oracle account, then open this page again.",
              '<p class="mt-4"><a class="btn btn-clay" href="/exam-oracle.html">Open Exam Oracle</a></p>',
            );
            return;
          }
          if (
            String(user.email || "")
              .trim()
              .toLowerCase() !== ADMIN_EMAIL
          ) {
            gate(
              "Not available on this account",
              "This dashboard is only for the Exam Oracle admin.",
            );
            return;
          }
          load(user).catch(function (error) {
            gate("Could not load the dashboard", error.message || "Try again in a moment.");
          });
        });
      });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
