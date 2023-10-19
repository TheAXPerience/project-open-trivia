const NUMBER_QUESTIONS = 10;

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
    return data.results;
}

// main function to run when this is run in Node.js
const main = async function() {
    const categories = await getCategories();
    categories.unshift({id: 0, name: "All Categories"});
    console.log(categories);

    // get a random category to check it out
    const category = categories[Math.floor(Math.random() * categories.length)];

    const questions = await getQuestions(category.id, NUMBER_QUESTIONS);
    console.log(`\nChosen category: ${category.name}`);
    for (const q of questions) {
        console.log(`Q: ${decodeURI(q.question)}`);
        for (const opt of q.incorrect_answers) {
            console.log(`> ${decodeURI(opt)}`);
        }
        console.log(`A> ${decodeURI(q.correct_answer)}`);
    }
}
// invokes the main function
main();