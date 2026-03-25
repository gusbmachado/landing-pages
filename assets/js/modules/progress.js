export function initVakinhaProgress({ vakinhaUrl, campaignGoal, formatMoneyBRL, initIcons }) {
  const raisedAmount = document.getElementById("raisedAmount");
  const raisedAmountLarge = document.getElementById("raisedAmountLarge");
  const supportersCount = document.getElementById("supportersCount");
  const progressFill = document.getElementById("progressFill");
  const progressPercentText = document.getElementById("progressPercentText");
  const progressSupportersText = document.getElementById("progressSupportersText");
  const progressMetaInfo = document.getElementById("progressMetaInfo");
  const campaignStatus = document.getElementById("campaignStatus");

  function updateProgressUI(data) {
    const raised = Number.isFinite(data?.valor_arrecadado_num) ? data.valor_arrecadado_num : 0;
    const supporters = Number.isFinite(data?.num_apoiadores) ? data.num_apoiadores : 0;

    let percent = Number.isFinite(data?.percentual) ? data.percentual : null;
    if (percent === null && campaignGoal > 0) {
      percent = Math.min(100, Math.round((raised / campaignGoal) * 100));
    }
    if (percent === null) {
      percent = 0;
    }

    if (raisedAmount) raisedAmount.textContent = formatMoneyBRL(raised);
    if (raisedAmountLarge) raisedAmountLarge.textContent = formatMoneyBRL(raised);
    if (supportersCount) supportersCount.textContent = String(supporters);
    if (progressPercentText) progressPercentText.textContent = `${percent}% da meta`;
    if (progressSupportersText) progressSupportersText.textContent = `${supporters} apoiadores`;
    if (progressMetaInfo) progressMetaInfo.textContent = `${supporters} apoiadores · ${percent}% da meta`;
    if (progressFill) progressFill.style.width = `${percent}%`;

    document.documentElement.style.setProperty("--prog-fill", String(percent));

    if (campaignStatus) {
      campaignStatus.innerHTML = '<i data-lucide="refresh-cw" class="icon"></i> Atualizado automaticamente';
    }

    initIcons();
  }

  async function loadVakinhaProgress() {
    try {
      const response = await fetch("/api/vakinha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: vakinhaUrl })
      });

      if (!response.ok) {
        throw new Error(`Falha na API: ${response.status}`);
      }

      const data = await response.json();
      updateProgressUI(data);
    } catch (error) {
      console.error("Não foi possível atualizar progresso da Vakinha:", error);
      if (campaignStatus) {
        campaignStatus.innerHTML = '<i data-lucide="alert-circle" class="icon"></i> Falha na atualização';
        initIcons();
      }
    }
  }

  loadVakinhaProgress();
  return { reload: loadVakinhaProgress };
}
