const searchInput = document.getElementById("searchinput");
const searchBtn = document.getElementById("searchbtn");

const disItems = document.querySelectorAll("#dis");
// console.log(disItems);

searchBtn.addEventListener("click", searchfn);

// console.log(searchInput.clientWidth);

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

// Start navpannel

const menuBtn = document.querySelector(".menucss");

menuBtn.addEventListener("click", () => {
  var navPannel = document.querySelector(".pannelcss");

  navPannel.classList.toggle("activepannel");
});

// End navpannel

// Start Login Modal

const loginModal = document.querySelector(".modalboxcss");
const openLoginBtn = document.querySelectorAll("#openloginmodal");
const closeLoginBtn = document.querySelector("#closeloginmodal");

// openLoginBtn.forEach(function () {
//   console.log(openLoginBtn);
//   openLoginBtn.addEventListener("click", function () {
//     loginModal.style.display = "grid";
//     document.getElementsByTagName("body")[0].classList.add("modalboxscroll");
//   });
// });

for (let i = 0; i < openLoginBtn.length; i++) {
  console.log(openLoginBtn[i]);

  console.log(openLoginBtn);
  openLoginBtn[i].addEventListener("click", function () {
    loginModal.style.display = "grid";
    document.getElementsByTagName("body")[0].classList.add("modalboxscroll");
  });
}

closeLoginBtn.addEventListener("click", function () {
  loginModal.style.display = "none";
  document.getElementsByTagName("body")[0].classList.remove("modalboxscroll");
});

// End Login Modal

// Start darklight toggle

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

// End darklight toggle

// Start Bar Chart

const ctbx = document.getElementById("myBarChart").getContext("2d");

const data = {
  labels: ["jan", "feb", "mar", "apr", "may", "jun", "jul"],
  datasets: [
    {
      label: "Visit And Sales Statistics",
      data: [65, 59, 80, 81, 56, 55, 40],
      backgroundColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(255, 159, 64, 1)",
        "rgba(255, 205, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(201, 203, 207, 1)",
      ],
    },
  ],
};

const config = {
  type: "bar",
  data: data,
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
};

const myBarChart = new Chart(ctbx, config);

// End Bar Chart

// Start Chartjs Area

const ctdx = document.getElementById("myDonutChart").getContext("2d");
const myDonutChart = new Chart(ctdx, {
  type: "doughnut",
  data: {
    labels: ["Search Engines", "Direct Click", "Bookmarks Click", "Email"],
    datasets: [
      {
        label: "# of Votes",
        data: [3000, 4000, 2000, 1000],
        backgroundColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 205, 86, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
        ],
      },
    ],
  },
  options: {},
});

// End Chartjs Area

// Start Linear Scale Chart

const ctlx = document.getElementById("myLinearChart").getContext("2d");

const myLinearChart = new Chart(ctlx, {
  type: "line",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July"],
    datasets: [
      {
        label: "Sales",
        data: [10, 30, 25, 33, 25, 44, 10],
        borderColor: ["rgba(255, 99, 132, 1)"],
        backgroundColor: ["rgba(255, 99, 132, 1)"],
      },
      {
        label: "Revenue",
        data: [30, 33, 22, 22, 20, 26, 30],
        borderColor: ["rgba(75, 192, 192, 1)"],
        backgroundColor: ["rgba(75, 192, 192, 1)"],
      },
      {
        label: "Customers",
        data: [20, 18, 28, 30, 26, 33, 20],
        borderColor: ["rgba(54, 162, 235, 1)"],
        backgroundColor: ["rgba(54, 162, 235, 1)"],
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      title: {
        display: false,
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
