const searchInput = document.getElementById("searchinput");
const searchBtn = document.getElementById("searchbtn");

const disItems = document.querySelectorAll("#dis");
console.log(disItems);

searchBtn.addEventListener("click", searchfn);

console.log(searchInput.clientWidth);

function searchfn() {
  if (searchInput.classList.contains("active")) {
    searchInput.classList.remove("active");

    disItems.forEach(function (e) {
      e.classList.remove("d-none");
    });
  } else {
    searchInput.classList.add("active");

    disItems.forEach(function (e) {
      e.classList.add("d-none");
    });
  }
}
