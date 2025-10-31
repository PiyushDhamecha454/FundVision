import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Scatter } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function Dashboard({ data }) {
  if (!data)
    return <p className="text-center text-muted">No data yet — submit the form!</p>;

  const colors = {
    oneYr: "rgba(239, 68, 68, 0.9)",
    threeYr: "rgba(99, 102, 241, 0.9)",
  };

  /* ✅ FIX — Correct datasets */
  const aumVsReturn1 = {
    datasets: [
      {
        label: "AUM vs 1Y Return",
        data: [{ x: data.aum, y: data.top_feature_impact.returns_1yr }],
        backgroundColor: colors.oneYr,
        pointRadius: 8,
        pointHoverRadius: 12,
      },
    ],
  };

  const aumVsReturn3 = {
    datasets: [
      {
        label: "AUM vs Return",
        data: [{ x: data.aum, y: data.top_feature_impact.returns_3yr }],
        backgroundColor: colors.threeYr,
        pointRadius: 8,
        pointHoverRadius: 12,
      },
    ],
  };

  const expenseVsReturn1 = {
    datasets: [
      {
        label: "Expense Ratio vs 1Y Return",
        data: [{ x: data.top_feature_impact.expense_ratio, y: data.top_feature_impact.returns_1yr }],
        backgroundColor: colors.oneYr,
        pointRadius: 8,
        pointHoverRadius: 12,
      },
    ],
  };

  const expenseVsReturn3 = {
    datasets: [
      {
        label: "Expense Ratio vs Return",
        data: [{ x: data.top_feature_impact.expense_ratio, y: data.top_feature_impact.returns_3yr }],
        backgroundColor: colors.threeYr,
        pointRadius: 8,
        pointHoverRadius: 12,
      },
    ],
  };

  const returnsVsRatingDataset = {
    datasets: [
      {
        label: "Return vs Rating",
        data: [{ x: data.top_feature_impact.returns_3yr, y: data.top_feature_impact.rating }],
        backgroundColor: colors.threeYr,
        pointRadius: 8,
        pointHoverRadius: 12,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
    scales: {
      x: { title: { display: true, text: "X" } },
      y: { title: { display: true, text: "Y" } },
    },
  };

  return (
    <div className="space-y-10 py-8">
      <h2 className="text-2xl font-bold text-center mb-6">
        📈 Mutual Fund Feature Impact Dashboard
      </h2>

      <div className="text-xl text-center mb-4">
        Predicted Return: <div className="font-medium">{data.predicted_return} %</div>
      </div>

      <h3 className="font-semibold text-lg text-center">AUM vs Returns</h3>
      <Scatter data={aumVsReturn3} options={chartOptions} height={90} />

      <h3 className="font-semibold text-lg text-center">Expense Ratio vs Return</h3>
      <Scatter data={expenseVsReturn3} options={chartOptions} height={90} />

      {/* ✅ Returns vs Rating */}
      <h3 className="font-semibold text-lg text-center">Return vs Rating</h3>
      <Scatter data={returnsVsRatingDataset} options={chartOptions} height={90} />
    </div>
  );
}
