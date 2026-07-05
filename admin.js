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

        <div class="admin-user-card">

            <h2>${user.rank} ${user.fullName}</h2>

            <p><b>מספר אישי:</b> ${user.personalNumber}</p>

            <p><b>התקדמות:</b> ${user.totalProgress}%</p>

        </div>

        `;
    });

}

loadUsers();