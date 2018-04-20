
// TODO delete that file

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

test();
