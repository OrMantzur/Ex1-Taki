/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

Player.nextFreePlayerId = 0;

/**
 * can be human/computer player
 *
 * @param i_PlayerName
 * @param i_IsComputer
 * @returns {*}
 * @constructor
 */
function Player(i_PlayerName, i_IsComputer) {
    var playerId = Player.nextFreePlayerId++;
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

        isComputerPlayer: function(){
            return isComputer;
        },

        // returns a ptr to a card in the player's hand that has the given color
        getCardOfColor: function (color) {
            return cards.find(card => card.getColor() === color);
        },

        // returns a ptr to a card in the player's hand that has the given value
        getCardOfValue: function (value) {
            return cards.find(card => card.getValue() === value);
        },

        getCardOfColorAndValue: function(color, value){
            return cards.find(card => card.getValue() === value && card.getColor() === color);
        },

        // TODO delete (we don't want access to all cards from outside
        getCards: function () {
            return cards;
        },

        // getCardsStrArr: function () {
        //     var cardsToReturn = [];
        //     cards.forEach(card => cardsToReturn.push(card.getColor() + " " + card.getValue()));
        //     return cardsToReturn.join(", ");
        // },

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

        // finds the given card in the player's hand removes it from the hand and returns the card, null if the card is not found
        removeCardFromHand: function (cardToRemove) {
            var cardRemoved = null;
            var indexToRemove = cards.findIndex(card => card === cardToRemove);
            if (indexToRemove > 0) {
                cardRemoved = cards.splice(indexToRemove, 1);
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
