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

    window.open(
        "https://youtu.be/ucrmCmw2Yic?si=qlr0Obcr8xVTvsdc"
        );
}
