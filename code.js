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

    document.getElementById("videoPopup")
    .classList.add("show");
}

/* CLOSE VIDEO */

const closeVideo = () => {

    document.getElementById("videoPopup")
    .classList.remove("show");
}
