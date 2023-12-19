//Criamos uma variavel states e dentro dela vamos cri objetos.
const state = {
    //Criamos o score que vai conta a pontuação
    score: {
        // jogador inicia com 0 pontos.
        playerScore:0,
        // computador começa com 0 pontos.
        computerScore:0,
        // Agora pegamos a class score_points que vai altera a pontuação no front
        scoreBox: document.getElementById("score_points"),
    },
    //criamos o local das imagens pegando os locais dela
    cardSprite: {
        // pegando imagem.
        avatar: document.getElementById("card-image"),
        // pegando o nome.
        name: document.getElementById("card-name"),
        // pegando tipo.
        type: document.getElementById("card-type"),
      },
      // pegando as cartes que seram comparadas
      fieldCards: {
        // pegando o play.
        player: document.getElementById("player-field-card"),
        // pegando o pc
        computer: document.getElementById("computer-field-card"),
      },
      // pegando o botão.
      button: document.getElementById("next-duel"),
};

// Vamos cria uma variavel players que vai quarda um objetos de um player1 e computer.
const player = {
    player1: "player-cards",
    computer: "computer-cards",
  };

// Vamos enumera as cartas usando um array.
const cardData = [
    {
      //configurações da catas.
      id: 0,
      name: "Blue Eyes White Dragon",
      type: "Paper",
      //local da imagen.
      img: "./src/assets/icons/dragon.png",
      //informando de quem essa carta ganha.
      WinOf: [1],
      LoseOf: [2],
    },
    {
      id: 1,
      name: "Dark Magician",
      type: "Rock",
      img: "./src/assets/icons/magician.png",
      WinOf: [2],
      LoseOf: [0],
    },
    {
      id: 2,
      name: "Exodia",
      type: "Scissors",
      img: "./src/assets/icons/exodia.png",
      WinOf: [0],
      LoseOf: [1],
    },
  ];

// Criamos um função assíncrona que vai da um id de uma carta aleaotoria.
async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
  }

  // Essa função vai de inicio vai remover as cartas, depois vai ser escolhida uma carta uma para o pc e checa o resulatdo
  async function setCardsField(cardId) {
    await RemoveAllCardImages();
  
    let computerCardId = await getRandomCardId();
  
    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
  
    let duelResults = await checkDuelResults(cardId, computerCardId);
  
    await updateScore();
    await drawButton(duelResults);
  }
  //essa função vai verifica quem ganhou
  async function checkDuelResults(playerCardId, computerCardId) {
    //pegando carta do player
    let playerCard = cardData[playerCardId];
    // Inicia como empate.
    let duelResults = "Empate";
  
    //checando se venceu
    if (playerCard.WinOf.includes(computerCardId)) {
      duelResults = "Ganhou";
      //chamando audio de vitoria.
      await playAudio("win");
      state.score.playerScore++;
    }
  
    //checando se perdeu
    if (playerCard.LoseOf.includes(computerCardId)) {
      duelResults = "Perdeu";
      //chamando audio de derrota.
      await playAudio("lose");
      state.score.computerScore++;
    }
  
    return duelResults;
  }
  
  // Cria os umafunção assíncrona que vai cruar as imagens na tela.
  async function createCardImage(randomIdCard, fieldSide) {
    //criando a imagem.
    const cardImage = document.createElement("img");
    //colocando tamanho.
    cardImage.setAttribute("height", "100px");
    // passando a imagens de 
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    //salvando o id da carta
    cardImage.setAttribute("data-id", randomIdCard);
    // vai adicionar a clase card
    cardImage.classList.add("card");
  
    // Se o lado do campo for igual ao player1 adicionamos o evento que vai exibir imagem quando ouvir um clik   
    if (fieldSide === player.player1) {
      cardImage.addEventListener("click", () => {
        setCardsField(cardImage.getAttribute("data-id"));
      });
      //quando passamos o mause por cima da carta que vai desenha a carta do lado esquerdo apenas aq for do player1.
      cardImage.addEventListener("mouseover", () => {
        drawSelectCard(randomIdCard);
      });
      
      //quando clicar na carta ele vai para area de comparação.
      cardImage.setAttribute("src", "./src/assets/icons/card-front.png");
    }
  
    return cardImage;
  }
  //Essa função remove as imagens da area de combate dos dois 
  async function RemoveAllCardImages() {
    let cards = document.querySelector(".card-box.framed#enemy-cards");
    let imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
  
    cards = document.querySelector(".card-box.framed#player-cards");
    imgElements = cards.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
  }
  
  // Criamos uma função assíncrona que vai sortea a cartas 
  async function drawCards(cardNumbers, fieldSide) {
    //pegando as cartas aleatotia.
    for (let i = 0; i < cardNumbers; i++) {
      const randomIdCard = await getRandomCardId();
      //quardando as imagens
      const cardImage = await createCardImage(randomIdCard, fieldSide);
     
      document.getElementById(fieldSide).appendChild(cardImage);
    }
  }
  
  //Essa Função que vai permite que vai ser exibia quando você passa o mouse a imgaem, nome e tipo .
  function drawSelectCard(index) {
    state.cardSprite.avatar.src = cardData[index].img;
    state.cardSprite.name.innerText = cardData[index].name;
    state.cardSprite.type.innerText = "Attribute: " + cardData[index].type;
  }
  //vai exibir o botão se ganhou ou perdeu com os textos
  async function drawButton(text) {
    state.button.innerText = text;
    state.button.style.display = "block";
  }
  
  //para reiniciar outro duelo.
  async function resetDuel() {
    //remove a carta da esquerda quando reiniciar
    state.cardSprite.avatar.src = "";
    //o botão vai desaparecer.
    state.button.style.display = "none";
  
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";
  
    //reiniciando as cartas.
    drawCards(5, player.player1);
    drawCards(5, player.computer);
  }
  
  //caregando audio de vitoria ou derota
  async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play();
  }
  
  //atualizando a pontuação.
  async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
  }
  
  function init() {
    drawCards(5, player.player1);
    drawCards(5, player.computer);
  
    const bgm = document.getElementById("bgm");
    bgm.play();
  }
  //criamos a função init que vai chama os metodos ela vai ser a primeira para chama o estado inicial.
function init(){
  drawCards(5, player.player1);
  drawCards(5, player.computer);

  const bgm = document.getElementById("bgm");
  bgm.play();
}


init();