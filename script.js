document.addEventListener("DOMContentLoaded", function () {
  const steps = document.querySelectorAll(".step");
  const nextButtons = document.querySelectorAll(".next-btn");
  const prevButtons = document.querySelectorAll(".prev-btn");
  const progressBar = document.getElementById("progress");
  const form = document.querySelector("form");
  const successMessage = document.getElementById("success-message");
  const submitButton = document.querySelector("button[type='submit']");
  let currentStep = 0;

  // 🔹 Show the current step & update progress bar
  function showStep(index) {
    steps.forEach((step, i) => step.classList.toggle("active", i === index));
    updateProgressBar();
  }

  function updateProgressBar() {
    progressBar.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
  }

  // 🔹 Validate all required fields in the current step
  function validateStep(stepIndex) {
    const fields = steps[stepIndex].querySelectorAll("input[required]");
    return Array.from(fields).every(validateField);
  }

  // 🔹 Validate a single input field & show custom error messages
  function validateField(field) {
    const errorSpan = field.nextElementSibling;
    let message = "";

    if (!field.checkValidity()) {
      switch (field.id) {
        case "email":
          message = "Please enter a valid email (e.g., user@example.com).";
          break;
        case "zip":
          message = "ZIP code must be exactly 5 digits (e.g., 12345).";
          break;
        case "card":
          message = "Card number must be 16 digits (e.g., 4111111111111111).";
          break;
        case "cvv":
          message = "CVV must be 3 digits (e.g., 123).";
          break;
        default:
          message = field.validationMessage;
      }
    }

    errorSpan.textContent = message;
    return !message;
  }

  // 🔹 Restrict numeric input & enforce length
  function enforceNumericInput(field, maxLength) {
    field.addEventListener("input", function () {
      this.value = this.value.replace(/\D/g, "").slice(0, maxLength);
      validateField(this);
    });
  }

  enforceNumericInput(document.getElementById("card"), 16);
  enforceNumericInput(document.getElementById("cvv"), 3);

  // 🔹 Attach validation to all required fields
  document.querySelectorAll("input[required]").forEach((field) => {
    field.addEventListener("input", () => validateField(field));
  });

  // 🔹 Next & Previous button functionality
  nextButtons.forEach((button, i) => {
    button.addEventListener("click", () => {
      if (validateStep(i)) {
        currentStep++;
        showStep(currentStep);
      }
    });
  });

  prevButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
      }
    });
  });

  // 🔹 Handle Form Submission
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";

    setTimeout(() => {
      form.style.display = "none";
      successMessage.style.display = "block";
    }, 2000);
  });

  // 🔹 Theme Toggle
  const themeToggle = document.getElementById("theme-toggle");
  const sunIcon = document.getElementById("sun-icon");
  const moonIcon = document.getElementById("moon-icon");

  function updateTheme(isDarkMode) {
    document.body.setAttribute("data-theme", isDarkMode ? "dark" : "light");
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    sunIcon.style.display = isDarkMode ? "inline" : "none";
    moonIcon.style.display = isDarkMode ? "none" : "inline";
  }

  updateTheme(localStorage.getItem("theme") === "dark");

  themeToggle.addEventListener("click", () => {
    updateTheme(document.body.getAttribute("data-theme") !== "dark");
  });

  // 🔹 Initialize form
  showStep(currentStep);
});
