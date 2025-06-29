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

let lastId = 1;

const loginLink = document.getElementById('login');
const userAvatar = document.getElementById('avatarka');

auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("User logged in on the home page:", user.uid, user.displayName);
        currentUserDataRef = db.ref(`users/${user.uid}`);
        userNotesRef = currentUserDataRef.child('notes');
        userSettingsRef = currentUserDataRef.child('settings');
        if (loginLink) loginLink.style.display = 'none';
        if (userAvatar) userAvatar.style.display = 'block';
        if (userAvatar) {
            let imageUrl = '';
            if (user.photoURL) {
                imageUrl = user.photoURL;
            } else {
                imageUrl = '/Notes/resourses/img/user-solid.png';
            }

            userAvatar.style.backgroundImage = `url('${imageUrl}')`;
            userAvatar.style.backgroundSize = 'cover';
            userAvatar.style.backgroundPosition = 'center';
            userAvatar.style.backgroundRepeat = 'no-repeat';
            userAvatar.title = user.displayName || 'Фото профілю користувача';
        }
        loadUserNotes();
        checkAndDeleteOldNotes();
    } else {
        console.log("User is not logged in on the main page.");
        if (loginLink) loginLink.style.display = 'block';
        if (userAvatar) userAvatar.style.display = 'none';
        $('.default, .archived, .deleted').empty();
        window.location.href = '/Notes/loginMenu/login.html';
    }
});
function saveNote(id, noteData) {
    if (userNotesRef) {
        userNotesRef.child(id).set(noteData);
    } else {
        console.error("User is not logged in, unable to save note.");
    }
}
function loadUserNotes() {
    $('.default, .archived, .deleted').empty();
    lastId = 1;
    if (!userNotesRef) {
        console.log("User is not logged in, notes are not loading.");
        return;
    }
    userNotesRef.once("value").then(snapshot => {
        const notes = snapshot.val() || {};

        if (Object.keys(notes).length === 0) {
            console.log("There are no notes for this user. Creating the first note.");
            const firstNote = {
                title: "Title",
                text: "Some text...",
                state: "default",
                date: formattedDate,
                time: formattedTime,
                deletedTimestamp: null
            };
            saveNote("note1", firstNote);
            createNote("note1", firstNote.title, firstNote.text, firstNote.state);
        } else {
            console.log("Loading notes for the user:", Object.keys(notes).length);
            for (const noteId in notes) {
                const note = notes[noteId];
                if (!note.title || note.title.trim() === "") note.title = "Title";
                if (!note.text || note.text.trim() === "") note.text = "Some text...";
                const numericId = parseInt(noteId.replace("note", ""));
                if (!isNaN(numericId) && numericId >= lastId) lastId = numericId + 1;
                createNote(noteId, note.title, note.text, note.state);
            }
        }
    }).catch(error => {
        console.error("Error loading user notes:", error);
    });
}
function checkAndDeleteOldNotes() {
    if (!userNotesRef) {
        console.warn("The user is not logged in or the userNotesRef is not ready to check for deleted notes.");
        return;
    }
    const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
    userNotesRef.once("value").then(snapshot => {
        const notes = snapshot.val() || {};
        let deletedCount = 0;
        let notesToRemoveFromDOM = [];

        for (const noteId in notes) {
            const note = notes[noteId];
            if (note.state === "deleted" && note.deletedTimestamp) {
                if (note.deletedTimestamp < twentyFourHoursAgo) {
                    notesToRemoveFromDOM.push(noteId);
                    userNotesRef.child(noteId).remove()
                        .then(() => {
                            console.log(`Note '${noteId}' has been deleted from the database (24 hours have passed).`);
                            deletedCount++;
                            $(`#${noteId}`).remove();
                        })
                        .catch(error => {
                            console.error(`Error deleting note '${noteId}' from database:`, error);
                        });
                }
            }
        }
        if (deletedCount > 0) {
            console.log(`${deletedCount} old deleted notes have been cleared.`);
        }
    }).catch(error => {
        console.error("Error while checking old deleted notes:", error);
    });
}
function truncateText(text, maxLength) {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}
function createNote(id, title = "Title", text = "Some text...", state = "default") {
    const shortTitle = truncateText(title, 15);
    const shortText = truncateText(text, 70);
    $(`#${id}`).remove();
    $(`.${state}`).append(`<div class="note" id="${id}"><p class="title">${shortTitle}</p><p class="text">${shortText}</p></div>`);
    $(`#${id}`).off('click').click(function () {
        if (userSettingsRef) {
            userSettingsRef.child('openedNoteId').set(id)
                .then(() => {
                    console.log(`openedNoteId '${id}' saved in Firebase.`);
                    window.location.href = "/Notes/notesMenu/menu.html";
                })
                .catch(error => {
                    console.error("Error saving openedNoteId to Firebase:", error);
                });
        } else {
            console.error("User is not logged in, cannot save openedNoteId.");
        }
    });
}
$(document).ready(function () {
    $("#createB").click(function () {
        if (!auth.currentUser) {
            return;
        }
        const id = `note${lastId++}`;
        const note = {
            title: "Title",
            text: "Some text...",
            state: "default",
            date: formattedDate,
            time: formattedTime,
            deletedTimestamp: null
        };
        saveNote(id, note);
        createNote(id, note.title, note.text, note.state);
    });
    $("#avatarka").click(function(){
        window.location.href = "/Notes/settingsMenu/settings.html";
    });
    $("#notesB").click(function () {
        $(".default").css("display", "grid");
        $(".archived, .deleted").css("display", "none");
        $("#notesB").addClass("active");
        $("#archiveB, #binB").removeClass("active");
        $("#createB").css({"bottom":"16px"});
    });

    $("#archiveB").click(function () {
        $(".archived").css("display", "grid");
        $(".default, .deleted").css("display", "none");
        $("#archiveB").addClass("active");
        $("#notesB, #binB").removeClass("active");
        $("#createB").css({"bottom":"-71px"});
    });

    $("#binB").click(function () {
        $(".deleted").css("display", "grid");
        $(".default, .archived").css("display", "none");
        $("#binB").addClass("active");
        $("#notesB, #archiveB").removeClass("active");
        $("#createB").css({"bottom":"-71px"});
    });
});
