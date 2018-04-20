/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

const NUM_STARTING_CARDS = 8;

const GameState = {
    SUPER_TAKI: "superTaki",
    OPEN_TAKI:"takiOpen",
    CLOSE_TAKI:"takiClose",
    OPEN_PLUS:"+Open",
    CLOSE_PLUS:"+Close",
    OPEN_PLUS_2:"+2Open",
    CLOSE_PLUS_2:"+2Close",
    CHANGE_COLOR:"changeColor",
    GAME_ENDED:"game ended - Player won",
};

var game = (function (i_numPlayersToStartGame, i_GameCreator) {
    // TODO auto generate
    var gameID = 1;
    var players = [];
    var activePlayerIndex = 0;
    var numPlayersToStartGame = i_numPlayersToStartGame;
    var m_Deck = Deck();
    var m_CardsOnTable = CardsOnTable();
    var gameIsActive = false;
    var gameCreator = i_GameCreator;
    var gameState = {
        currColor: null,
        gameState: null,
        additionalInfo: null // TODO will be used for counter on +2
    };
    var startGame = function () {
        gameIsActive = true;
        console.log("GameID (" + gameID + "): The game has started");
        players[activePlayerIndex].startTurn();
        try {
            m_CardsOnTable.putCardOnTable(m_Deck.drawCards(1)[0]);
        } catch (e) {
            // TODO handle error
        }
        //    TODO do stuff
    };


    var x = 0;

    function moveCardsFromTableToDeck() {
        var pickedUpCards = m_CardsOnTable.takeAllButTopCard();
        m_Deck.addCardsToDeck(pickedUpCards);
    }

    function isValidMove(cardPlaced) {
        var isValid = true;
        var topCardOnTable = m_CardsOnTable.viewTopCard();
        // redundent
        if (gameState.gameState === GameState.OPEN_TAKI) {
            isValid = topCardOnTable.getColor() === cardPlaced.getColor();
        }
        if (gameState.gameState === GameState.SUPER_TAKI) {
            // TODO advanced game
        } else if (gameState.gameState === GameState.CHANGE_COLOR) {
            isValid = true; //TODO can i put anything on change color?
        } else if (gameState.gameState === GameState.OPEN_PLUS_2) {
            isValid = cardPlaced.getValue() === "+2";
        } else {
            isValid =
                (topCardOnTable.getColor() === cardPlaced.getColor()) ||
                (topCardOnTable.getValue() === cardPlaced.getValue());
        }

        return isValid;
    }

    function makeComputerPlayerMove() {

    }

    return {

        getGameId: function () {
            return gameID;
        },

        getGameCreator: function () {
            return gameCreator;
        },

        isActive: function () {
            return gameIsActive;
        },

        getActivePlayer: function () {
            return players[activePlayerIndex];
        },

        getPlayer: function (playerId) {
            // TODO by now we dont have unique id so we treat to it like index
            return players[playerId];
        },

        addPlayerToGame: function (i_playerToAdd) {
            var playerAdded = false;
            if (gameIsActive || players.length >= numPlayersToStartGame) {
                console.log("Cannot add another player, game is full or has already started")
                /*            } else if ((playerToAdd = GameManager.getPlayerByName(i_playerNameToAdd)) === undefined) {
                                console.log("Player '" + playerToAdd + "' does not exist and was not added to the game")*/
            } else {
                players.push(i_playerToAdd);
                i_playerToAdd.addCardsToHand(m_Deck.drawCards(NUM_STARTING_CARDS));
                console.log("GameID (" + gameID + "): " + i_playerToAdd.getName() + " has joined the game");
                if (players.length === numPlayersToStartGame) {
                    startGame();
                }
                playerAdded = true;
            }
            return playerAdded;
        },

        takeCardsFromDeck: function () {
            // if there is only one card left add the cards from the table to the deck so the deck won't remain empty
            // check if there is a possible move that the player can make
            var card = players[activePlayerIndex].getPossibleMove(isValidMove);
            if (card !== null) {
                throw new Error("Cannot take card from deck when there is a possible move. \nThe card that can be places is: " + card.getColor() + ", " + card.getValue());
            }

            // check that there are enough cards in the deck
            if ((m_Deck.getSize() <= 1) ||
                (gameState.gameState === GameState.OPEN_PLUS_2 && m_CardsOnTable.getSize() <= gameState.additionalInfo + 1)) {
                moveCardsFromTableToDeck();
            }

            var cardsTaken = [];
            try {
                if (gameState.gameState === GameState.OPEN_PLUS_2) {
                    cardsTaken = m_Deck.drawCards(gameState.additionalInfo);
                    gameState.gameState = null;
                    gameState.additionalInfo = null;
                } else {
                    cardsTaken = m_Deck.drawCards(1);
                }

                players[activePlayerIndex].addCardsToHand(cardsTaken);
            } catch (e) {
                // TODO handle error
                console.log(e.message);
            }
            return cardsTaken;
        },

        viewTopCardOnTable: function () {
            return m_CardsOnTable.viewTopCard();
        },

        makeMove: function (cardPlaced) {
            var testMessage = "################################################\n" +
                " player.makeMove() will run ! counter:" + x +
                "\n################################################\n";
            console.log(testMessage);
            x++;

            if (!isValidMove(cardPlaced)) {
                throw new Error("Invalid move!");
            }
            var cardValue = cardPlaced.getValue();
            var activePlayer = players[activePlayerIndex];
            activePlayer.removeCardFromHand(cardPlaced);

            m_CardsOnTable.putCardOnTable(cardPlaced);
            if (cardValue === SpecialCard.STOP) {
                activePlayerIndex = (activePlayerIndex + 2) % players.length;
            } else if (cardValue === SpecialCard.TAKI) {
                gameState.gameState = GameState.OPEN_TAKI;
                gameState.additionalInfo = cardPlaced.getColor();
            } else if (cardValue === SpecialCard.CHANGE_COLOR) {
                // TODO get color from user
            } else if (cardValue === SpecialCard.PLUS_2) {
                // TODO implement
            } else {
                if (
                    (gameState.gameState === GameState.OPEN_TAKI && players[activePlayerIndex].hasCardOfColor(gameState.additionalInfo)) ||
                    (gameState.gameState === GameState.OPEN_PLUS)
                ) {
                    // player gets another turn;
                } else {
                    if (gameState.gameState === GameState.OPEN_TAKI && !players[activePlayerIndex].hasCardOfColor(color)) {
                        gameState.gameState = GameState.CLOSE_TAKI;
                    }
                    activePlayerIndex = (activePlayerIndex + 1) % players.length;
                }
            }

            if (activePlayer.getCardsRemainingNum() === 0) {
                activePlayer.setIsWinner(true);
                gameState.gameState = GameState.GAME_ENDED;
                // TODO game ended - show statistics
            }
        },
    }
})(2, "Taki Man");
