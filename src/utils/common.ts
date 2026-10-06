export const formatDate = (
  date: Date,
  options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  },
): string => date.toLocaleDateString("es-ES", options);

export const formatCurrency = (
  amount: number,
  showDecimals: boolean = true,
): string => {
  if (amount === undefined || amount === null)
    return showDecimals ? "S/ 0.00" : "S/ 0";
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount);
};
