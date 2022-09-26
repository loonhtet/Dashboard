const searchInput = document.getElementById("searchinput");
const searchBtn = document.getElementById("searchbtn");

const disItems = document.querySelectorAll("#dis");
console.log(disItems);

searchBtn.addEventListener("click", searchfn);

console.log(searchInput.clientWidth);

function searchfn() {
  if (searchInput.classList.contains("active")) {
    // Close search box

    searchInput.classList.remove("active");

    disItems.forEach(function (e) {
      e.classList.remove("d-none");
    });
    searchBtn.style.color = "var(--bs-dark)";

    searchBtn.classList.remove("ri-close-line");
    searchBtn.classList.add("ri-search-line");
  } else {
    // Open search box

    searchInput.classList.add("active");

    disItems.forEach(function (e) {
      e.classList.add("d-none");
    });

    searchBtn.classList.remove("ri-search-line");
    searchBtn.classList.add("ri-close-line");
    searchBtn.style.color = "var(--bs-danger)";

    searchInput.focus();
  }
}

const darkLightToggle = document.getElementById("darklighttoggle");

darkLightToggle.addEventListener("click", switchtoggle);

function switchtoggle() {
  if ((darkLightToggle.classList.contains = "ri-sun-line")) {
    darkLightToggle.classList.remove = "ri-sun-line";
    darkLightToggle.classList.add = "ri-moon-line";
  } else {
    darkLightToggle.classList.remove = "ri-moon-line";
    darkLightToggle.classList.add = "ri-sun-line";
  }
}

// Start Google chart

google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(columnChart);
function columnChart() {
  var dataColumn = google.visualization.arrayToDataTable([
    ["Element", "Density", { role: "style" }],
    ["JAN", 8.94, "#06D6A0"],
    ["FEB", 10.49, "#FFD166"],
    ["MAR", 19.3, "#26547C"],
    ["APRIL", 21.45, "color: #EF476F"],
  ]);

  var view = new google.visualization.DataView(dataColumn);
  view.setColumns([
    0,
    1,
    { calc: "stringify", sourceColumn: 1, type: "string", role: "annotation" },
    2,
  ]);

  var options = {
    title: "Visit And Sales Statistics",

    backgroundColor: "#f8f9fa",
    bar: { groupWidth: "95%" },
    legend: { position: "none" },
  };
  var chart = new google.visualization.ColumnChart(
    document.getElementById("columnchart_values")
  );
  chart.draw(view, options);
}

// End Google chart

// Start Chartjs Area

const ctdx = document.getElementById("myDonutChart").getContext("2d");
const myDonutChart = new Chart(ctdx, {
  type: "doughnut",
  data: {
    labels: ["Search Engines", "Direct Click", "Bookmarks Click", "Email"],
    datasets: [
      {
        label: "# of Votes",
        data: [12, 19, 3, 2],
        backgroundColor: ["#06D6A0", "#FFD166", "#26547C", "#EF476F"],
      },
    ],
  },
  options: {},
});

// End Chartjs Area

// Start Linear Scale Chart

const ctlx = document.getElementById("myLinearChart").getContext("2d");

// const DATA_COUNT = 7;
// const NUMBER_CFG = { count: DATA_COUNT, min: 0, max: 100 };

// const labels = Utils.months({ count: 7 });
// const data = {
//   labels: labels,
// };

const myLinearChart = new Chart(ctlx, {
  type: "line",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July"],
    datasets: [
      {
        label: "Dataset 1",
        data: [10, 30, 50, 20, 25, 44, -10],
        borderColor: ["#06D6A0", "#FFD166", "#26547C", "#EF476F"],
        backgroundColor: ["#06D6A0", "#FFD166", "#26547C", "#EF476F"],
      },
      {
        label: "Dataset 2",
        data: [100, 33, 22, 19, 11, 49, 30],
        borderColor: ["#06D6A0", "#FFD166", "#26547C", "#EF476F"],
        backgroundColor: ["#06D6A0", "#FFD166", "#26547C", "#EF476F"],
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Min and Max Settings",
      },
    },
    scales: {
      y: {
        min: 10,
        max: 50,
      },
    },
  },
});

// End Linear Scale Chart
