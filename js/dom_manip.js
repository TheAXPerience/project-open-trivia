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

class ResultsCarousel {
    constructor() {
        this.node = document.createElement("section");
        this.node.classList.add("carousel");

        const leftButton = document.createElement("button");
        leftButton.classList.add("carousel-button");
        leftButton.classList.add("button-left");
        leftButton.addEventListener("click", () => this.moveRight(-1));
        this.node.appendChild(leftButton);

        const rightButton = document.createElement("button");
        rightButton.classList.add("carousel-button");
        rightButton.classList.add("button-right");
        rightButton.addEventListener("click", () => this.moveRight(1));
        this.node.appendChild(rightButton);

        this.currentIndex = 0;
        this.elements = [];
    }

    addElement(element) {
        this.elements.push(element);
        this.node.appendChild(element);
        this.applyTransform();
    }

    addScore(name, score) {
        const scoreNode = document.createElement("div");
        scoreNode.classList.add("carousel-item");
        scoreNode.classList.add("carousel-txt");

        // announcing score
        const headingNode = document.createElement("h3");
        headingNode.textContent = `${name}'s Score:`;
        headingNode.style.fontSize = "1.5rem";
        scoreNode.appendChild(headingNode);

        // score
        const scoreHeadingNode = document.createElement("h1");
        scoreHeadingNode.textContent = `${score}`;
        scoreHeadingNode.style.fontSize = "3.5rem";
        scoreNode.appendChild(scoreHeadingNode);

        this.addElement(scoreNode);
    }

    addQuestionAnswer(qno, question, guess, answer) {
        const questionNode = setupQuestionNode(qno, question);
        questionNode.classList.add("carousel-item");
        questionNode.classList.add("carousel-txt");
        questionNode.classList.remove("questiondrop");

        const guessNode = document.createElement("h3");
        const answerNode = document.createElement("h3");
        guessNode.innerHTML = `Your Answer: ${guess}`;
        answerNode.innerHTML = `Correct Answer: ${answer}`;
        guessNode.style.color = "darkblue";
        if (guess === answer) {
            answerNode.style.color = "darkgreen";
        } else {
            answerNode.style.color = "darkred";
        }
        
        questionNode.appendChild(guessNode);
        questionNode.appendChild(answerNode);

        this.addElement(questionNode);
    }

    clearElements() {
        this.elements = [];
    }

    applyTransform() {
        for (let i = 0; i < this.elements.length; i++) {
            const item = this.elements[i];
            item.style.transform = `translateX(${(-this.currentIndex)*100}%)`;
            if (i === this.currentIndex) {
                item.style.opacity = "1";
            } else {
                item.style.opacity = "0";
            }
        }
    }

    moveRight(x) {
        this.currentIndex += x;
        while (this.currentIndex < 0) {
            this.currentIndex += this.elements.length;
        }
        this.currentIndex %= this.elements.length;
        this.applyTransform();
    }
}

removeChildren(document.querySelector("#main"));
const MAIN_CAROUSEL = new TriviaCarousel(document.querySelector("#main"));
const TRIVIA_GAME = new TriviaGame();

function setupBackdrop() {
    const mainNode = document.createElement("section");
    mainNode.classList.add("center");
    mainNode.classList.add("center-vertical");
    mainNode.classList.add("backdrop");
    return mainNode;
}

function setupCategoryNode() {
    const nameCatNode = document.createElement("div");
    nameCatNode.classList.add("namecategorydrop");
    nameCatNode.classList.add("center");

    const nameNode = document.createElement("div");
    nameNode.classList.add("namedrop");
    nameNode.classList.add("center-vertical");
    nameCatNode.appendChild(nameNode);

    const nameHeading = document.createElement("h4");
    nameHeading.appendChild(document.createTextNode(TRIVIA_GAME.playerName));
    nameHeading.classList.add("center");
    nameNode.appendChild(nameHeading);

    const categoryNode = document.createElement("div");
    categoryNode.classList.add("categorydrop");
    categoryNode.classList.add("center-vertical");
    nameCatNode.appendChild(categoryNode);

    const categoryHeading = document.createElement("h4");
    categoryHeading.appendChild(document.createTextNode(TRIVIA_GAME.currentCategory));
    categoryHeading.classList.add("center");
    categoryNode.appendChild(categoryHeading);

    return nameCatNode;
}

// use this function to show the player's final score
function setupResults() {
    const mainNode = setupBackdrop();

    // name category
    mainNode.appendChild(setupCategoryNode());

    // TODO: carousel!
    const carousel = new ResultsCarousel();

    // first page: name and score
    carousel.addScore(TRIVIA_GAME.playerName, TRIVIA_GAME.calculateScore());

    // rest of pages: question, guess, answer
    for (let i = 0; i < TRIVIA_GAME.questions.length; i++) {
        carousel.addQuestionAnswer(
            i+1,
            TRIVIA_GAME.questions[i].question, 
            TRIVIA_GAME.answers[i],
            TRIVIA_GAME.questions[i].correctAnswer
        );
    }

    // add to main node
    mainNode.appendChild(carousel.node);

    // return to home button
    const answerdrop = document.createElement("div");
    answerdrop.classList.add("answerdrop");
    mainNode.appendChild(answerdrop);

    const homeButton = document.createElement("button");
    homeButton.textContent = "Return to Home Menu";
    homeButton.addEventListener("click", setupHome);
    answerdrop.appendChild(homeButton);

    MAIN_CAROUSEL.addNode(mainNode);
    MAIN_CAROUSEL.nextNode();    
};

function clickAnswer(event) {
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

function setupQuestionNode(qno, question) {
    const questionNode = document.createElement("div");
    questionNode.classList.add("questiondrop");

    const questionNumber = document.createElement("h4");
    questionNumber.classList.add("center");
    questionNumber.innerHTML = `Question #${qno}`;
    questionNode.appendChild(questionNumber);
    
    const questionHeading = document.createElement("h2");
    questionHeading.classList.add("center");
    questionHeading.innerHTML = question;
    questionNode.appendChild(questionHeading);

    return questionNode;
}

// use this function to set up an individual question
function setupQuestion(question) {
    const mainNode = setupBackdrop();

    // name and category node
    mainNode.appendChild(setupCategoryNode());

    // question node
    const questionNode = setupQuestionNode(TRIVIA_GAME.currentQuestion, question.question);
    mainNode.appendChild(questionNode);

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
function startGame(event) {
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
function main() {
    // set up a Now Loading screen
    const loadingNode = setupBackdrop();
    
    // now loading text
    const loadingText = document.createElement("h1");
    loadingText.textContent = "Now Loading...";
    loadingNode.appendChild(loadingText);
    MAIN_CAROUSEL.addNode(loadingNode);
    
    setTimeout(setupHome, 250);
}
