/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

function CardsOnTable() {
    var cards = [];

    return {
        getSize: function () {
            return cards.length;
        },

        putCardOnTable: function (card) {
            cards.push(card);
        },

        viewTopCard: function () {
            var topCard = null;
            if (cards.length > 0) {
                topCard = cards[cards.length - 1];
            }
            return topCard;
        },

        /**
         * used in case where cards need to be move from the table back to the deck
         * @returns {*}
         */
        takeAllButTopCard: function () {
            var pickedUpCards = null;
            if (cards.length > 0) {
                pickedUpCards = cards.splice(1, cards.length - 1);
            }
            return pickedUpCards;
        },
    }
}
