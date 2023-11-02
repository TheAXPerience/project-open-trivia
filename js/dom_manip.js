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
    addAnswer(ans, time=1) {
        this.answers.push([ans, time]);
    }

    // calculates the player's final score
    calculateScore() {
        if (this.questions.length !== this.answers.length) {
            return -1;
        }
        let score = 0;
        for (let i = 0; i < this.questions.length; i++) {
            if (this.questions[i].correctAnswer === this.answers[i][0]) {
                score += this.answers[i][1];
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

    /*
    const nameNode = document.createElement("div");
    nameNode.classList.add("namedrop");
    nameNode.classList.add("center-vertical");
    nameCatNode.appendChild(nameNode);

    const nameHeading = document.createElement("h4");
    nameHeading.textContent = TRIVIA_GAME.playerName;
    nameHeading.classList.add("center");
    nameNode.appendChild(nameHeading);
    */

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
