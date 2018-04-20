/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

function Player(i_PlayerName, i_IsComputer) {
    var playerId;
    var playerName = i_PlayerName;
    var isComputer = i_IsComputer;
    var cards = [];
    var isActive = false;
    var isWinner = false;

    return {
        setIsWinner: function (i_IsWinner) {
            isWinner = i_IsWinner;
        },

        getId: function () {
            return playerId;
        },

        getName: function () {
            return playerName;
        },

        hasCardOfColor: function (color) {
            return cards.findIndex(card => card.getColor() === color) > 0;
        },

        getCards: function () {
            return cards;
        },

        getCardsRemainingNum: function () {
            return cards.length;
        },

        getPossibleMove(isValidFunc) {
            var cardThatCanBePlaced = null;
            for (var i = 0; i < cards.length; i++) {
                if (isValidFunc(cards[i]) === true) {
                    cardThatCanBePlaced = cards[i];
                    break;
                }
            }
            return cardThatCanBePlaced;
        },

        startTurn: function () {
            isActive = true;
        },

        addCardsToHand: function (cardsToAdd) {
            if (cardsToAdd instanceof Array && cardsToAdd.length > 0) {
                cards = cards.concat(cardsToAdd);
            }
        },

        removeCardFromHand: function (cardToRemove) {
            var cardRemoved = false;
            var indexToRemove = cards.findIndex(card => card === cardToRemove);
            if (indexToRemove > 0) {
                cards.splice(indexToRemove, 1);
                cardRemoved = true;
            }
            return cardRemoved;
        },


        // for testing
        printCardsInHandToConsole: function () {
            console.log("printing all cards in hand");
            for (var i = 0; i < cards.length; i++) {
                console.log(cards[i].getValue() + ", " + cards[i].getColor() + "\n");
            }
        },
        // for testing
        getCardAtI: function (i) {
            return cards[i];
        }
    }
}
