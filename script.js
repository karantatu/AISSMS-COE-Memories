// FINAL WORKING PREMIUM GALLERY SYSTEM

const API_URL =
"https://script.google.com/macros/s/AKfycbzp9Q_8CYFyMW1LII83I3vfJgyPRC4A9rF2_CklOB3lh2byBorijNCHfAJtomgVtbM2Uw/exec";

/* ELEMENTS */

const gallery =
document.getElementById("gallery-container");

const popup =
document.getElementById("popup");

const popupImg =
document.getElementById("popup-img");

const closeBtn =
document.querySelector(".close-btn");

const loader =
document.getElementById("loader");

/* DATA */

let images = [];

let currentIndex = 0;

/* INFINITE LOAD */

let loadedCount = 0;

const imagesPerLoad = 20;

let isLoading = false;

/* FETCH GALLERY */

async function loadGallery(){

  try{

    const response =
    await fetch(API_URL);

    images =
    await response.json();

    /* REMOVE INVALID LINKS */

    images = images.filter(
      img => img && img.trim() !== ""
    );

    gallery.innerHTML = "";

    /* FIRST BATCH */

    loadMoreImages();

  }

  catch(error){

    console.log(
      "Gallery Error:",
      error
    );

    gallery.innerHTML = `

      <p style="
        text-align:center;
        color:#777;
        padding:40px;
      ">

        Failed to load memories.

      </p>

    `;

  }

  finally{

    /* HIDE LOADER */

    setTimeout(() => {

      loader.style.opacity = "0";

      loader.style.pointerEvents =
      "none";

    }, 700);

  }

}

/* LOAD MORE IMAGES */

function loadMoreImages(){

  if(isLoading) return;

  isLoading = true;

  const nextImages =
  images.slice(
    loadedCount,
    loadedCount + imagesPerLoad
  );

  nextImages.forEach((src, index) => {

    const img =
    document.createElement("img");

    img.src = src;

    img.alt = "memory";

    img.loading = "lazy";

    img.decoding = "async";

    img.style.opacity = "0";

    /* IMAGE LOADED */

    img.onload = () => {

      img.style.transition =
      "opacity 0.5s ease";

      img.style.opacity = "1";

    };

    /* IMAGE ERROR */

    img.onerror = () => {

      img.style.display = "none";

    };

    /* OPEN FULLSCREEN */

    img.addEventListener(
      "click",
      () => {

        openPopup(
          loadedCount + index
        );

      }
    );

    gallery.appendChild(img);

  });

  loadedCount += nextImages.length;

  isLoading = false;
}

/* AUTO LOAD ON SCROLL */

window.addEventListener(
  "scroll",
  () => {

    const scrollPosition =
    window.innerHeight +
    window.scrollY;

    const pageHeight =
    document.body.offsetHeight;

    if(
      scrollPosition >=
      pageHeight - 700
    ){

      if(
        loadedCount <
        images.length
      ){

        loadMoreImages();

      }

    }

  }
);

/* OPEN POPUP */

function openPopup(index){

  currentIndex = index;

  popup.style.display = "flex";

  document.body.style.overflow =
  "hidden";

  /* FIX FIRST IMAGE ISSUE */

  popupImg.src = "";

  setTimeout(() => {

    popupImg.src =
    images[currentIndex];

  }, 50);

}

/* CLOSE POPUP */

function closePopup(){

  popup.style.display = "none";

  popupImg.src = "";

  document.body.style.overflow =
  "auto";
}

/* NEXT IMAGE */

function nextImage(){

  currentIndex++;

  if(currentIndex >= images.length){

    currentIndex = 0;

  }

  popupImg.src = "";

  setTimeout(() => {

    popupImg.src =
    images[currentIndex];

  }, 30);

}

/* PREVIOUS IMAGE */

function prevImage(){

  currentIndex--;

  if(currentIndex < 0){

    currentIndex =
    images.length - 1;

  }

  popupImg.src = "";

  setTimeout(() => {

    popupImg.src =
    images[currentIndex];

  }, 30);

}

/* CLOSE BUTTON */

closeBtn.addEventListener(
  "click",
  closePopup
);

/* CLICK OUTSIDE */

popup.addEventListener(
  "click",
  (e) => {

    if(e.target === popup){

      closePopup();

    }

  }
);

/* KEYBOARD SUPPORT */

document.addEventListener(
  "keydown",
  (e) => {

    if(
      popup.style.display ===
      "flex"
    ){

      if(e.key === "Escape"){

        closePopup();

      }

      if(e.key === "ArrowRight"){

        nextImage();

      }

      if(e.key === "ArrowLeft"){

        prevImage();

      }

    }

  }
);

/* MOBILE SWIPE */

let touchStartX = 0;

let touchEndX = 0;

/* TOUCH START */

popup.addEventListener(
  "touchstart",
  (e) => {

    touchStartX =
    e.changedTouches[0].screenX;

  }
);

/* TOUCH END */

popup.addEventListener(
  "touchend",
  (e) => {

    touchEndX =
    e.changedTouches[0].screenX;

    handleSwipe();

  }
);

/* HANDLE SWIPE */

function handleSwipe(){

  const swipeDistance =
  touchEndX - touchStartX;

  /* NEXT IMAGE */

  if(swipeDistance < -50){

    nextImage();

  }

  /* PREVIOUS IMAGE */

  if(swipeDistance > 50){

    prevImage();

  }

}

/* START */

loadGallery();