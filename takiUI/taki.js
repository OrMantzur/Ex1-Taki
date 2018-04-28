/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

function drawCardOnScreen(playerId, containerId) {
    var playerCards = game.getPlayer(playerId).getCards();
    var playerCardsContainer = document.getElementById(containerId);

    //clear all children
    while (playerCardsContainer.firstChild) {
        playerCardsContainer.removeChild(playerCardsContainer.firstChild);
    }

    // set card onClick
    playerCards.forEach(function (card) {
        var cardElement = createCardElement(card, true);
        cardElement.addEventListener("click", function () {
            var screenOverlay = document.getElementById("player-overlay");
            var deck = document.getElementById("deck");
            var deckClassSaver = deck.getAttribute("class");

            // disable player card
            screenOverlay.style.display = "block";
            // disable deck
            deck.setAttribute("class", deckClassSaver + " disabled-button");

            setTimeout(function () {
                game.makeMove(card);
                screenOverlay.style.display = "none";
                deck.setAttribute("class", deckClassSaver);
                refreshCards();
            }, 100);
        });
        playerCardsContainer.appendChild(cardElement);
    });
}

function createCardElement(card, isClickable) {
    var cardElement = document.createElement("div");
    var cardColor = card.getColor() !== null ? card.getColor() : "noColor";
    // cardElement.setAttribute("id", cardIndex.toString());
    cardElement.setAttribute("class", "card " + cardColor + (isClickable ? " clickable-card" : ""));
    cardElement.setAttribute("cardValue", card);
    if (card.getValue().length > 1)
        cardElement.className += " textCard";
    cardElement.textContent = card.getValue();
    return cardElement;
}

function drawTopCard(parentId) {
    var card = game.viewTopCardOnTable();
    var deckElement = document.getElementById(parentId);
    var cardElement = createCardElement(card, false);
    while (deckElement.firstChild)
        deckElement.removeChild(deckElement.firstChild);
    deckElement.appendChild(cardElement);
}

function refreshCards() {
    drawCardOnScreen(0, 'player-container');
    drawCardOnScreen(1, 'player-container2');
    drawTopCard("topCard");
}

function clickedDeck() {
    game.takeCardsFromDeck();
    refreshCards();
}
