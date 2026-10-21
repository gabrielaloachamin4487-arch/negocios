"use strict";

const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const specialties = ["Cardiología", "Pediatría", "Urgencias", "Medicina general", "Traumatología"];
const palette = ["#ef765e", "#4f8e78", "#d1e475", "#86b9c6", "#a996c0"];
const specialtyMix = [[24, 58, 18], [72, 13, 15], [8, 4, 88], [78, 7, 15], [37, 43, 20]];

const hospitalData = {
  monthly: [
    { patients: 1842, wait: 31, occupancy: 76, satisfaction: 91, mix: [48, 34, 18], admissions: [112, 94, 128, 105, 119] },
    { patients: 1768, wait: 29, occupancy: 73, satisfaction: 92, mix: [51, 31, 18], admissions: [98, 87, 116, 91, 104] },
    { patients: 2014, wait: 34, occupancy: 79, satisfaction: 89, mix: [46, 35, 19], admissions: [121, 101, 139, 111, 126] },
    { patients: 1956, wait: 32, occupancy: 78, satisfaction: 90, mix: [49, 33, 18], admissions: [114, 96, 131, 106, 118] },
    { patients: 2130, wait: 36, occupancy: 82, satisfaction: 88, mix: [45, 36, 19], admissions: [130, 108, 148, 118, 137] },
    { patients: 2076, wait: 33, occupancy: 80, satisfaction: 90, mix: [47, 34, 19], admissions: [124, 103, 143, 113, 131] },
    { patients: 2242, wait: 38, occupancy: 85, satisfaction: 87, mix: [44, 37, 19], admissions: [138, 115, 159, 125, 145] },
    { patients: 2188, wait: 35, occupancy: 83, satisfaction: 89, mix: [46, 35, 19], admissions: [132, 110, 151, 120, 139] },
    { patients: 2054, wait: 32, occupancy: 78, satisfaction: 91, mix: [50, 32, 18], admissions: [119, 99, 135, 108, 123] },
    { patients: 2316, wait: 39, occupancy: 86, satisfaction: 88, mix: [43, 38, 19], admissions: [143, 119, 164, 129, 151] },
    { patients: 2264, wait: 36, occupancy: 84, satisfaction: 90, mix: [47, 34, 19], admissions: [137, 114, 157, 124, 144] },
    { patients: 2480, wait: 41, occupancy: 89, satisfaction: 86, mix: [42, 39, 19], admissions: [156, 130, 178, 141, 163] }
  ],
  specialtyCounts: [
    [312, 286, 518, 451, 275], [298, 274, 493, 432, 271], [344, 318, 568, 479, 305],
    [329, 307, 552, 474, 294], [358, 337, 607, 505, 323], [349, 325, 584, 496, 322],
    [377, 356, 641, 536, 332], [369, 345, 619, 527, 328], [351, 320, 566, 501, 316],
    [389, 370, 664, 552, 341], [381, 361, 642, 547, 333], [419, 397, 708, 587, 369]
  ]
};

const monthFilter = document.querySelector("#month-filter");
const specialtyFilter = document.querySelector("#specialty-filter");
const monthNamesShort = months.map((month) => month.slice(0, 3));

months.forEach((month, index) => monthFilter.add(new Option(month, String(index))));
monthFilter.add(new Option("Todo el año", "all"));
specialtyFilter.add(new Option("Todas", "all"));
specialties.forEach((specialty, index) => specialtyFilter.add(new Option(specialty, String(index))));
monthFilter.value = "all";
specialtyFilter.value = "all";

Chart.defaults.font.family = '"DM Sans", sans-serif';
Chart.defaults.color = "#77837d";
Chart.defaults.font.size = 10;

const sharedOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 350 }
};

const specialtyChart = new Chart(document.querySelector("#specialty-chart"), {
  type: "bar",
  data: {
    labels: specialties,
    datasets: [{ label: "Atenciones", data: [], backgroundColor: palette, borderRadius: 2, maxBarThickness: 39 }]
  },
  options: {
    ...sharedOptions,
    plugins: { legend: { display: false }, tooltip: { displayColors: false } },
    scales: {
      x: { grid: { display: false }, ticks: { maxRotation: 0, minRotation: 0, font: { size: 9 } }, border: { display: false } },
      y: { beginAtZero: true, grid: { color: "#edf0ec" }, border: { display: false }, ticks: { precision: 0, maxTicksLimit: 5 } }
    }
  }
});

const typeChart = new Chart(document.querySelector("#type-chart"), {
  type: "doughnut",
  data: {
    labels: ["Ambulatorio", "Hospitalizado", "Urgencias"],
    datasets: [{ data: [], backgroundColor: ["#ef765e", "#4f8e78", "#d1e475"], borderWidth: 3, borderColor: "#fff", hoverOffset: 5 }]
  },
  options: {
    ...sharedOptions,
    cutout: "67%",
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: (context) => `${context.label}: ${context.raw}%` } } }
  }
});

const admissionsChart = new Chart(document.querySelector("#admissions-chart"), {
  type: "line",
  data: {
    labels: monthNamesShort,
    datasets: [{ label: "Admisiones", data: [], borderColor: "#4f8e78", backgroundColor: "rgba(79, 142, 120, .12)", fill: true, tension: .32, pointRadius: 3, pointHoverRadius: 5, pointBackgroundColor: "#fff", pointBorderWidth: 2 }]
  },
  options: {
    ...sharedOptions,
    plugins: { legend: { display: false }, tooltip: { displayColors: false } },
    scales: {
      x: { grid: { display: false }, border: { display: false } },
      y: { beginAtZero: false, grid: { color: "#edf0ec" }, border: { display: false }, ticks: { precision: 0, maxTicksLimit: 5 } }
    }
  }
});

function getSelectedMonths() {
  if (monthFilter.value === "all") return hospitalData.monthly.map((_, index) => index);
  return [Number(monthFilter.value)];
}

function average(values) {
  return Math.round(values.reduce((total, value) => total + value, 0) / values.length);
}

function renderLegend(values) {
  const legend = document.querySelector("#type-legend");
  const labels = typeChart.data.labels;
  legend.replaceChildren(...labels.map((label, index) => {
    const item = document.createElement("span");
    item.className = "legend-item";
    item.innerHTML = `<span class="legend-swatch" style="background:${typeChart.data.datasets[0].backgroundColor[index]}"></span><span></span><strong></strong>`;
    item.querySelector("span:nth-child(2)").textContent = label;
    item.querySelector("strong").textContent = `${values[index]}%`;
    return item;
  }));
}

function updateDashboard() {
  const selectedMonths = getSelectedMonths();
  const selectedSpecialty = specialtyFilter.value === "all" ? null : Number(specialtyFilter.value);
  const filteredData = selectedMonths.map((index) => hospitalData.monthly[index]);
  const patients = filteredData.reduce((total, data) => total + data.patients, 0);
  document.querySelector("#kpi-patients").textContent = patients.toLocaleString("es-ES");
  document.querySelector("#kpi-wait").textContent = String(average(filteredData.map((data) => data.wait)));
  document.querySelector("#kpi-occupancy").textContent = String(average(filteredData.map((data) => data.occupancy)));
  document.querySelector("#kpi-satisfaction").textContent = String(average(filteredData.map((data) => data.satisfaction)));

  const selectedMonthLabel = monthFilter.value === "all" ? "Resumen del año" : months[Number(monthFilter.value)];
  document.querySelector("#selected-period-label").textContent = selectedMonthLabel;

  const barValues = selectedMonths.map((index) => hospitalData.specialtyCounts[index]);
  const specialtyTotals = specialties.map((_, specialtyIndex) => barValues.reduce((total, monthValues) => total + monthValues[specialtyIndex], 0));
  specialtyChart.data.datasets[0].data = selectedSpecialty === null
    ? specialtyTotals
    : specialtyTotals.map((value, index) => index === selectedSpecialty ? value : 0);
  specialtyChart.data.datasets[0].backgroundColor = specialties.map((_, index) => index === selectedSpecialty || selectedSpecialty === null ? palette[index] : "#e6eae4");
  specialtyChart.update();

  const annualMix = [0, 1, 2].map((typeIndex) => average(hospitalData.monthly.map((data) => data.mix[typeIndex])));
  const mix = selectedSpecialty === null
    ? [0, 1, 2].map((typeIndex) => average(filteredData.map((data) => data.mix[typeIndex])))
    : specialtyMix[selectedSpecialty].map((share, typeIndex) => share + average(filteredData.map((data) => data.mix[typeIndex] - annualMix[typeIndex])));
  mix[2] = 100 - mix[0] - mix[1];
  typeChart.data.datasets[0].data = mix;
  typeChart.update();
  renderLegend(mix);

  admissionsChart.data.datasets[0].data = hospitalData.monthly.map((data) => selectedSpecialty === null
    ? data.admissions.reduce((total, count) => total + count, 0)
    : data.admissions[selectedSpecialty]);
  admissionsChart.data.datasets[0].label = selectedSpecialty === null ? "Admisiones totales" : `Admisiones · ${specialties[selectedSpecialty]}`;
  admissionsChart.update();
}

monthFilter.addEventListener("change", updateDashboard);
specialtyFilter.addEventListener("change", updateDashboard);
updateDashboard();