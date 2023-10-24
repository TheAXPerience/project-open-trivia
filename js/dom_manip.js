/*
    This file contains the logic to retrieve and insert data to and from the DOM
    The main() function at the bottom provides an example of using functions from fetch_api.js to retrieve data from the API
*/

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
        console.log(`Q: ${q.question}`);
        for (const opt of q.getAnswers()) {
            console.log(`> ${opt}`);
        }
    }
}

// invokes the main function
main();
