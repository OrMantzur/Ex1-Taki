/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */


/**
 * deck in basic game contains:
 * number card(8): 2 of each color
 * taki: 2 of each color
 * stop: 2 of each color
 * change color: 4 cards
 * there are 4 color
 * total 84 card (8*4*2 + 4*2 + 4*2 + 4)
 *
 * @returns {{getSize: (function(): number), addCardsToDeck: addCardsToDeck, drawCards: (function(*): Array)}}
 * @constructor
 */
function Deck(i_GameType) {
    const CARD_NUMBER_OF_EACH_COLOR = 2;
    const CHANGE_COLOR_AMOUNT = 4;
    const SUPER_TAKI_AMOUNT = 2;
    var cards = [];
    var gameType = i_GameType;

    // TODO remove NOT color from color
    // init number cards
    for (const color in Color) {
        NUMBER_CARD.forEach(cardValue => {
            cards = cards.concat(createCards(cardValue, color, CARD_NUMBER_OF_EACH_COLOR))
        });
    }

    // init special cards
    for (const specialCardValue in SpecialCard) {
        // skip only when it basic game with PLUS_2 or SUPER_TAKI cards
        if (!(gameType === GameType.BASIC &&
            (specialCardValue !== SpecialCard.PLUS_2 || specialCardValue !== SpecialCard.SUPER_TAKI))) {
            var cardsToAdd;
            if (specialCardValue === SpecialCard.CHANGE_COLOR) {
                cardsToAdd = createCards(specialCardValue, null, CHANGE_COLOR_AMOUNT);
            } else if (specialCardValue === SpecialCard.SUPER_TAKI) {
                cardsToAdd = createCards(specialCardValue, null, SUPER_TAKI_AMOUNT);
                cards = cards.concat(cardsToAdd);
            } else {
                for (const color in Color) {
                    cardsToAdd = createCards(specialCardValue, color, CARD_NUMBER_OF_EACH_COLOR);
                    cards = cards.concat(cardsToAdd);
                }
            }
        }
    }

    function createCards(value, color, amount) {
        var newCards = [];
        for (var i = 0; i < amount; i++) {
            newCards.push(Card(color, value));
        }
        return newCards;
    }

    function drawCard() {
        if (cards.length === 0) {
            throw new Error("DeckEmpty");
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
    }
}
