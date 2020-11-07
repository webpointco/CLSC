// From https://bulma.io/documentation/components/navbar/
document.addEventListener("DOMContentLoaded", () => {

  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll(".navbar-burger"), 0);

  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {

    // Add a click event on each of them
    $navbarBurgers.forEach( el => {
      el.addEventListener("click", () => {

        // Get the target from the "data-target" attribute
        const target = el.dataset.target;
        const $target = document.getElementById(target);

        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        el.classList.toggle("is-active");
        $target.classList.toggle("is-active");

      });
    });
  }

});

// mobile dropdown functionality
// i'm sorry if your name is Adam Goldstein and you're seeing this... I tried my best
const dropdownTargets = ["about-dropdown", "academics-dropdown", "calendar-dropdown"];

document.addEventListener("DOMContentLoaded", () => {

  // Get all "drop-container" elements
  const $dropContainers = Array.prototype.slice.call(document.querySelectorAll(".drop-container"), 0);

  // Check if there are any navbar burgers
  if ($dropContainers.length > 0) {
    // Add a click event on each of them
    $dropContainers.forEach( el => {
      el.addEventListener("click", () => {
        let source = el.getAttribute("href");
        //let target = "";
        if (source === "/about-us.pug") {
          // Get the target from the "data-target" attribute
          const $target = document.getElementById(dropdownTargets[0]);
          // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
          el.classList.toggle("mobile-onclick");
          $target.classList.toggle("mobile-onclick");
        }
        if (source === "/curriculum.pug") {
          // Get the target from the "data-target" attribute
          const $target = document.getElementById(dropdownTargets[1]);
          // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
          el.classList.toggle("mobile-onclick");
          $target.classList.toggle("mobile-onclick");
        }
        if (source === "/calendar.pug") {
          // Get the target from the "data-target" attribute
          const $target = document.getElementById(dropdownTargets[2]);
          // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
          el.classList.toggle("mobile-onclick");
          $target.classList.toggle("mobile-onclick");
        }
      });
    });
  }

});
