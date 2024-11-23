/*
function loadImages() {
var xmlhttp = new XMLHttpRequest();
xmlhttp.onload = function () {
if (!this.responseText) console.error("Could not fetch image data");
var container = document.getElementById("infotabs_pics");
var array = this.responseText.split("\n"),
i = 0;

function waitNextImage(link) {
setTimeout(function () {
if (link) {
  link.style.visibility = "visible";
  link.style.opacity = 1;
}
i++;
loadNextImage();
}, 100);
}

function loadNextImage() {
if (i >= array.length) return;
if (!array[i]) {
waitNextImage();
return;
}
var image = new Image();
image.src = "/archives/images/" + encodeURI(array[i]);
image.onload = function () {
var link = document.createElement("a");
link.classList.add("infotab-pic-link");
link.target = "_blank";
link.href = image.src;
link.style.visibility = "hidden";
link.style.opacity = 0;
link.style.backgroundImage = "url('" + link.href + "')";
container.appendChild(link);
waitNextImage(link);
};
image.onerror = function () {
waitNextImage();
};
}

loadNextImage();
};
xmlhttp.open("GET", "/archives/images.txt", true);
xmlhttp.send();
}
*/
document.addEventListener('DOMContentLoaded', function () {
  stars_start();
  document.getElementById('infotabs_container').removeAttribute('hidden');
  // document.getElementById('infotabs_pics_tab').addEventListener('click', loadImages, {once: true});
});
