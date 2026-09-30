/* =========================
   GENERAL
========================= */

let touchStartY = 0;
let hasScrolled = false;

window.addEventListener("touchstart", (event) => {
    if (!event.changedTouches.length) return;

    touchStartY = event.changedTouches[0].clientY;
});

window.addEventListener("touchend", (event) => {

    if (hasScrolled) return;
    if (!event.changedTouches.length) return;

    const touchEndY = event.changedTouches[0].clientY;

    if (touchStartY - touchEndY > 30) {

        hasScrolled = true;

        if (window.location.pathname.includes("openPage")) {
            window.location.href = "categoriesPage.html";
        }
    }
});


/* =========================
   DROPDOWN
========================= */

const toggleDropdown = () => {

    const dropdown = document.getElementById("dropdownMenu");

    if (dropdown) {
        dropdown.classList.toggle("open");
    }
};


const openSubchapter = (chapter) => {

    /* =========================
       1.1
    ========================= */

    if (chapter === "1.1") {

        const page =
            document.getElementById("subchapterPage");

        if (!page) return;

        page.classList.add("show");

        document.body.style.overflow = "hidden";

        window.scrollTo({
            top: 0,
            behavior: "auto"
        });

        return;
    }


    /* =========================
       1.2
    ========================= */

    if (chapter === "1.2") {

        const page =
            document.getElementById("subchapter12Page");

        if (!page) return;

        page.classList.add("show");

        document.body.style.overflow = "hidden";

        window.scrollTo({
            top: 0,
            behavior: "auto"
        });

        return;
    }


    /* =========================
       1.3
    ========================= */

    if (chapter === "1.3") {

        const page =
            document.getElementById("subchapter13Page");

        if (!page) return;

        page.classList.add("show");

        document.body.style.overflow = "hidden";

        window.scrollTo({
            top: 0,
            behavior: "auto"
        });

        return;
    }
};


const closeSubchapter = () => {

    const page = document.getElementById("subchapterPage");

    if (!page) return;

    page.classList.remove("show");

    document.body.style.overflow = "";
};


const finishSubchapter = () => {

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        closeSubchapter();
        return;
    }

    /* יצירת מבנה התקדמות אם עדיין לא קיים */
    if (!user.chapters) {
        user.chapters = {};
    }

    if (!user.chapters.chapter1) {
        user.chapters.chapter1 = {
            video: false,
            practice: false
        };
    }

    /*
     * שמירת תת-הפרקים שהושלמו
     */
    if (!user.subchapters) {
        user.subchapters = {};
    }

    if (!user.subchapters.chapter1) {
        user.subchapters.chapter1 = {};
    }

    /* 1.1 הושלם */
    user.subchapters.chapter1["1.1"] = 100;

    /*
     * השדה practice נשאר כדי לא לשבור
     * את מנגנון ההתקדמות הקיים.
     */
    user.chapters.chapter1.practice = true;

    /* עדכון ההתקדמות הכללית */
    updateUserProgress(user);

    /* שמירה */
    localStorage.setItem(
        "user",
        JSON.stringify(user)
    );

    /*
     * סגירת עמוד תת-הפרק
     */
    closeSubchapter();

    /*
     * חזרה לעמוד הקטגוריות
     */
    window.location.href = "categoriesPage.html";
};

/* =========================
   VIDEO
========================= */

const openVideo = (event) => {

    if (event) {
        event.stopPropagation();
    }

    const videoModal =
        document.getElementById("videoModal");

    const youtubeVideo =
        document.getElementById("youtubeVideo");

    if (!videoModal || !youtubeVideo) {

        console.log(
            "חלון הסרטון לא נמצא ב-HTML"
        );

        return;
    }

    youtubeVideo.src =
        "https://www.youtube.com/embed/ucrmCmw2Yic?autoplay=1";

    videoModal.classList.add("show");

    const user =
        JSON.parse(localStorage.getItem("user"));

    if (
        user &&
        user.chapters &&
        user.chapters.chapter4
    ) {

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


/* =========================
   REGISTER
========================= */

const registerUser = async () => {

    const fullName =
        document.getElementById("fullName")?.value;

    const personalNumber =
        document.getElementById("personalNumber")?.value;

    const verifyNumber =
        document.getElementById("verifyNumber")?.value;

    const rank =
        document.getElementById("rank")?.value;

    if (
        !fullName ||
        !personalNumber ||
        !verifyNumber ||
        !rank
    ) {

        alert("יש למלא את כל השדות");

        return;
    }

    if (personalNumber !== verifyNumber) {

        alert("המספרים האישיים אינם תואמים");

        return;
    }

    const user = {

        fullName,
        personalNumber,
        rank,

        isAdmin:
            personalNumber === "9598269",

        totalProgress: 0,

        chapters: {

            chapter1: {
                video: false,
                practice: false
            },

            chapter2: {
                video: false,
                practice: false
            },

            chapter3: {
                video: false,
                practice: false
            },

            chapter4: {
                video: false,
                practice: false
            },

            chapter5: {
                video: false,
                practice: false
            }

        }
    };

    localStorage.setItem(
        "user",
        JSON.stringify(user)
    );

    try {

        if (typeof setDoc === "function" &&
            typeof doc === "function" &&
            typeof db !== "undefined") {

            await setDoc(
                doc(
                    db,
                    "users",
                    personalNumber
                ),
                user
            );
        }

    } catch (error) {

        console.log(error);

        alert(
            "אירעה שגיאה בשמירת המשתמש"
        );

        return;
    }

    alert("ההרשמה בוצעה בהצלחה");

    window.location.href =
        "loginPage.html";
};


/* =========================
   LOGIN
========================= */

const loginUser = () => {

    const loginName =
        document.getElementById("loginName")?.value;

    const loginNumber =
        document.getElementById("loginNumber")?.value;

    const savedUser =
        JSON.parse(localStorage.getItem("user"));

    if (!savedUser) {

        alert("לא נמצא משתמש רשום");

        return;
    }

    if (
        loginName === savedUser.fullName &&
        loginNumber === savedUser.personalNumber
    ) {

        localStorage.setItem(
            "loggedIn",
            "true"
        );

        if (savedUser.isAdmin) {

            window.location.href =
                "adminPage.html";

        } else {

            window.location.href =
                "openPage.html";
        }

    } else {

        alert("פרטים שגויים");
    }
};


/* =========================
   REGISTER PAGE LINK
========================= */

const goToRegister = () => {

    window.location.href =
        "registerPage.html";
};


/* =========================
   SHOW USER
========================= */

const helloText =
    document.getElementById("helloText");

if (helloText) {

    const user =
        JSON.parse(localStorage.getItem("user"));

    if (user) {

        helloText.innerHTML =
            `👋 שלום ${user.rank} ${user.fullName}`;
    }
}


/* =========================
   CHAPTER PROGRESS
========================= */

const getChapterProgress = (chapter) => {

    if (!chapter) return 0;

    let progress = 0;

    if (chapter.video) {
        progress += 50;
    }

    if (chapter.practice) {
        progress += 50;
    }

    return progress;
};


/* =========================
   TOTAL PROGRESS
========================= */

const updateUserProgress = (user) => {

    if (!user || !user.chapters) {
        return;
    }

    let total = 0;

    for (let i = 1; i <= 5; i++) {

        total += getChapterProgress(
            user.chapters[`chapter${i}`]
        );
    }

    user.totalProgress =
        Math.round(total / 5);
};


/* =========================
   OPEN CHAPTERS
========================= */

const updateChapters = () => {

    const user =
        JSON.parse(localStorage.getItem("user"));

    if (!user || !user.chapters) {
        return;
    }

    for (let i = 2; i <= 5; i++) {

        const previous =
            user.chapters[`chapter${i - 1}`];

        const current =
            document.getElementById(`chapter${i}`);

        if (!current) continue;

        if (getChapterProgress(previous) === 100) {

            current.classList.remove("locked");

        }
    }
};


/* =========================
   SHOW TOTAL PROGRESS
========================= */

const refreshProgressUI = () => {

    const user =
        JSON.parse(localStorage.getItem("user"));

    if (!user) return;

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

    if (progressRing) {

        progressRing.style.background =
            `conic-gradient(
                #9BCB5A 0% ${user.totalProgress}%,
                #475247 ${user.totalProgress}% 100%
            )`;
    }

    if (totalProgress) {

        totalProgress.innerHTML =
            `${user.totalProgress}%`;
    }

    if (progressDescription) {

        if (user.totalProgress === 0) {

            progressDescription.innerHTML =
                "ברוכים הבאים! התחילו את הפרק הראשון";

        } else if (user.totalProgress < 50) {

            progressDescription.innerHTML =
                "התחלה מצוינת, המשיכו כך";

        } else if (user.totalProgress < 100) {

            progressDescription.innerHTML =
                "כל הכבוד! אתם מתקדמים יפה";

        } else {

            progressDescription.innerHTML =
                "סיימתם את כל התוכן בהצלחה";
        }
    }
};


/* =========================
   CHAPTER UI
========================= */

const refreshChaptersUI = () => {

    const user =
        JSON.parse(localStorage.getItem("user"));

    if (!user || !user.chapters) {
        return;
    }

    for (let i = 1; i <= 5; i++) {

        const chapter =
            user.chapters[`chapter${i}`];

        if (!chapter) continue;

        const progress =
            getChapterProgress(chapter);

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

        if (i === 1) {

            unlocked = true;

        } else {

            const previous =
                user.chapters[
                    `chapter${i - 1}`
                ];

            unlocked =
                getChapterProgress(previous) === 100;
        }

        if (card) {

            if (unlocked) {

                card.classList.remove(
                    "locked"
                );

            } else {

                card.classList.add(
                    "locked"
                );
            }
        }

        if (fill) {

            fill.style.width =
                `${progress}%`;
        }

        if (text) {

            if (unlocked) {

                text.innerHTML =
                    `${progress}% הושלם`;

            } else {

                text.innerHTML =
                    "🔒 טרם נפתח";
            }
        }
    }
};

/* =========================
   SUBCHAPTER PROGRESS
========================= */

const refreshSubchaptersUI = () => {

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return;

    if (!user.subchapters) {
        user.subchapters = {};
    }

    if (!user.subchapters.chapter1) {
        user.subchapters.chapter1 = {};
    }

    const chapter1 = user.subchapters.chapter1;


    /* =========================
       SUBCHAPTERS 1.1 - 1.11
    ========================= */

    for (let i = 1; i <= 11; i++) {

        const currentNumber = `1.${i}`;

        const nextNumber = `1.${i + 1}`;

        const currentCard =
            document.querySelector(
                `[data-chapter="1"][data-subchapter="${i}"]`
            );

        const nextCard =
            document.querySelector(
                `[data-chapter="1"][data-subchapter="${i + 1}"]`
            );

        if (!currentCard) continue;


        /* ההתקדמות של תת הפרק הנוכחי */

        const currentProgress =
            chapter1[currentNumber] || 0;


        const progressElement =
            currentCard.querySelector(
                ".subchapter-progress"
            );


        const lockedStatus =
            currentCard.querySelector(
                ".locked-status"
            );


        /* =========================
           תת פרק שהושלם
        ========================= */

        if (currentProgress === 100) {

            currentCard.classList.remove("locked");
            currentCard.classList.add("available");

            if (progressElement) {
                progressElement.innerHTML =
                    "100% הושלם";
            }

            if (lockedStatus) {
                lockedStatus.remove();
            }
        }


        /* =========================
           תת פרק שעדיין לא הושלם
        ========================= */

        else {

            if (i === 1) {

                // 1.1 זמין מההתחלה
                currentCard.classList.remove("locked");

            } else {

                // כל השאר נעולים עד שהקודם הושלם
                const previousNumber =
                    `1.${i - 1}`;

                const previousProgress =
                    chapter1[previousNumber] || 0;

                if (previousProgress === 100) {

                    currentCard.classList.remove("locked");
                    currentCard.classList.add("available");

                    if (lockedStatus) {
                        lockedStatus.remove();
                    }

                } else {

                    currentCard.classList.add("locked");
                    currentCard.classList.remove("available");
                }
            }

            if (progressElement) {
                progressElement.innerHTML =
                    "טרם הושלם";
            }
        }


        /* =========================
           פתיחת תת הפרק הבא
        ========================= */

        if (
            nextCard &&
            currentProgress === 100
        ) {

            nextCard.classList.remove("locked");
            nextCard.classList.add("available");

            const nextLockedStatus =
                nextCard.querySelector(
                    ".locked-status"
                );

            if (nextLockedStatus) {
                nextLockedStatus.remove();
            }

            const nextProgressElement =
                nextCard.querySelector(
                    ".subchapter-progress"
                );

            if (nextProgressElement) {

                const nextProgress =
                    chapter1[nextNumber] || 0;

                if (nextProgress === 100) {
                    nextProgressElement.innerHTML =
                        "100% הושלם";
                } else {
                    nextProgressElement.innerHTML =
                        "טרם הושלם";
                }
            }
        }
    }
};


/* =========================
   MAIN CATEGORY
========================= */

window.toggleMain = function(element) {

    const category =
        element.closest(".main-category");

    if (!category) return;

    category.classList.toggle("open");
};


/* =========================
   CLOSE SUBCHAPTER WITH ESC
========================= */

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        const page =
            document.getElementById(
                "subchapterPage"
            );

        if (
            page &&
            page.classList.contains("show")
        ) {

            closeSubchapter();
        }
    }
});



/* =========================
   SUBCHAPTER 1.2
========================= */

/* OPEN 1.2 */

const openSubchapter12 = () => {
    const page = document.getElementById("subchapter12Page");

    if (!page) return;

    page.classList.add("show");

    document.body.style.overflow = "hidden";

    window.scrollTo({
        top: 0,
        behavior: "instant"
    });
};


/* CLOSE 1.2 */

const closeSubchapter12 = () => {
    const page = document.getElementById("subchapter12Page");

    if (!page) return;

    page.classList.remove("show");

    document.body.style.overflow = "";
};


/* OPEN / CLOSE INTERACTIVE CARDS */

const toggleLearningCard = (card) => {
    card.classList.toggle("open");
};


/* QUIZ */

const checkAnswer12 = (button, isCorrect) => {

    const answers =
        document.querySelectorAll(
            "#subchapter12Page .quiz-answer"
        );

    const feedback =
        document.getElementById("quizFeedback12");

    answers.forEach((answer) => {
        answer.disabled = true;
    });

    if (isCorrect) {

        button.classList.add("correct");

        feedback.innerHTML =
            "✓ נכון! שעון הפעילות מגדיר את העיתוי של מופעי ניהול ההדרכה המרכזיים בהכשרה.";

        feedback.style.color = "#687b5b";

    } else {

        button.classList.add("wrong");

        feedback.innerHTML =
            "לא בדיוק. חפשי את ההגדרה שמתייחסת לעיתוי של מופעי ניהול ההדרכה.";

        feedback.style.color = "#a06c62";
    }
};


/* FINISH 1.2 */

const finishSubchapter12 = () => {

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        closeSubchapter12();
        return;
    }

    if (!user.subchapters) {
        user.subchapters = {};
    }

    if (!user.subchapters.chapter1) {
        user.subchapters.chapter1 = {};
    }

    // סימון תת פרק 1.2 כהושלם
    user.subchapters.chapter1["1.2"] = 100;

    localStorage.setItem(
        "user",
        JSON.stringify(user)
    );

    closeSubchapter12();

    window.location.href = "categoriesPage.html";
};

const finishSubchapter13 = () => {

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        closeSubchapter13();
        return;
    }

    if (!user.subchapters) {
        user.subchapters = {};
    }

    if (!user.subchapters.chapter1) {
        user.subchapters.chapter1 = {};
    }

    user.subchapters.chapter1["1.3"] = 100;

    localStorage.setItem(
        "user",
        JSON.stringify(user)
    );

    closeSubchapter13();

    window.location.href = "categoriesPage.html";
};


/* ESC */

document.addEventListener("keydown", (event) => {

    if (event.key !== "Escape") return;

    const page =
        document.getElementById("subchapter12Page");

    if (
        page &&
        page.classList.contains("show")
    ) {
        closeSubchapter12();
    }
});


/* GLOBAL */

window.openSubchapter12 = openSubchapter12;
window.closeSubchapter12 = closeSubchapter12;
window.toggleLearningCard = toggleLearningCard;
window.checkAnswer12 = checkAnswer12;
window.finishSubchapter12 = finishSubchapter12;




/* =========================
   INIT
========================= */

refreshProgressUI();
refreshChaptersUI();
refreshSubchaptersUI();
loadChapterProgress();
updateChapters();


/* =========================
   GLOBAL FUNCTIONS
========================= */

window.registerUser = registerUser;
window.loginUser = loginUser;
window.openVideo = openVideo;
window.closeVideo = closeVideo;
window.goToRegister = goToRegister;

window.openSubchapter = openSubchapter;
window.closeSubchapter = closeSubchapter;
window.finishSubchapter = finishSubchapter;
