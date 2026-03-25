import { formatMoneyBRL, generatePixPayload } from "./utils.js";

export function createDonationController({ pixKey, defaultSelectedAmount, initIcons }) {
  const donateModal = document.getElementById("donateModal");
  const customAmountInput = document.getElementById("customAmt");
  const valuesSelection = document.getElementById("values-selection");

  const pixBox = document.getElementById("pixBox");
  const pixAmount = document.getElementById("pixAmount");
  const pixPayload = document.getElementById("pixPayload");
  const pixQr = document.getElementById("pixQr");
  const copyPixCode = document.getElementById("copyPixCode");
  const copyPixKey = document.getElementById("copyPixKey");

  let selectedAmt = defaultSelectedAmount;

  function resetPixPanel() {
    if (pixBox) {
      pixBox.hidden = true;
    }
    if (pixPayload) {
      pixPayload.value = "";
    }
    if (pixQr) {
      pixQr.innerHTML = "";
    }
    if (pixAmount) {
      pixAmount.textContent = "Valor: R$ 0,00";
    }
  }

  function setDefaultSelection() {
    const buttons = Array.from(document.querySelectorAll(".amount-btn"));
    buttons.forEach((button) => button.classList.remove("active"));

    const defaultButton =
      buttons.find((button) => button.textContent.replace(/\D/g, "") === defaultSelectedAmount) || buttons[0];

    if (defaultButton) {
      defaultButton.classList.add("active");
    }

    selectedAmt = defaultSelectedAmount;
  }

  function resetDonateModal() {
    if (customAmountInput) {
      customAmountInput.value = "";
    }
    if (valuesSelection) {
      valuesSelection.hidden = false;
    }
    setDefaultSelection();
    resetPixPanel();
  }

  function renderPixQr(payload, amount) {
    if (!pixBox || !pixPayload || !pixQr || !pixAmount) {
      return;
    }

    if (valuesSelection) {
      valuesSelection.hidden = true;
    }

    pixAmount.textContent = `Valor: ${formatMoneyBRL(amount)}`;
    pixPayload.value = payload;
    pixQr.innerHTML = "";

    if (window.QRCode) {
      new window.QRCode(pixQr, {
        text: payload,
        width: 180,
        height: 180,
        colorDark: "#0A1F2E",
        colorLight: "#FFFFFF",
        correctLevel: window.QRCode.CorrectLevel.M
      });
    }

    pixBox.hidden = false;
  }

  function generatePixForAmount(amount, { preset = false } = {}) {
    if (!Number.isFinite(amount) || amount <= 0) {
      alert("Informe um valor válido para gerar o PIX.");
      return false;
    }

    if (!preset && (amount < 5 || amount > 100)) {
      alert("Escolha um valor entre R$ 5 e R$ 100 para gerar o PIX.");
      return false;
    }

    const payload = generatePixPayload({
      amount,
      key: pixKey,
      name: "BENEVITA",
      city: "UBERLANDIA"
    });

    renderPixQr(payload, amount);
    initIcons();
    return true;
  }

  function setAmountSelection(amount) {
    const normalized = String(amount);
    const buttons = Array.from(document.querySelectorAll(".amount-btn"));
    buttons.forEach((button) => button.classList.remove("active"));

    const matchedButton = buttons.find((button) => button.textContent.replace(/\D/g, "") === normalized);
    if (matchedButton) {
      matchedButton.classList.add("active");
    }

    selectedAmt = normalized;
    if (customAmountInput) {
      customAmountInput.value = "";
    }
  }

  function openModal(amount = null) {
    if (!donateModal) {
      return;
    }

    resetDonateModal();
    donateModal.classList.add("open");
    document.body.style.overflow = "hidden";

    if (Number.isFinite(amount) && amount > 0) {
      setAmountSelection(amount);
      generatePixForAmount(amount, { preset: true });
    }
  }

  function openModalWithAmount(amount) {
    openModal(Number(amount));
  }

  function closeModal() {
    if (!donateModal) {
      return;
    }

    donateModal.classList.remove("open");
    document.body.style.overflow = "";
    resetDonateModal();
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

    resetPixPanel();
  }

  function confirmDonate() {
    const customValue = customAmountInput ? customAmountInput.value.replace(",", ".") : "";
    const baseAmount = customValue || selectedAmt;
    const amount = Number(baseAmount);

    generatePixForAmount(amount, { preset: false });
  }

  function initEvents() {
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
          resetPixPanel();
          return;
        }

        document.querySelectorAll(".amount-btn").forEach((button) => button.classList.remove("active"));
        selectedAmt = value;
        resetPixPanel();
      });
    }

    if (copyPixCode) {
      copyPixCode.addEventListener("click", async () => {
        if (!pixPayload || !pixPayload.value) {
          return;
        }
        await navigator.clipboard.writeText(pixPayload.value);
        copyPixCode.textContent = "Código copiado";
        setTimeout(() => {
          copyPixCode.textContent = "Copiar código PIX";
        }, 1500);
      });
    }

    if (copyPixKey) {
      copyPixKey.addEventListener("click", async () => {
        await navigator.clipboard.writeText(pixKey);
        copyPixKey.textContent = "Chave copiada";
        setTimeout(() => {
          copyPixKey.textContent = "Copiar chave PIX";
        }, 1500);
      });
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    });
  }

  return {
    initEvents,
    resetDonateModal,
    openModal,
    openModalWithAmount,
    closeModal,
    selectAmt,
    confirmDonate
  };
}
