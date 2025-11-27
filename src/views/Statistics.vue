<template> 
  <div class="ui container improved-view">
    <h2 class="ui dividing header centered-text">Statistics 📊</h2>

    <div class="kpi-cards">
      <div class="kpi-card">
        <div class="kpi-label">📈 Avg Score</div>
        <div class="kpi-value">{{ avgScore }}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Total Logs</div>
        <div class="kpi-value">{{ totalLogs }}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">🏆 Best Score</div>
        <div class="kpi-value">{{ bestScore }}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Perform</div>
        <div class="kpi-value">{{ performance }}</div>
      </div>
    </div>

    <div class="charts-wrapper">
      <!-- Line Chart bên trái -->
      <div class="chart-box line-box">
        <h3 class="ui header centered-text">Mood Score Over Time</h3>
        <div class="field chart-controls">
          <label>Select days:</label>
          <select v-model="days" class="ui dropdown" @change="fetchLineChart">
            <option :value="3">Last 3 days</option>
            <option :value="7">Last 7 days</option>
            <option :value="14">Last 14 days</option>
            <option :value="30">Last 30 days</option>
          </select>
        </div>
        <canvas id="lineChart"></canvas>
      </div>

      <!-- Pie Chart bên phải -->
      <div class="chart-box pie-box">
        <h3 class="ui header centered-text">Mood Distribution</h3>
        <canvas id="pieChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { getLineChartData, getPieChartData, getKPIData } from "../helpers/api.js";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default {
  name: "Statistics",
  setup() {

    const avgScore = ref(0);
    const totalLogs = ref(0);
    const bestScore = ref(0);
    const performance = ref("Loading...");
    
    const fetchKPI = async () => {
      try {
        const data = await getKPIData(); // API trả avgScore, totalLogs, bestScore 
        avgScore.value = Number(data.avgScore || 0).toFixed(2); // lấy sau dấu phẩy 2 số 
        totalLogs.value = data.totalLogs || 0;
        bestScore.value = data.bestScore || 0;

        if (avgScore.value >= 8) performance.value = "High 🔥";
        else if (avgScore.value >= 5) performance.value = "Medium ⚡";
        else performance.value = "Low 😴";
      } catch (err) {
        console.error(err);

      }
    }
      
    const days = ref(7);
    let lineChart = null;
    let pieChart = null;

    const fetchLineChart = async () => {
      const data = await getLineChartData(days.value);
      const labels = data?.map(d => d.date) || [];
      const scores = data?.map(d => d.score) || [];

      if (lineChart) lineChart.destroy();

      const ctx = document.getElementById("lineChart").getContext("2d");
      lineChart = new Chart(ctx, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Mood Score",
              data: scores,
              fill: true,
              borderColor: "#36A2EB",
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              tension: 0.3,
              pointBackgroundColor: "#36A2EB",
              pointRadius: 5,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true, position: "top" },
            tooltip: { mode: "index", intersect: false },
          },
          scales: {
            y: { beginAtZero: true, max: 10 },
            x: { 
              grid: { display: false }, 
              ticks: {
                maxRotation: 45,
                minRotation: 45,
              }
            }
          },
        },
      });
    };

    const fetchPieChart = async () => {
      const data = await getPieChartData();
      if (!data) return;

      const labels = Object.keys(data);
      const counts = Object.values(data);

      if (pieChart) pieChart.destroy();

      const ctx = document.getElementById("pieChart").getContext("2d");
      pieChart = new Chart(ctx, {
        type: "pie",
        data: {
          labels,
          datasets: [
            {
              data: counts,
              backgroundColor: [
                "#36A2EB",
                "#FF6384",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40",
                "#C9CBCF",
                "#FF6666",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: true, position: "bottom" },
          },
        },
      });
    };

    onMounted(async () => {
      await fetchKPI();
      await fetchLineChart();
      await fetchPieChart();
    });

    watch(days, fetchLineChart);

    return {
      days,
      avgScore, 
      totalLogs, 
      bestScore, 
      performance, 
    };
  },
};

</script>

<style scoped>
.ui.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.charts-wrapper {
  display: flex;
  flex-wrap: nowrap;  /* Không xếp dọc */
  justify-content: center;
  gap: 2rem;
}

.line-box {
  flex-grow: 2;   /* to hơn */
  flex-basis: 70%;
}

.pie-box {
  flex-grow: 1;   /* nhỏ hơn */
  flex-basis: 30%;
  max-width: 350px;
}

.chart-box {
  flex: 0 1 700px; /* cố định chiều ngang mỗi chart */
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chart-controls {
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

canvas {
  width: 100% !important;
  height: 400px !important;
}

.centered-text {
  text-align: center;
}

/* Responsive: màn hình quá nhỏ thì mới xếp dọc */
@media (max-width: 1200px) {
  .charts-wrapper {
    flex-wrap: wrap;
    flex-direction: row;
  }
  .chart-box {
    flex: 1 1 100%;
    max-width: 100%;
  }
}

.kpi-cards {
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
}
.kpi-card {
  flex: 1;
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}
.kpi-value {
  font-size: 1.5em;
  font-weight: bold;
}
.kpi-label {
  margin-top: 10px;
  font-size: 0.9em;
  color: #666;
}

</style>
