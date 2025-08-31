const nav = document.querySelector(".nav");
const toggle = document.querySelector(".nav-toggle");

window.addEventListener("DOMContentLoaded", () => {
    const stored = localStorage.getItem("navVisible");
    if (stored === "false") {
        nav.classList.add("hide-click");
    } else {
        nav.classList.add("show");
    }
});

document.querySelectorAll(".nav__link").forEach(link => {
    if (link.hostname === window.location.hostname) {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const href = link.getAttribute("href");

            nav.classList.remove("show");
            nav.classList.add("hide-click");

            setTimeout(() => {
                window.location = href;
            }, 500);
        });
    }
});

toggle.addEventListener("click", () => {
    if (nav.classList.contains("show")) {
        nav.classList.remove("show");
        nav.classList.add("hide-click");
        localStorage.setItem("navVisible", "false");
    } else {
        nav.classList.remove("hide-click");
        nav.classList.add("show");
        localStorage.setItem("navVisible", "true");
    }
});

window.addEventListener("scroll", () => {
    const scrollY = window.scrollY + window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    if (docHeight - scrollY < 150) {
        nav.classList.remove("show");
        nav.classList.add("hide-scroll");
    } else {
        if (localStorage.getItem("navVisible") !== "false") {
            nav.classList.add("show");
            nav.classList.remove("hide-scroll");
        }
    }
});

window.addEventListener("resize", () => {
    const stored = localStorage.getItem("navVisible");
    if (stored !== "false") {
        nav.classList.add("show");
        nav.classList.remove("hide-click", "hide-scroll");
    }
});
