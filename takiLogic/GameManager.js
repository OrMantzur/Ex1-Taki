// ==================================================================================================================================
// ====================================================     global variables     ====================================================
// ==================================================================================================================================

var CARD_VALUES = ["1", "3", "4", "5", "6", "7", "8", "9", "stop", "taki"];
var COLORS = ["red", "green", "blue", "yellow"];

// ==================================================================================================================================
// ====================================================     Game Management      ====================================================
// ==================================================================================================================================
var GameManager = (function () {
    var games = [];
    return {
        createNewGame: function (numPlayers, gameID) {
            var gameCreated = null;
            // if game doesn't exist
            if (games.findIndex(game => gameID === game.getGameId()) === -1) {
                gameCreated = Game(numPlayers, gameID);
                games.push(gameCreated);
                console.log("GameID (" + gameID + "): " + " Game successfully created");
            } else {
                console.log("Game was not created, GameID '" + gameID + "' already exists");
            }
            return gameCreated;
        }
    }
})();

function Game(i_numPlayersToStartGame, i_GameID) {
    var gameIsActive = false;
    var gameID = i_GameID;
    var players = [];
    var numPlayersToStartGame = i_numPlayersToStartGame;
    var startGame = function () {
        gameIsActive = true;
        console.log("GameID (" + gameID + "): The game has started")
        //    TODO do stuff
    };
    return {
        deck: Deck(),
        cardsOnTable: CardsOnTable(),
        getGameId: function () {
            return gameID;
        },
        /**
         * @return {boolean}
         */
        isActive: function () {
            return gameIsActive;
        },
        addPlayerToGame: function (playerToAdd) {
            if (gameIsActive || players.length >= numPlayersToStartGame) {
                console.log("Cannot add another player, game is full or has already started")
            } else {
                players.push(playerToAdd);
                console.log("GameID (" + gameID + "): " + playerToAdd + " has joined the game")
                if (players.length === numPlayersToStartGame) {
                    startGame();
                }
            }
        },
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
            var randIndex = Math.floor(Math.random() * cards.length);
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
// ====================================================          Testing         ====================================================
// ==================================================================================================================================

var tests = function () {
    console.log("Running tests:");
    var game = GameManager.createNewGame(2, "test game");
    var game2 = GameManager.createNewGame(2, "test game");
    game.addPlayerToGame("p1");
    game.addPlayerToGame("p2");
    game.addPlayerToGame("p3");
    console.log("Current deck size: " + game.deck.getSize());
    console.log("Current cardsOnTable size: " + game.cardsOnTable.getSize());
    console.log("Pulling cards from deck:");
    for (var i = 0; i < 4; i++) {
        var cardDrawn = game.deck.drawCard();
        cardDrawn.printCardToConsole();
        console.log("Putting card on table:");
        game.cardsOnTable.putCardOnTable(cardDrawn);
        console.log("Current deck size: " + game.deck.getSize());
        console.log("Current cardsOnTable size: " + game.cardsOnTable.getSize());
    }
    console.log("Picking up cards from table");
    var pickedUpCards = game.cardsOnTable.takeAllButTopCard();
    game.deck.addCardsToDeck(pickedUpCards);
    console.log("Current deck size: " + game.deck.getSize());
    console.log("Current cardsOnTable size: " + game.cardsOnTable.getSize());
};

tests();
