/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

import Card from "./card";
import Deck from "./deck";
import Game from "./game";
import Player from "./player";

export default class CardsOnTable {

    constructor(){
        this.cards = [];
    }

    getSize() {
        return cards.length;
    }

    putCardOnTable(card) {
        cards.push(card);
    }

    viewTopCard() {
        var topCard = null;
        if (cards.length > 0) {
            topCard = cards[cards.length - 1];
        }
        return topCard;
    }

    /**
     * used in case where cards need to be move from the table back to the deck
     * @returns {*}
     */
    takeAllButTopCard() {
        var pickedUpCards = null;
        if (cards.length > 0) {
            pickedUpCards = cards.splice(1, cards.length - 1);
        }
        return pickedUpCards;
    }
}
