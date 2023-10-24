/* 
    This file contains the logic to fetch data from the Open Trivia Database API
*/

const NUMBER_QUESTIONS = 10;

// shuffle algorithm: for each array element, swap with a random other array element
const shuffle = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        const j = Math.floor(Math.random() * arr.length);
        const tmp = arr[j];
        arr[j] = arr[i];
        arr[i] = tmp;
    }
    return arr;
}

// parse a question returned from JSON into a class object
class Question {
    constructor(question) {
        this.question = question.question;
        this.correctAnswer = (question.correct_answer);
        this.allAnswers = [this.correctAnswer];
        for (const ans of question.incorrect_answers) {
            this.allAnswers.push((ans));
        }
        this.category = (question.category);
        this.type = (question.type);
        this.difficulty = (question.difficulty);
    }

    getAnswers() {
        // return a shuffled copy of allAnswers
        return shuffle(this.allAnswers.slice());
    }
}

// code to get categories from API
const getCategories = async () => {
    let data = await fetch("https://opentdb.com/api_category.php")
        .then(response => response.text());
    data = JSON.parse(data);
    return data.trivia_categories;
}

// code to get questions from the API
// able to pass in a category ID and a number of questions
// defaults to all categories and 10 questions
// able to add difficulty, type (multiple choice/true and false), and encoding
const getQuestions = async (category=0, numQuestions=NUMBER_QUESTIONS) => {
    const url = `https://opentdb.com/api.php?amount=${numQuestions}&category=${category}`;
    let data = await fetch(url)
        .then(response => response.text());
    data = JSON.parse(data);
    const questions = [];
    for (const question of data.results) {
        questions.push(new Question(question));
    }
    return questions;
}
