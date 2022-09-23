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
