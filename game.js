 const question = document.getElementById('question');
 const choice = Array.from(document.getElementsByClassName("choice-text"));
 const progressText = document.getElementById('progessText');
 const scoreText = document.getElementById('score'); 
 const progressBarFull = document.getElementById('progressBarFull');
 const loader = document.getElementById('loader');
 const game = document.getElementById('game');



 let currentQuestion={};
 let acceptingAnswers=false;
 let score=0;
 let questionCounter=0;
 let availableQuestion=[];

 let questions=[];

//  fetch("question.json") // if you have set of question than pass file location//
 fetch("https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple")   
 .then(res => {
         return res.json();
 })
    .then(loadedQuestions => {
         console.log(loadedQuestions.results);
         questions = loadedQuestions.results.map(loadedQuestions => {
             const formattedQuestion = {
                 question:loadedQuestions.question
             };
                const answerChoices = [...loadedQuestions.incorrect_answers];
                formattedQuestion.answer = Math.floor(Math.random() * 3) +1;
                answerChoices.splice(formattedQuestion.answer -1,0,
                    loadedQuestions.correct_answer);

                    answerChoices.forEach((choice, index) => {
                        formattedQuestion["choice" + (index+1)] =choice;
                    })
                    return formattedQuestion;
            });

            
         
        //  questions = loadedQuestions;
         startGame();
 })

 .catch(err => {
     console.error(err);
 });

//Constant//

const CORRECT_BONUS=10;
const MAX_QUESTIONS=5;


startGame=()=>{
    questionCounter=0;
    score=0;
    availableQuestion=[...questions];
    console.log(availableQuestion);
    getNewQuestion();
    game.classList.remove("hidden");
    loader.classList.add("hidden");
};

getNewQuestion = () => {

    if(availableQuestion.length === 0 || questionCounter >= MAX_QUESTIONS)
    {
        localStorage.setItem('mostRecentScore',score);

            //Go to end page

            return window.location.assign('/end.html');
    }

    questionCounter++;
    
    progressText.innerText= "Question " + questionCounter + "/" + MAX_QUESTIONS;
    
    // this is another method for concatenate variable //
    // progressText.innerText=`Question ${questionCounter}/${MAX_QUESTIONS}`;
    
    // Update the ProgressBar // 
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100 }%`;

    const questionIndex = Math.floor(Math.random() * availableQuestion.length );
    currentQuestion=availableQuestion[questionIndex];
    question.innerText = currentQuestion.question;


    choice.forEach(choice =>{
        const number=choice.dataset['number'];
        choice.innerText = currentQuestion['choice'+number];
    });

    availableQuestion.splice(questionIndex,1);
    acceptingAnswers=true;
}; 

choice.forEach(choice =>{
    choice.addEventListener('click',e => {
        if(!acceptingAnswers) return;

        acceptingAnswers=false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        const classToApply = 
        
        selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

        if(classToApply === 'correct')
        {
            incrementScore(CORRECT_BONUS);
        }

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout( () =>{
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        },1000);
    });
    
});

incrementScore = num => {
    score += num;
    scoreText.innerText = score;
};