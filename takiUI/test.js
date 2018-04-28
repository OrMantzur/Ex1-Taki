// TODO delete that file

var game = Game(GameType.BASIC, 2, "Taki Man", "ex1");

function test() {
    console.log("Running tests:");
    var player1 = Player("p1", false);
    var player2 = Player("p2", true);
    game.addPlayerToGame(player1);
    game.addPlayerToGame(player2);
    console.log("Top card is: ");
    game.viewTopCardOnTable().printCardToConsole();
}

function onClickImgTest() {
    console.log("on click test !!");
    alert("on click test !!");
}

// test();
