export function initIcons() {
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }
}

export function formatMoneyBRL(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

function emv(id, value) {
  const size = String(value.length).padStart(2, "0");
  return `${id}${size}${value}`;
}

function crc16(payload) {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i += 1) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit += 1) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc <<= 1;
      }
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

export function generatePixPayload({ amount, key, name, city }) {
  const merchantAccount = emv("26", `${emv("00", "br.gov.bcb.pix")}${emv("01", key)}`);
  const amountFixed = Number(amount).toFixed(2);

  const payload =
    emv("00", "01") +
    emv("01", "12") +
    merchantAccount +
    emv("52", "0000") +
    emv("53", "986") +
    emv("54", amountFixed) +
    emv("58", "BR") +
    emv("59", name.substring(0, 25).toUpperCase()) +
    emv("60", city.substring(0, 15).toUpperCase()) +
    emv("62", emv("05", "***"));

  const payloadWithCrcTag = `${payload}6304`;
  return `${payloadWithCrcTag}${crc16(payloadWithCrcTag)}`;
}

export async function setBase64Images(src, ids) {
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
