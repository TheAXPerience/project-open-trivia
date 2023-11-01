/*
    This file contains the logic to retrieve and insert data to and from the DOM
    The main() function at the bottom provides an example of using functions from fetch_api.js to retrieve data from the API
*/

// remove all child nodes of a node
const removeChildren = (node) => {
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}

class TriviaCarousel {
    constructor(mainNode) {
        this.mainNode = mainNode;
        this.nodes = [];
    }

    adjustX() {
        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];
            node.style.transform = `translateX(${i * 100}%)`;
            /*
            if (i === 0) {
                node.style.opacity = "1";
            } else {
                node.style.opacity = "0";
            } */
        }
    }

    addNode(node) {
        this.nodes.push(node);
        this.mainNode.appendChild(node);
        this.adjustX();
    }

    nextNode() {
        setTimeout(() => {
            if (this.nodes.length <= 1) {
                return;
            }
            const removedNode = this.nodes.shift();
            removedNode.style.transform = "translateX(-100%)";
            this.adjustX();
            setTimeout(() => this.mainNode.removeChild(this.mainNode.firstChild), 500);
        }, 100);
    }
}

class TriviaGame {
    constructor() {
        this.clear();
    }

    setupGame(questions, playerName, categoryName, categoryId) {
        this.clear();
        this.questions = questions;
        this.playerName = playerName;
        this.currentCategory = categoryName;
        this.categoryId = categoryId;
    }

    // returns the next question to be asked
    nextQuestion() {
        if (this.currentQuestion >= this.questions.length) {
            return null;
        }
        return this.questions[this.currentQuestion++];
    }

    // adds an answer to the list of answers
    addAnswer(ans) {
        this.answers.push(ans);
    }

    // calculates the player's final score
    calculateScore() {
        if (this.questions.length !== this.answers.length) {
            return -1;
        }
        let score = 0;
        for (let i = 0; i < this.questions.length; i++) {
            if (this.questions[i].correctAnswer === this.answers[i]) {
                score++;
            }
        }
        return score;
    }

    // resets all values to defaults
    clear() {
        this.questions = [];
        this.answers = [];
        this.playerName = "";
        this.currentCategory = "";
        this.categoryId = 0;
        this.currentQuestion = 0;
    }
}

removeChildren(document.querySelector("#main"));
const MAIN_CAROUSEL = new TriviaCarousel(document.querySelector("#main"));
const TRIVIA_GAME = new TriviaGame();

const setupBackdrop = () => {
    const mainNode = document.createElement("section");
    mainNode.classList.add("center");
    mainNode.classList.add("center-vertical");
    mainNode.classList.add("backdrop");
    return mainNode;
}

// use this function to show the player's final score
const setupResults = () => {
    // TODO
    alert(`Category: ${TRIVIA_GAME.currentCategory}\n${TRIVIA_GAME.playerName}'s Score:\n${TRIVIA_GAME.calculateScore()}`);
    setupHome();
};

const clickAnswer = (event) => {
    // add answer to list of answers
    const chosenAnswer = event.target.value;
    TRIVIA_GAME.addAnswer(chosenAnswer);

    // either show next question or show results screen
    const question = TRIVIA_GAME.nextQuestion();
    if (question) {
        setupQuestion(question);
    } else {
        setupResults();
    }
}

// use this function to set up an individual question
const setupQuestion = (question) => {
    const mainNode = setupBackdrop();

    // name and category node
    const nameCatNode = document.createElement("div");
    nameCatNode.classList.add("namecategorydrop");
    nameCatNode.classList.add("center");
    mainNode.appendChild(nameCatNode);

    // name node
    const nameNode = document.createElement("div");
    nameNode.classList.add("namedrop");
    nameNode.classList.add("center-vertical");
    nameCatNode.appendChild(nameNode);

    const nameHeading = document.createElement("h4");
    nameHeading.appendChild(document.createTextNode(TRIVIA_GAME.playerName));
    nameHeading.classList.add("center");
    nameNode.appendChild(nameHeading);

    // category node
    const categoryNode = document.createElement("div");
    categoryNode.classList.add("categorydrop");
    categoryNode.classList.add("center-vertical");
    nameCatNode.appendChild(categoryNode);

    const categoryHeading = document.createElement("h4");
    categoryHeading.appendChild(document.createTextNode(TRIVIA_GAME.currentCategory));
    categoryHeading.classList.add("center");
    categoryNode.appendChild(categoryHeading);

    // question node
    const questionNode = document.createElement("div");
    questionNode.classList.add("questiondrop");
    mainNode.appendChild(questionNode);

    const questionNumber = document.createElement("h4");
    questionNumber.classList.add("center");
    questionNumber.innerHTML = `Question #${TRIVIA_GAME.currentQuestion}`;
    questionNode.appendChild(questionNumber);
    
    const questionHeading = document.createElement("h2");
    questionHeading.classList.add("center");
    // questionHeading.appendChild(document.createTextNode(question.question));
    questionHeading.innerHTML = question.question;
    questionNode.appendChild(questionHeading);

    // answers node
    const answerNode = document.createElement("div");
    answerNode.classList.add("answerdrop");
    answerNode.classList.add("center");
    mainNode.appendChild(answerNode);

    // add answer choices
    for (const ans of question.getAnswers()) {
        const singleAnswerNode = document.createElement("button");
        // singleAnswerNode.appendChild(document.createTextNode(ans));
        singleAnswerNode.innerHTML = ans;
        singleAnswerNode.value = ans;
        answerNode.appendChild(singleAnswerNode);
        singleAnswerNode.addEventListener("click", clickAnswer);
    }

    // add to carousel
    MAIN_CAROUSEL.addNode(mainNode);
    MAIN_CAROUSEL.nextNode();
}

// use this function to start the quiz
const beginQuiz = async (playerName, categoryId, categoryName) => {
    // get the questions and initialize the game
    const questions = await getQuestions(categoryId);
    TRIVIA_GAME.setupGame(questions, playerName, categoryName, categoryId);

    // console.log(TRIVIA_GAME);

    // start the game
    setupQuestion(TRIVIA_GAME.nextQuestion());
};

// callback function on submit when player begins the game
const startGame = (event) => {
    event.preventDefault();
    const name = event.target[0];
    const category = event.target[1];

    /*
    console.log("Player Name: " + name.value);
    console.log("Category ID: " + category.value);
    console.log("Category Name: " + category.options[category.selectedIndex].text);
    */

    beginQuiz(
        name.value,
        parseInt(category.value),
        category.options[category.selectedIndex].text
    );
}

// use this function to setup the home/launch page
const setupHome = async () => {
    const mainNode = setupBackdrop();
    const categoryList = await getCategories();
    categoryList.unshift({id: 0, name: "All Categories"});

    // title node
    const titleNode = document.createElement("div");
    titleNode.classList.add("titledrop");
    titleNode.classList.add("center-vertical");
    mainNode.appendChild(titleNode);

    const titleHeading = document.createElement("h1");
    titleHeading.appendChild(document.createTextNode("Open Trivia Game"));
    titleHeading.classList.add("center");
    titleNode.appendChild(titleHeading);

    // form node
    const formNode = document.createElement("form");
    formNode.classList.add("center");
    formNode.classList.add("data-form");
    mainNode.appendChild(formNode);

    // player name node
    const nameDiv = document.createElement("div");
    formNode.appendChild(nameDiv);

    const nameHeading = document.createElement("h3");
    nameHeading.appendChild(document.createTextNode("Name"));
    nameDiv.appendChild(nameHeading);

    const nameInput = document.createElement("input")
    nameInput.type = "text";
    nameInput.placeholder = "Enter name here...";
    nameDiv.appendChild(nameInput);

    // selector node
    const categoryDiv = document.createElement("div");
    formNode.appendChild(categoryDiv);

    const categoryHeading = document.createElement("h3");
    categoryHeading.appendChild(document.createTextNode("Category"));
    categoryDiv.appendChild(categoryHeading);

    const categorySelect = document.createElement("select");
    categoryDiv.appendChild(categorySelect);

    for (const category of categoryList) {
        const opt = document.createElement("option");
        opt.value = String(category.id);
        opt.appendChild(document.createTextNode(category.name));
        categorySelect.appendChild(opt);
    }

    // form button
    const formButton = document.createElement("input");
    formButton.type = "submit";
    formButton.value = "Start Game";
    formNode.appendChild(formButton);

    // add event listener to form
    formNode.addEventListener("submit", startGame);

    // add to carousel
    MAIN_CAROUSEL.addNode(mainNode);
    MAIN_CAROUSEL.nextNode();
};

// main function
const main = async function() {
    // set up a Now Loading screen
    const loadingNode = setupBackdrop();
    
    // now loading text
    const loadingText = document.createElement("h1");
    loadingText.textContent = "Loading...";
    loadingNode.appendChild(loadingText);
    MAIN_CAROUSEL.addNode(loadingNode);
    
    setTimeout(setupHome, 250);
}
