/*
    This file contains the logic to retrieve and insert data to and from the DOM
    The main() function at the bottom provides an example of using functions from fetch_api.js to retrieve data from the API
*/

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

const MAIN_NODE = document.querySelector("#main");
const TRIVIA_GAME = new TriviaGame();

// remove all child nodes of a node
const removeChildren = (node) => {
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}

// use this function to show the player's final score
const setupResults = () => {

};

// use this function to set up an individual question
const setupQuestion = (question) => {

}

// use this function to start the quiz
const beginQuiz = async (playerName, categoryId, categoryName) => {
    const questions = await getQuestions(categoryId);

    TRIVIA_GAME.setupGame(questions, playerName, categoryName, categoryId);
    console.log(TRIVIA_GAME);

    // TODO: actually start the game
};

// callback function on submit when player begins the game
const startGame = (event) => {
    event.preventDefault();
    const name = event.target[0];
    const category = event.target[1];
    console.log("Player Name: " + name.value);
    console.log("Category ID: " + category.value);
    console.log("Category Name: " + category.options[category.selectedIndex].text);

    beginQuiz(name.value, parseInt(category.value), category.options[category.selectedIndex].text);
}

// use this function to setup the home/launch page
const setupHome = async () => {
    removeChildren(MAIN_NODE);
    const categoryList = await getCategories();
    categoryList.unshift({id: 0, name: "All Categories"});

    // title node
    const titleNode = document.createElement("div");
    titleNode.classList.add("titledrop");
    titleNode.classList.add("center-vertical");
    MAIN_NODE.appendChild(titleNode);

    const titleHeading = document.createElement("h1");
    titleHeading.appendChild(document.createTextNode("Open Trivia Game"));
    titleHeading.classList.add("center");
    titleNode.appendChild(titleHeading);

    // form node
    const formNode = document.createElement("form");
    formNode.classList.add("center");
    formNode.classList.add("data-form");
    MAIN_NODE.appendChild(formNode);

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
};

// main function
const main = async function() {
    const categories = await getCategories();
    categories.unshift({id: 0, name: "All Categories"});
    console.log(categories);

    // get a random category to check it out
    const category = categories[Math.floor(Math.random() * categories.length)];

    const questions = await getQuestions(category.id, NUMBER_QUESTIONS);
    console.log(`\nChosen category: ${category.name}`);
    for (const q of questions) {
        console.log(`Q: ${q.question}`);
        for (const opt of q.getAnswers()) {
            console.log(`> ${opt}`);
        }
    }
}

setupHome();
