let addSpecBtn = document.getElementById("addSpecsBtn");
let specList = document.querySelector(".specList");
let specDiv = document.querySelectorAll(".specDiv")[0];

addSpecBtn.addEventListener("click", function () {
	let newSpecs = specDiv.cloneNode(true);
	let input = newSpecs.getElementsByTagName("input")[0];
	input.value = "";
	specList.appendChild(newSpecs);
});

