// the HTML element that holds the trivia game contents
const CARDD = document.getElementById("cardd");

const generateResultsPage = (name, category, score, totalQuestions) => {
    CARDD.innerHTML = `
    <div class="categorydrop center-vertical">
        <h4 class="center">${name} -- ${category}</h4>
    </div>
    <h2>Your score was...</h2>
    <div class="titledrop center-vertical">
        <h1 class="center">${score} / ${totalQuestions}</h1>
    </div>
    <div class="answerdrop">
        <button>Play Again</button>
        <button onclick="generateHomePage()">Return to Home</button>
    </div>`;
}

// code to alert the user about the answer they have chosen
const alertAnswer = (answer) => {
    alert(`You have chosen "${answer}."`);
    generateResultsPage(playerName, category, 8, 16);
}

// code to generate an HTML string of the div class "categorydrop"
const generateCategoryDrop = (name, category) => {
    return `<div class="categorydrop center-vertical"><h4 class="center">${name} -- ${category}</h4></div>`
}

// code to generate an HTML string of the div class "questiondrop"
const generateQuestionDrop = (question) => {
    return `<div class="questiondrop"><h2 class="center">${question}</h2></div>`;
}

// code to generate an HTML string of the div class "answerdrop"
const generateAnswerDrop = (answers) => {
    let ansHTML = "";
    for (const ans of answers) {
        ansHTML += `<button onclick="alertAnswer('${ans}')">${ans}</button>`;
    }
    return `<div class="answerdrop center">${ansHTML}</div>`;
}

// code to generate the question HTML and display it to the user
const generateQuestionPage = (name, category, question) => {
    CARDD.innerHTML = generateCategoryDrop(name, category)
        + generateQuestionDrop(question.question)
        + generateAnswerDrop(question.allAnswers);
}

// code to display the home page (as it is in the prototype)
const generateHomePage = () => {
    CARDD.innerHTML = `
    <div class="titledrop center-vertical">
        <h1 class="center">Open Trivia Game</h1>
    </div>
    <form id="startGame" class="center data-form">
        <div>
            <h3>Name</h3>
            <input id="playerName" type="text" placeholder="Enter name here..."/>
        </div>
        <div>
            <h3>Category</h3>
            <select id="categorySelect">
                <option value="1">All Categories</option>
                <option value="2">Horror</option>
                <option value="3">Disney</option>
                <option value="4">Sports</option>
                <option value="5">Geography</option>
            </select>
        </div>
        <button><b>Start Game</b></button>
    </form>`;

    document.getElementById("startGame").addEventListener('submit', (event) => {
        event.preventDefault();
        const rando = Math.floor(Math.random() * 2);
        const playerName = document.getElementById("playerName").value;
        const category = document.getElementById("categorySelect").value;
        if (rando) {
            generateQuestionPage(playerName, category, multChoiceQuestion);
        } else {
            generateQuestionPage(playerName, category, trueFalseQuestion);
        }
    });
}

// values to play with
const playerName = "John Doe"
const category = "Entertainment: Video Games"
const multChoiceQuestion = {
    question: "Who is the brother of Super Mario?",
    correctAnswer: "Luigi",
    allAnswers: ["Mario", "Luigi", "Wario", "Waluigi"]
}
const trueFalseQuestion = {
    question: "Peach is the princess of the Dandelion Kingdom.",
    correctAnswer: "False",
    allAnswers: ["True", "False"]
}
generateQuestionPage(playerName, category, trueFalseQuestion);
