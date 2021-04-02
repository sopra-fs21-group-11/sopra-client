
import React from "react";
import styled from "styled-components";
import { BaseContainer } from "../../helpers/layout";
import { api } from "../../helpers/api";
import User from "../shared/models/User";
import { withRouter } from "react-router-dom";
import { Button } from "../../views/design/Button";
import { OverlayContainer, Overlay } from "../../views/design/Overlay";
import Error from "../../views/Error";

const MenuContainer = styled.div`
  height: 500px;
  width: 30vw;
`;

const PlayerNameContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PlayerName = styled.div`
  font-size: 30px;
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
        .get("/users/logout/" + localStorage.getItem("loginUserid"))
        .then((res) => {
          console.log(res);
        });
    } catch (error) {
      //console.log( `Something went wrong while logout the users: \n${handleError(error)}`);
      this.setState({
        erroMessage: error.message,
      });
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("loginUserid");
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
                  Username: {localStorage.getItem("username")}
                </PlayerName>
              </PlayerNameContainer>
              <NavigationContainer>
                <ButtonContainer>
                  <Button
                    width="50%"
                    style={{ margin: "5px" }}
                    onClick={() => {
                      this.login();
                    }}
                  >
                    Create Game
                  </Button>
                  
                </ButtonContainer>
                <ButtonContainer>
                  <Button
                    width ="50%"
                    onClick={() => {
                      this.props.history.push("/Registration");
                    }}
                  >
                    Join Game
                  </Button>
                </ButtonContainer>
                <ButtonContainer>
                  <Button
                    width ="50%"
                    onClick={() => {
                      this.props.history.push("/Registration");
                    }}
                  >
                    Deck Editor
                  </Button>
                </ButtonContainer>
                <ButtonContainer>
                  <Button
                    width ="50%"
                    onClick={() => {
                      this.props.history.push("/Game");
                    }}
                  >
                    Player Overview
                  </Button>
                </ButtonContainer>
                <ButtonContainer>
                  <Button
                    width ="50%"
                    onClick={() => {
                      this.goToDetails(localStorage.getItem("loginUserid"));
                    }}
                  >
                    Edit Profile
                  </Button>
                </ButtonContainer>
                <ButtonContainer>
                  <Button
                    width ="50%"
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
      </OverlayContainer>
    );
  }
}

export default withRouter(MainView);


