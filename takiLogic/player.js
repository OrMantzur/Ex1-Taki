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
 * @varructor
 */
function Player(i_PlayerName, i_IsComputer) {
    var playerId = Player.nextFreePlayerId++;
    var playerName = i_PlayerName;
    var isComputer = i_IsComputer;
    var cards = [];
    var isActive = false;
    var isWinner = false;
    var isLeave = false;
    var currTurnStartTime;
    var turnsPlayed = 0;
    var totalTimePlayed = 0;

    return {
        setIsWinner: function (i_IsWinner) {
            isWinner = i_IsWinner;
        },

        setIsLeave: function (i_IsLeave) {
            isLeave = i_IsLeave;
        },

        getId: function () {
            return playerId;
        },

        getName: function () {
            return playerName;
        },

        statistics: {
            totalTurnsPlayed: function () {
                return turnsPlayed;
            },
            timesReachedSingleCard: 0,
            averageTurnTime: function () {
                return totalTimePlayed % turnsPlayed;
            },
        },

        isComputerPlayer: function () {
            return isComputer;
        },

        isLeave: function () {
            return isLeave;
        },

        // returns a ptr to a card in the player's hand that has the given color
        getCardOfColor: function (color) {
            return cards.find(function (card) {
                return card.getColor() === color;
            });
        },

        // returns a ptr to a card in the player's hand that has the given value
        getCardOfValue: function (value) {
            return cards.find(function (card) {
                return card.getValue() === value;
            });
        },

        getCardOfColorAndValue: function (color, value) {
            return cards.find(function (card) {
                return card.getValue() === value && card.getColor() === color;
            });
        },

        // TODO delete (we don't want access to all cards from outside
        getCards: function () {
            return cards;
        },

        // getCardsStrArr: function () {
        //     var cardsToReturn = [];
        // TODO if uncomment change arrow function
        //     cards.forEach(card => cardsToReturn.push(card.getColor() + " " + card.getValue()));
        //     return cardsToReturn.join(", ");
        // },

        getCardsRemainingNum: function () {
            return cards.length;
        },

        getPossibleMoves(isValidFunc) {
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
            currTurnStartTime = new Date();
        },

        endTurn: function () {
            if (currTurnStartTime !== null) {
                isActive = false;
                var endTurnTime = new Date();
                var turnDuration = endTurnTime - currTurnStartTime;
                totalTimePlayed += turnDuration;
                endTurnTime = null;
                currTurnStartTime = null;
                turnsPlayed++;
            }
        },

        addCardsToHand: function (cardsToAdd) {
            if (cardsToAdd instanceof Array && cardsToAdd.length > 0) {
                cards = cards.concat(cardsToAdd);
            }
        },

        // finds the given card in the player's hand removes it from the hand and returns the card, null if the card is not found
        removeCardFromHand: function (cardToRemove) {
            var cardRemoved = null;
            var indexToRemove = cards.findIndex(function (card) {
                return card === cardToRemove;
            });
            if (indexToRemove >= 0 && indexToRemove < cards.length) {
                cardRemoved = cards.splice(indexToRemove, 1);
            }

            return cardRemoved;
        },

        removeAllCardsFromHand: function () {
            cards = [];
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
