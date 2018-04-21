/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

function drawCardOnScreen(parentId, playerId) {
    var playerCards = game.getPlayer(playerId).getCards();
    // one player cards row at the caller table
    var cardsRowElement = document.createElement("tr");
    var cardIndex = 0;

    //clear all children
    while (cardsRowElement.firstChild) {
        cardsRowElement.removeChild(cardsRowElement.firstChild);
    }
    document.getElementById(parentId).innerHTML = '';
    playerCards.forEach(card => {
        var cardElement = document.createElement("td");
        cardElement.setAttribute("id", cardIndex.toString());
        cardIndex++;
        cardElement.addEventListener("click", function () {
            game.makeMove(card);
            refreshCards();
            drawTopCard("topCard");
        });
        cardElement.textContent = card.getValue();
        cardElement.style = "color: " + card.getColor();
        cardsRowElement.appendChild(cardElement);
    });
    document.getElementById(parentId).appendChild(cardsRowElement);
}

function refreshCards() {
    drawCardOnScreen("player1CardsTable", 0);
    drawCardOnScreen("player2CardsTable", 1);
    // drawTopCard("topCard");
}

function drawTopCard(parentId) {
    var card = game.viewTopCardOnTable();
    var cardElement = document.getElementById(parentId);
    cardElement.innerHTML = card.getValue();
    cardElement.style = "color: " + card.getColor();
    // parentId.style = "color: red";
}

function initDeck(parentId){
    document.getElementById(parentId).addEventListener("click",function(){
        game.takeCardsFromDeck();
        refreshCards();
        drawTopCard("topCard");
    });
}
