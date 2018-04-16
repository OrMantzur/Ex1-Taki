// ==================================================================================================================================
// ====================================================     global variables     ====================================================
// ==================================================================================================================================

const CARD_VALUES = ["1", "3", "4", "5", "6", "7", "8", "9", "stop", "taki"];
const COLORS = ["red", "green", "blue", "yellow"];
const NUM_STARTING_CARDS = 8;

// ==================================================================================================================================
// ====================================================     Game Management      ====================================================
// ==================================================================================================================================
var GameManager = (function () {
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
        deleteGame: function (i_GameId, i_PlayerTryingToDelete) {
            var gameToDeleteIndex = games.findIndex(game => game.getGameId() === i_GameId);
            if (gameToDeleteIndex !== -1) {
                console.log("GameManager: The game '" + i_GameId + "' was not found so it has not been deleted")
            } else if (games[gameToDeleteIndex].getGameCreator() === i_PlayerTryingToDelete) {
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
})();

function Game(i_numPlayersToStartGame, i_GameID, i_GameCreator) {
    var gameCreator = i_GameCreator;
    var gameIsActive = false;
    var gameID = i_GameID;
    var playersInGame = [];
    var numPlayersToStartGame = i_numPlayersToStartGame;
    var m_Deck = Deck();
    var m_CardsOnTable = CardsOnTable();
    var startGame = function () {
        gameIsActive = true;
        console.log("GameID (" + gameID + "): The game has started")
        //    TODO do stuff
    };
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
        addPlayerToGame: function (i_playerNameToAdd) {
            var playerAdded = false;
            var playerToAdd;
            if (gameIsActive || playersInGame.length >= numPlayersToStartGame) {
                console.log("Cannot add another player, game is full or has already started")
            } else if ((playerToAdd = GameManager.getPlayerByName(i_playerNameToAdd)) === undefined) {
                console.log("Player '" + playerToAdd + "' does not exist and was not added to the game")
            } else {
                playersInGame.push(playerToAdd);
                console.log("GameID (" + gameID + "): " + playerToAdd + " has joined the game")
                if (playersInGame.length === numPlayersToStartGame) {
                    startGame();
                }
                playerAdded = true;
            }
            return playerAdded;
        },
        moveCardsFromTableToDeck: function () {
            var pickedUpCards = m_CardsOnTable.takeAllButTopCard();
            m_Deck.addCardsToDeck(pickedUpCards);
        }
    }
};
// ==================================================================================================================================
// ==================================================== deck and Card Management ====================================================
// ==================================================================================================================================

// TODO its the same like: var Card = function (i_Color, i_Value) {
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

// TODO its the same like: var Deck = function () {
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

    return {
        /**
         * draw and remove a random card from the deck
         * @return {Card}
         */
        drawCard: function () {
            var randIndex = Math.floor(Math.random() % cards.length);
            return cards.splice(randIndex, 1)[0];
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

function Player(i_PlayerName) {
    var playerName = i_PlayerName;
    var cards = [];
    var gameBeingPlayed = null;
    var isActive = false;
    var isWinner = false;

    function privateTakeCardsFromDeck(numCards) {
        // TODO how to check this?!
        // if (gameBeingPlayed instanceof Game) {
            for (var i = 0; i < numCards; i++) {
                cards.push(gameBeingPlayed.deck.drawCard());
            }
        // }
    };
    return {
        getName: function () {
            return playerName;
        },
        createNewGame: function (i_NumPlayers, i_GameId) {
            GameManager.createNewGame(i_NumPlayers, i_GameId, playerName);
        },
        deleteGame: function (i_GameId) {
            GameManager.deleteGame(i_GameId, playerName);
        },
        joinGame: function (game) {
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
        },
        takeCardsFromDeck: function(numCards){
          return privateTakeCardsFromDeck(numCards);
        },
        // TODO add put card on table
        // TODO add canPutOnTable
    }
}

// ==================================================================================================================================
// ====================================================          Testing         ====================================================
// ==================================================================================================================================

var tests = function () {
    console.log("Running tests:");
    var game = GameManager.createNewGame(2, "test game");
    var player1 = Player("p1");
    var player2 = Player("p2");
    GameManager.addNewPlayer(player1);
    GameManager.addNewPlayer(player2);
    player1.joinGame(game);
    console.log("Current deck size: " + game.deck.getSize());
    console.log("Current cardsOnTable size: " + game.cardsOnTable.getSize());
    player2.joinGame(game);
    console.log("Picking up cards from table");

    game.moveCardsFromTableToDeck();

    console.log("Current deck size: " + game.deck.getSize());
    console.log("Current cardsOnTable size: " + game.cardsOnTable.getSize());
};

tests();
