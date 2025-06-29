const firebaseConfig = {
    apiKey: "AIzaSyCBY4RuUUsmpoEk6MMa2CLUSnclnEKQLdY",
    authDomain: "notes228web.firebaseapp.com",
    projectId: "notes228web",
    storageBucket: "notes228web.appspot.com",
    messagingSenderId: "57500987004",
    appId: "1:57500987004:web:9e46d1c05f04ade312e3f9",
    measurementId: "G-TWYY0QMQCB"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();
$("#exit").click(function() {
    auth.signOut()
        .then(() => {
            console.log("User has successfully logged out.");
            window.location.href = "/Notes/headWeb/home.html";
        })
        .catch((error) => {
            console.error("Logout error:", error);
        });
});
$("#delete").click(function() {
    const user = auth.currentUser;

    if (user) {
        if (confirm("Delete account?")) {
            const userId = user.uid;
            db.ref('users/' + userId).remove()
                .then(() => {
                    console.log("User data deleted from database.");
                    return user.delete();
                })
                .then(() => {
                    console.log("User account deleted from Firebase Auth.");
                    window.location.href = "/Notes/headWeb/home.html";
                })
                .catch((error) => {
                    console.error("Error during account deletion:", error);
                    if (error.code === 'auth/requires-recent-login') {
                        alertify.error("Please re-login before deleting your account.");
                    }
                });
        } else {
            console.log("Account deletion canceled by user.");
        }
    } else {
        console.log("No user is currently signed in.");
    }
});
$("#leave").click(function() {
    window.location.href = "/Notes/headWeb/home.html";
});
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("User is logged in:", user.email);
    } else {
        console.log("User is not logged in.");
        window.location.href = '/Notes/loginMenu/login.html';
    }
});
