/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

import Card from "./card";
import CardsOnTable from "./cardsOnTable";
import Deck from "./deck";
import Player from "./player";

export default class Game {

    static COMPUTER_DELAY = 1.5 * 1000;
    static NUM_STARTING_CARDS = 8;
    static GameType = {
        BASIC: "basic",
        ADVANCED: "advanced"
    };
    static GameState = {
        OPEN_TAKI: "openTaki",
        OPEN_PLUS: "openPlus",
        CHANGE_COLOR: "changeColor",
        GAME_STARTED: "gameStarted",
        GAME_ENDED: "gameEnded - Player won",
        SUPER_TAKI: "superTaki",
        CLOSE_TAKI: "closeTaki",
        CLOSE_PLUS: "closePlus",
        OPEN_PLUS_2: "openPlus2",
        CLOSE_PLUS_2: "closePlus2"
    };
    static nextFreeGameId = 0;

    constructor(gameType, playerNum, gameCreator, gameName) {
        // TODO (advanced game) Validate in gameManager when there is more than one game
        this.numPlayersToStartGame = playerNum;
        this.gameCreator = gameCreator;
        this.gameID = Game.nextFreeGameId++;
        this.gameName = gameName;
        this.gameType = gameType;
        this.players = [];
        this.activePlayerIndex = 0;
        this.gameIsActive = false;
        this.m_Deck = Deck(gameType);
        this.m_CardsOnTable = CardsOnTable();
        this.gameStartTime = new Date();
        this.gameEndTime = null;
        this.gameState = {
            currColor: null,
            gameState: "",
            additionalInfo: null // TODO (advanced game) will be used for counter on +2
        };
    }

    _statistics() {
        var totalTurnsPlayed = 0;
        this.players.forEach(function (player) {
            totalTurnsPlayed += player.getTotalTurnsPlayed();
        });
        var gameDuration = this._getGameDurationPrivate();
        var minutesPlayed = Math.floor(gameDuration / (1000 * 60));
        var secondsPlayed = Math.floor(gameDuration / 1000) % 60;
        return {
            getTotalTurnsPlayed  () {
                return totalTurnsPlayed;
            },

            getGameDuration  () {
                return (minutesPlayed < 10 ? "0" + minutesPlayed : minutesPlayed) + ":" + (secondsPlayed < 10 ? "0" + secondsPlayed : secondsPlayed);
            }
        };
    }

    _getGameDurationPrivate() {
        return (this.gameEndTime === null ? new Date() : this.gameEndTime) - this.gameStartTime;
    }

    _startGame() {
        this.gameIsActive = true;
        console.log("GameID (" + this.gameID + "): The game has started");
        // open start card (can't start with changeColor or superTaki card)
        var cardDrawnFromDeck;
        do {
            cardDrawnFromDeck = this.m_Deck.drawCards(1)[0];
        } while (cardDrawnFromDeck.getValue() === Card.SpecialCard.CHANGE_COLOR || cardDrawnFromDeck.getValue() === Card.SpecialCard.SUPER_TAKI);

        this.m_CardsOnTable.putCardOnTable(cardDrawnFromDeck);
        this.players[this.activePlayerIndex].startTurn();
    }

    _moveCardsFromTableToDeck() {
        var pickedUpCards = this.m_CardsOnTable.takeAllButTopCard();
        this.m_Deck.addCardsToDeck(pickedUpCards);
    }

    _isValidMove(cardPlaced) {
        var isValid = true;
        var topCardOnTable = this.m_CardsOnTable.viewTopCard();
        if (gameState.gameState === Game.GameState.OPEN_TAKI) {
            isValid = topCardOnTable.getColor() === cardPlaced.getColor();
        } else if (gameState.gameState === Game.GameState.SUPER_TAKI) {
            // TODO (advanced game)
        } else if (gameState.gameState === Game.GameState.OPEN_PLUS_2) {
            isValid = cardPlaced.getValue() === Card.SpecialCard.PLUS_2;
        } else {
            isValid = topCardOnTable.getColor() === cardPlaced.getColor() || topCardOnTable.getValue() === cardPlaced.getValue() || cardPlaced.getValue() === Card.SpecialCard.CHANGE_COLOR;
            // TODO (advanced game) - add any relevant special card
        }

        return isValid;
    }

    _makeComputerPlayerMove() {
        var activePlayer = this.players[this.activePlayerIndex];
        var topCard = this.m_CardsOnTable.viewTopCard();
        var cardToPlace;
        var additionalData;
        var chooseCardToPlaceFunc = [function () {
            // anyColorPlus2card
            cardToPlace = gameState.gameState === Game.GameState.OPEN_PLUS_2 ? activePlayer.getCardOfValue(Card.SpecialCard.PLUS_2) : undefined;
        }, function () {
            // sameColorPlus2card
            cardToPlace = activePlayer.getCardOfColorAndValue(topCard.getColor(), Card.SpecialCard.PLUS_2);
        }, function () {
            // changeColorCard
            cardToPlace = activePlayer.getCardOfValue(Card.SpecialCard.CHANGE_COLOR);
            if (cardToPlace !== undefined) {
                var i;
                for (i = 0; Card.Color.allColors[i] !== undefined; i++) {
                    if (activePlayer.getCardOfColor(Card.Color.allColors[i]) !== undefined) {
                        break;
                    }
                }
                additionalData = Card.Color.allColors[i] !== undefined ? Card.Color.allColors[i] : Card.Color.getRandomColor();
            }
        }, function () {
            // sameColorStopCard
            cardToPlace = activePlayer.getCardOfColorAndValue(topCard.getColor(), Card.SpecialCard.STOP);
        }, function () {
            // sameColorPlusCard
            cardToPlace = activePlayer.getCardOfColorAndValue(topCard.getColor(), Card.SpecialCard.PLUS);
        }, function () {
            // superTakiCard
            cardToPlace = activePlayer.getCardOfValue(Card.SpecialCard.SUPER_TAKI);
            additionalData = topCard.getColor();
        }, function () {
            // sameColorTakiCard
            cardToPlace = activePlayer.getCardOfColorAndValue(topCard.getColor(), Card.SpecialCard.TAKI);
        }, function () {
            cardToPlace = activePlayer.getCardOfColor(topCard.getColor());
        }, function () {
            if (gameState.gameState !== Game.GameState.OPEN_TAKI) {
                cardToPlace = activePlayer.getCardOfValue(topCard.getValue());
            }
        }];

        // iterate through all function until a card is found, if not then draw a card from th deck
        for (var i = 0; i < chooseCardToPlaceFunc.length && cardToPlace === undefined; i++) {
            chooseCardToPlaceFunc[i]();
        }

        cardToPlace === undefined ? this.takeCardsFromDeck() : this.makeMove(cardToPlace, additionalData);
    }

    _checkIfActivePlayerWon() {
        var playerWon = false;
        var activePlayer = this.players[this.activePlayerIndex];
        // check if the active player win
        if (activePlayer.getCardsRemainingNum() === 0 && !this._needToTakeCardFromDeck()) {
            playerWon = true;
            activePlayer.setIsWinner(true);
            console.log("Player \"" + activePlayer.getName() + "\" has won!");
            this._gameEnded(activePlayer);
        }
        return playerWon;
    }

    /**
     * call only at the end of move
     * @returns {boolean}
     */
    _needToTakeCardFromDeck() {
        return this.m_CardsOnTable.viewTopCard().getValue() === Card.SpecialCard.PLUS;
    }

    _afterMoveOfSpecialCard(card, additionalData) {
        var cardValue = card.getValue();
        switch (cardValue) {
            case Card.SpecialCard.STOP:
                // two calls to skip the next player
                var skipOnePlayer = true;
                this._moveToNextPlayer(skipOnePlayer);
                console.log("in case - Stop");
                break;
            case Card.SpecialCard.TAKI:
                // if the player put down a "taki" card and has more cards to put then set state to "openTaki"
                if (this.players[this.activePlayerIndex].getCardOfColor(card.getColor()) !== undefined) {
                    gameState.gameState = Game.GameState.OPEN_TAKI;
                } else {
                    // the player doesn't have more cards to place, so no need to change state to "openTaki"
                    gameState.gameState = null;
                    this._moveToNextPlayer();
                }
                console.log("in case - Taki");
                break;
            case Card.SpecialCard.SUPER_TAKI:
                card.setColor(additionalData);
                gameState.gameState = Game.GameState.OPEN_TAKI;
                console.log("in case - Super Taki");
                break;
            case Card.SpecialCard.CHANGE_COLOR:
                if (additionalData === undefined) {
                    additionalData = Card.Color.getRandomColor();
                }
                card.setColor(additionalData);
                console.log("change color to " + additionalData);
                this._moveToNextPlayer();
                console.log("in case - Change Color");
                break;
            case Card.SpecialCard.PLUS_2:
                if (gameState.gameState === Game.GameState.OPEN_PLUS_2)
                    gameState.additionalInfo += 2;
                else {
                    gameState.gameState = Game.GameState.OPEN_PLUS_2;
                    gameState.additionalInfo = 2;
                }
                this._moveToNextPlayer();
                console.log("in case - PLUS_2");
                break;
            case Card.SpecialCard.PLUS:
                // do nothing, the player gets another turn
                console.log("in case - PLUS");
                break;
            default:
                console.log("Error - no matching special card found");
        }
    }

    _moveToNextPlayer(skipOnePlayer) {
        this.players[this.activePlayerIndex].endTurn();
        this.activePlayerIndex = (this.activePlayerIndex + (skipOnePlayer === true ? 2 : 1)) % this.players.length;
        this.players[this.activePlayerIndex].startTurn();
    }

    _gameEnded(playerWhoWon) {
        this.gameIsActive = false;
        this.gameState.gameState = Game.GameState.GAME_ENDED.toString();
        this.gameState.additionalInfo = playerWhoWon;
        this.gameEndTime = new Date();
        console.log("game ended");
    }

    getGameId() {
        return this.gameID;
    }

    getGameCreator() {
        return this.gameCreator;
    }

    getGameState() {
        return gameState;
    }

    getCardsRemainingInDeck() {
        return this.m_Deck.getSize();
    }

    getCardsOnTableCount() {
        return this.m_CardsOnTable.getSize();
    }

    isActive() {
        return this.gameIsActive;
    }

    getActivePlayer() {
        return this.players[this.activePlayerIndex];
    }

    getPlayer(playerId) {
        return this.players[playerId];
    }

    getStatistics() {
        return this._statistics();
    }

    getGameDuration() {
        return this._getGameDurationPrivate();
    }

    getPossibleMoveForActivePlayer() {
        return this.players[this.activePlayerIndex].getPossibleMove(this._isValidMove);
    }

    addPlayerToGame(i_playerToAdd) {
        var playerAdded = false;
        if (this.gameIsActive || this.players.length >= this.numPlayersToStartGame) {
            console.log("Cannot add another player, game is full or has already started");
        } else {
            this.players.push(i_playerToAdd);
            i_playerToAdd.addCardsToHand(this.m_Deck.drawCards(Game.NUM_STARTING_CARDS));
            console.log("GameID (" + this.gameID + "): " + i_playerToAdd.getName() + " has joined the game");
            playerAdded = true;
            if (this.players.length === this.numPlayersToStartGame) {
                this._startGame();
            }
        }
        return playerAdded;
    }

    viewTopCardOnTable() {
        return this.m_CardsOnTable.viewTopCard();
    }

    takeCardsFromDeck() {
        // check if there is a possible move that the player can make
        var card = this.players[this.activePlayerIndex].getPossibleMove(this._isValidMove);
        if (card !== null) {
            console.log("Cannot take card from deck when there is a possible move. \nThe card that can be places is: " + card.getColor() + ", " + card.getValue());
            return false;
        }

        // check that there are enough cards in the deck, if not add the cards from the table to the deck so the deck won't remain empty
        if ((this.m_Deck.getSize() <= 1) ||
            (gameState.gameState === Game.GameState.OPEN_PLUS_2 && this.m_CardsOnTable.getSize() <= gameState.additionalInfo + 1)) {
            this._moveCardsFromTableToDeck();
        }

        var cardsTaken = [];
        if (gameState.gameState ===  Game.GameState.OPEN_PLUS_2) {
            var numCardsToTake = gameState.additionalInfo;
            cardsTaken = this.m_Deck.drawCards(numCardsToTake);
            gameState.gameState = null;
            gameState.additionalInfo = null;
        } else {
            cardsTaken = this.m_Deck.drawCards(1);
        }

        var activePlayer = this.players[this.activePlayerIndex];
        console.log("player: " + activePlayer.getName() + " took a card from the deck");
        activePlayer.addCardsToHand(cardsTaken);
        this._moveToNextPlayer();
        if (this.players[this.activePlayerIndex].isComputerPlayer()) {
            setTimeout(function () {
                this._makeComputerPlayerMove();
            }, Game.COMPUTER_DELAY);
        }

        return true;
    }

    /**
     *
     * @param cardPlaced
     * @param additionalData - additional info such as color for "change color" card
     * @returns {boolean} - true if move was successful else false
     */
    makeMove(cardPlaced, additionalData) {
        // first, check move validation
        if (!this._isValidMove(cardPlaced)) {
            // TODO change back to error
            // throw new Error("Invalid move!");
            console.log("Invalid move!");
            return false;
        }

        // the move
        // var cardValue = cardPlaced.getValue();
        var activePlayer = this.players[this.activePlayerIndex];
        activePlayer.removeCardFromHand(cardPlaced);
        this.m_CardsOnTable.putCardOnTable(cardPlaced);

        if (activePlayer.getCardsRemainingNum() === 1) {
            activePlayer.increaseTimesReachedSingleCard();
        } else if (this._checkIfActivePlayerWon()) {
            return true;
        }

        // check if after the move there are more valid moves
        if (gameState.gameState ===  Game.GameState.OPEN_TAKI && activePlayer.getCardOfColor(cardPlaced.getColor()) !== undefined) {
            // taki open + player has more cards of the same color = player gets another turn;
        } else {
            if (gameState.gameState ===  Game.GameState.OPEN_TAKI) {
                // taki open + player has no more cards of the same color = return to normal state
                gameState.gameState = null;
                gameState.additionalInfo = null;
            }
            if (cardPlaced.isSpecialCard()) {
                // make changes to game state according to placed card
                this._afterMoveOfSpecialCard(cardPlaced, additionalData);
            } else {
                gameState.gameState = null;
                gameState.additionalInfo = null;
                this._moveToNextPlayer();
            }
        }

        // for debugging
        console.log("Player \"" + activePlayer.getName() + "\" placed the following card on the table:");
        cardPlaced.printCardToConsole();

        if (this.players[this.activePlayerIndex].isComputerPlayer()) {
            // simulate thinking time
            setTimeout(function () {
                this._makeComputerPlayerMove();
            }, Game.COMPUTER_DELAY);
        }

        return true;
    }

    /**
     *
     * @param playerWhoLeftTheGame
     */
    leaveGame(playerWhoLeftTheGame) {
        var countPlayerThatInGame = 0;
        var somePlayerInGame = playerWhoLeftTheGame;
        this.players.forEach(function (player) {
            if (player === playerWhoLeftTheGame) {
                player.setIsLeave(true);
                console.log("player " + player.getName() + " leave the game");
            } else if (!player.leave()) {
                // if that player was the only player that stay in game
                // determine him to the winner
                somePlayerInGame = player;
                countPlayerThatInGame++;
            }
        });

        if (countPlayerThatInGame < 2) {
            this._gameEnded(somePlayerInGame);
        }
    }

    // used for debugging
    MakeComputerMove() {
        // setTimeout(makeComputerPlayerMove, 1000);
        this._makeComputerPlayerMove();
    }

}
