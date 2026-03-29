// Formatar valor monetário em Real brasileiro
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

// Formatar data
export const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  return new Intl.DateTimeFormat("pt-BR", options).format(date);
};

// Obter nome do mês atual para sugestão
export const getNextMonthName = (lastMonthName?: string): string => {
  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  if (!lastMonthName) {
    const now = new Date();
    return `${months[now.getMonth()]} ${now.getFullYear()}`;
  }

  // Extrair mês e ano do último mês
  const parts = lastMonthName.split(" ");
  if (parts.length >= 2) {
    let monthIndex = months.indexOf(parts[0]);
    let year = parseInt(parts[1]);

    if (monthIndex === -1) return getNextMonthName();

    monthIndex = (monthIndex + 1) % 12;
    if (monthIndex === 0) year++;

    return `${months[monthIndex]} ${year}`;
  }

  return getNextMonthName();
};
