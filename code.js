/* =========================
   GENERAL
========================= */

let touchStartY = 0;
let hasScrolled = false;


window.addEventListener("touchstart", (event) => {

    if (!event.changedTouches.length) return;

    touchStartY =
        event.changedTouches[0].clientY;
});


window.addEventListener("touchend", (event) => {

    if (hasScrolled) return;
    if (!event.changedTouches.length) return;

    const touchEndY =
        event.changedTouches[0].clientY;

    if (touchStartY - touchEndY > 30) {

        hasScrolled = true;

        if (
            window.location.pathname.includes(
                "openPage"
            )
        ) {

            window.location.href =
                "categoriesPage.html";
        }
    }
});


/* =========================
   DROPDOWN
========================= */

const toggleDropdown = () => {

    const dropdown =
        document.getElementById("dropdownMenu");

    if (dropdown) {

        dropdown.classList.toggle("open");
    }
};


/* =========================
   OPEN SUBCHAPTER
========================= */

const getSubchapterPage = (chapter) => {

    const n = chapter.replace(".", "");

    return (
        document.getElementById("subchapterNew" + n + "Page") ||
        document.getElementById("subchapter" + n + "Page")
    );
};

/* קישור למבחן המסכם – להחליף בכתובת האמיתית של המבחן */
const FINAL_EXAM_URL = "#";

const LAST_SUB = { 1: 11, 2: 4, 3: 8, 4: 5, 5: 3 };
 
// האם תת-פרק c.n הושלם
const isSubDone = (user, c, n) =>
    user?.subchapters?.[`chapter${c}`]?.[`${c}.${n}`] === 100;
 
// תת-פרק נפתח רק אחרי השלמת הקודם. 1.1 תמיד פתוח.
// תת-פרק ראשון בפרק (2.1, 3.1...) נפתח אחרי השלמת התת-פרק האחרון בפרק הקודם.
const isSubchapterUnlocked = (user, c, n) => {
 
    if (c === 1 && n === 1) return true;
 
    if (n === 1) return isSubDone(user, c - 1, LAST_SUB[c - 1]);
 
    return isSubDone(user, c, n - 1);
};

const openSubchapter = (chapter) => {
 
    const user = JSON.parse(localStorage.getItem("user"));
 
    const [c, n] = chapter.split(".").map(Number);
 
    if (!isSubchapterUnlocked(user, c, n)) return;
 
    const page = getSubchapterPage(chapter);
 
    if (!page) return;
 
    page.classList.add("show");
    page.scrollTop = 0;
    document.body.style.overflow = "hidden";
    window.scrollTo({ top: 0, behavior: "auto" });
};

/* =========================
   CLOSE 1.1
========================= */

const closeSubchapter = () => {

    const page =
        document.getElementById(
            "subchapterPage"
        );

    if (!page) return;

    page.classList.remove("show");

    document.body.style.overflow = "";
};


/* =========================
   FINISH 1.1
========================= */

const finishSubchapter = () => {

    // אין יותר הרשמה, לכן אם אין עדיין אובייקט משתמש - יוצרים אחד חדש
    const user = JSON.parse(
        localStorage.getItem("user")
    ) || {};

    if (!user.chapters) {
        user.chapters = {};
    }

    if (!user.chapters.chapter1) {
        user.chapters.chapter1 = {
            video: false,
            practice: false
        };
    }

    if (!user.subchapters) {
        user.subchapters = {};
    }

    if (!user.subchapters.chapter1) {
        user.subchapters.chapter1 = {};
    }

    // סימון תת-פרק 1.1 כהושלם
    user.subchapters.chapter1["1.1"] = 100;

    // שמירה על מנגנון ההתקדמות הקיים
    user.chapters.chapter1.practice = true;

    // עדכון ההתקדמות הכללית
    updateUserProgress(user);

    // סימון תת-פרק 1.2 כתת-הפרק הבא שנפתח
    sessionStorage.setItem(
        "newlyUnlockedSubchapter",
        "1.2"
    );

    // שמירת כל הנתונים לפני המעבר
    localStorage.setItem(
        "user",
        JSON.stringify(user)
    );

    closeSubchapter();

    // חזרה לרשימת תתי-הפרקים
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
        document.getElementById(
            "videoModal"
        );

    const youtubeVideo =
        document.getElementById(
            "youtubeVideo"
        );


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
        JSON.parse(
            localStorage.getItem("user")
        );


    if (
        user &&
        user.chapters &&
        user.chapters.chapter4
    ) {

        user.chapters.chapter4.video =
            true;

        updateUserProgress(user);


        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );
    }
};


const closeVideo = () => {

    const videoModal =
        document.getElementById(
            "videoModal"
        );

    const youtubeVideo =
        document.getElementById(
            "youtubeVideo"
        );


    if (videoModal) {

        videoModal.classList.remove(
            "show"
        );
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
        document.getElementById(
            "fullName"
        )?.value;

    const personalNumber =
        document.getElementById(
            "personalNumber"
        )?.value;

    const verifyNumber =
        document.getElementById(
            "verifyNumber"
        )?.value;

    const rank =
        document.getElementById(
            "rank"
        )?.value;


    if (
        !fullName ||
        !personalNumber ||
        !verifyNumber ||
        !rank
    ) {

        alert(
            "יש למלא את כל השדות"
        );

        return;
    }


    if (
        personalNumber !== verifyNumber
    ) {

        alert(
            "המספרים האישיים אינם תואמים"
        );

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
        },


        subchapters: {

            chapter1: {}
        }
    };


    localStorage.setItem(
        "user",
        JSON.stringify(user)
    );


    try {

        if (
            typeof setDoc === "function" &&
            typeof doc === "function" &&
            typeof db !== "undefined"
        ) {

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


    alert(
        "ההרשמה בוצעה בהצלחה"
    );


    window.location.href =
        "loginPage.html";
};


/* =========================
   LOGIN
========================= */

const loginUser = () => {

    const loginName =
        document.getElementById(
            "loginName"
        )?.value;

    const loginNumber =
        document.getElementById(
            "loginNumber"
        )?.value;


    const savedUser =
        JSON.parse(
            localStorage.getItem("user")
        );


    if (!savedUser) {

        alert(
            "לא נמצא משתמש רשום"
        );

        return;
    }


    if (
        loginName === savedUser.fullName &&
        loginNumber ===
            savedUser.personalNumber
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

        alert(
            "פרטים שגויים"
        );
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
    document.getElementById(
        "helloText"
    );


if (helloText) {

    const user =
        JSON.parse(
            localStorage.getItem("user")
        );


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

    if (
        !user ||
        !user.chapters
    ) {

        return;
    }


    let total = 0;


    for (let i = 1; i <= 5; i++) {

        total +=
            getChapterProgress(
                user.chapters[
                    `chapter${i}`
                ]
            );
    }


    user.totalProgress =
        Math.round(
            total / 5
        );
};


/* =========================
   OPEN CHAPTERS
========================= */

const updateChapters = () => {

    const user =
        JSON.parse(
            localStorage.getItem("user")
        );


    if (
        !user ||
        !user.chapters
    ) {

        return;
    }


    for (let i = 2; i <= 5; i++) {

        const previous =
            user.chapters[
                `chapter${i - 1}`
            ];


        const current =
            document.getElementById(
                `chapter${i}`
            );


        if (!current) continue;


        if (
            getChapterProgress(
                previous
            ) === 100
        ) {

            current.classList.remove(
                "locked"
            );
        }
    }
};


/* =========================
   SHOW TOTAL PROGRESS
========================= */

const refreshProgressUI = () => {

    const user =
        JSON.parse(
            localStorage.getItem("user")
        );


    if (!user) return;


    updateUserProgress(user);


    localStorage.setItem(
        "user",
        JSON.stringify(user)
    );


    const progressRing =
        document.getElementById(
            "progressRing"
        );


    const totalProgress =
        document.getElementById(
            "totalProgress"
        );


    const progressDescription =
        document.getElementById(
            "progressDescription"
        );


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

        if (
            user.totalProgress === 0
        ) {

            progressDescription.innerHTML =
                "ברוכים הבאים! התחילו את הפרק הראשון";

        } else if (
            user.totalProgress < 50
        ) {

            progressDescription.innerHTML =
                "התחלה מצוינת, המשיכו כך";

        } else if (
            user.totalProgress < 100
        ) {

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
        JSON.parse(
            localStorage.getItem("user")
        );


    if (
        !user ||
        !user.chapters
    ) {

        return;
    }


    for (let i = 1; i <= 5; i++) {

        const chapter =
            user.chapters[
                `chapter${i}`
            ];


        if (!chapter) continue;


        const progress =
            getChapterProgress(
                chapter
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


        if (i === 1) {

            unlocked = true;

        } else {

            const previous =
                user.chapters[
                    `chapter${i - 1}`
                ];


            unlocked =
                getChapterProgress(
                    previous
                ) === 100;
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
 
    // גם למשתמש חדש (בלי נתונים שמורים) מציגים נכון את הנעילה
    const user = JSON.parse(localStorage.getItem("user")) || {};
 
    if (!user.subchapters) user.subchapters = {};
 
    const newlyUnlocked = sessionStorage.getItem("newlyUnlockedSubchapter");
 
    Object.keys(LAST_SUB).forEach((key) => {
 
        const c = Number(key);
 
        const chapterData = user.subchapters[`chapter${c}`] || {};
 
        for (let i = 1; i <= LAST_SUB[c]; i++) {
 
            const card = document.querySelector(
                `[data-chapter="${c}"][data-subchapter="${i}"]`
            );
 
            if (!card) continue;
 
            const progressElement = card.querySelector(".subchapter-progress");
            const lockedStatus = card.querySelector(".locked-status");
 
            const isUnlocked = isSubchapterUnlocked(user, c, i);
            const isCompleted = chapterData[`${c}.${i}`] === 100;
 
            if (isUnlocked) {
 
                card.classList.remove("locked");
                card.classList.add("available");
 
                if (lockedStatus) lockedStatus.remove();
 
                if (progressElement) {
                    progressElement.textContent = isCompleted
                        ? "100% הושלם"
                        : "טרם הושלם";
                    progressElement.style.display = "";
                    progressElement.style.visibility = "visible";
                }
 
            } else {
 
                card.classList.add("locked");
                card.classList.remove("available");
 
                if (progressElement) progressElement.textContent = "🔒 נעול";
                if (lockedStatus) lockedStatus.textContent = "🔒 נעול";
            }
 
            // אנימציה (הבזק) לתת-הפרק שנפתח עכשיו
            if (isUnlocked && newlyUnlocked === `${c}.${i}`) {
 
                card.classList.add("just-unlocked");
 
                sessionStorage.removeItem("newlyUnlockedSubchapter");
 
                setTimeout(() => {
                    card.classList.remove("just-unlocked");
                }, 1300);
            }
        }
    });
};


/* =========================
   MAIN CATEGORY
========================= */

window.toggleMain = function(element) {

    const category =
        element.closest(
            ".main-category"
        );


    if (!category) return;


    category.classList.toggle(
        "open"
    );
};


/* =========================
   SUBCHAPTER 1.2
========================= */


/* OPEN 1.2 */

const openSubchapter12 = () => {

    const page =
        document.getElementById(
            "subchapter12Page"
        );


    if (!page) return;


    page.classList.add("show");


    document.body.style.overflow =
        "hidden";


    window.scrollTo({
        top: 0,
        behavior: "auto"
    });
};


/* CLOSE 1.2 */

const closeSubchapter12 = () => {

    const page =
        document.getElementById(
            "subchapter12Page"
        );


    if (!page) return;


    page.classList.remove(
        "show"
    );


    document.body.style.overflow =
        "";
};


/* =========================
   INTERACTIVE CARDS
========================= */

const toggleLearningCard = (card) => {

    if (!card) return;

    card.classList.toggle("open");
};


/* =========================
   QUIZ 1.2
========================= */

const checkAnswer12 = (button, isCorrect) => {
 
    const card = button.closest(".quiz-card-12");
 
    const answers = card.querySelectorAll(".quiz-answer");
 
    const feedback = card.querySelector(".quiz-feedback");
 
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


/* =========================
   FINISH 1.2
========================= */

const finishSubchapter12 = () => {

    const user =
        JSON.parse(
            localStorage.getItem("user")
        ) || {};


    if (!user.subchapters) {

        user.subchapters = {};
    }


    if (!user.subchapters.chapter1) {

        user.subchapters.chapter1 = {};
    }


    /* =========================
       1.2 הושלם
    ========================= */

    user.subchapters.chapter1["1.2"] =
        100;


    /* =========================
       1.3 נפתח עכשיו
    ========================= */

    sessionStorage.setItem(
        "newlyUnlockedSubchapter",
        "1.3"
    );


    /* שמירה */

    localStorage.setItem(
        "user",
        JSON.stringify(user)
    );


    closeSubchapter12();


    window.location.href =
        "categoriesPage.html";
};


/* =========================
   SUBCHAPTER 1.3
========================= */


/* CLOSE 1.3 */

const closeSubchapter13 = () => {

    const page =
        document.getElementById(
            "subchapter13Page"
        );


    if (!page) return;


    page.classList.remove(
        "show"
    );


    document.body.style.overflow =
        "";
};

/* =========================
   CLOSE 1.4
========================= */

const closeSubchapter14 = () => {

    const page =
        document.getElementById(
            "subchapter14Page"
        );

    if (!page) return;

    page.classList.remove("show");

    document.body.style.overflow = "";
};

/* =========================
   CLOSE 1.5
========================= */

const closeSubchapter15 = () => {

    const page =
        document.getElementById(
            "subchapter15Page"
        );

    if (!page) return;

    page.classList.remove("show");

    document.body.style.overflow = "";
};


/* CLOSE – 1.6 עד 1.11 */
const closeSubchapterPage = (chapter) => {
 
    const page = getSubchapterPage(chapter);
 
    if (!page) return;
 
    page.classList.remove("show");
    document.body.style.overflow = "";
};



/* FINISH 1.3 */

const finishSubchapter13 = () => {

    const user =
        JSON.parse(
            localStorage.getItem("user")
        ) || {};


    if (!user.subchapters) {

        user.subchapters = {};
    }


    if (!user.subchapters.chapter1) {

        user.subchapters.chapter1 = {};
    }


    /* =========================
       1.3 הושלם
    ========================= */

    user.subchapters.chapter1["1.3"] =
        100;


    /* =========================
       1.4 נפתח עכשיו
    ========================= */

    sessionStorage.setItem(
        "newlyUnlockedSubchapter",
        "1.4"
    );


    /* שמירה */

    localStorage.setItem(
        "user",
        JSON.stringify(user)
    );


    closeSubchapter13();


    window.location.href =
        "categoriesPage.html";
};



/* =========================
   FINISH 1.4
========================= */

const finishSubchapter14 = () => {

    const user =
        JSON.parse(
            localStorage.getItem("user")
        ) || {};

    if (!user.subchapters) {
        user.subchapters = {};
    }

    if (!user.subchapters.chapter1) {
        user.subchapters.chapter1 = {};
    }

    // סימון תת-פרק 1.4 כהושלם
    user.subchapters.chapter1["1.4"] = 100;

    // סימון תת-פרק 1.5 כתת-הפרק הבא שייפתח
    sessionStorage.setItem(
        "newlyUnlockedSubchapter",
        "1.5"
    );

    // שמירת ההתקדמות
    localStorage.setItem(
        "user",
        JSON.stringify(user)
    );

    closeSubchapter14();

    // חזרה לרשימת תתי-הפרקים
    window.location.href = "categoriesPage.html";
};


/* =========================
   FINISH 1.5
========================= */

const finishSubchapter15 = () => {

    const user =
        JSON.parse(
            localStorage.getItem("user")
        ) || {};

    if (!user.subchapters) {
        user.subchapters = {};
    }

    if (!user.subchapters.chapter1) {
        user.subchapters.chapter1 = {};
    }

    // סימון תת-פרק 1.4 כהושלם
    user.subchapters.chapter1["1.5"] = 100;

    // סימון תת-פרק 1.6 כתת-הפרק הבא שייפתח
    sessionStorage.setItem(
        "newlyUnlockedSubchapter",
        "1.6"
    );

    // שמירת ההתקדמות
    localStorage.setItem(
        "user",
        JSON.stringify(user)
    );

    closeSubchapter15();

    // חזרה לרשימת תתי-הפרקים
    window.location.href = "categoriesPage.html";
};

/* FINISH – 1.6 עד 1.11 */
const finishSubchapterPage = (chapter) => {
 
    const user = JSON.parse(localStorage.getItem("user")) || {};
 
    const [c, n] = chapter.split(".").map(Number);
 
    if (!user.subchapters) user.subchapters = {};
    if (!user.subchapters[`chapter${c}`]) user.subchapters[`chapter${c}`] = {};
 
    // סימון תת-הפרק כהושלם
    user.subchapters[`chapter${c}`][chapter] = 100;
 
    // לוגיקה מיוחדת שהייתה ב-1.1 (מנגנון ההתקדמות הכללי)
    if (chapter === "1.1") {
 
        if (!user.chapters) user.chapters = {};
 
        if (!user.chapters.chapter1) {
            user.chapters.chapter1 = { video: false, practice: false };
        }
 
        user.chapters.chapter1.practice = true;
 
        updateUserProgress(user);
    }
 
    // מה נפתח עכשיו?
    if (n < LAST_SUB[c]) {
 
        // התת-פרק הבא באותו פרק
        sessionStorage.setItem("newlyUnlockedSubchapter", `${c}.${n + 1}`);
 
    } else if (c < 5) {

        // סיום התת-פרק האחרון בפרק -> נפתח הפרק הבא (ותת-פרק X.1 שלו)
        sessionStorage.setItem("newlyUnlockedSubchapter", `${c + 1}.1`);
        sessionStorage.setItem("newlyUnlockedChapter", String(c + 1));

    } else if (c === 5) {

        // סיום 5.3 -> הפרקים הסתיימו: נפתח המבחן המסכם ומוצג פופ-אפ
        sessionStorage.setItem("newlyUnlockedChapter", "6");
        sessionStorage.setItem("allChaptersDone", "1");
    }

    localStorage.setItem("user", JSON.stringify(user));
 
    closeSubchapterPage(chapter);
 
    window.location.href = "categoriesPage.html";
};


/* =========================
   ESC - GENERAL
========================= */

document.addEventListener(
    "keydown",
    (event) => {

        if (event.key !== "Escape") {
            return;
        }


        const page1 =
            document.getElementById(
                "subchapterPage"
            );


        const page12 =
            document.getElementById(
                "subchapter12Page"
            );


        const page13 =
            document.getElementById(
                "subchapter13Page"
            );


        if (
            page1 &&
            page1.classList.contains("show")
        ) {

            closeSubchapter();

            return;
        }


        if (
            page12 &&
            page12.classList.contains("show")
        ) {

            closeSubchapter12();

            return;
        }


        if (
            page13 &&
            page13.classList.contains("show")
        ) {

            closeSubchapter13();

            return;
        }
    }
);

/* ESC – סוגר את עמודי 1.6–1.11 */
document.addEventListener("keydown", (event) => {
 
    if (event.key !== "Escape") return;
 
    document
        .querySelectorAll(".sc-new.show")
        .forEach((page) => page.classList.remove("show"));
 
    document.body.style.overflow = "";
});


/* =========================
   KEEP CHAPTER OPEN AFTER FINISH
========================= */

// אחרי "סיימתי" הדף נטען מחדש - פותחים שוב את הנושא
// של תת-הפרק שנפתח עכשיו, כדי שהרשימה לא תיסגר
const keepChapterOpenAfterFinish = () => {

    const newlyUnlocked = sessionStorage.getItem(
        "newlyUnlockedSubchapter"
    );

    if (!newlyUnlocked) return;

    const [chapter, subchapter] =
        newlyUnlocked.split(".");

    const card = document.querySelector(
        `[data-chapter="${chapter}"][data-subchapter="${subchapter}"]`
    );

    card?.closest(".chapter-group")?.classList.add("open");
};

/* פתיחה/סגירה של פרק. פרק נעול לא נפתח. */
const toggleChapterGroup = (card) => {
 
    const group = card.parentElement;
 
    if (!group || group.classList.contains("locked-chapter")) return;
 
    group.classList.toggle("open");
};
 
 
/* נעילה/פתיחה של פרקים 2 עד 5 + הבזק על הפרק שנפתח עכשיו */
const refreshChapterLocksUI = () => {
 
    const user = JSON.parse(localStorage.getItem("user")) || {};
 
    const rules = {
        2: isSubDone(user, 1, LAST_SUB[1]),   // פרק 2 נפתח אחרי 1.11
        3: isSubDone(user, 2, LAST_SUB[2]),   // פרק 3 נפתח אחרי 2.4
        4: isSubDone(user, 3, LAST_SUB[3]),   // פרק 4 נפתח אחרי 3.8
        5: isSubDone(user, 4, LAST_SUB[4]),   // פרק 5 נפתח אחרי 4.5
        6: isSubDone(user, 5, LAST_SUB[5])    // המבחן המסכם נפתח אחרי 5.3
    };
 
    const newly = sessionStorage.getItem("newlyUnlockedChapter");
 
    Object.entries(rules).forEach(([c, unlocked]) => {
 
        const group = document.getElementById(`chapterGroup${c}`);
 
        if (!group) return;
 
        group.classList.toggle("locked-chapter", !unlocked);
 
        if (unlocked && newly === c) {
 
            group.classList.add("chapter-just-unlocked");
 
            sessionStorage.removeItem("newlyUnlockedChapter");
 
            setTimeout(() => {
                group.classList.remove("chapter-just-unlocked");
            }, 1300);
        }
    });
};
 
 
/* חידון: תשובה אחת בלחיצה, עם הסבר.
   הכפתור הנכון מסומן ב-data-ok="1", וההסבר ב-data-why על הכרטיס */
const checkQuiz = (button) => {
 
    const card = button.closest(".quiz-card-12");
 
    if (!card) return;
 
    const feedback = card.querySelector(".quiz-feedback");
 
    const isCorrect = button.dataset.ok === "1";
 
    card.querySelectorAll(".quiz-answer").forEach((answer) => {
 
        answer.disabled = true;
 
        if (answer.dataset.ok === "1") answer.classList.add("correct");
    });
 
    if (!isCorrect) button.classList.add("wrong");
 
    feedback.textContent = (isCorrect ? "✓ נכון! " : "לא בדיוק. ") +
        (card.dataset.why || "");
 
    feedback.style.color = isCorrect ? "#2f6b43" : "#a06c62";
};
 
 
/* פס התקדמות קריאה בראש עמודי כל הפרקים */
const initReadBars = () => {
 
    document.querySelectorAll(".sc-new").forEach((page) => {
 
        const bar = page.querySelector(".read-bar i");
 
        if (!bar) return;
 
        page.addEventListener("scroll", () => {
 
            const max = page.scrollHeight - page.clientHeight;
 
            const percent = max > 0
                ? Math.min(100, (page.scrollTop / max) * 100)
                : 0;
 
            bar.style.width = `${percent}%`;
 
        }, { passive: true });
    });
};



/* =========================
   INIT
========================= */

refreshProgressUI();

refreshChaptersUI();

keepChapterOpenAfterFinish();

refreshSubchaptersUI();

refreshChapterLocksUI();
 
initReadBars();

updateChapters();


/* =========================
   GLOBAL FUNCTIONS
========================= */

window.registerUser =
    registerUser;

window.loginUser =
    loginUser;

window.openVideo =
    openVideo;

window.closeVideo =
    closeVideo;

window.goToRegister =
    goToRegister;


window.openSubchapter =
    openSubchapter;

window.closeSubchapter =
    closeSubchapter;

window.finishSubchapter =
    finishSubchapter;


window.openSubchapter12 =
    openSubchapter12;

window.closeSubchapter12 =
    closeSubchapter12;

window.toggleLearningCard =
    toggleLearningCard;

window.checkAnswer12 =
    checkAnswer12;

window.finishSubchapter12 =
    finishSubchapter12;


window.closeSubchapter13 =
    closeSubchapter13;

window.finishSubchapter13 =
    finishSubchapter13;

window.finishSubchapter14 =
    finishSubchapter14;

window.closeSubchapter15 = closeSubchapter15;
window.finishSubchapter15 = finishSubchapter15;

window.closeSubchapterPage = closeSubchapterPage;
window.finishSubchapterPage = finishSubchapterPage;


/* =========================
   נספחים
========================= */
let appendixReturn = null;   // דף הפרק שממנו הגענו לנספח (אם הגענו מקישור בתוך תוכן)

const setAppendixBackLabels = (page, label) => {
    const back = page.querySelector(".back-button");
    const fin = page.querySelector(".finish-learning");
    if (back) {
        if (!back.dataset.orig) back.dataset.orig = back.innerHTML;
        back.innerHTML = label ? `<span>→</span> ${label}` : back.dataset.orig;
    }
    if (fin) {
        if (!fin.dataset.orig) fin.dataset.orig = fin.innerHTML;
        fin.innerHTML = label ? `<span>←</span> ${label}` : fin.dataset.orig;
    }
};

const openAppendix = (id) => {
    const page = document.getElementById(`appendix${id}Page`);
    if (!page) return;
    if (!appendixReturn) setAppendixBackLabels(page, "");
    page.classList.add("show");
    page.scrollTop = 0;
    document.body.style.overflow = "hidden";
};

/* מעבר מתוך תוכן של תת-פרק אל נספח, עם אפשרות חזרה לאותו מקום בדיוק */
const gotoAppendix = (id, link, event) => {
    if (event) { event.preventDefault(); event.stopPropagation(); }
    const from = link.closest(".subchapter-page");
    const page = document.getElementById(`appendix${id}Page`);
    if (!from || !page) return false;
    const lab = from.querySelector(".intro-icon")?.textContent.trim() || "";
    appendixReturn = { page: from, scroll: from.scrollTop };
    from.classList.remove("show");
    setAppendixBackLabels(page, lab ? `חזרה לתת־פרק ${lab}` : "חזרה לתת־פרק");
    page.classList.add("show");
    page.scrollTop = 0;
    document.body.style.overflow = "hidden";
    return false;
};

const closeAppendix = (id) => {
    const page = document.getElementById(`appendix${id}Page`);
    if (!page) return;
    page.classList.remove("show");
    if (appendixReturn) {
        const { page: from, scroll } = appendixReturn;
        appendixReturn = null;
        from.classList.add("show");
        from.scrollTop = scroll;
        setAppendixBackLabels(page, "");
        document.body.style.overflow = "hidden";
        return;
    }
    document.body.style.overflow = "";
};

/* גרף: הסתרה/הצגה של סדרה */
const toggleSeries = (btn, i) => {
    const chart = btn.closest(".bchart");
    const off = btn.getAttribute("aria-pressed") === "true";
    btn.setAttribute("aria-pressed", off ? "false" : "true");
    chart.classList.toggle(`hide-s${i}`, off);
};

/* גרף: בחירת תחום והצגת הנתונים שלו */
const pickGroup = (group) => {
    const chart = group.closest(".bchart");
    chart.querySelectorAll(".bgroup").forEach((g) => g.classList.remove("picked"));
    group.classList.add("picked");
    const vals = group.dataset.vals.split(",");
    const names = [...chart.querySelectorAll(".bl")].map((b) => b.textContent.trim());
    const note = chart.querySelector(".chart-note");
    note.innerHTML = `<strong>${group.dataset.name}</strong>: ` +
        names.map((n, i) => `${n} – <b>${vals[i]}</b>`).join(" · ");
};

/* טבלת החרגות: חיפוש וסינון */
let excChapter = "all";
const filterExc = () => {
    const q = (document.getElementById("excSearch")?.value || "").trim();
    let shown = 0;
    document.querySelectorAll(".exc-list .exc").forEach((card) => {
        const okCh = excChapter === "all" || card.dataset.ch === excChapter;
        const okQ = !q || card.textContent.includes(q);
        const ok = okCh && okQ;
        card.hidden = !ok;
        if (ok) shown++;
    });
    const cnt = document.getElementById("excCount");
    if (cnt) cnt.textContent = `${shown} החרגות`;
    const empty = document.getElementById("excEmpty");
    if (empty) empty.hidden = shown !== 0;
};

const setExcChapter = (btn) => {
    excChapter = btn.dataset.ch;
    document.querySelectorAll(".exc-chips .ec").forEach((b) => b.classList.toggle("on", b === btn));
    filterExc();
};

window.openAppendix = openAppendix;
window.gotoAppendix = gotoAppendix;
window.closeAppendix = closeAppendix;
window.toggleSeries = toggleSeries;
window.pickGroup = pickGroup;
window.filterExc = filterExc;
window.setExcChapter = setExcChapter;


/* =========================
   סיום כל הפרקים + מבחן מסכם
========================= */
const allChaptersDone = () => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    return Object.keys(LAST_SUB).every((c) => isSubDone(user, Number(c), LAST_SUB[c]));
};

const openFinalExam = (event) => {
    if (event) event.preventDefault();
    if (!allChaptersDone()) return false;
    if (FINAL_EXAM_URL && FINAL_EXAM_URL !== "#") {
        window.open(FINAL_EXAM_URL, "_blank", "noopener");
    }
    return false;
};

const closeAllDonePopup = () => {
    const popup = document.getElementById("allDonePopup");
    if (popup) popup.hidden = true;
    document.body.style.overflow = "";
};

const showAllDonePopup = () => {
    const popup = document.getElementById("allDonePopup");
    if (!popup) return;
    popup.hidden = false;
    document.body.style.overflow = "hidden";
};

const initAllDonePopup = () => {
    if (sessionStorage.getItem("allChaptersDone") !== "1") return;
    sessionStorage.removeItem("allChaptersDone");
    if (allChaptersDone()) {
        // פותחים את קטגוריית המבחן המסכם ומציגים את הפופ-אפ
        document.getElementById("chapterGroup6")?.classList.add("open");
        setTimeout(showAllDonePopup, 450);
    }
};

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") { closeAllDonePopup(); appendixReturn = null; }
});

window.openFinalExam = openFinalExam;
window.closeAllDonePopup = closeAllDonePopup;

initAllDonePopup();

window.toggleChapterGroup = toggleChapterGroup;
window.checkQuiz = checkQuiz;
