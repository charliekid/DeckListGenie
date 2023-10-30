const fs = require('fs');
const log4js = require("log4js");
const logger = log4js.getLogger("Reader");
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
    logger.info(`[processDeckList] - START:`);
    let currentCardSection = "Pokemon";
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.split('\n');

    for (const currentLine of lines) {
        logger.info(`[processDeckList] - reading current line`);
        // logger.info(`---Line: ${currentLine}---`);
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
                // logger.info(`qty : ${qty}`);
            }
            // means that there card name has more spaces
            if (splitArray.length > 4) {
                let i = splitArray.length - 1;
                // we know that last 2 elements are the collection#
                // and set so lets deal with that.
                collectionNum = splitArray[i];
                set = splitArray[i - 1];

                // logger.info(`collectionNum : ${collectionNum}`);
                // logger.info(`set : ${set}`);


                // now we know anthing between 1 and (i - 1) is the pokemon card name
                for (let j = 1; j < (i - 1); j++) {
                    cardName += `${splitArray[j]} `;
                }
                // logger.info(`cardName : ${cardName}`);
            } else {
                cardName = splitArray[1];
                set = splitArray[2];
                collectionNum = splitArray[3];
            }
            logger.info(`[processDeckList] - processing ${currentCardSection} card`);
            if (currentCardSection === 'Trainer') {
                incrementOrAddKey2(cardName, tempTrainerList, qty)
                // incrementOrAddKey(cardName, tempTrainerList, qty);
            } else if (currentCardSection === 'Pokemon') {
                if(cardName !== undefined) {
                    pokemonList.push(new Card(currentCardSection, cardName, set, collectionNum, qty));
                }
            } else if (currentCardSection === 'Energy') {
                if (cardName !== undefined) {
                    energyList.push(new Card(currentCardSection, cardName, set, collectionNum, qty));
                }
            }
        }

    }

// process trainer cards
    for (const [cardName, qty] of tempTrainerList) {
        if (cardName !== undefined) {
            trainerList.push(new Card('Trainer', cardName, "NA", "NA", qty));
        }
    }

// pokemon section output

    logger.info(`[processDeckList] - START processing pokemon output`);

    for (const pokemonCard of pokemonList) {
        pokemonQtyOutput += `${pokemonCard.qty}\n`;
        pokemonNameOutput += `${pokemonCard.cardName}\n`;
        pokemonSetOutput += `${pokemonCard.set}\n`;
        pokemonCollectionOutput += `${pokemonCard.collectionNum}\n`;
    }
    logger.info(`[processDeckList] - END processing pokemon output`);

// trainer section output
    logger.info(`[processDeckList] - START processing Trainer output`);
    for (const trainerCard of trainerList) {
        trainerQtyOutput += `${trainerCard.qty}\n`;
        trainerNameOutput += `${trainerCard.cardName}\n`
    }
    logger.info(`[processDeckList] - END processing Trainer output`);
    logger.info(`[processDeckList] - START processing Energy output`);
// energy section output
    for (const energyCard of energyList) {
        energyQtyOutput += `${energyCard.qty}\n`
        energyNameOutput += `${energyCard.cardName}\n`
    }
    // logger.info(pokemonNameOutput);
    logger.info(`[processDeckList] - END processing Energy output`);
}

function incrementOrAddKey2(keyToCheck, map, qty) {
    if (map.has(keyToCheck)) {
        // Key exists, so add x to it
        const currentValue = map.get(keyToCheck);
        map.set(keyToCheck, currentValue + qty);
    } else {
        // Key doesn't exist, so create a new key with the value of x
        map.set(keyToCheck, qty);
    }
}

function incrementOrAddKey(key, aMap, qty) {
    if (aMap.has(key)) {
        // Key exists, so increment the value by one
        logger.info("adding by one");
        aMap.set(key, aMap.get(key) + qty);
    } else {
        // Key does not exist, so add it with a count of 1
        cosole.log("")
        aMap.set(key, qty);
    }
}

function getPokemonNames() {
    return pokemonNameOutput;
}

function getPokemonQty() {
    return pokemonQtyOutput;
}

function getPokemonSet() {
    return pokemonSetOutput;
}

function getPokemonCollection() {
    return pokemonCollectionOutput;
}

function getTrainerQty() {
    return trainerQtyOutput;
}

function getTrainerNames() {
    return trainerNameOutput;
}

function getEnergyQty() {
    return energyQtyOutput;
}

function getEnergyName() {
    return energyNameOutput;
}

function clearOutputEntries() {
    pokemonQtyOutput = "";
    pokemonNameOutput = "";
    pokemonSetOutput = "";
    pokemonCollectionOutput = "";

    trainerQtyOutput = "";
    trainerNameOutput = "";

    energyQtyOutput = "";
    energyNameOutput  = "";

    pokemonList = [];
    tempTrainerList = new Map;
    energyList = [];
    trainerList = [];
}


module.exports = {processDeckList, pokemonQtyOutput , pokemonNameOutput,
    pokemonSetOutput, pokemonCollectionOutput, trainerQtyOutput,
    trainerNameOutput, energyQtyOutput, energyNameOutput, getPokemonNames, getPokemonQty, getPokemonSet, getPokemonCollection,
    getTrainerQty, getTrainerNames, getEnergyName, getEnergyQty, clearOutputEntries}
