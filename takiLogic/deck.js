/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

// import Card from "./card";

/**
 * deck in BASIC game contains:
 * number card(8): 2 of each color
 * taki: 2 of each color
 * stop: 2 of each color
 * plus: 2 of each color
 * change color: 4 cards
 * there are 4 color
 * total 92 cards (8*4*2 + 4*2 + 4*2 + 4*2 + 4)
 *
 * deck in ADVANCED game contains:
 * all the basic cards and in addition:
 * plus 2: 2 of each color
 * super taki: 2 cards
 * there are 4 color
 * total 102 cards (92 + 4*2 + 2)
 *
 * @param i_GameType
 * @returns {{getSize: (function(): number), addCardsToDeck: addCardsToDeck, drawCards: (function(*): Array), printAllCards: printAllCards}}
 * @constructor
 */
function Deck(i_GameType) {
    var CARD_NUMBER_OF_EACH_COLOR = 2;
    var CHANGE_COLOR_AMOUNT = 4;
    var SUPER_TAKI_AMOUNT = 2;
    var cards = [];
    var gameType = i_GameType;

    // init number cards
    Card.Color.allColors.forEach(function (color) {
        Card.NUMBER_CARD.forEach(function (cardValue) {
            cards = cards.concat(createCards(cardValue, color, CARD_NUMBER_OF_EACH_COLOR));
        });
    });

    // init special cards
    var specialCardValue;
    for (var specialCardKey in Card.SpecialCard) {
        specialCardValue = Card.SpecialCard[specialCardKey];
        // skip only when it basic game with PLUS_2 or SUPER_TAKI cards
        if (!(gameType === GameType.BASIC &&
            (specialCardValue === Card.SpecialCard.PLUS_2 || specialCardValue === Card.SpecialCard.SUPER_TAKI))) {
            var cardsToAdd;
            if (specialCardValue === Card.SpecialCard.CHANGE_COLOR) {
                cardsToAdd = createCards(specialCardValue, null, CHANGE_COLOR_AMOUNT);
                cards = cards.concat(cardsToAdd);
            } else if (specialCardValue === Card.SpecialCard.SUPER_TAKI) {
                cardsToAdd = createCards(specialCardValue, null, SUPER_TAKI_AMOUNT);
                cards = cards.concat(cardsToAdd);
            } else {
                Card.Color.allColors.forEach(function (color) {
                    cardsToAdd = createCards(specialCardValue, color, CARD_NUMBER_OF_EACH_COLOR);
                    cards = cards.concat(cardsToAdd);
                });
            }
        }
    }

    function createCards(value, color, amount) {
        var newCards = [];
        for (var i = 0; i < amount; i++) {
            newCards.push(new Card(color, value));
        }
        return newCards;
    }

    function drawCard() {
        if (cards.length === 0) {
            console.log("Deck: Tried to draw card from an empty deck - returning null");
            return null;
        }

        var randIndex = Math.floor((Math.random() * 100) % cards.length);
        return cards.splice(randIndex, 1)[0];
    }

    return {
        /**
         * returns the number of cards currently in the deck
         * @return {number}
         */
        getSize: function () {
            return cards.length;
        },

        /**
         * assume cardsToAdd is an array of cards
         * @param cardsToAdd
         */
        addCardsToDeck: function (cardsToAdd) {
            if (cardsToAdd instanceof Array && cardsToAdd.length > 0) {
                cards = cards.concat(cardsToAdd);
            } else {
                console.log("Error in 'addCardsToDeck', parameter must be an array");
            }
        },

        /**
         *  draw and remove a random card from the deck
         * @param i_numCards
         * @returns {Array}
         */
        drawCards: function (i_numCards) {
            var cardsDrawn = [];
            for (var i = 0; i < i_numCards; i++) {
                cardsDrawn.push(drawCard());
            }
            return cardsDrawn;
        },

        //for testing
        printAllCards: function () {
            var arr = [];
            cards.forEach(function (card) {
                arr.push(card.getColor() + ", " + card.getValue());
            });
            console.log(arr.join("\n"));
        }
    };
}
