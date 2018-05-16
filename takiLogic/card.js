/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

import CardsOnTable from "./cardsOnTable";
import Deck from "./deck";
import Game from "./game";
import Player from "./player";

export default class Card {

    static NUMBER_CARD = ["1", "3", "4", "5", "6", "7", "8", "9"];

    static SpecialCard = {
        TAKI: "taki",
        STOP: "stop",
        CHANGE_COLOR: "change color",
        PLUS: "plus",
        // TODO advance game
        PLUS_2: "+2",
        SUPER_TAKI: "super taki"
    };

    // TODO refactor to a new class
    static Color = {
        allColors: ["red", "green", "blue", "yellow"],

        getRandomColor  () {
            const randomIndex = Math.floor((Math.random() * 10) % Object.keys(Card.Color.allColors).length);
            return Card.Color.allColors[randomIndex];
        }
    };

    static nextFreeCardId = 0;

    constructor(color, value) {
        this.cardId = Card.nextFreeCardId++;
        this.cardValue = value;
        this.cardColor = color;
    }

    getId() {
        return this.cardId;
    }

    getColor() {
        return this.cardColor;
    }

    getValue() {
        return this.cardValue;
    }

    setColor(color) {
        if (this.cardValue !== Card.SpecialCard.CHANGE_COLOR) {
            // throw new Error("color can only be changed for \"change color\" cards");
            console.log("card color was not changed - color can only be changed for \"change color\" cards");
        } else {
            this.cardColor = color;
        }
    }

    printCardToConsole() {
        console.log("Color: " + this.cardColor + ", Value: " + this.cardValue);
    }

    isSpecialCard() {
        let isSpecial = false;
        for (const specialCardKey in Card.SpecialCard) {
            if (value === Card.SpecialCard[specialCardKey]) {
                isSpecial = true;
            }
        }
        return isSpecial;
    }
}
