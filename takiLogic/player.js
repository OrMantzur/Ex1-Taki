/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

import Card from "./card";
import CardsOnTable from "./cardsOnTable";
import Deck from "./deck";
import Game from "./game";



/**
 * can be human/computer player
 *
 * @param i_PlayerName
 * @param i_IsComputer
 * @returns {*}
 * @constructor
 */
export default class Player {

    static nextFreePlayerId = 0;

    constructor(playerName, isComputer) {
        this.playerId = Player.nextFreePlayerId++;
        this.playerName = playerName;
        this.isComputer = isComputer;
        this.cards = [];
        this.isActive = false;
        this.isWinner = false;
        this.leave = false;
        this.currTurnStartTime = undefined;
        this.turnsPlayed = 0;
        this.totalTimePlayed = 0;
        this.timesReachedSingleCard = 0;
    }

    setIsWinner(i_IsWinner) {
        this.isWinner = i_IsWinner;
    }

    setIsLeave(i_IsLeave) {
        this.leave = i_IsLeave;
    }

    increaseTimesReachedSingleCard() {
        this.timesReachedSingleCard++;
    }

    getId() {
        return this.playerId;
    }

    getName() {
        return this.playerName;
    }

    getTotalTurnsPlayed() {
        return this.turnsPlayed;
    }

    getAverageTurnTime() {
        var totalAvgTimeInSeconds = (this.totalTimePlayed / this.turnsPlayed) / 1000;
        var avgTimeSeconds = Math.floor(totalAvgTimeInSeconds % 60);
        var avgTimeMinutes = Math.floor(totalAvgTimeInSeconds / 60);
        if (totalAvgTimeInSeconds.toString() === "NaN" || avgTimeSeconds.toString() === "NaN" ||
            avgTimeMinutes.toString() === "NaN") {
            return 0;
        }
        return (avgTimeMinutes < 10 ? "0" + avgTimeMinutes : avgTimeMinutes) + ":" + (avgTimeSeconds < 10 ? "0" + avgTimeSeconds : avgTimeSeconds);
    }

    getTimesReachedSingleCard() {
        return this.timesReachedSingleCard;
    }

    isComputerPlayer() {
        return this.isComputer;
    }

    isLeave() {
        return this.leave;
    }

    // returns a ptr to a card in the player's hand that has the given color
    getCardOfColor(color) {
        return cards.find(function (card) {
            return card.getColor() === color;
        });
    }

    // returns a ptr to a card in the player's hand that has the given value
    getCardOfValue(value) {
        return cards.find(function (card) {
            return card.getValue() === value;
        });
    }

    getCardOfColorAndValue(color, value) {
        return cards.find(function (card) {
            return card.getValue() === value && card.getColor() === color;
        });
    }

    getCards() {
        return cards;
    }

    getCardById(cardId) {
        var cardFound = cards.find(function (card) {
            return card.getId() === parseInt(cardId);
        });
        return cardFound;
    }

    // used for debugging
    getCardsStrArr() {
        var cardsToReturn = [];
        cards.forEach(function (card) {
            return cardsToReturn.push(card.getColor() + " " + card.getValue());
        });
        return cardsToReturn.join(", ");
    }

    getCardsRemainingNum() {
        return cards.length;
    }

    /**
     *
     * @param isValidFunc
     * @returns {Card}
     */
    getPossibleMove(isValidFunc) {
        var cardThatCanBePlaced = null;
        for (var i = 0; i < cards.length; i++) {
            if (isValidFunc(cards[i]) === true) {
                cardThatCanBePlaced = cards[i];
                break;
            }
        }
        return cardThatCanBePlaced;
    }

    startTurn() {
        this.isActive = true;
        this.currTurnStartTime = new Date();
    }

    endTurn() {
        if (this.currTurnStartTime !== null) {
            this.isActive = false;
            var endTurnTime = new Date();
            this.totalTimePlayed += endTurnTime - this.currTurnStartTime;
            endTurnTime = null;
            this.currTurnStartTime = null;
            this.turnsPlayed++;
        }
    }

    addCardsToHand(cardsToAdd) {
        if (cardsToAdd instanceof Array && cardsToAdd.length > 0) {
            this.cards = cards.concat(cardsToAdd);
        }
    }

    // finds the given card in the player's hand removes it from the hand and returns the card, null if the card is not found
    removeCardFromHand(cardToRemove) {
        var cardRemoved = null;
        var indexToRemove = cards.findIndex(function (card) {
            return card === cardToRemove;
        });
        if (indexToRemove >= 0 && indexToRemove < cards.length) {
            cardRemoved = cards.splice(indexToRemove, 1);
        }

        return cardRemoved;
    }

    removeAllCardsFromHand() {
        this.cards = [];
    }

    // for testing
    printCardsInHandToConsole() {
        console.log("printing all cards in hand");
        for (var i = 0; i < cards.length; i++) {
            console.log(cards[i].getValue() + ", " + cards[i].getColor() + "\n");
        }
    }

}
