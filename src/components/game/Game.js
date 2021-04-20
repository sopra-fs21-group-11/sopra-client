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

const Container = styled(BaseContainer)`
  overflow: hidden;
  display: flex;
  flex-direction: row;
`;

const Notification = styled(BaseContainer)`
  color: white;
  border: 4px black solid;
  width: 100%;
  margin-left: 0;
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
  //min-height: 500px;
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

const CardsContainer = styled(BaseContainer)`
  color: white;
  text-align: center;
  display: flex;
  justify-content: center;
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
  margin-top: 20px;
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
  constructor() {
    super();
    this.state = {
      users: null,
      hostId: localStorage.getItem("hostId"),
      username: localStorage.getItem("username"),
      currentPlayer: null,
      errorMessage:null,
      numTokens: 3,
    };
  }



  async componentDidMount() {
    try {





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


  render() {
    return (
      <GameContainer>
        <Header/>
        <Container>
          <CardsContainer>
            <Label>this is where the cards go</Label>
          </CardsContainer>
        </Container>
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
                <Card ></Card>
              </Container >
              <ButtonContainer style={{height: "100%", width: "25%"}}>
                <Button>
                  <Link>
                    Help Button
                  </Link>
                </Button>
              </ButtonContainer>
            </Container>
            <Container  style={{height: "40%", width: "100%", bottom: "10%"}}>
              <Notification>Notification</Notification>
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
