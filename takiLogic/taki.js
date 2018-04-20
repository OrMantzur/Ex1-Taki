// ==================================================================================================================================
// ====================================================     global variables     ====================================================
// ==================================================================================================================================

const CARD_VALUES = ["1", "3", "4", "5", "6", "7", "8", "9", "stop", "taki"]; // "change color" is added manually in the "Deck" function
const COLORS = ["red", "green", "blue", "yellow"];
const NUM_STARTING_CARDS = 8;
//TODO con
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

//TODO con
const SpecialCard = {
    SUPER_TAKI: "superTaki",
    TAKI: "taki",
    CHANGE_COLOR: "changeColor",
    CHANGE_DIRECTION: "changeDirection",
    PLUS: "plus",
    PLUS_2: "+2",
    STOP: "stop",
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


// ==================================================================================================================================
// ====================================================     Player Management    ====================================================
// ==================================================================================================================================

function Player(i_PlayerName, i_IsComputer) {
    var playerId;
    var playerName = i_PlayerName;
    var isComputer = i_IsComputer;
    var cards = [];
    // var gameBeingPlayed = null;
    var isActive = false;
    var isWinner = false;

    /*    function privateTakeCardsFromDeck(numCards) {
            // TODO how to check this?! maybe check the name of the function in meta data(that is game)
            // if (gameBeingPlayed instanceof game) {
            for (var i = 0; i < numCards; i++) {
                cards.push(gameBeingPlayed.deck.drawCards());
            }
            // }
        };*/
    return {
        setIsWinner: function (i_IsWinner) {
            isWinner = i_IsWinner;
        },

        getId: function () {
            return playerId;
        },

        getName: function () {
            return playerName;
        },

        hasCardOfColor: function (color) {
            return cards.findIndex(card => card.getColor() === color) > 0;
        },

        getCards: function () {
            return cards;
        },

        getCardsRemainingNum: function () {
            return cards.length;
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

        startTurn: function () {
            isActive = true;
        },

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
// ==================================================== deck and Card Management ====================================================
// ==================================================================================================================================

function Card(color, value) {
    // TODO auto
    const cardId = 1;
    const cardColor = color;
    const cardValue = value;
    return {
        // getter
        getId: function () {
            return cardId;
        },

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
    const NUMBER_OF_CHANGE_COLOR_CARD = 4;
    for (var i = 0; i < NUMBER_OF_CHANGE_COLOR_CARD; i++) {
        cards.push(new Card("no color", "change color"));
    }

    function drawCard() {
        if (cards.length === 0) {
            throw new Error("DeckEmpty");
        }
        var randIndex = Math.floor((Math.random() * 100) % cards.length);
        return cards.splice(randIndex, 1)[0];
    }

    return {
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
        },

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
    }
}

function CardsOnTable() {
    var cards = [];
    return {
        getSize: function () {
            return cards.length;
        },

        putCardOnTable: function (card) {
            cards.push(card);
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

        takeAllButTopCard: function () {
            var pickedUpCards = null;
            if (cards.length > 0) {
                pickedUpCards = cards.splice(1, cards.length - 1);
            }
            return pickedUpCards;
        },
    }
}


// ==================================================================================================================================
// ==================================================== UI Utils ====================================================
// ==================================================================================================================================
function drawCardOnScreen(parentId, playerId) {
    var playerCards = game.getPlayer(playerId).getCards();
    // one player cards row at the caller table
    var cardsRowElement = document.createElement("tr");
    var cardIndex = 0;

    playerCards.forEach(card => {
        var cardElement = document.createElement("td");
        cardElement.setAttribute("id", cardIndex.toString());
        cardIndex++;
        cardElement.setAttribute("onclick", "game.makeMove()");
        cardElement.textContent = card.getValue();
        cardsRowElement.appendChild(cardElement);
    });
    document.getElementById(parentId).appendChild(cardsRowElement);
}

// ==================================================================================================================================
// ====================================================          Testing         ====================================================
// ==================================================================================================================================

// var game = Game(2, "test", "orm");

function test() {
    console.log("Running tests:");
    var player1 = Player("p1", false);
    var player2 = Player("p2", true);
    game.addPlayerToGame(player1);
    game.addPlayerToGame(player2);
    console.log("Top card is: ");
    game.viewTopCardOnTable().printCardToConsole();
}

// ####################################################
test();
// ####################################################
