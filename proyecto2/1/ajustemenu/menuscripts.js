const menuBtn = document.getElementById("menu-btn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const closeBtn = document.getElementById("close-btn");

const dropdownButtons = document.querySelectorAll(".submenu-btn");
const navLinks = document.querySelectorAll(".menu-link, .submenu a");

function closeAllDropdowns() {
    document.querySelectorAll(".dropdown").forEach(dropdown => {
        dropdown.classList.remove("open");
    });

    document.querySelectorAll(".submenu-btn").forEach(btn => {
        btn.setAttribute("aria-expanded", "false");
    });

    document.querySelectorAll(".arrow").forEach(arrow => {
        arrow.classList.remove("rotate");
    });

    document.querySelectorAll(".submenu").forEach(submenu => {
        submenu.style.maxHeight = null;
    });
}

function openSidebar() {
    sidebar.classList.add("active");
    overlay.classList.add("active");
    menuBtn.classList.add("active");
    menuBtn.setAttribute("aria-expanded", "true");
    sidebar.setAttribute("aria-hidden", "false");
}

function closeSidebar() {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
    menuBtn.classList.remove("active");
    menuBtn.setAttribute("aria-expanded", "false");
    sidebar.setAttribute("aria-hidden", "true");
    closeAllDropdowns();
}

menuBtn.addEventListener("click", () => {
    const isOpen = sidebar.classList.contains("active");
    if (isOpen) {
        closeSidebar();
    } else {
        openSidebar();
    }
});

overlay.addEventListener("click", closeSidebar);

if (closeBtn) {
    closeBtn.addEventListener("click", closeSidebar);
}

navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        const targetId = link.getAttribute("href");

        if (targetId && targetId.startsWith("#")) {
            e.preventDefault();

            const target = document.querySelector(targetId);
            if (!target) return;

            const header = document.querySelector(".site-header");
            const headerHeight = header.offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = targetPosition - headerHeight - 10;

            closeSidebar();
            closeAllDropdowns();

            setTimeout(() => {
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }, 150);
        }
    });
});

dropdownButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const dropdown = btn.closest(".dropdown");
        const submenu = btn.nextElementSibling;
        const arrow = btn.querySelector(".arrow");
        const isOpen = dropdown.classList.contains("open");

        closeAllDropdowns();

        if (!isOpen) {
            dropdown.classList.add("open");
            btn.setAttribute("aria-expanded", "true");
            arrow.classList.add("rotate");
            submenu.style.maxHeight = submenu.scrollHeight + "px";
        }
    });
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
        closeSidebar();
    } else {
        closeAllDropdowns();
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeSidebar();
    }
});