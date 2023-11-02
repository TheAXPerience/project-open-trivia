// use this function to setup the home/launch page
async function setupHome() {
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
};

// use this function to show the player's final score
function setupResults() {
    const mainNode = setupBackdrop();

    // name category
    mainNode.appendChild(setupCategoryNode());

    // carousel!
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

// use this function to start the quiz
async function beginQuiz (playerName, categoryId, categoryName) {
    // get the questions and initialize the game
    const questions = await getQuestions(categoryId);
    TRIVIA_GAME.setupGame(questions, playerName, categoryName, categoryId);

    // start the game
    setupQuestion(TRIVIA_GAME.nextQuestion());
};

// callback function on submit when player begins the game
function startGame(event) {
    event.preventDefault();
    const name = event.target[0];
    const category = event.target[1];

    beginQuiz(
        name.value,
        parseInt(category.value),
        category.options[category.selectedIndex].text
    );
}

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