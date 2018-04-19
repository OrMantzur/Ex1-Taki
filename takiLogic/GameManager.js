// ==================================================================================================================================
// ====================================================     global variables     ====================================================
// ==================================================================================================================================

const CARD_VALUES = ["1", "3", "4", "5", "6", "7", "8", "9", "stop", "taki"]; // "change color" is added manually in the "Deck" function
const COLORS = ["red", "green", "blue", "yellow"];
const NUM_STARTING_CARDS = 8;

// ==================================================================================================================================
// ====================================================     Game Management      ====================================================
// ==================================================================================================================================
/*var GameManager = (function () {
    var games = [];
    var allPlayers = [];
    return {
        createNewGame: function (numPlayers, gameID, gameCreator) {
            var gameCreated = null;
            // if game doesn't exist
            if (games.findIndex(game => gameID === game.getGameId()) === -1) {
                gameCreated = Game(numPlayers, gameID, gameCreator);
                games.push(gameCreated);
                console.log("GameID (" + gameID + "): " + " Game successfully created");
            } else {
                console.log("Game was not created, GameID '" + gameID + "' already exists");
            }
            return gameCreated;
        },
        /!**
         * only who create the game can delete it
         * @param i_GameId
         * @param i_PlayerTryingToDelete
         *!/
        deleteGame: function (i_GameId, i_PlayerTryingToDelete) {
            var gameToDeleteIndex = games.findIndex(game => game.getGameId() === i_GameId);
            if (gameToDeleteIndex !== -1) {
                console.log("GameManager: The game '" + i_GameId + "' was not found so it has not been deleted")
            }
            // TODO you mean !== ??
            else if (games[gameToDeleteIndex].getGameCreator() === i_PlayerTryingToDelete) {
                console.log("GameManager: The game '" + i_GameId + "' was not created by " + i_PlayerTryingToDelete + " so it has not been deleted")
            } else {
                games.splice(gameToDeleteIndex, 1);
                console.log("GameManager: The game '" + i_GameId + "' has been deleted")
            }
        },
        addNewPlayer: function (i_Player) {
            if (allPlayers.findIndex(player => player === i_Player) === -1) {
                allPlayers.push(i_Player);
                console.log("Player '" + i_Player.getName() + "' was added to all players list");
            } else {
                console.log("Player '" + i_Player.getName() + "' already exists");
            }
        },
        removePlayer: function (i_Player) {
            var playerIndex = allPlayers.findIndex(player => player === i_Player)
            if (playerIndex !== -1) {
                allPlayers.splice(playerIndex, 1);
                console.log("Player '" + i_Player.getName() + "' was removed from all players list");
            } else {
                console.log("Player '" + i_Player.getName() + "' does not exist");
            }
        },
        getPlayerByName: function (i_PlayerName) {
            return allPlayers.find(player => player.getName() === i_PlayerName);
        },
        printAllPlayers: function () {
            allPlayers.forEach(player => console.log(player.getName() + ", "))
        }
    }
})();*/

var Game = (function (i_numPlayersToStartGame, i_GameID, i_GameCreator) {
    var gameCreator = i_GameCreator;
    var gameIsActive = false;
    var gameID = i_GameID;
    var playersInGame = [];
    var numPlayersToStartGame = i_numPlayersToStartGame;
    var m_Deck = Deck();
    var m_CardsOnTable = CardsOnTable();
    var activePlayerIndex = 0;
    var gameState = {
        currColor: null,
        gameState: null,
        additionalInfo: null // TODO will be used for counter on +2
    };
    var startGame = function () {
        gameIsActive = true;
        console.log("GameID (" + gameID + "): The game has started")
        playersInGame[activePlayerIndex].startTurn();
        try {
            m_CardsOnTable.putCardOnTable(m_Deck.drawCards(1)[0]);
        } catch (e) {
            // TODO handle error
        }
        //    TODO do stuff
    };

    function isValidMove(cardPlaced) {
        var isValid = true;
        var topCardOnTable = m_CardsOnTable.viewTopCard();
        if (gameState.gameState === "takiOpen") {
            isValid = topCardOnTable.getColor() === cardPlaced.getColor();
        }
        if (gameState.gameState === "superTaki") {
            // TODO advanced game
        } else if (gameState.gameState === "change color") {
            isValid = true; //TODO can i put anything on change color?
        } else if (gameState.gameState === "+2_open") {
            isValid = cardPlaced.getValue() === "+2";
        } else {
            isValid =
                (topCardOnTable.getColor() === cardPlaced.getColor()) ||
                (topCardOnTable.getValue() === cardPlaced.getValue());
        }

        return isValid;
    }

    function moveCardsFromTableToDeck() {
        var pickedUpCards = m_CardsOnTable.takeAllButTopCard();
        m_Deck.addCardsToDeck(pickedUpCards);
    }

    function makeComputerPlayerMove() {

    }

    return {
        deck: m_Deck,
        cardsOnTable: m_CardsOnTable,
        getGameId: function () {
            return gameID;
        },
        getGameCreator: function () {
            return gameCreator;
        },
        /**
         * @return {boolean}
         */
        isActive: function () {
            return gameIsActive;
        },
        addPlayerToGame: function (i_playerToAdd) {
            var playerAdded = false;
            if (gameIsActive || playersInGame.length >= numPlayersToStartGame) {
                console.log("Cannot add another player, game is full or has already started")
                /*            } else if ((playerToAdd = GameManager.getPlayerByName(i_playerNameToAdd)) === undefined) {
                                console.log("Player '" + playerToAdd + "' does not exist and was not added to the game")*/
            } else {
                playersInGame.push(i_playerToAdd);
                i_playerToAdd.addCardsToHand(m_Deck.drawCards(NUM_STARTING_CARDS));
                console.log("GameID (" + gameID + "): " + i_playerToAdd.getName() + " has joined the game");
                if (playersInGame.length === numPlayersToStartGame) {
                    startGame();
                }
                playerAdded = true;
            }
            return playerAdded;
        },
        takeCardsFromDeck: function () {
            // if there is only one card left add the cards from the table to the deck so the deck won't remain empty
            // check if there is a possible move that the player can make
            var card = playersInGame[activePlayerIndex].getPossibleMove(isValidMove);
            if (card !== null) {
                throw new Error("Cannot take card from deck when there is a possible move. \nThe card that can be places is: " + card.getColor() + ", " + card.getValue());
            }

            // check that there are enough cards in the deck
            if ((m_Deck.getSize() <= 1) ||
                (gameState.gameState === "+2_Open" && m_CardsOnTable.getSize() <= gameState.additionalInfo + 1)) {
                moveCardsFromTableToDeck();
            }

            var cardsTaken = [];
            try {
                if (gameState.gameState === "+2_Open") {
                    cardsTaken = m_Deck.drawCards(gameState.additionalInfo);
                    gameState.gameState = null;
                    gameState.additionalInfo = null;
                } else {
                    cardsTaken = m_Deck.drawCards(1);
                }

                playersInGame[activePlayerIndex].addCardsToHand(cardsTaken);
            } catch (e) {
                // TODO handle error
                console.log(e.message);
            }
            return cardsTaken;
        },
        makeMove: function (cardPlaced) {
            if (!isValidMove(cardPlaced)) {
                throw new Error("Invalid move!");
            }
            var cardValue = cardPlaced.getValue();
            var activePlayer = playersInGame[activePlayerIndex];
            activePlayer.removeCardFromHand(cardPlaced);

            m_CardsOnTable.putCardOnTable(cardPlaced);
            if (cardValue === "stop") {
                activePlayerIndex = (activePlayerIndex + 2) % playersInGame.length;
            } else if (cardValue === "taki") {
                gameState.gameState = "takiOpen";
                gameState.additionalInfo = cardPlaced.getColor();
            } else if (cardValue === "change color") {
                // TODO get color from user
            } else if (cardValue === "+2") {
                // TODO implement
            } else {
                if (
                    (gameState.gameState === "takiOpen" && playersInGame[activePlayerIndex].hasCardOfColor(gameState.additionalInfo)) ||
                    (gameState.gameState === "+")
                ) {
                    // player gets another turn;
                } else {
                    if (gameState.gameState === "takiOpen" && !playersInGame[activePlayerIndex].hasCardOfColor(color)) {
                        gameState.gameState = "takiClosed";
                    }
                    activePlayerIndex = (activePlayerIndex + 1) % playersInGame.length;
                }
            }

            if (activePlayer.getCardsRemaining() === 0) {
                activePlayer.setIsWinner(true);
                gameState.gameState = "Game ended - Player won";
                // TODO game ended - show statistics
            }
        },
        getActivePlayer: function () {
            return playersInGame[activePlayerIndex];
        }
    }
})(2, "Ex01", "Taki Man");

// ==================================================================================================================================
// ==================================================== deck and Card Management ====================================================
// ==================================================================================================================================

function Card(color, value) {
    const cardColor = color;
    const cardValue = value;
    return {
        getColor: function () {
            return cardColor;
        },
        getValue: function () {
            return cardValue;
        },
        printCardToConsole: function () {
            console.log("Color: " + cardColor + ", Value: " + cardValue);
        }
    }
}

function Deck() {
    var cards = [];

    // init deck
    COLORS.forEach(function (color) {
        CARD_VALUES.forEach(function (val) {
            cards.push(Card(color, val));
            cards.push(Card(color, val));
        });
    });
    for (var i = 0; i < 4; i++) {
        cards.push(new Card("no color", "change color"));
    }

    function drawCard() {
        if (cards.length === 0) {
            throw new Error("DeckEmpty");
        }
        var randIndex = Math.floor((Math.random() * 100) % cards.length);
        return cards.splice(randIndex, 1)[0];
    }

    ''

    return {
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
                })
            } else {
                console.log("Error in 'TakeCardsFromTableToDeck', parameter must be an array");
            }
        }
    }
}

function CardsOnTable() {
    var cards = [];
    return {
        putCardOnTable: function (card) {
            cards.push(card);
        },
        takeAllButTopCard: function () {
            var pickedUpCards = null;
            if (cards.length > 0) {
                pickedUpCards = cards.splice(1, cards.length - 1);
            }
            return pickedUpCards;
        },
        viewTopCard: function () {
            var topCard = null;
            if (cards.length > 0) {
                topCard = cards[cards.length - 1];
            }
            return topCard;
        },
        pickUpTopCard: function () {
            var topCard = null;
            if (cards.length > 0) {
                topCard = cards.pop();
            }
            return topCard;
        },
        /**
         * @return {number}
         */
        getSize: function () {
            return cards.length;
        }
    }
}

// ==================================================================================================================================
// ====================================================     Player Management    ====================================================
// ==================================================================================================================================

function Player(i_PlayerName, i_IsComputer) {
    var playerName = i_PlayerName;
    var isComputer = i_IsComputer;
    var cards = [];
    // var gameBeingPlayed = null;
    var isActive = false;
    var isWinner = false;

    /*    function privateTakeCardsFromDeck(numCards) {
            // TODO how to check this?! maybe check the name of the function in meta data(that is Game)
            // if (gameBeingPlayed instanceof Game) {
            for (var i = 0; i < numCards; i++) {
                cards.push(gameBeingPlayed.deck.drawCards());
            }
            // }
        };*/
    return {
        getName: function () {
            return playerName;
        },
        /*        createNewGame: function (i_NumPlayers, i_GameId) {
                    GameManager.createNewGame(i_NumPlayers, i_GameId, playerName);
                },
                deleteGame: function (i_GameId) {
                    GameManager.deleteGame(i_GameId, playerName);
                },*/
        /*        joinGame: function (game) {
                    if (gameBeingPlayed !== null) {
                        console.log("Player " + playerName + ": cannot join game, already playing in '" + gameBeingPlayed.getGameId() + "'")
                    }
                    // TODO how to check this?!
                    // if (game instanceof Game) {
                    gameBeingPlayed = game;
                    if (game.addPlayerToGame(playerName) === true) {
                        privateTakeCardsFromDeck(NUM_STARTING_CARDS);
                    } else {
                        console.log("Player " + playerName + ": cannot join game '" + game.getGameId() + "'")
                    }
                    // }
                },*/
        /*        takeCardsFromDeck: function (numCards) {
                    return privateTakeCardsFromDeck(numCards);
                },*/
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
        startTurn: function () {
            isActive = true;
        },
        getCardsRemaining: function () {
            return cards.length;
        },
        setIsWinner: function (i_IsWinner) {
            isWinner = i_IsWinner;
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
        hasCardOfColor: function (color) {
            return cards.findIndex(card => card.getColor() === color) > 0;
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

// ==================================================================================================================================
// ====================================================          Testing         ====================================================
// ==================================================================================================================================

var tests = function () {
    console.log("Running tests:");
    var player1 = Player("p1", false);
    var player2 = Player("p2", true);
    Game.addPlayerToGame(player1);
    Game.addPlayerToGame(player2);
    console.log("Top card is: ");
    Game.cardsOnTable.viewTopCard().printCardToConsole();
};

tests();
