
import React from "react";
import styled from "styled-components";
import { BaseContainer } from "../../helpers/layout";
import { api } from "../../helpers/api";
import { withRouter } from "react-router-dom";
import { Button } from "../../views/design/Button";
import { OverlayContainer, Overlay } from "../../views/design/Overlay";
import {NotificationContainer, NotificationManager} from 'react-notifications';


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


  async componentDidMount() {
    try {
      let userId=localStorage.getItem("loginUserId");
      if(userId!==null)
      {
        const response = await api.get(
          "/users/" + localStorage.getItem("loginUserId")
        );
        console.log(response)
      }
     
    
    } catch (error) {
     
      localStorage.removeItem("token");
      localStorage.removeItem("loginUserId");
      this.props.history.push(`/Registration`);

    }
  }
  
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
                      this.props.history.push("/deckEditor");
                    }}
                  >
                    Deck Editor
                  </Button>
                </ButtonContainer>
                <ButtonContainer>
                  <Button
                    width="40%"
                    onClick={()=> window.open("/Usgrachnet_Help.pdf", "_blank")}
                  >
                    Game Manual
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
            </MenuContainer>
          </BaseContainer>
        </Overlay>
        <NotificationContainer/>
      </OverlayContainer>
    );
  }
}

export default withRouter(MainView);


