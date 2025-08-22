const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type")
    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },
    playersSides: {
        player1: "player-cards",
        player1BOX: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBOX: document.querySelector("#computer-cards"),
    },
    actions:{
        button: document.getElementById("next-duel"),
        infoBtn: document.getElementById("info"),       
        closeBtn: document.getElementById("closeBtn"),
    },
    screen:{
        info: document.getElementById("infoScreen"),
        modal: document.getElementById("modalOverlay"),
    } 
};    

const pathImages = "./src/assets/icons/"
const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}white-dragon-card.png`,
        WinOf:[1, 4],
        LoseOf:[2, 3]
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}dark-magician-card.png`,
        WinOf:[2, 3],
        LoseOf:[0, 4]
    },
    {
        id: 2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia-card.png`,
        WinOf:[0, 3],
        LoseOf:[1, 4]
    }
    ,
    {
        id: 3,
        name: "Red Eyes Black Dragon",
        type: "Lizard",
        img: `${pathImages}black-dragon-card.png`,
        WinOf:[0, 4],
        LoseOf:[1, 2]
    }
    ,
    {
        id: 4,
        name: "Magician of Black Chaos",
        type: "Spock",
        img: `${pathImages}magician-chaos-card.png`,
        WinOf:[1, 2],
        LoseOf:[0, 3]
    }
];

let infoScreenActived = false

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImage(IdCard, fieldSide) {
    const cardimage = document.createElement("img");
    cardimage.setAttribute("height", "100px");
    cardimage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardimage.setAttribute("data-id", IdCard);
    cardimage.setAttribute("class", "card");
    cardimage.classList.add("card");

    if(fieldSide === state.playersSides.player1){
        cardimage.addEventListener("mouseover", () => {
        drawSelectCard(IdCard);
         });

        cardimage.addEventListener("touchstart", () => {
            drawSelectCard(IdCard);
        });

        cardimage.addEventListener("touchend", () => {
            drawSelectCard(null);
        });

        cardimage.addEventListener("click", () => {
            setCardsField(cardimage.getAttribute("data-id"));
        });
    }  

    return cardimage;
} 

async function setCardsField(cardId) {
    await removeAllCardsImages();
    
    let computerCardId = await getRandomCardId();

    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";

    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
}

async function removeAllCardsImages() {
    state.playersSides.player1BOX.innerHTML = "";
    state.playersSides.computerBOX.innerHTML = "";
}

async function checkDuelResults(playerCardId, computerCardId) {
    let duelResult = "Draw";
    let playerCard = cardData[playerCardId];

    if (playerCard.WinOf.includes(computerCardId)) {
        duelResult = "Win";
        await playAudio("win");
        state.score.playerScore++;
    }

    if (playerCard.LoseOf.includes(computerCardId)) {
        duelResult = "Lose";
        await playAudio("lose");
        state.score.computerScore++;
    }

    return duelResult;
}

async function drawButton(text) {
    state.actions.button.innerText = text;
    state.actions.button.style.display = "block";

}

async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore} `
}

async function drawSelectCard(IdCard) {
    state.cardSprites.avatar.style.display = "block";
    state.cardSprites.avatar.src = cardData[IdCard].img;
    state.cardSprites.name.innerText = cardData[IdCard].name;
    state.cardSprites.type.innerText = `Attribute: ${cardData[IdCard].type}`;
}

async function drawCards(cardNumber, fieldSide) {
    for(let i = 0; i < cardNumber; i++){
        const IdCard = cardData[i].id;
        const cardimage = await createCardImage(IdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardimage);
    }
}

async function resetDuel(){
    state.cardSprites.avatar.src = "";
    state.cardSprites.name.innerText = "Select";
    state.cardSprites.type.innerText = "a card";
    state.actions.button.style.display = "none";

    state.fieldCards.computer.style.display = "none";
    state.fieldCards.player.style.display = "none";
    state.cardSprites.avatar.style.display = "none";

    init()
}

async function playAudio(status){
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.volume = .05;
    audio.play();
}

async function infoDetails() {
    if(!infoScreenActived){
        state.screen.info.style.display = "flex";
        state.screen.modal.style.display = "block";
        infoScreenActived = true;
        
    }
    else{
        state.screen.info.style.display = "none";
        state.screen.modal.style.display = "none";
        infoScreenActived = false;
    }
}

function init(){
    drawCards(5, state.playersSides.player1);
    drawCards(5, state.playersSides.computer);

    const bgm = document.getElementById("bgm");
    bgm.volume = .1;
    bgm.play();
}

init();