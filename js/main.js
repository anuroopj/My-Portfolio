
(function () {
  "use strict";

  /* ---------- Config ---------- */
  var SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwvZhFQj-1Dp8Yga5mmUd-QG_u9e2emEABr0dHEuWp5c7cYa2ix1StR2v5Hiz1M42NCfQ/exec";

  /* ---------- Mobile nav ---------- */
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");

  function setNav(open) {
    if (!nav || !toggle) return;

    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute(
      "aria-label",
      open ? "Close menu" : "Open menu"
    );
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setNav(!nav.classList.contains("open"));
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        setNav(false);
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        setNav(false);
      }
    });
  }

  /* ---------- Active nav link on scroll ---------- */
  var sectionIds = ["top", "about", "skills", "contact"];
  var navLinks = nav
    ? nav.querySelectorAll(".nav-link")
    : [];

  if ("IntersectionObserver" in window) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          var id = entry.target.id;

          navLinks.forEach(function (link) {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === "#" + id
            );
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    sectionIds.forEach(function (id) {
      var section = document.getElementById(id);

      if (section) {
        navObserver.observe(section);
      }
    });

    /* ---------- Reveal on scroll ---------- */
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll(".reveal").forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("in");
    });
  }

  /* ---------- Copy email ---------- */
  var copyBtn = document.getElementById("copyEmail");

  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var email = "anuroop.jayan@example.com";

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(
          function () {
            copyBtn.setAttribute("title", "Copied!");

            setTimeout(function () {
              copyBtn.setAttribute("title", "Copy email");
            }, 1600);
          },
          function () {
            console.error("Could not copy email address.");
          }
        );
      }
    });
  }

  /* ---------- Contact form ---------- */
  var form = document.getElementById("contactForm");
  var statusEl = document.getElementById("formStatus");
  var submitBtn = document.getElementById("submitBtn");

  if (!form || !statusEl || !submitBtn) {
    return;
  }

  var submitLabel = submitBtn.querySelector("span");

  function setStatus(text, kind) {
    statusEl.textContent = text;
    statusEl.className =
      "form-status" + (kind ? " " + kind : "");
  }

  function markField(id, invalid) {
    var field = document.getElementById(id);

    if (field) {
      field.classList.toggle("invalid", invalid);
    }
  }

  function validate() {
    var name = form.elements.namedItem("name").value.trim();
    var email = form.elements.namedItem("email").value.trim();
    var message = form.elements.namedItem("message").value.trim();

    var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    markField("fieldName", !name);
    markField("fieldEmail", !emailOk);
    markField("fieldMessage", !message);

    if (!name) return "Please enter your name.";
    if (!emailOk) return "Please enter a valid email address.";
    if (!message) return "Please write a message.";

    return null;
  }

  ["name", "email", "message"].forEach(function (id) {
    var input = form.elements.namedItem(id);

    if (input) {
      input.addEventListener("input", function () {
        var fieldId =
          "field" + id.charAt(0).toUpperCase() + id.slice(1);

        markField(fieldId, false);
        setStatus("", "");
      });
    }
  });

  form.addEventListener("submit", function (e) {
    // Prevent the browser's default form submission and page reload.
    e.preventDefault();
    e.stopPropagation();

    if (submitBtn.disabled) return;

    var error = validate();

    if (error) {
      setStatus(error, "err");
      return;
    }

    var name = form.elements.namedItem("name").value.trim();
    var email = form.elements.namedItem("email").value.trim();
    var message = form.elements.namedItem("message").value.trim();

    var params = new URLSearchParams({
      name: name,
      email: email,
      message: message
    });

    var url = SCRIPT_URL + "?" + params.toString();

    submitBtn.disabled = true;

    if (submitLabel) {
      submitLabel.textContent = "Sending...";
    }

    setStatus("", "");

    fetch(url, {
      method: "GET",
      mode: "no-cors",
      redirect: "follow"
    })
      .then(function () {
        /*
         * no-cors responses are opaque.
         * A resolved fetch does not prove that the sheet was updated.
         */
        setStatus(
          "Your request was sent. Please note that delivery could not be verified.",
          "ok"
        );

        form.reset();

        ["fieldName", "fieldEmail", "fieldMessage"].forEach(
          function (id) {
            markField(id, false);
          }
        );
      })
      .catch(function (error) {
        console.error("Contact form request failed:", error);

        setStatus(
          "We couldn't send your message. Please try again.",
          "err"
        );
      })
      .finally(function () {
        submitBtn.disabled = false;

        if (submitLabel) {
          submitLabel.textContent = "Send Message";
        }
      });
  });
})();