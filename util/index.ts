export const formatBRL = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value / 100);
};

export const parseBRL = (text: string): number => {
  const cleaned = text.replace(/[^0-9]/g, ""); // remove all except numbers
  return Number(cleaned);
};

export const formatPercentage = (value: number): string => {
  return (
    new Intl.NumberFormat("pt-BR", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value) + "%"
  );
};

export const parsePercentage = (text: string): number => {
  const cleaned = text.replace(/[^0-9]/g, "");
  return Number(cleaned) / 100 || 0; // Divide por 100 para converter em decimal
};

export const toNumber = (text: string) => {
  if (!text) return 0;
  const normalized = text.replace(",", ".").replace(/[^\d.-]/g, "");
  const n = parseFloat(normalized);
  return Number.isFinite(n) ? n : 0;
};
