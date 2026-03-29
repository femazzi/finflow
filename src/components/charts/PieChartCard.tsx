import type { Transaction } from "../../types";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { groupByCategory } from "../../utils/calculations";
import EmptyState from "../ui/EmptyState";
import { BarChart3 } from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartCardProps {
  title: string;
  transactions: Transaction[];
}

const COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#6366f1",
  "#f43f5e",
];

export default function PieChartCard({
  title,
  transactions,
}: PieChartCardProps) {
  if (transactions.length === 0) {
    return (
      <div className="bg-dark-700 rounded-xl p-5 border border-white/10">
        <h3 className="font-syne font-semibold text-white mb-4">{title}</h3>
        <EmptyState
          icon={<BarChart3 size={24} className="text-gray-400" />}
          title={`Nenhum dado para ${title.toLowerCase()}`}
        />
      </div>
    );
  }

  const grouped = groupByCategory(transactions);
  const labels = Object.keys(grouped);
  const data = Object.values(grouped);

  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: COLORS.slice(0, labels.length),
        borderColor: "transparent",
        spacing: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.parsed;
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const percentage = ((value / total) * 100).toFixed(1);
            return `R$ ${value.toFixed(2)} (${percentage}%)`;
          },
        },
      },
    },
  };

  const total = data.reduce((a, b) => a + b, 0);

  return (
    <div className="bg-dark-700 rounded-xl p-5 border border-white/10">
      <h3 className="font-syne font-semibold text-white mb-4">{title}</h3>
      <div className="flex gap-6">
        <div className="flex-1">
          <Doughnut data={chartData} options={options} />
        </div>
        <div className="w-40 space-y-2">
          {labels.map((label, index) => {
            const value = grouped[label];
            const percentage = ((value / total) * 100).toFixed(1);
            return (
              <div key={label} className="flex items-center gap-2 justify-between text-xs">
                <div className="flex items-center gap-2 flex-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span className="text-gray-400 truncate">{label}</span>
                </div>
                <span className="text-gray-300 font-medium whitespace-nowrap">
                  {percentage}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
