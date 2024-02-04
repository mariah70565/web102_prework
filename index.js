/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {

    // loop over each item in the data
    for (let i = 0; i < games.length; i++) {
        // create a new div element, which will become the game card
        let game = document.createElement("div");
        
        // add the class game-card to the list
        game.classList.add("game-card");

        // set the inner HTML using a template literal to display some info 
        // about each game
        // TIP: if your images are not displaying, make sure there is space
        // between the end of the src attribute and the end of the tag ("/>")
        game.innerHTML = `
            <img src = "${games[i].img}" class="game-img">
            <h3> ${games[i].name} <\h3>
            <p> ${games[i].description} <\p>`;

        // append the game to the games-container
        gamesContainer.append(game);
    }

}

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games
addGamesToPage(GAMES_JSON);

/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const totalContributions = GAMES_JSON.reduce( (acc, game) => {
    return acc + game.backers;
}, 0);

// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = `<p> ${totalContributions.toLocaleString()} <\p>`


// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");
const totalRaised = GAMES_JSON.reduce( (acc, game) => {
    return acc + game.pledged;
}, 0);

// set inner HTML using template literal
raisedCard.innerHTML = `<p> ${totalRaised.toLocaleString()} <\p>`


// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
gamesCard.innerHTML = `<p> ${GAMES_JSON.length} <\p>`

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// added
const searchInput = document.getElementById("game-search");
const searchIcon = document.getElementById("search-icon");
const errorMsg = document.getElementById("search-result");
function filterSearched() {
    const searched = searchInput.value.toLowerCase();
    let listOfGamesSearched = GAMES_JSON.filter((game) => {
        return game.name.toLowerCase().includes(searched);
    });

    deleteChildElements(gamesContainer);
    deleteChildElements(errorMsg);
    
    if (listOfGamesSearched.length > 0) {
        addGamesToPage(listOfGamesSearched);
    }
    else {
        const emptySearchMsg = `<p> Uh oh! There are no games that match your search. Please check your spelling and try again!`;
        const emptySearchDesc = document.createElement("p");
        emptySearchDesc.innerHTML = emptySearchMsg;
        errorMsg.appendChild(emptySearchDesc);
    }
}

// searchInput.addEventListener("keyup", filterSearched);
searchIcon.addEventListener("click", filterSearched);

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);
    deleteChildElements(errorMsg);

    // use filter() to get a list of games that have not yet met their goal
    let listOfGamesNotReached = GAMES_JSON.filter ( (game) => {
        return game.goal > game.pledged;
    });

    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(listOfGamesNotReached);
    // console.log(listOfGamesNotReached.length);
}
// filterUnfundedOnly()
// console.log("Function executed"); 

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);
    deleteChildElements(errorMsg);

    // use filter() to get a list of games that have met or exceeded their goal
    let listOfGamesReached = GAMES_JSON.filter ( (game) => {
        return game.goal <= game.pledged;
    });

    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(listOfGamesReached);
    // console.log(listOfGamesReached.length);
}
// filterFundedOnly()
// console.log("Function executed"); 

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);
    deleteChildElements(errorMsg);

    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON)
    // console.log(GAMES_JSON.length);
}
// showAllGames()
// console.log("Function executed"); 

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use FILTER or reduce to count the number of unfunded games
let listOfUnfundedGames = GAMES_JSON.filter ( (game) => {
    return game.goal > game.pledged;
});
let numUnfundedGames = listOfUnfundedGames.length

// create a string that explains the number of unfunded games using the ternary operator
const displayStr = `<p> A total of $${totalRaised.toLocaleString()} has been raised for ${GAMES_JSON.length} games.
                    Currently, ${numUnfundedGames} ${numUnfundedGames === 1 ? "game remains" : "games remain"} unfunded.
                    We need your help to fund these amazing games!`;

// create a new DOM element containing the template string and append it to the description container
const description = document.createElement("p");
description.innerHTML = displayStr;
descriptionContainer.appendChild(description);

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
const {name: name1, description: desc1, pledged: pledged1, goal: goal1, backers: backers1, img: img1} = GAMES_JSON[0];
const {name: name2, description: desc2, pledged: pledged2, goal: goal2, backers: backers2, img: img2} = GAMES_JSON[1];
// console.log(name1)
// console.log(name2)

// create a new element to hold the name of the top pledge game, then append it to the correct element
const game1 = document.createElement("p");
game1.innerHTML = name1;
firstGameContainer.appendChild(game1);

// do the same for the runner up item
const game2 = document.createElement("p");
game2.innerHTML = name2;
secondGameContainer.appendChild(game2);