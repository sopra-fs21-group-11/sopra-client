/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import styled from "styled-components";
import { BaseContainer } from "../../helpers/layout";
import { api } from "../../helpers/api";
import { withRouter } from "react-router-dom";
import Error from "../../views/Error";
import Header from "../../views/Header";
import {OverlayContainer} from "../../views/design/Overlay";

import token from "../../views/Token.png";
import {Button} from "../../views/design/Button";
import Card from "../../views/design/Card";
import DirectionCard from "../../views/design/DirectionCard";
import SockJS from "sockjs-client";
import * as Stomp from "@stomp/stompjs";
import {stompClient} from "../../helpers/stompClient";

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

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      players: null,
      hostId: localStorage.getItem("hostId"),
      username: localStorage.getItem("username"),
      currentPlayer: null,
      errorMessage:null,
      numTokens: 3,
      gameState: null,
    };
  }

  async componentDidMount() {
    try {
      this.setState({
        players: this.props.location.state.players,
        currentPlayer: this.props.location.state.players[0]}, () => {console.log(this.state.players, this.state.currentPlayer)})


    } catch (error) {
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

  placeCard(key, axis) {

    stompClient.send("/app/game/turn", {},
      JSON.stringify({"gameId":this.state.gameId,
      "placementIndex": key,
      "axis":axis }));


  }




  render() {
    return (
      <GameContainer>
          <CardsContainer>
            <HorizontalCardContainer>
                <AddButton>
                  <Link key={1} onClick={() => {this.placeCard(key, "horizontal")}}>
                    +
                  </Link>
                </AddButton>
              <Card sizeCard={120} sizeFont={120}/>
                <AddButton>
                  <Link>
                    +
                  </Link>
                </AddButton>
            </HorizontalCardContainer>
            <MiddleCardsContainer>
            <VerticalCardContainer style={{flexDirection: "column-reverse"}}>
                <AddButton>
                  <Link>
                    +
                  </Link>
                </AddButton>
              <Card sizeCard={120} sizeFont={120}/>

                <AddButton>
                  <Link>
                    +
                  </Link>
                </AddButton>
              <Card sizeCard={120} sizeFont={120}/>
                <AddButton>
                  <Link>
                    +
                  </Link>
                </AddButton>
            </VerticalCardContainer>
              <StartingCardContainer>
                <Card sizeCard={120} sizeFont={120}/>
              </StartingCardContainer>
            <VerticalCardContainer>
                <AddButton>
                  <Link>
                    +
                  </Link>
                </AddButton>
              <Card sizeCard={120} sizeFont={120}/>
                <AddButton>
                  <Link>
                    +
                  </Link>
                </AddButton>
            </VerticalCardContainer>
            </MiddleCardsContainer>
            <HorizontalCardContainer>
                <AddButton>
                  <Link>
                    +
                  </Link>
                </AddButton>
              <Card sizeCard={120} sizeFont={120}/>
                <AddButton>
                  <Link>
                    +
                  </Link>
                </AddButton>
              <Card sizeCard={120} sizeFont={120}/>
                <AddButton>
                  <Link>
                    +
                  </Link>
                </AddButton>
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
          </MiddleFooter>
          <RightFooter>
            <Container  style={{height: "50%", width: "100%", marginTop: "3%"}}>
              <Container style={{height: "100%", width: "25%"}}>
                <Label>Countdown</Label>
              </Container>
              <Container style={{height: "100%", width: "50%", justifyContent: "center"}}>
                {(this.state.currentPlayer.toString() === localStorage.getItem("loginUserId"))
                ? <Card sizeCard={150} sizeFont={130}/>
                : <Label>?</Label>}
              </Container >
              <ButtonContainer style={{height: "100%", width: "25%"}}>
                <Button>
                  <Link>
                    Help
                  </Link>
                </Button>
              </ButtonContainer>
            </Container>
            <Container  style={{height: "40%", width: "100%", bottom: "10%"}}>
              <Notification>
                {this.state.currentPlayer.toString() === localStorage.getItem("loginUserId")
                  ? ">>> It is your turn! Place the card above on the board by clicking on one of the plus signs."
                  : ">>> It is player " + this.state.currentPlayer + "'s turn"}

              </Notification>
            </Container>
          </RightFooter>
        </Footer>
        <Container style={{ display: "flex" }}>
                <Error message={this.state.errorMessage}/>
        </Container>
      </GameContainer>
    );
  }
}

export default withRouter(Game);
