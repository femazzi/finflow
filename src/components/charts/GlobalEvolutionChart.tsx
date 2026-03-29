import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { Month } from '../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface GlobalEvolutionChartProps {
  months: Month[];
}

export default function GlobalEvolutionChart({ months }: GlobalEvolutionChartProps) {
  // Ordenar cronologicamente para a trilha correta
  const sortedMonths = [...months].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const labels = sortedMonths.map(m => m.name);
  const dataBalance = sortedMonths.map(m => m.totals.balance);

  const data = {
    labels,
    datasets: [
      {
        label: 'Saldo Geral do Mês',
        data: dataBalance,
        borderColor: '#00C9FF', // Neon Blue
        backgroundColor: 'rgba(0, 201, 255, 0.15)', // Light glow below the line
        borderWidth: 3,
        pointBackgroundColor: '#030014',
        pointBorderColor: '#00C9FF',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 7,
        fill: true,
        tension: 0.4 // Smooth bezier curve
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(17, 17, 24, 0.9)',
        titleColor: '#fff',
        bodyColor: '#00C9FF',
        titleFont: { family: 'Syne', size: 14 },
        bodyFont: { family: 'Inter', size: 14, weight: 'bold' as const },
        padding: 12,
        borderColor: 'rgba(0, 201, 255, 0.3)',
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          label: (context: any) => `R$ ${context.parsed.y.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
        }
      }
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: '#6B7280',
          font: { family: 'Inter' }
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
          font: { family: 'Inter' }
        }
      }
    }
  };

  if (months.length < 2) {
    return (
      <div className="h-[250px] flex items-center justify-center border border-dashed border-white/10 rounded-2xl bg-white/5">
        <p className="text-gray-400 text-sm font-medium">Adicione ao menos 2 meses para rastrear a evolução em gráfico.</p>
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full mt-4">
      <Line data={data} options={options} />
    </div>
  );
}
