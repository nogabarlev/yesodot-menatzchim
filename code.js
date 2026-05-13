let swipeBtn;
let screen;


const load = () => {

    swipeBtn = document.getElementById("swipeBtn");

    screen = document.querySelector(".phone");

    swipeBtn.addEventListener("click", () => {

        screen.classList.add("slide-up");

        setTimeout(() => {

            window.location.href = "categoriesPage.html";

        }, 800);

    });

}

window.onload = load;

const changeScreen= () =>{
    
}