const startBtn = document.getElementById('start-btn'); //1st
const nameInput = document.getElementById('player-name');
const statusText = document.getElementById('comp-vs');


const rock = document.querySelector('#rock-btn'); //2nd
const paper = document.querySelector('#paper-btn');
const scissor = document.querySelector('#scissor-btn');

const playerScore = document.querySelector('#player-score');//4th
const compScore = document.querySelector('#comp-score'); 
const resultStatus = document.querySelector("#result-status"); 
const highScoreList = document.querySelector('ol');


//URL from Firebase DATA BASE
const DATABASE_URL = `https://firstdatabase-project-default-rtdb.europe-west1.firebasedatabase.app/Highscore.json`; //add .json



const ROCK= 'ROCK'; //3rd
const PAPER= 'PAPER';
const SCISSORS= 'SCISSORS';

let playerChoice;
let compChoice;
let playerWins = 0;
let highscores

startBtn.onclick = function(event) {
    event.preventDefault();
    console.log('loading...')
    const playerName = nameInput.value; //instead of writing the whole code, you can write the nameInput
    statusText.textContent += playerName;
    document.getElementById('name-label').style.display = 'none';
    nameInput.style.display = 'none';
    startBtn.style.display = 'none'; //this removes the display when button is clicked.
}; //1st


rock.addEventListener('click', function(event){
    event.preventDefault();
    playerChoice = ROCK;
    evaluateResult();
}); //3rd
paper.addEventListener('click', function(event){
    event.preventDefault();
    playerChoice = PAPER;
    evaluateResult();
}); //3rd
scissor.addEventListener('click', function(event){
    event.preventDefault();
    playerChoice = SCISSORS;
    evaluateResult();
}); //3rd


async function getHighScoresAndShowThemOnThePage(){
    const res = await getHighscores();
    const highscoresArray = Object.values(res)

    function compareTwoScores(scoreA, scoreB){
        return scoreB.score-scoreA.score
    }

    highscoresArray.sort(compareTwoScores)
    highscores = highscoresArray
    highScoreList.innerHTML = '';
    for(let i=1; i<=5; i++) {
        score = highscoresArray[i-1]
        const highScoreListItem = document.createElement("li");
        highScoreList.appendChild(highScoreListItem);
        highScoreListItem.textContent = score.name + ' ' + score.score
    }
}
getHighScoresAndShowThemOnThePage()

function evaluateResult(){
    compChoice = getComputerChoice()
    let winner;
    if(playerChoice === compChoice) {
        winner= 'It is a draw!'
    } else if (
        playerChoice === ROCK && compChoice === PAPER ||
        playerChoice === SCISSORS && compChoice === ROCK ||
        playerChoice === PAPER && compChoice === SCISSORS
    ) {
        winner = ''
        restartGame()
    } else {
        playerWins++
        if(playerWins > highscores[highscores.length -1].score){
            saveScore({name: nameInput.value, score: playerWins})
        }
        winner = 'You won!'
    } //3rd

    resultStatus.textContent = `Computer picked ${compChoice} and you picked ${playerChoice}! ${winner}`;
    endRound() //4th
};

function getComputerChoice() {
    const randomValue = Math.random();
    if(randomValue < 0.34) {
        return ROCK;
    } else if (randomValue < 0.67) {
        return PAPER;
    } else {
        return SCISSORS;
    }
};

function endRound() {
    playerScore.textContent = playerWins; //so player can see score on screen
};

function getHighscores(){
    const highscores = fetch(DATABASE_URL)
        .then(response => response.json())
        .then(data => {
            return data;
        })
    return highscores;
}

function saveScore(score){
    const options = {
        method: 'POST', 
        body: JSON.stringify(score), 
        headers: {
            'content-type':'application/json; charset=UTF-8'
        }
    }
    fetch(DATABASE_URL, options).then(()=> getHighScoresAndShowThemOnThePage())
}

function restartGame(){
    playerWins = 0;
    playerScore.textContent = playerWins;
    resultStatus.textContent = '';
}
