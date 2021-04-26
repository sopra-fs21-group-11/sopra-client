/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import styled from "styled-components";
import { BaseContainer } from "../../helpers/layout";
import { api } from "../../helpers/api";
import { withRouter } from "react-router-dom";
import Error from "../../views/Error";
import Header from "../../views/Header";
import {OverlayContainer} from "../../views/design/Overlay";
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

import token from "../../views/Token.png";
import {Button} from "../../views/design/Button";
import Card from "../../views/design/Card";
import DirectionCard from "../../views/design/DirectionCard";
import SockJS from "sockjs-client";
import * as Stomp from "@stomp/stompjs";
const Container = styled(BaseContainer)`
  overflow: hidden;
  display: flex;
  flex-direction: row;
`;

const Notification = styled(BaseContainer)`
  color: black;
  border: 4px black solid;
  width: 100%;
  margin-left: 0;
  background: white;
`;

const LeftFooter = styled(BaseContainer)`
  color: white;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 40%;
`;

const RightFooter = styled(BaseContainer)`
  color: white;
  display: flex;
  flex-direction: column;
  width: 40%;
`;

const MiddleFooter = styled(BaseContainer)`
  color: white;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  width: 20%;
`;

const GameContainer = styled.div`
  width: 100vw;
  height: 95vh;
  margin: 0;
  position: absolute;
  bottom: 0;
  -ms-transform: translateY(0%);
  transform: translateY(0%);
`;

const Footer = styled.footer`
  color: white;
  position: absolute;
  width: 100%;
  display: flex;
  flex-direction: row;
  min-height: 25%;
  bottom: 0;
  background: rgb(200, 213, 0, 0.25);
`;

const CardsContainer = styled.div`
  color: white;
  text-align: center;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 75%;
`;

const MiddleCardsContainer = styled.div`
  color: white;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: auto;
  height: 100%;
`;

const StartingCardContainer = styled.div`
  color: white;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: auto;
  height: 10%;
`;

const HorizontalCardContainer = styled.div`
  color: white;
  display: flex;
  flex-direction: row;  
  justify-content: flex-start;
  align-items: center;
  width: auto;
  height: 100%;
  margin-left: 1%;
  margin-right: 1%;
`;

const VerticalCardContainer = styled.div`
  color: white;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: auto;
  height: 45%;
`;

const PlayerName = styled.p`
  margin-top: 30px;
  color: black;
  font-size: 16px;
  font-weight: 300;
  width: 5%;
  text-transform: uppercase;
`;

const TokenContainer = styled(BaseContainer)`
  color: white;
  text-align: left;
  display: flex;
  flex-direction: row;
  justify-content: left;
  margin: 0;
  padding: 0;
`;

const Token = styled.img`
  margin: 5px;
  height: 50px;
  width: 50px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 5px;
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

const Label = styled.label`
  color: white;
  margin-bottom: 10px;
  text-transform: uppercase;
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
      currentPlayer: null,
      errorMessage: null,
      numTokens: 3,
      gameState: null,
      cards: null,
      nextCard: null,
      cardsLeft: [],
      cardsRight: [],
      cardsAbove: [],
      cardsBelow: [],
      startCardIndexHorizontal: 0,
      startCardIndexVertical: 0,
      countDown:0,
      startingCard: null,
      nextPlayer: null,
      message: null,
    };
  }

  async componentDidMount() {
    try {

      this.getData();

    }
    catch (error) {
      this.setState({
        errorMessage: error.message,
      });
      //alert(`Something went wrong while fetching the users: \n${handleError(error)}`);
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
    doubtGame() {
   
  }

  callback = (message)  => {
    console.log(JSON.parse(message.body));
    let textMessage = JSON.parse(message.body);
    this.setState({
      currentPlayer: textMessage["playersturn"].toString(),
      gameState: textMessage["gamestate"],
      cardsLeft: textMessage["left"],
      cardsRight: textMessage["right"],
      cardsAbove: textMessage["top"],
      cardsBelow: textMessage["bottom"],
      numTokens: textMessage["playertokens"],
      nextCard: textMessage["nextCardOnStack"],
      startingCard: textMessage["startingCard"],
      nextPlayer: textMessage["nextPlayer"]});

    let userId = localStorage.getItem("loginUserId");

    if (userId === this.state.currentPlayer && this.state.gameState === "CARDPLACEMENT") {
      this.setState({message: ">>> It is your turn, pleas place the card above on the board by clicking on one of the plus sings"})
    }

    else if (userId === this.state.currentPlayer && this.state.gameState === "DOUBTINGPHASE") {
      this.setState({message: ">>> The other players can doubt your placement, please wait"})
    }

    else if (userId !== this.state.currentPlayer && this.state.gameState === "CARDPLACEMENT") {
      this.setState({message: ">>> It is player " + this.state.currentPlayer +"'s turn"})
    }

    else if (userId === this.state.currentPlayer && this.state.gameState === "DOUBTINGPHASE") {
      this.setState({message: ">>> The other players can doubt your placement, please wait"})
    }

    else if (userId !== this.state.currentPlayer && this.state.gameState === "DOUBTINGPHASE") {
      this.setState({message: ">>> You can now doubt the card placement"})
    }
  }

  getData = () => {

    let callback = this.callback;

    const socket = SockJS('http://localhost:8080/gs-guide-websocket');

    stompClient = Stomp.Stomp.over(socket);

    stompClient.connect({}, function () {

    let url = stompClient.ws._transport.url;
    url = url.replace("ws://localhost:8080/gs-guide-websocket/", "");
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


  placeCard(axis) {

    let index = 1;

    stompClient.send("/app/game/turn", {},
      JSON.stringify({
        "gameId": 1,
        "placementIndex": index,
        "axis": axis
      }));

    if (axis === "horizontal") {
      if (index > this.state.startCardIndexHorizontal) {
        this.setState({cardsRight: this.state.cardsRight.splice(index, 0, [this.state.nextCard])})}

      else {
        this.state.cardsLeft.splice(index, 0, [this.state.nextCard]);
        this.state.startCardIndexHorizontal++;
      }
    }
    if (axis === "vertical") {
      if (index > this.state.startCardIndexVertical) {
        this.state.cardsAbove.splice(this.state.startCardIndexVertical + index, 0, [this.state.nextCard]);
      } else {
        this.state.cardsBelow.splice(index, 0, [this.state.nextCard]);
        this.state.startCardIndexVertical++;
      }
    }

    this.setState({
      currentPlayer: localStorage.getItem("currentPlayer"),
      gameState: localStorage.getItem("gameState"),
      cards: localStorage.getItem("cards"),
      numTokens: localStorage.getItem("numToken"),
      nextCard: localStorage.getItem("nextCard"),
    }, () => {console.log(JSON.parse(this.state.nextCard))})

  }


  render() {
    const renderTime = ({ remainingTime }) => {
      if (remainingTime === 0) {
        this.setState({countDown:0})
        return <div className="timer">Too lale...</div>;
      }
     
    
      return (
        <div className="timer">
          <div className="text">Remaining</div>
          <div className="value">{remainingTime} seconds</div>
          <div className="text">to Place Doubt</div>
        </div>
      );
    };
    return (
      <GameContainer>
          <CardsContainer>
            <HorizontalCardContainer>
              {this.state.cardsLeft.map((card) => {
                return (
                  [<AddButton>
                  <Link key={1} onClick={() => {
                    this.placeCard("horizontal")
                  }}>
                    +
                  </Link>
                </AddButton>,
                <Card sizeCard={120} sizeFont={120} cardInfo={card} frontSide={true}/>]);
              })}
              <AddButton>
                <Link onClick={() => {
                  this.placeCard("horizontal")
                }}>
                  +
                </Link>
              </AddButton>
            </HorizontalCardContainer>
            <MiddleCardsContainer>
              <VerticalCardContainer style={{flexDirection: "column-reverse"}}>
                <AddButton>
                  <Link onClick={() => {
                    this.placeCard("vertical")
                  }}>
                    +
                  </Link>
                </AddButton>
                {this.state.cardsAbove.map((card) => {
                  return (
                    [<Card sizeCard={120} sizeFont={120} cardInfo={card} frontSide={true}/>,
                      <AddButton>
                      <Link key={1} onClick={() => {
                        this.placeCard("vertical")
                      }}>
                        +
                      </Link>
                    </AddButton>
                      ]);
                })}

              </VerticalCardContainer>
              <StartingCardContainer>
                <Card sizeCard={120} sizeFont={120} cardInfo={this.state.nextCard} frontSide={true}/>
              </StartingCardContainer>
              <VerticalCardContainer>
                <AddButton>
                  <Link onClick={() => {
                    this.placeCard("vertical")
                  }}>
                    +
                  </Link>
                </AddButton>
                {this.state.cardsBelow.map((card) => {
                  return (
                    [<AddButton>
                      <Link key={1} onClick={() => {
                        this.placeCard("vertical")
                      }}>
                        +
                      </Link>
                    </AddButton>,
                      <Card sizeCard={120} sizeFont={120} cardInfo={card} frontSide={true}/>]);
                })}

              </VerticalCardContainer>
            </MiddleCardsContainer>
            <HorizontalCardContainer>
              <AddButton>
                <Link onClick={() => {
                  this.placeCard("horizontal")
                }}>
                  +
                </Link>
              </AddButton>
              {this.state.cardsRight.map((card) => {
                return (
                  [<Card sizeCard={120} sizeFont={120} cardInfo={card} frontSide={true}/>,
                    <AddButton>
                    <Link key={1} onClick={() => {
                      this.placeCard("horizontal")
                    }}>
                      +
                    </Link>
                  </AddButton>,
                    ]);
              })}
            </HorizontalCardContainer>
          </CardsContainer>,
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
                this.state.countDown>0?<CountdownCircleTimer
                isPlaying
                duration={this.state.countDown}
                size={160}
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
                this.state.currentPlayer===localStorage.getItem("loginUserId")? <ButtonContainer >
                <Button 
                 width ="100%"
                 style={{backgroundColor:"yellow"}}
                 onClick={() => {
                  this.setState({countDown:20})//TODO : to highlight the card and select the card remove this function
                 }}>
                <Link>
                Doubt
                </Link>
                </Button>
              </ButtonContainer>:""
              }
           
            </Container>
            <Container style={{height: "100%", width: "50%", justifyContent: "center"}}>
          {(localStorage.getItem("currentPlayer") === localStorage.getItem("loginUserId"))
            ? <Card sizeCard={150} sizeFont={130} cardInfo={this.state.nextCard} frontSide={[true]}/>
            : <Label>?</Label>}
            </Container >
              <ButtonContainer style={{height: "100%", width: "25%"}}>
                <Button 
                 width ="50%">
                <Link>
                Help
                </Link>
                </Button>
              </ButtonContainer>
            </Container>
              <Container  style={{height: "40%", width: "100%", bottom: "10%"}}>
                <Notification>
                  {this.state.message}
                </Notification>
              </Container>
            </RightFooter>
          </Footer>,
          <Container style={{display: "flex"}}>
          <Error message={this.state.errorMessage}/>
          </Container>
      </GameContainer>
    );
  }
}

export default withRouter(Game);
