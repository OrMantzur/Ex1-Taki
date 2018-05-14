/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

import Card from "./card";


var COMPUTER_DELAY = 1.5 * 1000;
var NUM_STARTING_CARDS = 8;
var GameType = {
    BASIC: "basic",
    ADVANCED: "advanced"
};
var GameState = {
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
Game.nextFreeGameId = 0;

function Game(i_GameType, i_PlayerNum, i_GameCreator, i_GameName) {
    // TODO (advanced game) Validate in gameManager when there is more than one game
    var numPlayersToStartGame = i_PlayerNum;
    var gameCreator = i_GameCreator;
    var gameID = Game.nextFreeGameId++;
    var gameName = i_GameName;
    var gameType = i_GameType;
    var players = [];
    var activePlayerIndex = 0;
    var gameIsActive = false;
    var m_Deck = Deck(gameType);
    var m_CardsOnTable = CardsOnTable();
    var gameStartTime = new Date();
    var gameEndTime = null;
    var gameState = {
        currColor: null,
        gameState: null,
        additionalInfo: null // TODO (advanced game) will be used for counter on +2
    };

    function statistics() {
        var totalTurnsPlayed = 0;
        players.forEach(function (player) {
            totalTurnsPlayed += player.getTotalTurnsPlayed();
        });
        var gameDuration = getGameDurationPrivate();
        var minutesPlayed = Math.floor(gameDuration / (1000 * 60));
        var secondsPlayed = Math.floor(gameDuration / 1000) % 60;
        return {
            getTotalTurnsPlayed: function () {
                return totalTurnsPlayed;
            },

            getGameDuration: function () {
                return (minutesPlayed < 10 ? "0" + minutesPlayed : minutesPlayed) + ":" + (secondsPlayed < 10 ? "0" + secondsPlayed : secondsPlayed);
            }
        };
    }

    function getGameDurationPrivate() {
        return (gameEndTime === null ? new Date() : gameEndTime) - gameStartTime;
    }

    function startGame() {
        gameIsActive = true;
        console.log("GameID (" + gameID + "): The game has started");
        // open start card (can't start with changeColor or superTaki card)
        var cardDrawnFromDeck;
        do {
            cardDrawnFromDeck = m_Deck.drawCards(1)[0];
        } while (cardDrawnFromDeck.getValue() === Card.SpecialCard.CHANGE_COLOR || cardDrawnFromDeck.getValue() === Card.SpecialCard.SUPER_TAKI);

        m_CardsOnTable.putCardOnTable(cardDrawnFromDeck);
        players[activePlayerIndex].startTurn();
    }

    function moveCardsFromTableToDeck() {
        var pickedUpCards = m_CardsOnTable.takeAllButTopCard();
        m_Deck.addCardsToDeck(pickedUpCards);
    }

    function isValidMove(cardPlaced) {
        var isValid = true;
        var topCardOnTable = m_CardsOnTable.viewTopCard();
        if (gameState.gameState === GameState.OPEN_TAKI) {
            isValid = topCardOnTable.getColor() === cardPlaced.getColor();
        } else if (gameState.gameState === GameState.SUPER_TAKI) {
            // TODO (advanced game)
        } else if (gameState.gameState === GameState.OPEN_PLUS_2) {
            isValid = cardPlaced.getValue() === Card.SpecialCard.PLUS_2;
        } else {
            isValid = topCardOnTable.getColor() === cardPlaced.getColor() || topCardOnTable.getValue() === cardPlaced.getValue() || cardPlaced.getValue() === Card.SpecialCard.CHANGE_COLOR;
            // TODO (advanced game) - add any relevant special card
        }

        return isValid;
    }

    function makeComputerPlayerMove() {
        var activePlayer = players[activePlayerIndex];
        var topCard = m_CardsOnTable.viewTopCard();
        var cardToPlace;
        var additionalData;
        var chooseCardToPlaceFunc = [function () {
            // anyColorPlus2card
            cardToPlace = gameState.gameState === GameState.OPEN_PLUS_2 ? activePlayer.getCardOfValue(Card.SpecialCard.PLUS_2) : undefined;
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
            if (gameState.gameState !== GameState.OPEN_TAKI) {
                cardToPlace = activePlayer.getCardOfValue(topCard.getValue());
            }
        }];

        // iterate through all function until a card is found, if not then draw a card from th deck
        for (var i = 0; i < chooseCardToPlaceFunc.length && cardToPlace === undefined; i++) {
            chooseCardToPlaceFunc[i]();
        }

        cardToPlace === undefined ? game.takeCardsFromDeck() : game.makeMove(cardToPlace, additionalData);
    }

    function checkIfActivePlayerWon() {
        var playerWon = false;
        var activePlayer = players[activePlayerIndex];
        // check if the active player win
        if (activePlayer.getCardsRemainingNum() === 0 && !needToTakeCardFromDeck()) {
            playerWon = true;
            activePlayer.setIsWinner(true);
            console.log("Player \"" + activePlayer.getName() + "\" has won!");
            gameEnded(activePlayer);
        }
        return playerWon;
    }

    /**
     * call only at the end of move
     * @returns {boolean}
     */
    function needToTakeCardFromDeck() {
        return m_CardsOnTable.viewTopCard().getValue() === Card.SpecialCard.PLUS;
    }

    function afterMoveOfSpecialCard(card, additionalData) {
        var cardValue = card.getValue();
        switch (cardValue) {
            case Card.SpecialCard.STOP:
                // two calls to skip the next player
                var skipOnePlayer = true;
                moveToNextPlayer(skipOnePlayer);
                console.log("in case - Stop");
                break;
            case Card.SpecialCard.TAKI:
                // if the player put down a "taki" card and has more cards to put then set state to "openTaki"
                if (players[activePlayerIndex].getCardOfColor(card.getColor()) !== undefined) {
                    gameState.gameState = GameState.OPEN_TAKI;
                } else {
                    // the player doesn't have more cards to place, so no need to change state to "openTaki"
                    gameState.gameState = null;
                    moveToNextPlayer();
                }
                console.log("in case - Taki");
                break;
            case Card.SpecialCard.SUPER_TAKI:
                card.setColor(additionalData);
                gameState.gameState = GameState.OPEN_TAKI;
                console.log("in case - Super Taki");
                break;
            case Card.SpecialCard.CHANGE_COLOR:
                if (additionalData === undefined) {
                    additionalData = Card.Color.getRandomColor();
                }
                card.setColor(additionalData);
                console.log("change color to " + additionalData);
                moveToNextPlayer();
                console.log("in case - Change Color");
                break;
            case Card.SpecialCard.PLUS_2:
                if (gameState.gameState === GameState.OPEN_PLUS_2)
                    gameState.additionalInfo += 2;
                else {
                    gameState.gameState = GameState.OPEN_PLUS_2;
                    gameState.additionalInfo = 2;
                }
                moveToNextPlayer();
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

    function moveToNextPlayer(skipOnePlayer) {
        players[activePlayerIndex].endTurn();
        activePlayerIndex = (activePlayerIndex + (skipOnePlayer === true ? 2 : 1)) % players.length;
        players[activePlayerIndex].startTurn();
    }

    function gameEnded(playerWhoWon) {
        gameIsActive = false;
        gameState.gameState = GameState.GAME_ENDED;
        gameState.additionalInfo = playerWhoWon;
        gameEndTime = new Date();
        console.log("game ended");
    }

    return {

        getGameId: function () {
            return gameID;
        },

        getGameCreator: function () {
            return gameCreator;
        },

        getGameState: function () {
            return gameState;
        },

        getCardsRemainingInDeck: function () {
            return m_Deck.getSize();
        },

        getCardsOnTableCount: function () {
            return m_CardsOnTable.getSize();
        },

        isActive: function () {
            return gameIsActive;
        },

        getActivePlayer: function () {
            return players[activePlayerIndex];
        },

        getPlayer: function (playerId) {
            return players[playerId];
        },

        getStatistics: function () {
            return statistics();
        },

        getGameDuration: function () {
            return getGameDurationPrivate();
        },

        getPossibleMoveForActivePlayer: function () {
            return players[activePlayerIndex].getPossibleMove(isValidMove);
        },

        addPlayerToGame: function (i_playerToAdd) {
            var playerAdded = false;
            if (gameIsActive || players.length >= numPlayersToStartGame) {
                console.log("Cannot add another player, game is full or has already started");
            } else {
                players.push(i_playerToAdd);
                i_playerToAdd.addCardsToHand(m_Deck.drawCards(NUM_STARTING_CARDS));
                console.log("GameID (" + gameID + "): " + i_playerToAdd.getName() + " has joined the game");
                playerAdded = true;
                if (players.length === numPlayersToStartGame) {
                    startGame();
                }
            }
            return playerAdded;
        },

        viewTopCardOnTable: function () {
            return m_CardsOnTable.viewTopCard();
        },

        takeCardsFromDeck: function () {
            // check if there is a possible move that the player can make
            var card = players[activePlayerIndex].getPossibleMove(isValidMove);
            if (card !== null) {
                console.log("Cannot take card from deck when there is a possible move. \nThe card that can be places is: " + card.getColor() + ", " + card.getValue());
                return false;
            }

            // check that there are enough cards in the deck, if not add the cards from the table to the deck so the deck won't remain empty
            if ((m_Deck.getSize() <= 1) ||
                (gameState.gameState === GameState.OPEN_PLUS_2 && m_CardsOnTable.getSize() <= gameState.additionalInfo + 1)) {
                moveCardsFromTableToDeck();
            }

            var cardsTaken = [];
            if (gameState.gameState === GameState.OPEN_PLUS_2) {
                var numCardsToTake = gameState.additionalInfo;
                cardsTaken = m_Deck.drawCards(numCardsToTake);
                gameState.gameState = null;
                gameState.additionalInfo = null;
            } else {
                cardsTaken = m_Deck.drawCards(1);
            }

            var activePlayer = players[activePlayerIndex];
            console.log("player: " + activePlayer.getName() + " took a card from the deck");
            activePlayer.addCardsToHand(cardsTaken);
            moveToNextPlayer();
            if (players[activePlayerIndex].isComputerPlayer()) {
                setTimeout(function () {
                    makeComputerPlayerMove();
                }, COMPUTER_DELAY);
            }

            return true;
        },

        /**
         *
         * @param cardPlaced
         * @param additionalData - additional info such as color for "change color" card
         * @returns {boolean} - true if move was successful else false
         */
        makeMove: function (cardPlaced, additionalData) {
            // first, check move validation
            if (!isValidMove(cardPlaced)) {
                // TODO change back to error
                // throw new Error("Invalid move!");
                console.log("Invalid move!");
                return false;
            }

            // the move
            // var cardValue = cardPlaced.getValue();
            var activePlayer = players[activePlayerIndex];
            activePlayer.removeCardFromHand(cardPlaced);
            m_CardsOnTable.putCardOnTable(cardPlaced);

            if (activePlayer.getCardsRemainingNum() === 1) {
                activePlayer.increaseTimesReachedSingleCard();
            } else if (checkIfActivePlayerWon()) {
                return true;
            }

            // check if after the move there are more valid moves
            if (gameState.gameState === GameState.OPEN_TAKI && activePlayer.getCardOfColor(cardPlaced.getColor()) !== undefined) {
                // taki open + player has more cards of the same color = player gets another turn;
            } else {
                if (gameState.gameState === GameState.OPEN_TAKI) {
                    // taki open + player has no more cards of the same color = return to normal state
                    gameState.gameState = null;
                    gameState.additionalInfo = null;
                }
                if (cardPlaced.isSpecialCard()) {
                    // make changes to game state according to placed card
                    afterMoveOfSpecialCard(cardPlaced, additionalData);
                } else {
                    gameState.gameState = null;
                    gameState.additionalInfo = null;
                    moveToNextPlayer();
                }
            }

            // for debugging
            console.log("Player \"" + activePlayer.getName() + "\" placed the following card on the table:");
            cardPlaced.printCardToConsole();

            if (players[activePlayerIndex].isComputerPlayer()) {
                // simulate thinking time
                setTimeout(function () {
                    makeComputerPlayerMove();
                }, COMPUTER_DELAY);
            }

            return true;
        },

        /**
         *
         * @param playerWhoLeftTheGame
         */
        leaveGame: function (playerWhoLeftTheGame) {
            var countPlayerThatInGame = 0;
            var somePlayerInGame = playerWhoLeftTheGame;
            players.forEach(function (player) {
                if (player === playerWhoLeftTheGame) {
                    player.setIsLeave(true);
                    console.log("player " + player.getName() + " leave the game");
                } else if (!player.isLeave()) {
                    // if that player was the only player that stay in game
                    // determine him to the winner
                    somePlayerInGame = player;
                    countPlayerThatInGame++;
                }
            });

            if (countPlayerThatInGame < 2) {
                gameEnded(somePlayerInGame);
            }
        },

        // used for debugging
        MakeComputerMove: function () {
            // setTimeout(makeComputerPlayerMove, 1000);
            makeComputerPlayerMove();
        }
    };
}