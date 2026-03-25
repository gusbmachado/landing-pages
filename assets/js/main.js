import { CONFIG } from "./modules/config.js";
import { initIcons, setBase64Images, formatMoneyBRL } from "./modules/utils.js";
import { initUi } from "./modules/ui.js";
import { createDonationController } from "./modules/donation.js";
import { initVakinhaProgress } from "./modules/progress.js";
import { createContactController } from "./modules/contact.js";

const donation = createDonationController({
  pixKey: CONFIG.pixKey,
  defaultSelectedAmount: CONFIG.defaultSelectedAmount,
  initIcons
});

const contact = createContactController({ contactEmail: CONFIG.contactEmail });

setBase64Images(CONFIG.logoSrc, CONFIG.logoTargetIds);
initUi();
donation.initEvents();
initVakinhaProgress({
  vakinhaUrl: CONFIG.vakinhaUrl,
  campaignGoal: CONFIG.campaignGoal,
  formatMoneyBRL,
  initIcons
});
initIcons();
donation.resetDonateModal();

window.openModal = donation.openModal;
window.openModalWithAmount = donation.openModalWithAmount;
window.closeModal = donation.closeModal;
window.selectAmt = donation.selectAmt;
window.confirmDonate = donation.confirmDonate;
window.sendForm = contact.sendForm;