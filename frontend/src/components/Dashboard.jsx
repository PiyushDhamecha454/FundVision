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

  // Scatter Colors
  const colors = {
    aum: "rgba(59, 130, 246, 0.9)",       // blue-500
    rating: "rgba(16, 185, 129, 0.9)",    // emerald-500
    oneYr: "rgba(239, 68, 68, 0.9)",      // red-500
    threeYr: "rgba(99, 102, 241, 0.9)",   // indigo-500
  };

  // Datasets
  const aumVsExpenseDataset = {
    datasets: [
      {
        label: "AUM vs Expense Ratio",
        data: [{ x: data.aum, y: data.top_feature_impact.expense_ratio }],
        backgroundColor: colors.aum,
        pointRadius: 8,
        pointHoverRadius: 12,
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const ratingVsExpenseDataset = {
    datasets: [
      {
        label: "Rating vs Expense Ratio",
        data: [{ x: data.rating, y: data.top_feature_impact.expense_ratio }],
        backgroundColor: colors.rating,
        pointRadius: 8,
        pointHoverRadius: 12,
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const returnsVsRatingDataset = {
    datasets: [
      {
        label: "1 Year Return",
        data: [{ x: data.top_feature_impact.returns_1yr, y: data.top_feature_impact.rating }],
        backgroundColor: colors.oneYr,
        pointRadius: 8,
        pointHoverRadius: 12,
        pointHoverBorderWidth: 2,
      },
      {
        label: "3 Year Return",
        data: [{ x: data.top_feature_impact.returns_3yr, y: data.top_feature_impact.rating }],
        backgroundColor: colors.threeYr,
        pointRadius: 8,
        pointHoverRadius: 12,
        pointHoverBorderWidth: 2,
      },
    ],
  };

  // Chart styles
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          padding: 12,
          font: { family: "Inter, sans-serif", size: 12 },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.8)",
        titleFont: { family: "Inter", size: 13 },
        bodyFont: { family: "Inter", size: 12 },
        padding: 10,
      },
    },
    scales: {
      x: {
        title: { display: true, text: "X Value", color: "#666", font: { size: 13 } },
        grid: { color: "rgba(200,200,200,0.2)" },
        ticks: { font: { family: "Inter" } },
      },
      y: {
        title: { display: true, text: "Y Value", color: "#666", font: { size: 13 } },
        grid: { color: "rgba(200,200,200,0.2)" },
        ticks: { font: { family: "Inter" } },
      },
    },
  };

  return (
    <div className="space-y-10 py-8">
      <h2 className="text-2xl font-bold text-center mb-6">
        📈 Mutual Fund Feature Impact Dashboard
      </h2>

      <div className="text-xl text-center mb-4">
        Fund Age: <div className="font-medium">{data.top_feature_impact.fund_age_yr} years</div>
      </div>

      <div className="text-xl text-center mb-4">
        Predicted Return: <div className="font-medium">{data.predicted_return} %</div>
      </div>

      {/* AUM vs Expense */}
      <div className="mt-15">
        <h3 className="font-semibold text-lg mb-2 text-center">
          AUM vs Expense Ratio
        </h3>
        <Scatter data={aumVsExpenseDataset} options={chartOptions} height={90} />
      </div>

      {/* Rating vs Expense */}
      <div>
        <h3 className="font-semibold text-lg mb-2 text-center">
          Rating vs Expense Ratio
        </h3>
        <Scatter data={ratingVsExpenseDataset} options={chartOptions} height={90} />
      </div>

      {/* 1YR & 3YR Returns vs Rating */}
      <div>
        <h3 className="font-semibold text-lg mb-2 text-center">
          Returns vs Rating
        </h3>
        <Scatter data={returnsVsRatingDataset} options={chartOptions} height={90} />
      </div>
    </div>
  );
}
