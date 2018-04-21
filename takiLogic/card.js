/**
 * Dudi Yecheskel - 200441749
 * Or Mantzur - 204311997
 */

const NUMBER_CARD = ["1", "3", "4", "5", "6", "7", "8", "9"];
const SpecialCard = {
    TAKI: "taki",
    STOP: "stop",
    CHANGE_COLOR: "changeColor",
    PLUS: "plus",
    // TODO advance game
    PLUS_2: "+2",
    SUPER_TAKI: "superTaki"
};
const Color = {
    allColor:["red","green","blue","orange"],

    getRandomColor: function(){
        var randomIndex =Math.floor((Math.random() * 10) %  Object.keys(Color.allColor).length);
        return Color.allColor[randomIndex];
    }
};
Card.nextFreeCardId = 0;

function Card(color, value) {
    const cardId = Card.nextFreeCardId++;
    const cardValue = value;
    var cardColor = color;

    return {
        getId: function () {
            return cardId;
        },

        getColor: function () {
            return cardColor;
        },

        getValue: function () {
            return cardValue;
        },

        setColor: function(color){
            if (cardValue !== SpecialCard.CHANGE_COLOR){
                throw new Error("color can only be changed for \"change color\" cards");
            }
            cardColor = color;
        },

        printCardToConsole: function () {
            console.log("Color: " + cardColor + ", Value: " + cardValue);
        }
    }
}

Card.isSpecialCard = function(card){
    for (const specialCardKey in SpecialCard) {
        if(card === SpecialCard[specialCardKey]){
            return true;
        }
    }
    return false;
};

