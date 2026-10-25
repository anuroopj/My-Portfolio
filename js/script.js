(function () {
      /* ---------- Config ---------- */
      var SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzvO5GLB-PlXrPZvV3DAG8hSHuYRPfW0B4J6WLtfe58ctspppgkJ349epkYSKFPYGeV/exec";

      /* ---------- Mobile nav ---------- */
      var toggle = document.getElementById("navToggle");
      var nav = document.getElementById("nav");

      function setNav(open) {
        nav.classList.toggle("open", open);
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      }

      toggle.addEventListener("click", function () {
        setNav(!nav.classList.contains("open"));
      });

      nav.addEventListener("click", function (e) {
        if (e.target.tagName === "A") setNav(false);
      });

      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") setNav(false);
      });

      /* ---------- Active nav link on scroll ---------- */
      var sectionIds = ["top", "about", "skills", "contact"];
      var navLinks = nav.querySelectorAll(".nav-link");

      if ("IntersectionObserver" in window) {
        var navObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var id = entry.target.id;
            navLinks.forEach(function (link) {
              link.classList.toggle("active", link.getAttribute("href") === "#" + id);
            });
          });
        }, { rootMargin: "-45% 0px -50% 0px" });

        sectionIds.forEach(function (id) {
          var el = document.getElementById(id);
          if (el) navObserver.observe(el);
        });

        /* ---------- Reveal on scroll ---------- */
        var revealObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              revealObserver.unobserve(entry.target);
            }
          });
        }, { threshold: 0.12 });

        document.querySelectorAll(".reveal").forEach(function (el) {
          revealObserver.observe(el);
        });
      } else {
        document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
      }

      /* ---------- Copy email ---------- */
      var copyBtn = document.getElementById("copyEmail");
      copyBtn.addEventListener("click", function () {
        var email = "anuroop.jayan@example.com";
        var done = function () {
          copyBtn.setAttribute("title", "Copied!");
          setTimeout(function () { copyBtn.setAttribute("title", "Copy email"); }, 1600);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(email).then(done, function () {});
        } else {
          var ta = document.createElement("textarea");
          ta.value = email;
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand("copy"); done(); } catch (err) {}
          document.body.removeChild(ta);
        }
      });

      /* ---------- Contact form ---------- */
      var form = document.getElementById("contactForm");
      var statusEl = document.getElementById("formStatus");
      var submitBtn = document.getElementById("submitBtn");
      var submitLabel = submitBtn.querySelector("span");

      function setStatus(text, kind) {
        statusEl.textContent = text;
        statusEl.className = "form-status" + (kind ? " " + kind : "");
      }

      function markField(id, invalid) {
        document.getElementById(id).classList.toggle("invalid", invalid);
      }

      function validate() {
        var name = form.name.value.trim();
        var email = form.email.value.trim();
        var message = form.message.value.trim();
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
        form[id].addEventListener("input", function () {
          markField("field" + id.charAt(0).toUpperCase() + id.slice(1), false);
        });
      });

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var error = validate();
        if (error) {
          setStatus(error, "err");
          return;
        }

        var params = new URLSearchParams({
          name: form.name.value.trim(),
          email: form.email.value.trim(),
          message: form.message.value.trim()
        });
        var url = SCRIPT_URL + "?" + params.toString();

        submitBtn.disabled = true;
        submitLabel.textContent = "Sending...";
        setStatus("", "");

        fetch(url, { method: "GET", mode: "no-cors" })
          .then(function () {
            /* With mode "no-cors" the response is opaque, so success is assumed once the request completes. */
            setStatus("Thanks! Your message has been sent.", "ok");
            form.reset();
          })
          .catch(function () {
            setStatus("Something went wrong. Please try again.", "err");
          })
          .then(function () {
            submitBtn.disabled = false;
            submitLabel.textContent = "Send Message";
          });
      });
    })();
