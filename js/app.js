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

// Start Donut chart

google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(drawChart);
function drawChart() {
  var dataDonut = google.visualization.arrayToDataTable([
    ["Task", "Hours per Day"],
    ["Search Engines", 30],
    ["Direct Click", 30],
    ["Bookmarts Click", 40],
  ]);

  var options = {
    title: "Traffic Sources",
    titleTextStyle: {
      fontSize: 24,
    },
    colors: ["#20c997", "#0d6efd", "#ffc107"],
    pieHole: 0.4,
    backgroundColor: "#f8f9fa",
    pieHole: 0.4,
    pieSliceText: "none",
  };

  var chart = new google.visualization.PieChart(
    document.getElementById("donutchart")
  );
  chart.draw(dataDonut, options);
}

// End Donut chart

// Start Column chart

google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(columnChart);
function columnChart() {
  var dataColumn = google.visualization.arrayToDataTable([
    ["Element", "Density", { role: "style" }],
    ["Copper", 8.94, "#b87333"],
    ["Silver", 10.49, "silver"],
    ["Gold", 19.3, "gold"],
    ["Platinum", 21.45, "color: #e5e4e2"],
  ]);

  var view = new google.visualization.DataView(dataColumn);
  view.setColumns([
    0,
    1,
    { calc: "stringify", sourceColumn: 1, type: "string", role: "annotation" },
    2,
  ]);

  var options = {
    title: "Density of Precious Metals, in g/cm^3",
    width: 750,
    height: 350,
    backgroundColor: "#f8f9fa",
    bar: { groupWidth: "95%" },
    legend: { position: "none" },
  };
  var chart = new google.visualization.ColumnChart(
    document.getElementById("columnchart_values")
  );
  chart.draw(view, options);
}

// End Column chart
