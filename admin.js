import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

const usersContainer =
document.getElementById("usersContainer");

async function loadUsers(){

    usersContainer.innerHTML = "";

    const querySnapshot =
    await getDocs(collection(db,"users"));

    querySnapshot.forEach((document)=>{

        const user =
        document.data();

usersContainer.innerHTML += `
<div class="user-card">

<h3>${user.fullName}</h3>

<p>דרגה: ${user.rank}</p>

<p>מספר אישי: ${user.personalNumber}</p>

<p>התקדמות: ${user.totalProgress}%</p>

</div>
`;
    });

}

loadUsers();
