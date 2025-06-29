const firebaseConfig = {
    apiKey: "AIzaSyCBY4RuUUsmpoEk6MMa2CLUSnclnEKQLdY",
    authDomain: "notes228web.firebaseapp.com",
    projectId: "notes228web",
    storageBucket: "notes228web.firebasestorage.app",
    messagingSenderId: "57500987004",
    appId: "1:57500987004:web:9e46d1c05f04ade312e3f9",
    measurementId: "G-TWYY0QMQCB"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("The user is logged in on the authentication page:", user.uid);
        window.location.href = '/Notes/headWeb/home.html';
    } else {
        console.log("The user is not logged in on the authentication page.");
    }
});
// ----------------------------------------------------
// Google Login
// ----------------------------------------------------
const googleProvider = new firebase.auth.GoogleAuthProvider();

document.getElementById("googleLogin").addEventListener("click", () => {
    auth.signInWithPopup(googleProvider)
        .then((result) => {
            console.log("The Google sign-in process has been successfully initiated.");
        })
        .catch((error) => {
            console.error("Google login error:", error);
            alertify.error("Failed to sign in with Google.");
        });
});
// ----------------------------------------------------
// Microsoft Login
// ----------------------------------------------------
const microsoftProvider = new firebase.auth.OAuthProvider('microsoft.com');
microsoftProvider.addScope('User.Read');

document.getElementById("microsoftLogin").addEventListener("click", () => {
    auth.signInWithPopup(microsoftProvider)
        .then((result) => {
            console.log("The Microsoft sign-in process has been successfully initiated.");
        })
        .catch((error) => {
            console.error("Microsoft sign-in error:", error);
            alertify.error("Couldn't sign in with Microsoft.");

            if (error.code === 'auth/account-exists-with-different-credential') {
                alertify.error("An account with this email address already exists with a different sign-in method. Try signing in using a different provider.");
            } else if (error.code === 'auth/cancelled-popup-request') {
                console.log("Microsoft sign-in has been canceled by the user.");
            } else if (error.code === 'auth/popup-blocked') {
                alertify.error("Your browser has blocked the Microsoft sign-in pop-up. Please allow pop-ups for this site.");
            }
        });
});
// ----------------------------------------------------
// GitHub Login (Закоментовано)
// ----------------------------------------------------
/*
const githubProvider = new firebase.auth.GithubAuthProvider();

document.getElementById("githubLogin").addEventListener("click", () => {
    auth.signInWithPopup(githubProvider)
        .then((result) => {
            const user = result.user;
            console.log("Logged in with GitHub:", user.displayName || user.email || user.uid);
        })
        .catch((error) => {
            console.error("GitHub login error:", error);
            alertify.error("Unable to log in with GitHub.");

            if (error.code === 'auth/account-exists-with-different-credential') {
                alertify.error("An account with this email address already exists with a different sign-in method. Try signing in using a different provider.");
            } else if (error.code === 'auth/cancelled-popup-request') {
                console.log("GitHub login canceled by user.");
            } else if (error.code === 'auth/popup-blocked') {
                alertify.error("Your browser has blocked the GitHub login pop-up. Please allow pop-ups for this site.");
            }
        });
});
*/

// ----------------------------------------------------
// Twitter Login (Закоментовано)
// ----------------------------------------------------
/*
const twitterProvider = new firebase.auth.TwitterAuthProvider();

document.getElementById("twitterLogin").addEventListener("click", () => {
    auth.signInWithPopup(twitterProvider)
        .then((result) => {
            const user = result.user;
            console.log("Logged in with Twitter:", user.displayName || user.email || user.uid);
        })
        .catch((error) => {
            console.error("Twitter login error:", error);
            alertify.error("Unable to log in with Twitter.");

            if (error.code === 'auth/account-exists-with-different-credential') {
                alertify.error("An account with this email address already exists with a different sign-in method. Try signing in using a different provider.");
            } else if (error.code === 'auth/cancelled-popup-request') {
                console.log("Twitter login canceled by user.");
            } else if (error.code === 'auth/popup-blocked') {
                alertify.error("Your browser blocked the Twitter login pop-up. Please allow pop-ups for this site.");
            }
        });
});
*/
