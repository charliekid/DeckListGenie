// Declaration
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

// Expression; the class is anonymous but assigned to a variable
const Card = class {
    constructor(cardName, set, collectionNum, qty) {

        this._cardName = cardName;
        this._set = set;
        this._collectionNum = collectionNum;
        this._qty = qty;
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
};

// Expression; the class has its own name
// not really going to use. more of an example of how to declare and
// initialize an object of this the Card class
const CardExample = class CardExample {
    constructor(cardName, set, collectionNum, qty) {
        this.height = height;
        this.width = width;
    }
};
