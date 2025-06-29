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
const db = firebase.database();

let currentUserDataRef;
let userNotesRef;
let userSettingsRef;

const now = new Date();
const formattedDate = now.toLocaleDateString("uk-UA");
const formattedTime = now.toLocaleTimeString("uk-UA", { hour: '2-digit', minute: '2-digit' });

let openedNoteId = null;
let currentNoteState = "default";

auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("User logged in to the notes page:", user.uid);
        currentUserDataRef = db.ref(`users/${user.uid}`);
        userNotesRef = currentUserDataRef.child('notes');
        userSettingsRef = currentUserDataRef.child('settings');
        userSettingsRef.child('openedNoteId').once('value').then(snapshot => {
            openedNoteId = snapshot.val();
            if (openedNoteId) {
                console.log("A note with the ID opens:", openedNoteId);
                loadAndDisplayNote(openedNoteId);
            } else {
                console.warn("No openedNoteId found in Firebase for this user.");
                window.location.href = "/headWeb/home.html";
            }
        }).catch(error => {
            console.error("Error getting openedNoteId from Firebase:", error);
            window.location.href = "/headWeb/home.html";
        });

    } else {
        console.log("User is not logged in. Redirect to the login page.");
        window.location.href = '/loginMenu/login.html';
    }
});
function loadAndDisplayNote(noteId) {
    if (!userNotesRef) {
        console.error("userNotesRef not initialized. User not logged in or Firebase not ready.");
        return;
    }
    const MAX_TITLE_LENGTH = 250;
    const MAX_TEXT_LENGTH = 10000;
    userNotesRef.child(noteId).once('value').then(snapshot => {
        const noteData = snapshot.val();
        if (noteData) {
            $(".title").val(noteData.title);
            $(".text").val(noteData.text);
            $(".date").text(noteData.date);
            $(".time").text(noteData.time);
            currentNoteState = noteData.state || "default";
            updateButtonStates(currentNoteState);
            $(".title").on("input", function () {
                let newTitle = $(this).val();
                if (newTitle.length > MAX_TITLE_LENGTH) {
                    newTitle = newTitle.substring(0, MAX_TITLE_LENGTH);
                    $(this).val(newTitle);
                    alertify.error(`Max text in title: ${MAX_TITLE_LENGTH} symbols`);
                }
                noteData.title = newTitle;
                userNotesRef.child(noteId).update({ title: noteData.title });
                updateNoteTimestamp(noteId);
            });
            $(".text").on("input", function () {
                let newText = $(this).val();
                if (newText.length > MAX_TEXT_LENGTH) {
                    newText = newText.substring(0, MAX_TEXT_LENGTH);
                    $(this).val(newText);
                    alertify.error(`Max text in title ${MAX_TEXT_LENGTH} symbols`);
                }
                noteData.text = newText;
                userNotesRef.child(noteId).update({ text: noteData.text });
                updateNoteTimestamp(noteId);
            });
        } else {
            console.warn(`Note with ID '${noteId}' not found.`);
            if (userSettingsRef) {
                userSettingsRef.child('openedNoteId').remove();
            }
            window.location.href = "/headWeb/home.html";
        }
    }).catch(error => {
        console.error(`Error loading note ${noteId}:`, error);
        window.location.href = "/headWeb/home.html";
    });
}
function updateNoteTimestamp(noteId) {
    const newNow = new Date();
    const newFormattedDate = newNow.toLocaleDateString("uk-UA");
    const newFormattedTime = newNow.toLocaleTimeString("uk-UA", { hour: '2-digit', minute: '2-digit' });

    $(".date").text(newFormattedDate);
    $(".time").text(newFormattedTime);

    if (userNotesRef) {
        userNotesRef.child(noteId).update({
            date: newFormattedDate,
            time: newFormattedTime
        }).catch(error => {
            console.error("Error updating note time:", error);
        });
    }
}
function updateButtonStates(state) {
    $("#archive").removeClass("active-state");
    $("#delete").removeClass("active-state");
    if (state === "archived") {
        $("#archive").addClass("active-state");
    } else if (state === "deleted") {
        $("#delete").addClass("active-state");
    }
}
$(document).ready(function(){
    $("#close").click(function(){
        if (userSettingsRef) {
            userSettingsRef.child('openedNoteId').remove()
                .then(() => {
                    console.log("openedNoteId cleared from Firebase.");
                    localStorage.removeItem("openedNote");
                    window.location.href = "/headWeb/home.html";
                })
                .catch(error => {
                    console.error("Error clearing openedNoteId from Firebase:", error);
                });
        } else {
            localStorage.removeItem("openedNote");
            window.location.href = "/headWeb/home.html";
        }
    });

    $("#archive").click(function(){
        if (openedNoteId && userNotesRef) {
            let newState;
            if (currentNoteState === "archived") {
                newState = "default";
            } else {
                newState = "archived";
            }
            userNotesRef.child(openedNoteId).update({
                state: newState,
                deletedTimestamp: null
            })
            .then(() => {
                console.log(`The note has been updated to the state: ${newState}`);
                currentNoteState = newState;
                updateButtonStates(currentNoteState);
            })
            .catch(error => {
                console.error("Error changing note status:", error);
            });
        }
    });
    $("#delete").click(function(){
        if (openedNoteId && userNotesRef) {
            let newState;
            let timestampToUpdate = null;
            if (currentNoteState === "deleted") {
                newState = "default";
                timestampToUpdate = null;
            } else {
                newState = "deleted";
                alertify.error("This note will be deleted in 24 hours");
                timestampToUpdate = firebase.database.ServerValue.TIMESTAMP;
            }
            userNotesRef.child(openedNoteId).update({
                state: newState,
                deletedTimestamp: timestampToUpdate
            })
            .then(() => {
                console.log(`The note has been updated to the state: ${newState}`);
                currentNoteState = newState;
                updateButtonStates(currentNoteState);
            })
            .catch(error => {
                console.error("Error changing note state:", error);
            });
        }
    });
});