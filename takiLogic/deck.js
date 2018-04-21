/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

function Deck() {
    const NUMBER_OF_CHANGE_COLOR_CARD = 4;
    var cards = [];

    // init deck
    COLORS.forEach(color => {
        CARD_VALUES.forEach(val => {
            cards.push(Card(color, val));
            cards.push(Card(color, val));
        });
    });

    for (var i = 0; i < NUMBER_OF_CHANGE_COLOR_CARD; i++) {
        cards.push(new Card(null, SpecialCard.CHANGE_COLOR));
    }

    // TODO init other special cards

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
                console.log("Error in 'addCardsToDeck', parameter must be an array");
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
