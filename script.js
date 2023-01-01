"use strict";

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");
const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");
const nav = document.querySelector(".nav");

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

///////////////////////////////////////
// Learn More scroll button

btnScrollTo.addEventListener("click", function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  console.log(e.target.getBoundingClientRect());

  console.log("Current scroll (x/y)", window.pageXOffset, window.pageYOffset);

  console.log(
    "haight/width vieport",
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  // Old scholl
  // Scrolling
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: "smooth",
  // });

  // Easy way
  section1.scrollIntoView({ behavior: "smooth" });
});

///////////////////////////////////////
// Page Navigation

//// first way
// document.querySelectorAll(".nav__link").forEach(function (el) {
//   el.addEventListener("click", function (e) {
//     e.preventDefault();

//     const id = this.getAttribute("href");
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: "smooth" });
//   });
// });

//// socond and better way
// 1. Add event listener to common parent elemnt
// 2. Determine what elemnt originated the event
document.querySelector(".nav__links").addEventListener("click", function (e) {
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

///////////////////////////////////////
//  Tabbed component

tabsContainer.addEventListener("click", function (e) {
  const clicked = e.target.closest(".operations__tab"); // to solve the span (number) that when we click on that too, we click on the tab
  console.log(clicked);

  // Gaurd clause
  if (!clicked) return;

  // Remove active classes
  tabs.forEach((t) => t.classList.remove("operations__tab--active"));
  tabsContent.forEach((c) => c.classList.remove("operations__content--active"));

  // Active tab
  clicked.classList.add("operations__tab--active");

  // Active content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add("operations__content--active");
});

///////////////////////////////////////
//  Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains("nav__link")) {
    const link = e.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = this;
      console.log("bith");
    });
    logo.style.opacity = this;
  }
};

// Passeing "argument" into handler
nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));

///////////////////////////////////////
//  Sticky navigation

// using scroll event wich is not good for performence
// const initialCoords = section1.getBoundingClientRect();

// console.log(initialCoords);

// window.addEventListener("scroll", function (e) {
//   console.log(window.scrollY);

//   if (window.scrollY > initialCoords.top) nav.classList.add("sticky");
//   else nav.classList.remove("sticky");
// });

// doing the same with: "The Intersection Observer API"
// const obsCallback = function (entries, observer) {
//   entries.forEach((entry) => {
//     console.log(entry);
//   });
// };

// const obsOptions = {
//   root: null, // whole viewport
//   threshold: [0, 0.2],
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const header = document.querySelector(".header");
const navHeight = nav.getBoundingClientRect().height; // height of nav to show it sooner  (using rootMargin below)

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

///////////////////////////////////////
//  Reveal Sections
const allSections = document.querySelectorAll(".section");

const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

///////////////////////////////////////
//  Lazy Loading Images
const imgTargets = document.querySelectorAll("img[data-src]"); // to select the images that have data-src property

const loadImg = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);

  if (!entry.isIntersecting) return;
  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;
  // delete css blur effect when image is loaded
  entry.target.addEventListener("load", function () {
    entry.target.classList.remove("lazy-img");
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});

imgTargets.forEach((img) => imgObserver.observe(img));

///////////////////////////////////////
// Slider
const slider = function () {
  const slides = document.querySelectorAll(".slide");
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  const dotContainer = document.querySelector(".dots");

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") prevSlide();
    e.key === "ArrowRight" && nextSlide();
  });

  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

///////////////////////////////////////
/*
//// Selecting elements
console.log(document.documentElement);
console.log(document.head);
console.log(document.bodyz);

document.querySelector(".header");
const allSections = document.querySelectorAll(".section");
console.log(allSections);

document.querySelector("section--1");
const allBottons = document.getElementsByTagName("button");
console.log(allBottons);

console.log(document.getElementsByClassName("btn"));

//// Creating and inserting elements programmatically
// .insertAdjacentHTML

const message = document.createElement("div");
message.classList.add("cookie-message");
// message.textContent =
// "We used cookies for improved funcionality and analytics.";
// or we can
message.innerHTML =
  "We used cookies for improved funcionality and analytics. <button class='btn btn--close-cookie'>Got it!</button>";
// inserting it to DOM
document.querySelector(".header").append(message);
// document.querySelector(".header").prepend(message.cloneNode(true));
// document.querySelector(".header").before(message.cloneNode(true));
// document.querySelector(".header").after(message.cloneNode(true));
// prepend - append - after - before

// Delete
document
  .querySelector(".btn--close-cookie")
  .addEventListener("click", function () {
    message.remove();
  });

//// Styles
message.style.backgroundColor = "#37383d";
message.style.width = "120%";

// view the styles (including css styles)
console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 40 + "px";

document.documentElement.style.setProperty("--color-primary", "aqua");

//// Attributes

const logo = document.querySelector(".nav__logo");
logo.alt = "beatiful minimalist logo"; //changing existing attribute
console.log(logo.alt);
console.log(logo.src); // absolute version of img source
console.log(logo.getAttribute("src")); // relative version of img source (this is also the case for href attributes)
console.log(logo.className);

console.log(logo.getAttribute("designer")); // this "designer attribute doesn't exist"
logo.setAttribute("designer", "Hami Hash"); // how to define new attribute
console.log(logo.getAttribute("designer")); // this exist now

// Data attributes
console.log(logo.dataset.versionNumber);

// Classes
logo.classList.add("c", "j");
logo.classList.remove("c", "j");
logo.classList.toggle("c");
logo.classList.contains("c");

// Dpnt's use this becouse it overwrite all the existing classes and allows only 1 class on element
logo.className = "jonas";

//// Events
const h1 = document.querySelector("h1");

const alertH1 = function (e) {
  alert("addEventListener: Great! you are reading the heading :D");
  // We can remove it so it wont repeat again
  h1.removeEventListener("mouseenter", alertH1);
};

// Or we can make it so it removes after 3 seconds:
// setTimeout(() => h1.removeEventListener("mouseenter", alertH1), 3000);

h1.addEventListener("mouseenter", alertH1);

// we can do the same like this: (old school way)
// h1.onmouseenter = function (e) {
  //   alert("addEventListener: Great! you are reading the heading :D");
  // };


/////////////////////////////////////////// DOM Traversing ////

const h1 = document.querySelector("h1");

//// Going downwards: child
console.log(h1.querySelectorAll(".highlight"));
console.log(h1.childNodes);
console.log(h1.children); // only for direct children
h1.firstElementChild.style.color = "white";
h1.lastElementChild.style.color = "aqua";

//// Going upwards: parents
console.log(h1.parentNode); // direct
console.log(h1.parentElement); // direct

h1.closest(".header").style.background = "aqua"; // not direct and very usefull
h1.closest("h1").style.background = "black";
// note that this is exactly the opposite of querySelector wich finds children in the DOM three while the closest method finds parents (for both no matter how for down or up in the DOM)

//// Going sideways: siblings
// note that we can only access direct siblings in javascript
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling); // nodes
console.log(h1.nextSibling); // nodes

// trick to get all the childre:
console.log(h1.parentElement.children);
// ex)
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = "scale(0.5)";
});

*/
