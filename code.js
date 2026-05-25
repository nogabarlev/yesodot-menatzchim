const continueBtn = document.getElementById("continueBtn");

if(continueBtn){

    continueBtn.addEventListener("click", () => {

        window.location.href = "categoriesPage.html";

    });
}

const toggleDropdown = () => {

    const dropdown =
    document.getElementById("dropdownMenu");

    dropdown.classList.toggle("open");
}

/* OPEN VIDEO */

const openVideo = (event) => {

    event.stopPropagation();

    window.location.href =
    "media/videos/strugglingCamperVideo.mp4";
}
