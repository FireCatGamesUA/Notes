let state = 1;
document.getElementById("img").style.filter = "grayscale(0) blur(0px)";
document.getElementById("img").style.transform = "scale(1)";
document.getElementById("img").style.opacity = "1";
document.getElementById("svg").style.filter = "blur(0px)";
document.getElementById("svg").style.opacity = "1";
setTimeout(function() {
  window.location.href = "/Notes/headWeb/home.html";
}, 3000);
