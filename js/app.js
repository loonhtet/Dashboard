const searchInput = document.getElementById("searchinput");
const searchBtn = document.getElementById("searchbtn");

searchBtn.addEventListener("click", searchfn);

console.log(searchInput.clientWidth);

function searchfn() {
  if (searchInput.classList.contains("active")) {
    searchInput.classList.remove("active");
  } else {
    searchInput.classList.add("active");
  }
}
