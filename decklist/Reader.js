const fs = require('fs');
const readlineSync = require('readline-sync');

const filePath = 'path/to/your/file.txt';

const fileContent = fs.readFileSync(filePath, 'utf-8');
const lines = fileContent.split('\n');


let pokemonList = [];
let tempTrainerList = new Map;
let energyList = [];
let trainerList = [];

let currentCardSection = "Pokemon";

for (const currentLine of lines) {
    console.log(`Line: ${currentLine}`);
    if(currentLine.includes('Trainer: ') ) {
        currentCardSection = 'Trainer';
    } else if(currentLine.includes('Energy: ')) {
        currentCardSection = 'Energy';
    } else if(currentLine.includes('Total Cards: ')) {
        currentCardSection = 'END';
    }
    const splitArray = currentLine.split(" ");
    let qty;
    let cardName = "";
    let set;
    let collectionNum;
    if(splitArray.length > 0) {
        qty = splitArray[0];
    }
    // means that there card name has more spaces
    if(splitArray.length > 4) {
        let i = splitArray - 1;
        // we know that last 2 elements are the collection#
        // and set so lets deal with that.
        collectionNum = splitArray[i];
        set = splitArray[i-1];

        // now we know anthing between 1 and (i - 1) is the pokemon card name
        for(let j = 1 ; j < (i - 1); j++) {
            cardName += splitArray[j];
        }
    }
    if(currentCardSection.equals('Trainer')) {
        incrementOrAddKey(cardName, tempTrainerList);
    } else if(currentCardSection.equals('Pokemon')) {
        pokemonList.push(new Card(currentCardSection, cardName, set, collectionNum, qty));
    } else if(currentCardSection.equals('Energy')) {
        energyList.push(new Card(currentCardSection, cardName, set, collectionNum, qty));
    }

}

// process trainer cards
for (const [cardName, qty] of tempTrainerList) {
    trainerList.push(new Card('Trainer', cardName, "NA", "NA", qty));
}

// pokemon section output
let pokemonQtyOutput = "";
let pokemonNameOutput = "";
let pokemonSetOutput = "";
let pokemonCollectionOutput = "";

for(const pokemonCard of pokemonList) {
    pokemonQtyOutput += `${pokemonCard.qty()}\n`;
    pokemonNameOutput += `${pokemonCard.cardName()}\n`;
    pokemonSetOutput += `${pokemonCard.set()}\n`;
    pokemonCollectionOutput += `${pokemonCard.collectionNum()}\n`;
}


// trainer section output
let trainerQtyOutput = "";
let trainerName = "";

// energy section output
let energyQty = "";
let energyName = "";



function incrementOrAddKey(key, aMap) {
    if (aMap.has(key)) {
        // Key exists, so increment the value by one
        aMap.set(key, aMap.get(key) + 1);
    } else {
        // Key does not exist, so add it with a count of 1
        aMap.set(key, 1);
    }
}