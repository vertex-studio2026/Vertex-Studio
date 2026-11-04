/* =====================================================
   Vertex Studio — lightweight, transparent interactions
   ===================================================== */

const siteHeader = document.getElementById("siteHeader");
const menuButton = document.getElementById("menuButton");
const mobileMenu = document.getElementById("mobileMenu");
const themeToggle = document.getElementById("themeToggle");
const themeColor = document.querySelector('meta[name="theme-color"]');

// Add a subtle header divider after the page starts moving.
const syncHeader = () => {
  siteHeader?.classList.toggle("is-scrolled", window.scrollY > 8);
};
window.addEventListener("scroll", syncHeader, { passive: true });
syncHeader();

// Mobile navigation.
const setMenu = (open) => {
  if (!menuButton || !mobileMenu) return;
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute(
    "aria-label",
    open ? "Close navigation" : "Open navigation",
  );
  mobileMenu.hidden = !open;
};

menuButton?.addEventListener("click", () => {
  setMenu(menuButton.getAttribute("aria-expanded") !== "true");
});

mobileMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 1040) setMenu(false);
});

// Theme preference. The choice is stored only in this browser.
const getStoredTheme = () => {
  try {
    return localStorage.getItem("vertex-theme");
  } catch {
    return null;
  }
};

const setStoredTheme = (theme) => {
  try {
    localStorage.setItem("vertex-theme", theme);
  } catch {
    // The theme still works when browser storage is unavailable.
  }
};

const applyTheme = (theme) => {
  const dark = theme === "dark";
  document.documentElement.toggleAttribute("data-theme", dark);
  if (dark) document.documentElement.setAttribute("data-theme", "dark");
  if (themeToggle)
    themeToggle.setAttribute(
      "aria-label",
      dark ? "Switch to light theme" : "Switch to dark theme",
    );
  if (themeColor)
    themeColor.setAttribute("content", dark ? "#0e1714" : "#f6f7f3");
};

const preferredTheme =
  getStoredTheme() ||
  (window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light");
applyTheme(preferredTheme);

themeToggle?.addEventListener("click", () => {
  const nextTheme =
    document.documentElement.getAttribute("data-theme") === "dark"
      ? "light"
      : "dark";
  applyTheme(nextTheme);
  setStoredTheme(nextTheme);
});

// Keep one FAQ answer open at a time so the list remains easy to scan.
document.querySelectorAll(".faq-list details").forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    document.querySelectorAll(".faq-list details").forEach((otherItem) => {
      if (otherItem !== item) otherItem.open = false;
    });
  });
});

// Copy the published email address without collecting any user data.
const copyEmailButton = document.getElementById("copyEmail");
const fallbackCopy = (text) => {
  const input = document.createElement("textarea");
  input.value = text;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.appendChild(input);
  input.select();
  const copied = document.execCommand("copy");
  input.remove();
  return copied;
};

copyEmailButton?.addEventListener("click", async () => {
  const email = copyEmailButton.dataset.email;
  let copied = false;

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(email);
      copied = true;
    } else {
      copied = fallbackCopy(email);
    }
  } catch {
    copied = fallbackCopy(email);
  }

  const originalLabel = "Copy email";
  copyEmailButton.textContent = copied ? "Email copied" : "Copy failed";
  window.setTimeout(() => {
    copyEmailButton.textContent = originalLabel;
  }, 1800);
});

// The enquiry form opens a pre-filled email. It does not pretend to submit to a server.
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const recipient = "vertexstudio.work2026@gmail.com";

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  formStatus?.classList.remove("is-error");

  if (!contactForm.checkValidity()) {
    contactForm.reportValidity();
    if (formStatus) {
      formStatus.textContent =
        "Please complete the required fields before creating your email.";
      formStatus.classList.add("is-error");
    }
    return;
  }

  const data = new FormData(contactForm);
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const business = String(data.get("business") || "").trim();
  const projectType = String(data.get("projectType") || "").trim();
  const budget = String(data.get("budget") || "").trim();
  const message = String(data.get("message") || "").trim();

  const subject = `Website enquiry — ${business || name}`;
  const body = [
    "Hello Vertex Studio,",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Business / organisation: ${business || "Not provided"}`,
    `Project type: ${projectType}`,
    `Approximate budget: ${budget}`,
    "",
    "Project details:",
    message,
    "",
    "Thank you,",
  ].join("\n");

  const mailto = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  if (formStatus) {
    formStatus.textContent =
      "Opening your email app. Review the message there, then press send.";
  }
  window.location.href = mailto;
});

// Current year in the footer.
const year = document.getElementById("year");
if (year) year.textContent = String(new Date().getFullYear());
