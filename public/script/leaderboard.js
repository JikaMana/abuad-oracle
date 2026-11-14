(function () {
  "use strict";

  var PERIOD = "weekly";
  var board = null;
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
  function icons() {
    if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
  }
  function signedUser() {
    try {
      return window.firebase && window.firebase.auth && window.firebase.auth().currentUser;
    } catch (error) {
      return null;
    }
  }
  async function authHeaders() {
    var user = signedUser();
    if (!user) return {};
    var token = await user.getIdToken();
    return { Authorization: "Bearer " + token };
  }

  function paintPrize(id, prize) {
    var box = $(id);
    if (!box || !prize) return;
    box.className = "oracle-claim" + (prize.locked ? " is-locked" : " is-open");
    var code = prize.yours
      ? '<p class="oracle-claim-code">' +
        esc(prize.code) +
        "</p>" +
        '<p class="oracle-claim-help">' +
        esc(prize.note || "Message the admin with this code to confirm the prize.") +
        "</p>" +
        '<a class="btn btn-clay" target="_blank" rel="noopener" href="https://wa.me/' +
        esc(board.whatsapp) +
        "?text=" +
        encodeURIComponent("Exam Oracle prize claim. My code is " + prize.code + ".") +
        '">Message admin</a>'
      : '<div class="oracle-claim-lock"><i data-lucide="lock"></i><span>Locked</span></div>' +
        "<p>" +
        esc(prize.note || "This prize is locked.") +
        "</p>";
    box.innerHTML =
      '<p class="eyebrow text-clay">' +
      esc(prize.title) +
      "</p><h3>" +
      esc(prize.reward) +
      "</h3>" +
      code;
  }

  function paint() {
    if (!board) return;
    var period = board.periods[PERIOD];
    document.querySelectorAll(".oracle-board-tabs button").forEach(function (button) {
      button.classList.toggle("is-active", button.dataset.period === PERIOD);
    });
    $("chart-title").textContent = period.label;
    $("board-ranking").textContent = board.ranking;
    var rows = period.rows || [];
    var podium = rows.slice(0, 3);
    var order = [podium[1], podium[0], podium[2]].filter(Boolean);
    $("board-podium").innerHTML = podium.length
      ? order
          .map(function (row) {
            return (
              '<article class="oracle-podium-card is-rank-' +
              row.rank +
              (row.you ? " is-you" : "") +
              '"><b>0' +
              row.rank +
              "</b><strong>" +
              esc(row.name) +
              (row.you ? " · You" : "") +
              "</strong><span>" +
              row.average +
              "%</span></article>"
            );
          })
          .join("")
      : '<p class="oracle-board-empty">No ranked tests in this period yet.</p>';
    $("board-rows").innerHTML = rows.length
      ? rows
          .map(function (row) {
            var change = row.improvement > 0 ? "+" + row.improvement : String(row.improvement);
            return (
              "<tr" +
              (row.rank === 1 ? ' class="oracle-winner"' : row.you ? ' class="is-you"' : "") +
              "><td>" +
              String(row.rank).padStart(2, "0") +
              "</td><td><strong>" +
              esc(row.name) +
              "</strong>" +
              (row.rank === 1 ? '<span class="oracle-winner-tag">Prize leader</span>' : "") +
              (row.you ? '<span class="oracle-you-tag">You</span>' : "") +
              "</td><td>" +
              row.average +
              "%</td><td>" +
              change +
              "</td><td>" +
              row.tests +
              "</td><td>" +
              row.days +
              "</td></tr>"
            );
          })
          .join("")
      : '<tr><td colspan="6">Complete a test while signed in and the board will update.</td></tr>';
    var max = Math.max.apply(
      null,
      period.chart
        .map(function (bar) {
          return bar.tests;
        })
        .concat([1]),
    );
    $("board-chart").innerHTML = period.chart
      .map(function (bar) {
        var height = Math.max(8, Math.round((bar.tests / max) * 100));
        return (
          '<div class="oracle-bar"><i style="height:' +
          height +
          '%"></i><b>' +
          (bar.tests ? bar.average + "%" : "–") +
          "</b><span>" +
          esc(bar.label) +
          "</span></div>"
        );
      })
      .join("");
    paintPrize("prize-weekly", board.prizes.weekly);
    paintPrize("prize-monthly", board.prizes.monthly);
    icons();
  }

  async function load() {
    $("board-status").textContent = "Updating";
    try {
      var res = await fetch("/api/leaderboard", { headers: await authHeaders() });
      var data = await res.json();
      if (!res.ok) throw new Error(data.error || "Leaderboard unavailable.");
      board = data;
      $("board-status").innerHTML = '<i data-lucide="radio" class="w-4 h-4"></i> Live';
      paint();
    } catch (error) {
      $("board-status").textContent = "Could not load";
      $("board-rows").innerHTML =
        '<tr><td colspan="6">' +
        esc(error.message || "Could not load the leaderboard.") +
        "</td></tr>";
    }
  }

  document.querySelectorAll(".oracle-board-tabs button").forEach(function (button) {
    button.addEventListener("click", function () {
      PERIOD = button.dataset.period;
      paint();
    });
  });

  function start() {
    if (!window.firebase) {
      load();
      return;
    }
    if (!window.firebase.apps.length) window.firebase.initializeApp(firebaseConfig);
    window.firebase
      .auth()
      .setPersistence(window.firebase.auth.Auth.Persistence.LOCAL)
      .catch(function () {})
      .then(function () {
        window.firebase.auth().onAuthStateChanged(function () {
          load();
        });
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
