/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

var COMPUTER_DELAY = 1 * 1000;
var NUM_STARTING_CARDS = 8;
var GameType = {
    BASIC: "basic",
    ADVANCE: "advance"
};
var GameState = {
    OPEN_TAKI: "takiOpen",
    OPEN_PLUS: "+Open",
    CHANGE_COLOR: "changeColor",
    GAME_STARTED: "gameStarted",
    GAME_ENDED: "gameEnded - Player won",
    SUPER_TAKI: "superTaki",
    CLOSE_TAKI: "takiClose",
    CLOSE_PLUS: "+Close",
    OPEN_PLUS_2: "+2Open",
    CLOSE_PLUS_2: "+2Close",
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
        }
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
        } while (cardDrawnFromDeck.getValue() === SpecialCard.CHANGE_COLOR || cardDrawnFromDeck.getValue() === SpecialCard.SUPER_TAKI);

        m_CardsOnTable.putCardOnTable(cardDrawnFromDeck);
        players[activePlayerIndex].startTurn();
    }

    function restartGame() {
        m_Deck = Deck(gameType);
        m_CardsOnTable = CardsOnTable();
        for (var player in players) {
            player.removeAllCardsFromHand();
            player.addCardsToHand(m_Deck.drawCards(NUM_STARTING_CARDS));
        }
        // TODO ..
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
            isValid = cardPlaced.getValue() === SpecialCard.PLUS_2;
        } else {
            isValid =
                (topCardOnTable.getColor() === cardPlaced.getColor()) ||
                (topCardOnTable.getValue() === cardPlaced.getValue()) ||
                (cardPlaced.getValue() === SpecialCard.CHANGE_COLOR);
            // TODO (advanced game) - add any relevant special card
        }

        return isValid;
    }

    function makeComputerPlayerMove() {
        var activePlayer = players[activePlayerIndex];
        var topCard = m_CardsOnTable.viewTopCard();
        var cardToPlace;
        var additionalData;
        var chooseCardToPlaceFunc = [
            function () {
                // anyColorPlus2card
                //4.1. ישנו קלף 2+ פעיל (כפי שהוסבר בפרטי המשחק המתקדם) ולשחקן הממוחשב יש קלף 2+ - הוא יניח קלף זה בערימה המרכזית. אחרת ימשוך מהקופה את מספר הקלפים הנדרש.
                cardToPlace = gameState.gameState === GameState.OPEN_PLUS_2 ? activePlayer.getCardOfValue(SpecialCard.PLUS_2) : undefined;
            },
            function () {
                // sameColorPlus2card
                //4.2.  במידה ולשחקן הממוחשב יש קלף 2+ שצבעו זהה לקלף העליון בערימה המרכזית יניח קלף זה בערימה המרכזית
                cardToPlace = activePlayer.getCardOfColorAndValue(topCard.getColor(), SpecialCard.PLUS_2);
            },
            function () {
                // changeColorCard
                //4.3. במידה ולשחקן הממוחשב יש קלף שנה צבע – יניח אותו בערימה המרכזית ויבחר צבע בצורה אקראית
                cardToPlace = activePlayer.getCardOfValue(SpecialCard.CHANGE_COLOR);
                additionalData = Color.getRandomColor();
            },
            function () {
                // sameColorStopCard
                //4.4. במידה ולשחקן הממוחשב יש קלף עצור שצבעו זהה לקלף העליון בערימה המרכזית – יניח קלף זה בערימה המרכזית
                cardToPlace = activePlayer.getCardOfColorAndValue(topCard.getColor(), SpecialCard.STOP);
            },
            function () {
                // sameColorPlusCard
                //4.5. במידה ולשחקן הממוחשב יש קלף פלוס (+) שצבעו זהה לקלף העליון בערימה המרכזית – יניח קלף זה בערימה המרכזית
                cardToPlace = activePlayer.getCardOfColorAndValue(topCard.getColor(), SpecialCard.PLUS);
            },
            function () {
                // superTakiCard
                //4.6. במידה ולשחקן הממוחשב יש קלף סופר טאקי– יניח קלף זה בערימה המרכזית ולאחר מכן את כל הקלפים בצבע הטאקי בצורה כלשהי (אקראית, לפי הסדר שהקלפים מסודרים במבנה נתונים – לשיקולכם)
                cardToPlace = activePlayer.getCardOfValue(SpecialCard.SUPER_TAKI);
                additionalData = topCard.getColor();
            },
            function () {
                // sameColorTakiCard
                //4.7. במידה ולשחקן הממוחשב יש קלף טאקי (+) שצבעו זהה לקלף העליון בערימה המרכזית – יניח קלף זה בערימה המרכזית ו לאחר מכן את כל הקלפים בצבע הטאקי בצורה כלשהי (אקראית, לפי הסדר שהקלפים מסודרים במבנה נתונים – לשיקולכם)
                cardToPlace = activePlayer.getCardOfColorAndValue(topCard.getColor(), SpecialCard.TAKI);
            },
            function () {
                //4.8. במידה ולשחקן הממוחשב יש קלף שצבעו זהה לקלף העליון בערימה המרכזית – יניח קלף זה בערימה המרכזית
                cardToPlace = activePlayer.getCardOfColor(topCard.getColor());
            },
            function () {
                //4.9. במידה ולשחקן הממוחשב יש קלף שמספרו זהה לקלף העליון בערימה המרכזית – יניח קלף זה בערימה המרכזית
                if (gameState.gameState !== GameState.OPEN_TAKI) {
                    cardToPlace = activePlayer.getCardOfValue(topCard.getValue());
                }
            }
        ];

        //4.10. ימשוך קלף מהקופה
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
        return m_CardsOnTable.viewTopCard().getValue() === SpecialCard.PLUS;
    }

    function afterMoveOfSpecialCard(card, additionalData) {
        var cardValue = card.getValue();
        switch (cardValue) {
            case SpecialCard.STOP:
                // two calls to skip the next player
                var skipOnePlayer = true;
                moveToNextPlayer(skipOnePlayer);
                console.log("in case - Stop");
                break;
            case SpecialCard.TAKI:
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
            case SpecialCard.SUPER_TAKI:
                card.setColor(additionalData);
                gameState.gameState = GameState.OPEN_TAKI;
                console.log("in case - Super Taki");
                break;
            case SpecialCard.CHANGE_COLOR:
                if (additionalData === undefined) {
                    additionalData = Color.getRandomColor();
                }
                card.setColor(additionalData);
                console.log("change color to " + additionalData);
                moveToNextPlayer();
                console.log("in case - Change Color");
                break;
            case SpecialCard.PLUS_2:
                if (gameState.gameState === GameState.OPEN_PLUS_2)
                    gameState.additionalInfo += 2;
                else {
                    gameState.gameState = GameState.OPEN_PLUS_2;
                    gameState.additionalInfo = 2;
                }
                moveToNextPlayer();
                console.log("in case - PLUS_2");
                break;
            case SpecialCard.PLUS:
                // do nothing, the player gets another turn
                console.log("in case - PLUS");
                break;
            default:
                console.log("no match to any special card")
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
            // if there is only one card left add the cards from the table to the deck so the deck won't remain empty
            // check if there is a possible move that the player can make
            var card = players[activePlayerIndex].getPossibleMove(isValidMove);
            if (card !== null) {
                // throw new Error("Cannot take card from deck when there is a possible move. \nThe card that can be places is: " + card.getColor() + ", " + card.getValue());
                console.log("Cannot take card from deck when there is a possible move. \nThe card that can be places is: " + card.getColor() + ", " + card.getValue());
                return false;
            }

            // check that there are enough cards in the deck
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

            console.log("1");
            // check if after the move there are more valid moves
            if (gameState.gameState === GameState.OPEN_TAKI && activePlayer.getCardOfColor(cardPlaced.getColor()) !== undefined) {
                // taki open + player has more cards of the same color = player gets another turn;
                console.log("2");
            } else {
                if (gameState.gameState === GameState.OPEN_TAKI) {
                    // taki open + player has no more cards of the same color = return to normal state
                    console.log("3");
                    gameState.gameState = null;
                    gameState.additionalInfo = null;
                }
                if (cardPlaced.isSpecialCard()) {
                    // make changes to game state according to placed card
                    console.log("4");
                    afterMoveOfSpecialCard(cardPlaced, additionalData);
                } else {
                    console.log("5");
                    gameState.gameState = null;
                    gameState.additionalInfo = null;
                    moveToNextPlayer();
                }
            }

            // for debug
            {
                console.log("Player \"" + activePlayer.getName() + "\" placed the following card on the table:");
                cardPlaced.printCardToConsole();
            }


            if (players[activePlayerIndex].isComputerPlayer()) {
                // simulate thinking time
                setTimeout(function () {
                    makeComputerPlayerMove();
                }, COMPUTER_DELAY);
            }

            return true;
        },

        /**
         * player leave before the game ended
         */
        leaveGame: function (playerIdWhoLeave) {
            var countPlayerThatInGame = 0;
            var somePlayerInGame;
            players.forEach(function (player) {
                if (player.getId() === playerIdWhoLeave) {
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

        // for debugging
        makeComputerMove: function () {
            // setTimeout(makeComputerPlayerMove, 1000);
            makeComputerPlayerMove();
        }
    }
}