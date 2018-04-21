/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */


/**
 * deck contains:
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

    // init number cards
    Color.forEach(color => {
        NUMBER_CARD.forEach(cardValue => {
            cards.concat(createCards(cardValue, color, CARD_NUMBER_OF_EACH_COLOR))
        });
    });

    // init special cards
    SpecialCard.forEach(cardValue => {
        // skip only when it basic game with PLUS_2 or SUPER_TAKI cards
        if (!(gameType === GameType.BASIC && (cardValue !== SpecialCard.PLUS_2 || cardValue !== SpecialCard.SUPER_TAKI))) {
            var cardsToAdd;
            if (cardValue === SpecialCard.CHANGE_COLOR || cardValue === SpecialCard.SUPER_TAKI) {
                cardsToAdd = createCards(cardValue, Color.NONE, CHANGE_COLOR_AMOUNT);
                cards.concat(cardsToAdd);
            } else {
                Color.forEach(color => {
                    cardsToAdd = createCards(cardValue, color, CARD_NUMBER_OF_EACH_COLOR);
                    cards.concat(cardsToAdd);
                });
            }
        }
    });

    function createCards(value, color, amount) {
        var newCards = [];
        amount = color !== Color.NONE ? amount * CARD_NUMBER_OF_EACH_COLOR : amount;
        for (var i = 0; i < amount; i++) {
            newCards.push(Card(value, color));
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
                cardsToAdd.forEach(function (card) {
                    cards.push(card);
                });
            } else {
                console.log("Error in 'TakeCardsFromTableToDeck', parameter must be an array");
            }
        },

        /**
         * draw and remove a random card from the deck
         * @return {Card}
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
