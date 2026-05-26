/* ========================= */
/* CONTINUE BUTTON */
/* ========================= */

const continueBtn =
document.getElementById("continueBtn");

if(continueBtn){

    continueBtn.addEventListener("click", () => {

        window.location.href =
        "categoriesPage.html";

    });
}

/* ========================= */
/* DROPDOWN */
/* ========================= */

const toggleDropdown = () => {

    const dropdown =
    document.getElementById("dropdownMenu");

    dropdown.classList.toggle("open");
}

/* ========================= */
/* VIDEO */
/* ========================= */

const openVideo = (event) => {

    event.stopPropagation();

    document.getElementById("videoPopup")
    .classList.add("show");
}

const closeVideo = () => {

    document.getElementById("videoPopup")
    .classList.remove("show");
}

/* ========================= */
/* REGISTER */
/* ========================= */

const registerUser = () => {

    const fullName =
    document.getElementById("fullName").value;

    const personalNumber =
    document.getElementById("personalNumber").value;

    const verifyNumber =
    document.getElementById("verifyNumber").value;

    const rank =
    document.getElementById("rank").value;

    if(
        !fullName ||
        !personalNumber ||
        !verifyNumber ||
        !rank
    ){

        alert("יש למלא את כל השדות");

        return;
    }

    if(personalNumber !== verifyNumber){

        alert("המספרים האישיים אינם תואמים");

        return;
    }

    const user = {

        fullName,
        personalNumber,
        rank
    };

    localStorage.setItem(
        "user",
        JSON.stringify(user)
    );

    alert("ההרשמה בוצעה בהצלחה");

    window.location.href =
    "index.html";
}

/* ========================= */
/* LOGIN */
/* ========================= */

const loginUser = () => {

    const loginName =
    document.getElementById("loginName").value;

    const loginNumber =
    document.getElementById("loginNumber").value;

    const savedUser =
    JSON.parse(localStorage.getItem("user"));

    /* אם אין משתמש */

    if(!savedUser){

        alert("לא נמצא משתמש רשום");

        return;
    }

    /* בדיקה */

    if(

        loginName === savedUser.fullName &&
        loginNumber === savedUser.personalNumber

    ){

        localStorage.setItem(
            "loggedIn",
            "true"
        );

        window.location.href =
        "openPage.html";
    }

    else{

        alert("פרטים שגויים");
    }
}

/* ========================= */
/* SHOW USER */
/* ========================= */

const helloText =
document.getElementById("helloText");

if(helloText){

    const savedUser =
    JSON.parse(localStorage.getItem("user"));

    if(savedUser){

        helloText.innerHTML =
        `👋 שלום ${savedUser.rank} ${savedUser.fullName}`;
    }
}

/* GO TO REGISTER */

const goToRegister = () => {

    window.location.href =
    "registerPage.html";
}
