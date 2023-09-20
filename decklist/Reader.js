const fs = require('fs');
const {split} = require("handlebars-helpers/lib/string");

class  Card {
    constructor(cardType, cardName, set, collectionNum, qty) {
        this._cardType = cardType;
        this._cardName = cardName;
        this._set = set;
        this._collectionNum = collectionNum;
        this._qty = qty;
    }


    get cardType(){
        return this._cardType;
    }

    set cardType(value) {
        this._cardType = value;
    }

    get cardName() {
        return this._cardName;
    }

    set cardName(value) {
        this._cardName = value;
    }

    get set() {
        return this._set;
    }

    set set(value) {
        this._set = value;
    }

    get collectionNum() {
        return this._collectionNum;
    }

    set collectionNum(value) {
        this._collectionNum = value;
    }

    get qty() {
        return this._qty;
    }

    set qty(value) {
        this._qty = value;
    }
}

let pokemonQtyOutput = "";
let pokemonNameOutput = "";
let pokemonSetOutput = "";
let pokemonCollectionOutput = "";

let trainerQtyOutput = "";
let trainerNameOutput = "";

let energyQtyOutput = "";
let energyNameOutput  = "";

let pokemonList = [];
let tempTrainerList = new Map;
let energyList = [];
let trainerList = [];

function processDeckList(filePath) {
    let currentCardSection = "Pokemon";
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.split('\n');

    for (const currentLine of lines) {
        console.log(`---Line: ${currentLine}---`);
        if (currentLine.includes('Pokémon: ')){
            currentCardSection = "Pokemon";
        } else if(currentLine.includes('Trainer: ')) {
            currentCardSection = 'Trainer';
        } else if (currentLine.includes('Energy: ')) {
            currentCardSection = 'Energy';
        } else if (currentLine.includes('Total Cards: ')) {
            currentCardSection = 'END';
        } else {
            const splitArray = currentLine.split(" ");
            let qty;
            let cardName = "";
            let set;
            let collectionNum;
            if (splitArray.length > 0) {
                qty = splitArray[0];
                console.log(`qty : ${qty}`);
            }
            // means that there card name has more spaces
            if (splitArray.length > 4) {
                let i = splitArray.length - 1;
                // we know that last 2 elements are the collection#
                // and set so lets deal with that.
                collectionNum = splitArray[i];
                set = splitArray[i - 1];

                console.log(`collectionNum : ${collectionNum}`);
                console.log(`set : ${set}`);


                // now we know anthing between 1 and (i - 1) is the pokemon card name
                for (let j = 1; j < (i - 1); j++) {
                    cardName += `${splitArray[j]} `;
                }
                console.log(`cardName : ${cardName}`);
            } else {
                cardName = splitArray[1];
                set = splitArray[2];
                collectionNum = splitArray[3];
            }
            if (currentCardSection === 'Trainer') {
                incrementOrAddKey(cardName, tempTrainerList);
            } else if (currentCardSection === 'Pokemon') {
                let aCard = new Card(currentCardSection, cardName, set, collectionNum, qty);
                pokemonList.push(aCard);
            } else if (currentCardSection === 'Energy') {
                energyList.push(new Card(currentCardSection, cardName, set, collectionNum, qty));
            }
        }

    }

// process trainer cards
    for (const [cardName, qty] of tempTrainerList) {
        trainerList.push(new Card('Trainer', cardName, "NA", "NA", qty));
    }

// pokemon section output


    for (const pokemonCard of pokemonList) {
        pokemonQtyOutput += `${pokemonCard.qty}\n`;
        pokemonNameOutput += `${pokemonCard.cardName}\n`;
        pokemonSetOutput += `${pokemonCard.set}\n`;
        pokemonCollectionOutput += `${pokemonCard.collectionNum}\n`;
    }


// trainer section output

    for (const trainerCard of trainerList) {
        trainerQtyOutput += `${trainerCard.qty}\n`;
        trainerNameOutput += `${trainerCard.name}\n`
    }

// energy section output

    for (const energyCard of energyList) {
        energyQtyOutput += `${energyCard.qty}\n`
        energyNameOutput += `${energyCard.name}\n`
    }

    console.log(pokemonNameOutput);
}


function incrementOrAddKey(key, aMap) {
    if (aMap.has(key)) {
        // Key exists, so increment the value by one
        aMap.set(key, aMap.get(key) + 1);
    } else {
        // Key does not exist, so add it with a count of 1
        aMap.set(key, 1);
    }
}



module.exports = {processDeckList, pokemonQtyOutput , pokemonNameOutput,
    pokemonSetOutput, pokemonCollectionOutput, trainerQtyOutput,
    trainerNameOutput, energyQtyOutput, energyNameOutput}
