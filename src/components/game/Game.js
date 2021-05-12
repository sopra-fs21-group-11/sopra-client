/* eslint-disable jsx-a11y/anchor-is-valid */
import React  from "react";
import styled from "styled-components";
import { BaseContainer } from "../../helpers/layout";
import { api } from "../../helpers/api";
import { withRouter } from "react-router-dom";
import Error from "../../views/Error";
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import {Evaluation} from './Evaluation';

import token from "../../views/Token.png";
import {Button} from "../../views/design/Button";
import Card from "../../views/design/Card";
import SockJS from "sockjs-client";
import * as Stomp from "@stomp/stompjs";
import {getDomain} from "../../helpers/getDomain";
import ReactLoading from 'react-loading';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import DirectionCard from "../../views/design/DirectionCard";


const Container = styled(BaseContainer)`
  overflow: hidden;
  display: flex;
  flex-direction: row;
`;

const Notification = styled(BaseContainer)`
  color: black;
  border: 4px black solid;
  width: 100vw;
  margin-left: 0;
  background: white;
  border-radius: 4px;
`;

const LeftFooter = styled(BaseContainer)`
  color: white;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 20vw;
  margin: 0;
  padding-right: 0.25vw;
  padding-left: 0.5vw;
  
`;

const RightFooter = styled(BaseContainer)`
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: right;
  width: 50vw;
  margin: 0;
  padding-right: 0.5vw;
  padding-left: 0.25vw;
`;

const MiddleFooter = styled(BaseContainer)`
  color: white;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  width: 30vw;
  margin: 0;
  padding-right: 0.25vw;
  padding-left: 0.25vw;
`;

const GameContainer = styled.div`
  width: 100vw;
  height: 100vh;
  margin: 0;
  position: absolute;
  bottom: 0;
  -ms-transform: translateY(0%);
  transform: translateY(0%);
`;

const Footer = styled.footer`
  color: white;
  position: absolute;
  width: 100vw;
  display: flex;
  flex-direction: row;
  height: 30vh;
  bottom: 0;
  background: rgb(200, 213, 0, 0.25);
  padding: 0;
  margin: 0;
`;

const CardsContainer = styled.div`
  color: white;
  text-align: center;
  display: flex;
  justify-content: center;
  width: 100vw;
  height: 70vh;
  overflow: scroll;
  top: 0;
  padding: 0;
  margin: 0
`;

const MiddleCardsContainer = styled.div`
  color: white;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: auto;
  height: 100vh;
`;

const StartingCardContainer = styled.div`
  color: white;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: auto;
  height: fit-content;
`;

const HorizontalCardContainer = styled.div`
  color: white;
  display: flex;
  flex-direction: row;  
  justify-content: flex-start;
  align-items: center;
  width: auto;
  height: 100vh;
`;

const VerticalCardContainer = styled.div`
  color: white;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: auto;
  height: 45vh;
`;

const PlayerName = styled.p`
  margin-top: 30px;
  color: black;
  font-size: 16px;
  font-weight: 300;
  width: 5vw;
  text-transform: uppercase;
`;

const TokenContainer = styled(BaseContainer)`
  color: white;
  text-align: left;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: left;
  margin: 0;
  padding: 0;
`;

const Token = styled.img`
  height: 5vh;
  width: 5vh;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 5%;
  height: fit-content;
`;

const AddButton = styled.div`
  &:hover {
    transform: translateY(-2px);
  }
  font-weight: 1000;
  text-transform: uppercase;
  font-size: 30px;
  text-align: center;
  color: black;
  justify-content: center;
  height: 35px;
  padding: 0;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
`;

const Link = styled.a`
 margin: 10px;
 color: black;
`;

let stompClient;

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      players: null,
      hostId: localStorage.getItem("hostId"),
      username: localStorage.getItem("username"),
      gameId: localStorage.getItem("gameId"),
      currentPlayer: null,
      numTokens: 0,
      gameState: null,
      cards: null,
      currentCard: null,
      cardsLeft: [],
      cardsRight: [],
      cardsTop: [],
      cardsBottom: [],
      startCardIndexHorizontal: 0,
      startCardIndexVertical: 0,
      countDown:0,
      startingCard: [],
      nextPlayer: null,
      isLocalUserPLayer: false,
      message: "",
      countDownText: "",
      countKey:0,
      lastPlayer: "-1",
      loading:true,
      doubtResultDTO:null,
      countDownTimer: {
        "CARDPLACEMENT": 30,
        "DOUBTINGPHASE": 10,
        "DOUBTVISIBLE": 5,
        "EVALUATION": 30,
        "EVALUATIONVISIBLE": 30
      },
      winners: null,
      gameMinutes: 0,
      gameTooShort: true,
      scoreboard: [],

    };
    this.doubtGame = this.doubtGame.bind(this)
  }

  async componentDidMount() {
    try {

      // getting the game settings
      const response = await api.get("/games/" + this.state.gameId);
      this.setState({
        countDownTimer: {
          "CARDPLACEMENT": response.data.playerTurnCountdown,
          "DOUBTINGPHASE": response.data.doubtCountdown,
          "DOUBTVISIBLE": response.data.visibleAfterDoubtCountdown,
          "EVALUATION": response.data.evaluationCountdown,
          "EVALUATIONVISIBLE": response.data.evaluationCountdownVisible
        }
      });

      NotificationManager.warning('Loading the game','',3000);
      this.getData();
    }
    catch (error) {
      NotificationManager.error(error.message,'',3000);
    }
  }


  countTokens() {
    let tokens = []

    // Outer loop to create parent
    for (let i = 0; i < this.state.numTokens; i++) {
      //Create the parent and add the children
      tokens.push(<Token src={token}/>)
    }
    return tokens
  }

  doubtGame(doubtID) {
    if(this.checkDoubtCard(doubtID)){
      stompClient.send("/app/game/doubt", {},
      JSON.stringify({
        "placedCard": this.state.currentCard.id,
        "doubtedCard": doubtID,
        "gameId": this.state.gameId
      }));
    }
  }
  checkDoubtCard(cardID) {
    let currentCard=this.state.currentCard;
    let NeighbourCard=[currentCard.higherNeighbour,currentCard.leftNeighbour,currentCard.lowerNeighbour,currentCard.rightNeighbour];
    if(NeighbourCard.includes(cardID) && ! this.state.isLocalUserPLayer&&this.state.gameState === "DOUBTINGPHASE")
    {
        return true;
    }
    return false;
   
  }

  callback = (message)  => {
    let socketMessage = JSON.parse(message.body);
    console.log(socketMessage);
    this.setState({
      currentPlayer: socketMessage["playersturn"],
      gameState: socketMessage["gamestate"],
      cardsLeft: socketMessage["left"],
      cardsRight: socketMessage["right"],
      cardsTop: socketMessage["top"],
      cardsBottom: socketMessage["bottom"],
      numTokens: socketMessage["playertokens"],
      currentCard: socketMessage["nextCardOnStack"],
      startingCard: socketMessage["startingCard"],
      nextPlayer: socketMessage["nextPlayer"],
      doubtResultDTO:socketMessage["gamestate"]==="DOUBTVISIBLE"?socketMessage["doubtResultDTO"]:null,
      // winners: socketMessage["winnerIds"],
      // scoreboard: socketMessage["scoreboard"],
      // gameMinutes: socketMessage["gameMinutes"],
      // gameTooShort: socketMessage["gameTooShort"],
      loading:false,
      isLocalUserPLayer: localStorage.getItem("loginUserId") === socketMessage["playersturn"].id.toString(),
    });


      if (this.state.gameState === "CARDPLACEMENT") {
        if(this.state.isLocalUserPLayer)
        {
          NotificationManager.warning('It is your turn, please place the card','',3000);
        }
        this.setState({
          message: this.state.isLocalUserPLayer
            ? ">>> It is your turn, please place the card above on the board by clicking on one of the plus signs"
            : ">>> It is player " + this.state.currentPlayer.username + "'s turn",
          countDownText: this.state.isLocalUserPLayer
            ? "to place card"
            : "for " + this.state.currentPlayer.username + "\n to place card"})
            this.resetCountDown();
      }

      else if (this.state.gameState === "DOUBTINGPHASE") {
        if(!this.state.isLocalUserPLayer)
        {
          NotificationManager.warning('You can now doubt the card placement','',3000);
        }
        this.setState({
          message: this.state.isLocalUserPLayer
            ? ">>> The other players can doubt your placement, please wait"
            : ">>> You can now doubt the card placement",
          countDownText: this.state.isLocalUserPLayer
            ? "for the" + "\n" + "others to doubt"
            : "to doubt"})
            this.resetCountDown();
      }

      else if (this.state.gameState === "DOUBTVISIBLE") {
        let doubtRightous = this.state.doubtResultDTO.doubtRightous;

        this.setState({
          message: this.state.isLocalUserPLayer
          ? (!doubtRightous?">>> You placed card in wrong position ":"hurray, your placed Card correctly")
          : (!doubtRightous?">>> " + this.state.currentPlayer.username +" place card in wrong position ":this.state.currentPlayer.username +" placed Card correctly"),
          countDownText: ""})
        this.resetCountDown();}

      else if (this.state.gameState === "EVALUATION") {
        NotificationManager.warning('Evaluation phase. Please Guess Number of correct card','',3000);
        this.setState({
          message: ">>> Evaluation phase",
          countDownText: "to place a bet"})
        this.resetCountDown();
      }
      else if (this.state.gameState === "EVALUATIONVISIBLE") {
        NotificationManager.warning('After the Evaluation phase. Please have a look at the correctly and wrongly placed cards','',3000);
        this.setState({
          message: ">>> After the Evaluation phase",
          countDownText: "to look at the cards"})
        this.resetCountDown();
      }

      if(this.state.gameState === "GAMEEND"){
        NotificationManager.error('END GAMEDED. Thank you for Playing ','',3000,() => {
          this.props.history.push("/game/scoreboard");
        });
        setTimeout(() => {  this.props.history.push("/game/scoreboard"); }, 3000);

        // this.props.history.push({
        //   pathname: "/game/scoreboard",
        //   // state: {
        //   //   scoreboard:  this.state.scoreboard,
        //   //   gameTooShort: this.state.gameTooShort,
        //   //   winners: this.state.winners,
        //   //   gameMinutes: this.state.gameMinutes,
        //   //   gameId: this.state.gameId,
        //   // },
        // });
      }
  }

  getData = () => {

    let callback = this.callback;

    let baseURL = getDomain();
    const socket = SockJS(baseURL + '/gs-guide-websocket');
    socket.withCredentials=true;

    stompClient = Stomp.Stomp.over(socket);

    stompClient.connect({}, function () {

    let url = stompClient.ws._transport.url;
    url = url.substring(url.indexOf("/gs-guide-websocket/")+20,url.length);
    url = url.replace("/websocket", "");
    url = url.replace(/^[0-9]+\//, "");
    const sessionId = url;

    stompClient.subscribe('/topic/game/queue/specific-game-game' + sessionId,   callback);

    stompClient.send("/app/game", {}, JSON.stringify(
      {
        'name': localStorage.getItem("username"),
        'id': localStorage.getItem("loginUserId"),
        'gameId': localStorage.getItem("gameId")
      }));

  });}


  placeCard(axis, index) {

    stompClient.send("/app/game/turn", {},
      JSON.stringify({
        "gameId": this.state.gameId,
        "placementIndex": index,
        "axis": axis
      }));

  }
  checkTurnCard(cardID) {
      if(this.state.gameState === "EVALUATIONVISIBLE"){
        return false;
      }
      else if(this.state.gameState === "DOUBTVISIBLE"){
        let doubtResultDTO = this.state.doubtResultDTO;
        if([doubtResultDTO.referenceCard.id, doubtResultDTO.doubtedCard.id].includes(cardID)){
          return false;
        }
      }
      return true;
   
  }

  getCards = (cards, direction) => {
    let renderedCards = [ this.state.isLocalUserPLayer  && this.state.gameState === "CARDPLACEMENT" ?
      (
        <AddButton key={0} >
                            <Link key={0} onClick={() => {
                              this.placeCard(direction, 0)
                            }}>
                              +
                            </Link>
                          </AddButton>
      ): ""]

    for (let i=0; i < cards.length; i++) {
      renderedCards.push(
        <Card
          style={{padding: "10%"}}
          sizeCard={110}
          sizeFont={110}
          axis={direction}
          cardInfo={cards[i]}
          startingCard={this.state.startingCard}
          doubtCard={this.checkDoubtCard(cards[i].id)}
          doubtGame={this.doubtGame}
          frontSide={this.checkTurnCard(cards[i].id)}/>,
        this.state.isLocalUserPLayer  && this.state.gameState === "CARDPLACEMENT" ?
          (
            <AddButton key={i+1} >
              <Link key={i+1} onClick={() => {
                this.placeCard(direction, i+1)
              }}>
                +
              </Link>
            </AddButton>
          )
          : "")
    }

    return renderedCards

  }

  endGame(){
    stompClient.send("/app/game/end", {},
      JSON.stringify({
        "gameId": this.state.gameId
      }));
  }
  resetCountDown(){
    let count=this.state.countDownTimer[this.state.gameState]
    this.setState({countDown:count, countKey:this.state.countKey+1})
  }

  render() {
    const renderTime = ({ remainingTime }) => {

      return (
        <div className="timer" style={{justifyContent: "center", textAlign: "center", whiteSpace: "pre-wrap"}}>
          <div className="text">Remaining </div>
          <div className="value"> {remainingTime} seconds </div>
          <div className="text">{this.state.countDownText}</div>
        </div>
      );
    };
    return (
      <GameContainer>
          <CardsContainer>
          <HorizontalCardContainer style={{flexDirection: "row-reverse"}}>
              {this.getCards(this.state.cardsLeft, "left")}
            </HorizontalCardContainer>
            <MiddleCardsContainer>
              <VerticalCardContainer style={{flexDirection: "column-reverse"}}>
                {this.getCards(this.state.cardsTop, "top")}
              </VerticalCardContainer>
              {this.state.loading
                ? (
                  <ReactLoading  type={"spin"} height={120} width={120} />
                ) : (
                  <DirectionCard>
                  <StartingCardContainer
                    width={100}
                    heigth={100}
                  >
                  {this.state.startingCard
                  ? <Card style={{padding: "5%"}}
                      sizeCard={110}
                      sizeFont={110}
                      cardInfo={this.state.startingCard}
                      startingCard={this.state.startingCard}
                      doubtCard={this.checkDoubtCard(this.state.startingCard.id)}
                      doubtGame={this.doubtGame}
                      frontSide={this.checkTurnCard(this.state.startingCard.id)}/>
                  : " "}

                  </StartingCardContainer>
                  </DirectionCard>
                )}
              <VerticalCardContainer>
                {this.getCards(this.state.cardsBottom, "bottom")}
              </VerticalCardContainer>
            </MiddleCardsContainer>
            <HorizontalCardContainer>
              {this.getCards(this.state.cardsRight, "right")}
            </HorizontalCardContainer>
          </CardsContainer>
          <Footer>
            <LeftFooter>
            <PlayerName>
          {this.state.username}
            </PlayerName>
            <TokenContainer>
              {this.countTokens()}
            </TokenContainer>
            </LeftFooter>
            <MiddleFooter>
            <Container style={{height: "100%", width: "100%",marginTop: "3%"}}>
              {
                this.state.gameState ? <CountdownCircleTimer
                key={this.state.countKey}
                isPlaying
                duration={this.state.countDownTimer[this.state.gameState]}
                size={180}
                onComplete={() => [true, 1000]}
                colors={[
                  ['#004777', 0.33],
                  ['#F7B801', 0.33],
                  ['#A30000', 0.33],
                ]}
              >
                 {renderTime}
              </CountdownCircleTimer>:""
              }
            
            </Container>
            </MiddleFooter>
            <RightFooter>
            <Container  style={{height: "50%", width: "100%", marginTop: "3%"}}>
            <Container style={{height: "100%", width: "25%"}}>
              {
                this.state.gameState === "EVALUATION" ? (
                  <Evaluation stompClient={stompClient} gameId={this.state.gameId}/>
                ) : (
                  ""
                )
              }
            </Container>
            <Container style={{height: "100%", width: "50%", justifyContent: "center"}}>

          {(this.state.isLocalUserPLayer && this.state.gameState === "CARDPLACEMENT")
            ? <Card sizeCard={110} sizeFont={110} cardInfo={this.state.currentCard} frontSide={[true]} doubtCard={false} doubtGame={this.doubtGame}/>
            : " "}
            </Container>
            <Container  style={{height: "100%", width: "25%", display: "flex", flexDirection: "column", justifyContent: "center"}}>
              <ButtonContainer>
                <Button 
                 width ="50%">
                <Link onClick={()=> window.open("/Usgrachnet_Help.pdf", "_blank")}>
                Help
                </Link>
                </Button>
              </ButtonContainer>
              <ButtonContainer>
                {
                  this.state.hostId === localStorage.getItem("loginUserId")?
                    (<Button
                      width ="100%">
                      <Link
                        onClick={() => {
                          this.endGame()
                        }}
                      >
                        End Game
                      </Link>
                    </Button>):""
                }
              </ButtonContainer>
            </Container>
            </Container>
              <Container  style={{height: "40%", width: "100%", bottom: "10%"}}>
                <Notification>
                  {this.state.message}
                </Notification>
              </Container>
            </RightFooter>
          </Footer>,
          <Container style={{display: "flex"}}>
          <NotificationContainer/>
          </Container>
      </GameContainer>
    );
  }
}

export default withRouter(Game);
