const LOGO_SRC = "assets/images/logo.png";
const LOGO_TARGET_IDS = ["nav-logo-img", "hero-card-logo", "camp-logo", "modal-logo", "footer-logo"];

const navbar = document.getElementById("navbar");
const navLinks = document.getElementById("navLinks");
const hamburger = document.getElementById("hamburger");
const donateModal = document.getElementById("donateModal");
const customAmountInput = document.getElementById("customAmt");

let selectedAmt = "100";

async function setBase64Images(src, ids) {
    try {
        const response = await fetch(src);
        if (!response.ok) {
            throw new Error("Falha ao carregar logo.");
        }

        const blob = await response.blob();
        const reader = new FileReader();

        reader.onloadend = () => {
            const base64Data = reader.result;
            ids.forEach((id) => {
                const element = document.getElementById(id);
                if (element) {
                    element.src = base64Data;
                }
            });
        };

        reader.readAsDataURL(blob);
    } catch (error) {
        console.error(error);
    }
}

function toggleScrolledNavbar() {
    if (!navbar) {
        return;
    }
    navbar.classList.toggle("scrolled", window.scrollY > 40);
}

function toggleMobileMenu() {
    if (!navLinks || !hamburger) {
        return;
    }
    const isOpen = navLinks.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", String(isOpen));
}

function closeMobileMenu() {
    if (!navLinks || !hamburger) {
        return;
    }
    navLinks.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
}

function initRevealObserver() {
    const revealTargets = document.querySelectorAll(".r");
    if (!revealTargets.length) {
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("vis");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1 }
    );

    revealTargets.forEach((element) => observer.observe(element));
}

function openModal() {
    if (!donateModal) {
        return;
    }

    donateModal.classList.add("open");
    document.body.style.overflow = "hidden";
}

function closeModal() {
    if (!donateModal) {
        return;
    }

    donateModal.classList.remove("open");
    document.body.style.overflow = "";
}

function selectAmt(btn, amt) {
    document.querySelectorAll(".amount-btn").forEach((button) => button.classList.remove("active"));

    if (btn) {
        btn.classList.add("active");
    }

    selectedAmt = amt;
    if (customAmountInput) {
        customAmountInput.value = "";
    }
}

function confirmDonate() {
    const customValue = customAmountInput ? customAmountInput.value : "";
    const amount = customValue || selectedAmt;

    alert(
        "Você será redirecionado para a plataforma de doação. Valor selecionado: R$ " +
            amount +
            "\n\n(Em produção, este botão levaria à URL da campanha na Vakinha ou APOIA.se)"
    );
    closeModal();
}

function sendForm(btn) {
    if (!btn) {
        return;
    }

    const originalText = btn.textContent;
    btn.textContent = "✓ Mensagem enviada!";
    btn.style.background = "#004D5E";

    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = "";
    }, 3000);
}

function initEvents() {
    window.addEventListener("scroll", toggleScrolledNavbar);
    toggleScrolledNavbar();

    if (hamburger) {
        hamburger.setAttribute("aria-expanded", "false");
        hamburger.addEventListener("click", toggleMobileMenu);
    }

    document.querySelectorAll("#navLinks a").forEach((link) => {
        link.addEventListener("click", closeMobileMenu);
    });

    if (donateModal) {
        donateModal.addEventListener("click", (event) => {
            if (event.target === event.currentTarget) {
                closeModal();
            }
        });
    }

    if (customAmountInput) {
        customAmountInput.addEventListener("input", (event) => {
            const { value } = event.target;
            if (!value) {
                return;
            }

            document.querySelectorAll(".amount-btn").forEach((button) => button.classList.remove("active"));
            selectedAmt = value;
        });
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeModal();
        }
    });
}

setBase64Images(LOGO_SRC, LOGO_TARGET_IDS);
initRevealObserver();
initEvents();

// Inline handlers expected by the HTML.
window.openModal = openModal;
window.closeModal = closeModal;
window.selectAmt = selectAmt;
window.confirmDonate = confirmDonate;
window.sendForm = sendForm;
