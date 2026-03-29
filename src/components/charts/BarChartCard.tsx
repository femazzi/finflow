import type { Month } from "../../types";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartCardProps {
  month: Month;
}

export default function BarChartCard({ month }: BarChartCardProps) {
  const chartData = {
    labels: ["Resumo do Mês"],
    datasets: [
      {
        label: "Ganhos",
        data: [month.totals.earnings],
        backgroundColor: "#22c55e",
        borderRadius: 8,
      },
      {
        label: "Gastos",
        data: [month.totals.expenses],
        backgroundColor: "#ef4444",
        borderRadius: 8,
      },
      {
        label: "Investido",
        data: [month.totals.investments],
        backgroundColor: "#3b82f6",
        borderRadius: 8,
      },
      {
        label: "Saldo",
        data: [month.totals.balance],
        backgroundColor: month.totals.balance >= 0 ? "#f59e0b" : "#ef4444",
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    indexAxis: "y" as const,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "#9ca3af",
          font: {
            family: "Inter",
            size: 12,
          },
          padding: 16,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: "#1a1a2e",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#2a2a3e",
        borderWidth: 1,
        padding: 8,
        titleFont: {
          size: 12,
        },
        bodyFont: {
          size: 12,
        },
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.x;
            return `R$ ${value.toFixed(2).replace(".", ",")}`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: false,
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
          drawBorder: false,
        },
        ticks: {
          color: "#6b7280",
          font: {
            family: "Inter",
            size: 12,
          },
        },
      },
      y: {
        stacked: false,
        grid: {
          display: false,
        },
        ticks: {
          color: "#6b7280",
          font: {
            family: "Inter",
            size: 12,
          },
        },
      },
    },
  };

  return (
    <div className="bg-dark-700 rounded-xl p-5 border border-white/10">
      <h3 className="font-syne font-semibold text-white mb-4">
        Resumo do Mês
      </h3>
      <div style={{ height: 300 }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
