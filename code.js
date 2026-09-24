window.addEventListener("touchend", (event) => {

    if (hasScrolled) return;

    const touchEndY =
        event.changedTouches[0].clientY;

    if (touchStartY - touchEndY > 30) {

        hasScrolled = true;

        window.location.href =
        "categoriesPage.html";

    }

});

/* ========================= */
/* DROPDOWN */
/* ========================= */

const toggleDropdown = () => {

    const dropdown =
    document.getElementById("dropdownMenu");

    if(dropdown){

        dropdown.classList.toggle("open");
    }
}

/* ========================= */
/* VIDEO */
/* ========================= */

const openVideo = (event) => {

    event.stopPropagation();

    const videoModal =
        document.getElementById("videoModal");

    const youtubeVideo =
        document.getElementById("youtubeVideo");

    if (!videoModal || !youtubeVideo) {
        console.log("חלון הסרטון לא נמצא ב-HTML");
        return;
    }

    youtubeVideo.src =
        "https://youtu.be/ucrmCmw2Yic?si=yItgWkJQj2TSSm8V";

    videoModal.classList.add("show");

    const user =
        JSON.parse(localStorage.getItem("user"));

    if (user && user.chapters && user.chapters.chapter4) {

        user.chapters.chapter4.video = true;

        updateUserProgress(user);

        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );
    }
};


const closeVideo = () => {

    const videoModal =
        document.getElementById("videoModal");

    const youtubeVideo =
        document.getElementById("youtubeVideo");

    if (videoModal) {

        videoModal.classList.remove("show");
    }

    if (youtubeVideo) {

        youtubeVideo.src = "";
    }
};

/* ========================= */
/* REGISTER */
/* ========================= */

const registerUser = async () => {

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
        rank,
        isAdmin: 
        personalNumber === "9598269",


        totalProgress:0,

        chapters:{

            chapter1:{
                video:false,
                practice:false
            },

            chapter2:{
                video:false,
                practice:false
            },

            chapter3:{
                video:false,
                practice:false
            },

            chapter4:{
                video:false,
                practice:false
            },

            chapter5:{
                video:false,
                practice:false
            }
        }
    };

localStorage.setItem(
    "user",
    JSON.stringify(user)
);

try{

    await setDoc(

        doc(db,"users",personalNumber),

        user

    );

}catch(error){

    console.log(error);

    alert("אירעה שגיאה בשמירת המשתמש");

    return;
}

alert("ההרשמה בוצעה בהצלחה");

window.location.href =
"loginPage.html";
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
    JSON.parse(
        localStorage.getItem("user")
    );

    if(!savedUser){

        alert("לא נמצא משתמש רשום");

        return;
    }

    if(

        loginName ===
        savedUser.fullName

        &&

        loginNumber ===
        savedUser.personalNumber

    ){

        localStorage.setItem(
            "loggedIn",
            "true"
        );
        
        if(savedUser.isAdmin){

            window.location.href = "adminPage.html";
        }else{

            window.location.href = "openPage.html";
        }
    }


    else{

        alert("פרטים שגויים");
    }
}


/* ========================= */
/* REGISTER PAGE LINK */
/* ========================= */

const goToRegister = () => {

    window.location.href =
    "registerPage.html";
}

/* ========================= */
/* SHOW USER */
/* ========================= */

const helloText =
document.getElementById("helloText");

if(helloText){

    const user =
    JSON.parse(localStorage.getItem("user"));

    if(user){

        helloText.innerHTML =
        `👋 שלום ${user.rank} ${user.fullName}`;
    }
}

/* ========================= */
/* CHAPTER PROGRESS */
/* ========================= */

const getChapterProgress =
(chapter) => {

    let progress = 0;

    if(chapter.video){

        progress += 50;
    }

    if(chapter.practice){

        progress += 50;
    }

    return progress;
}

/* ========================= */
/* TOTAL PROGRESS */
/* ========================= */

const updateUserProgress =
(user) => {

    let total = 0;

    total += getChapterProgress(
        user.chapters.chapter1
    );

    total += getChapterProgress(
        user.chapters.chapter2
    );

    total += getChapterProgress(
        user.chapters.chapter3
    );

    total += getChapterProgress(
        user.chapters.chapter4
    );

    total += getChapterProgress(
        user.chapters.chapter5
    );

    user.totalProgress =
    Math.round(total / 5);
}

/* ========================= */
/* OPEN CHAPTERS */
/* ========================= */

const updateChapters = () => {

    const user =
    JSON.parse(localStorage.getItem("user"));

    if(!user){
        return;
    }

    if(
        getChapterProgress(
            user.chapters.chapter1
        ) === 100
    ){

        document
        .getElementById("chapter2")
        ?.classList.remove("locked");
    }

    if(
        getChapterProgress(
            user.chapters.chapter2
        ) === 100
    ){

        document
        .getElementById("chapter3")
        ?.classList.remove("locked");
    }

    if(
        getChapterProgress(
            user.chapters.chapter3
        ) === 100
    ){

        document
        .getElementById("chapter4")
        ?.classList.remove("locked");
    }

    if(
        getChapterProgress(
            user.chapters.chapter4
        ) === 100
    ){

        document
        .getElementById("chapter5")
        ?.classList.remove("locked");
    }
}

/* ========================= */
/* SHOW TOTAL PROGRESS */
/* ========================= */

/* ========================= */
/* SHOW TOTAL PROGRESS */
/* ========================= */

const totalProgressText =
document.getElementById(
    "totalProgress"
);

const progressDescription =
document.getElementById(
    "progressDescription"
);

if(totalProgressText){

    const user =
    JSON.parse(
        localStorage.getItem("user")
    );

    if(user){

        /* מחשב מחדש התקדמות */

        updateUserProgress(user);
        const progressRing =
        document.getElementById(
            "progressRing"
        );
        
        if(progressRing){

            progressRing.style.background =
            `conic-gradient(
            #9BCB5A 0% ${user.totalProgress}%,
            #475247 ${user.totalProgress}% 100%
            )`;
        }

        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );

        totalProgressText.innerHTML =
        `${user.totalProgress || 0}%`;

        if(progressDescription){

            if(
                (user.totalProgress || 0)
                === 0
            ){

                progressDescription.innerHTML =
                "ברוכים הבאים! התחילו את הפרק הראשון";
            }

            else if(
                user.totalProgress < 50
            ){

                progressDescription.innerHTML =
                "התחלה מצוינת, המשיכו כך";
            }

            else if(
                user.totalProgress < 100
            ){

                progressDescription.innerHTML =
                "כל הכבוד! אתם מתקדמים יפה";
            }

            else{

                progressDescription.innerHTML =
                "סיימתם את כל התוכן בהצלחה";
            }
        }
    }

    else{

        totalProgressText.innerHTML =
        "0%";
    }
}
updateChapters();

const refreshProgressUI = () => {

    const user =
    JSON.parse(localStorage.getItem("user"));

    if(!user){
        return;
    }

    updateUserProgress(user);

    localStorage.setItem(
        "user",
        JSON.stringify(user)
    );

    const progressRing =
    document.getElementById("progressRing");

    const totalProgress =
    document.getElementById("totalProgress");

    const progressDescription =
    document.getElementById("progressDescription");

    if(progressRing){

        progressRing.style.background =
        `conic-gradient(
        #9BCB5A 0% ${user.totalProgress}%,
        #475247 ${user.totalProgress}% 100%
        )`;
    }

    if(totalProgress){

        totalProgress.innerHTML =
        `${user.totalProgress}%`;
    }

    if(progressDescription){

        if(user.totalProgress === 0){

            progressDescription.innerHTML =
            "ברוכים הבאים! התחילו את הפרק הראשון";
        }

        else if(user.totalProgress < 50){

            progressDescription.innerHTML =
            "התחלה מצוינת, המשיכו כך";
        }

        else if(user.totalProgress < 100){

            progressDescription.innerHTML =
            "כל הכבוד! אתם מתקדמים יפה";
        }

        else{

            progressDescription.innerHTML =
            "סיימתם את כל התוכן בהצלחה";
        }
    }
}

const refreshChaptersUI = () => {

    const user =
    JSON.parse(localStorage.getItem("user"));

    if(!user){
        return;
    }

    for(let i = 1; i <= 5; i++){

        const progress =
        getChapterProgress(
            user.chapters[`chapter${i}`]
        );

        const fill =
        document.getElementById(
            `chapter${i}Fill`
        );

        const text =
        document.getElementById(
            `chapter${i}Text`
        );

        const card =
        document.getElementById(
            `chapter${i}`
        );

        let unlocked = false;

        if(i === 1){

            unlocked = true;
        }

        else{

            const previousProgress =
            getChapterProgress(
                user.chapters[
                    `chapter${i-1}`
                ]
            );

            unlocked =
            previousProgress === 100;
        }

        if(card){

            if(unlocked){

                card.classList.remove(
                    "locked"
                );

            }else{

                card.classList.add(
                    "locked"
                );
            }
        }

        if(fill){

            fill.style.width =
            `${progress}%`;
        }

        if(text){

            if(unlocked){

                text.innerHTML =
                `${progress}% הושלם`;

            }else{

                text.innerHTML =
                "🔒 טרם נפתח";
            }
        }
    }
}

const loadChapterProgress = () => {

    const user =
    JSON.parse(localStorage.getItem("user"));

    if(!user){
        return;
    }

    const progress =
    getChapterProgress(
        user.chapters.chapter1
    );

    const fill =
    document.getElementById("chapter1Fill");

    const text =
    document.getElementById("chapter1Text");

    if(fill){

        fill.style.width =
        `${progress}%`;
    }

    if(text){

        text.innerHTML =
        `${progress}% הושלם`;
    }
}

window.toggleMain = function(element){

    const category =
    element.closest(".main-category");

    category.classList.toggle("open");
}


/* =========================================
   פתיחת וסגירת תתי פרקים
========================================= */

refreshProgressUI();
refreshChaptersUI();
loadChapterProgress();

window.registerUser = registerUser;
window.loginUser = loginUser;
window.openVideo = openVideo;
window.closeVideo = closeVideo;
window.goToRegister = goToRegister;
