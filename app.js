const searchDiv = document.getElementById("search-div");
const searchInput = document.getElementById("search-input");
const searchResultsDiv = document.querySelector(".search-results");
const showMoreButton = document.getElementById("show-more-button");
const searchImagesButton = document.getElementById("search-button");

let inputData = "";
let pageNumber = 1;

async function searchImages() {
  inputData = searchInput.value;
  if (pageNumber === 1 || inputData === 0) {
    searchResultsDiv.innerHTML = "";
    // showMoreButton.style.display = "none"; // Remove the line hiding the button
  }

  if (inputData.length === 0) {
    alert("Please enter a search term");
    return;
  }
  const url = `https://imagefinder-backend.onrender.com/api/search-images?query=${inputData}&page=${pageNumber}`;

  const searchImageResponse = await fetch(url);
  const searchImageData = await searchImageResponse.json();

  if (searchImageData.results.length === 0) {
    // showMoreButton.style.display = "none"; // Remove the line hiding the button
    return;
  }

  searchImageData.results.forEach((result) => {
    const imageDiv = document.createElement("div");
    imageDiv.classList.add("search-result");

    // Photographer info section
    const photographerInfo = document.createElement("div");
    photographerInfo.classList.add("photographer-info");

    const photographerImage = document.createElement("img");
    photographerImage.src = result.user.profile_image.small;
    photographerImage.classList.add("photographer-image");
    photographerImage.alt = result.user.name;

    const photographerName = document.createElement("span");
    photographerName.classList.add("photographer-name");
    photographerName.textContent = result.user.name;

    photographerInfo.appendChild(photographerImage);
    photographerInfo.appendChild(photographerName);
    imageDiv.appendChild(photographerInfo);

    // Image section
    const imageLink = document.createElement("a");
    imageLink.href = result.links.html;
    imageLink.target = "_blank";

    const imageContainer = document.createElement("div");
    imageContainer.classList.add("image-container");

    const img = document.createElement("img");
    img.src = result.urls.small;
    img.alt = result.alt_description;

    const imageText = document.createElement("p");
    imageText.textContent = result.alt_description;

    imageContainer.appendChild(img);
    imageLink.appendChild(imageContainer);
    imageLink.appendChild(imageText);
    imageDiv.appendChild(imageLink);

    // Download section
    const downloadSection = document.createElement("div");
    downloadSection.classList.add("download-section");

    const downloadLink = document.createElement("a");
    downloadLink.href = result.links.download;
    downloadLink.textContent = "Download";
    downloadLink.classList.add("download-button");
    downloadLink.setAttribute("download", "");
    downloadLink.target = "_blank";

    downloadSection.appendChild(downloadLink);
    imageDiv.appendChild(downloadSection);

    searchResultsDiv.appendChild(imageDiv);
  });

  pageNumber = pageNumber + 1;
  // showMoreButton.style.display = "block"; // Remove this line, as the "show more" button is no longer needed
}

searchImagesButton.addEventListener("click", (event) => {
  pageNumber = 1;
  searchImages();
});

// Infinite Scroll Implementation
window.onscroll = function () {
  const scrollPosition = window.innerHeight + window.scrollY;
  const documentHeight = document.documentElement.scrollHeight;

  // Check if user has reached the bottom of the page
  if (scrollPosition >= documentHeight - 10) {
    // Adding a small offset for precision
    searchImages(); // Load more content
  }
};
