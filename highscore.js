const highScoresList = document.getElementById("highScoresList");
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

highScoresList.innerHTML = highScores.map( score => {
// console.log(score.name +"-"+ score.score);
return `<li class="high-score">${score.name} - ${score.score}</li>`; // Another Way to map data from data
})
.join("");