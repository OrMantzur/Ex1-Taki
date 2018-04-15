// ==================================================================================================================================
// ====================================================     global variables     ====================================================
// ==================================================================================================================================

var cardValues = ["1", "3", "4", "5", "6", "7", "8", "9", "stop", "taki"];
var colors = ["red", "green", "blue", "yellow"];

// ==================================================================================================================================
// ====================================================     Game Management      ====================================================
// ==================================================================================================================================
var GameManager = (function () {
    var Games = [];
    return {
        CreateNewGame: function (numPlayers, gameID) {
            var gameCreated = null;
            if (Games.findIndex(game => gameID === game.ID()) === -1) {
                gameCreated = Game(numPlayers, gameID);
                Games.push(gameCreated);
                console.log("GameID (" + gameID + "): " + " Game successfully created");
            } else {
                console.log("Game was not created, GameID '" + gameID + "' already exists");
            }
            return gameCreated;
        }
    }
})();

var Game = function (i_numPlayersToStartGame, i_GameID) {
    var gameIsActive = false;
    var gameID = i_GameID;
    var players = []
    var numPlayersToStartGame = i_numPlayersToStartGame;
    var StartGame = function () {
        gameIsActive = true;
        console.log("GameID (" + gameID + "): The game has started")
        //    TODO do stuff
    };
    return {
        Deck: Deck(),
        CardsOnTable: CardsOnTable(),
        ID: function () {
            return gameID;
        },
        /**
         * @return {boolean}
         */
        IsActive: function () {
            return gameIsActive;
        },
        AddPlayerToGame: function (playerToAdd) {
            if (gameIsActive || players.length >= numPlayersToStartGame) {
                console.log("Cannot add another player, game is full or has already started")
            } else {
                players.push(playerToAdd);
                console.log("GameID (" + gameID + "): " + playerToAdd + " has joined the game")
                if (players.length === numPlayersToStartGame) {
                    StartGame();
                }
            }
        },
    }
};
// ==================================================================================================================================
// ==================================================== Deck and Card Management ====================================================
// ==================================================================================================================================

var Card = function (i_Color, i_Value) {
    var cardColor = i_Color;
    var cardValue = i_Value;
    return {
        GetColor: function () {
            return cardColor;
        },
        GetValue: function () {
            return cardValue;
        },
        PrintCardToConsole: function () {
            console.log("Color: " + cardColor + ", Value: " + cardValue);
        }
    }
};

var Deck = function () {
    var cards = [];

    // init deck
    colors.forEach(function (color) {
        cardValues.forEach(function (val) {
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
        DrawCard: function () {
            var randIndex = Math.floor(Math.random() * cards.length);
            return cards.splice(randIndex, 1)[0];
        },
        /**
         * returns the number of cards currently in the deck
         * @return {number}
         */
        GetSize: function () {
            return cards.length;
        },
        AddCardsToDeck: function (cardsToAdd) {
            if (cardsToAdd instanceof Array && cardsToAdd.length > 0) {
                cardsToAdd.forEach(function (card) {
                    cards.push(card);
                })
            } else {
                console.log("Error in 'TakeCardsFromTableToDeck', parameter must be an array");
            }
        }
    }
};

var CardsOnTable = function () {
    var cards = [];
    return {
        PutCardOnTable: function (card) {
            cards.push(card);
        },
        TakeAllButTopCard: function () {
            var pickedUpCards = null;
            if (cards.length > 0) {
                pickedUpCards = cards.splice(1, cards.length - 1);
            }
            return pickedUpCards;
        },
        ViewTopCard: function () {
            var topCard = null;
            if (cards.length > 0) {
                topCard = cards[cards.length - 1];
            }
            return topCard;
        },
        PickUpTopCard: function () {
            var topCard = null;
            if (cards.length > 0) {
                topCard = cards.pop();
            }
            return topCard;
        },
        /**
         * @return {number}
         */
        GetSize: function () {
            return cards.length;
        }
    }
};

// ==================================================================================================================================
// ====================================================          Testing         ====================================================
// ==================================================================================================================================

var tests = function () {
    console.log("Running tests:");
    var game = GameManager.CreateNewGame(2, "test game");
    var game2 = GameManager.CreateNewGame(2, "test game");
    game.AddPlayerToGame("p1");
    game.AddPlayerToGame("p2");
    game.AddPlayerToGame("p3");
    console.log("Current Deck size: " + game.Deck.GetSize());
    console.log("Current cardsOnTable size: " + game.CardsOnTable.GetSize());
    console.log("Pulling cards from deck:");
    for (var i = 0; i < 4; i++) {
        var cardDrawn = game.Deck.DrawCard();
        cardDrawn.PrintCardToConsole();
        console.log("Putting card on table:");
        game.CardsOnTable.PutCardOnTable(cardDrawn);
        console.log("Current Deck size: " + game.Deck.GetSize());
        console.log("Current cardsOnTable size: " + game.CardsOnTable.GetSize());
    }
    console.log("Picking up cards from table");
    var pickedUpCards = game.CardsOnTable.TakeAllButTopCard();
    game.Deck.AddCardsToDeck(pickedUpCards);
    console.log("Current Deck size: " + game.Deck.GetSize());
    console.log("Current cardsOnTable size: " + game.CardsOnTable.GetSize());
};

tests();
