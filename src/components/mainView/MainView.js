
import React from "react";
import styled from "styled-components";
import { BaseContainer } from "../../helpers/layout";
import { api } from "../../helpers/api";
import { withRouter } from "react-router-dom";
import { Button } from "../../views/design/Button";
import { OverlayContainer, Overlay } from "../../views/design/Overlay";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import Card from "../../views/design/Card";
import DirectionCard from "../../views/design/DirectionCard";



const MenuContainer = styled.div`
  height: 500px;
  width: 50vw;
`;

const PlayerNameContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PlayerName = styled.div`
  font-size: 20px;
  font-weight: 900;
`;

const NavigationContainer = styled.div`
  margin-left: auto;
  padding-left: 15px;
  margin-right: auto;
  padding-right: 15px;
`;



const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;



class MainView extends React.Component {

  

  logout() {
    try {
      api
        .get("/users/logout/" + localStorage.getItem("loginUserId"))
        .then((res) => {
          console.log(res);
        });
    } catch (error) {
      //console.log( `Something went wrong while logout the users: \n${handleError(error)}`);
      this.setState({
        erroMessage: error.message,
      });
      NotificationManager.error(error.message,'',3000);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("loginUserId");
      this.props.history.push("/login");
    }
  }

  goToDetails(userId) {
    this.props.history.push({
      pathname: "/userDetails",
      state: { userId: userId },
    });
  }


  componentDidMount() {}

  render() {
    return (
      <OverlayContainer>
        <Overlay>
          <BaseContainer>
            <MenuContainer>
              <PlayerNameContainer>
                <PlayerName>
                  Welcome {localStorage.getItem("username")} Let's play USGRÄCHNET BÜNZEN
                </PlayerName>
              </PlayerNameContainer>
              <NavigationContainer>
                <ButtonContainer>
                  <Button
                    width="40%"
                    style={{ margin: "5px" }}
                    onClick={() => {
                      this.props.history.push("game/lobby");
                    }}
                  >
                    New Game
                  </Button>
                  
                </ButtonContainer>
                <ButtonContainer>
                  <Button
                   width="40%"
                    onClick={() => {
                      this.props.history.push("game/join");
                    }}
                  >
                    Join Game
                  </Button>
                </ButtonContainer>
                <ButtonContainer>
                  <Button
                    width="40%"
                    onClick={() => {
                      this.props.history.push("/Registration");
                    }}
                  >
                    Deck Editor
                  </Button>
                </ButtonContainer>
                <ButtonContainer>
                  <Button
                     width="40%"
                    onClick={() => {
                      this.logout();
                    }}
                  >
                    Logout
                  </Button>
                </ButtonContainer>
              </NavigationContainer>
              <div>
                <DirectionCard
                  sizeCard={110}
                  style={{marginTop: "100px", position: "relative", zIndex: "-9"}}
                >

                </DirectionCard>
                <Card style={{padding: "5%", position: "relative", zIndex: "1", minHeight: "500px"}}
                      sizeCard={110}
                      sizeFont={110}
                      cardInfo={startingCard}
                      startingCard={startingCard}
                      doubtCard={false}
                      doubtGame={this.doubtGame}
                      frontSide={true}/>
              </div>

            </MenuContainer>
          </BaseContainer>
        </Overlay>
        <NotificationContainer/>
      </OverlayContainer>
    );
  }
}

const card = {
  "id": 49,
  "lowerNeighbour": 0,
  "higherNeighbour": 0,
  "rightNeighbour": 49,
  "leftNeighbour": 49,
  "ncoord": 47.2,
  "ecoord": 9.25,
  "name": "Appenzell",
  "population": 0,
  "area": 0.0,
  "height": 0,
  "canton": null,
  "position": 1,
  "correct": true
}

const startingCard = {
  "id": 49,
  "lowerNeighbour": 0,
  "higherNeighbour": 0,
  "rightNeighbour": 49,
  "leftNeighbour": 49,
  "ncoord": 47.2,
  "ecoord": 9.25,
  "name": "Appenzell",
  "population": 0,
  "area": 0.0,
  "height": 0,
  "canton": null,
  "position": 1,
  "correct": true
}

export default withRouter(MainView);


