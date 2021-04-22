/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import styled from "styled-components";
import { BaseContainer } from "../../helpers/layout";
import { withRouter } from "react-router-dom";
import Error from "../../views/Error";
import { api } from "../../helpers/api";
import { Button } from "../../views/design/Button";
import { OverlayContainer } from "../../views/design/Overlay";
import SockJS from "sockjs-client";
import * as Stomp from "@stomp/stompjs";
import Lobby from "../lobby/Lobby";
import * as stompClient from "sockjs-client";

const Container = styled(BaseContainer)`
  color: white;
  text-align: center;
  overflow: hidden;
`;

const Games = styled.ul`
  list-style: none;
  width: 50%;
  margin-top: 0;
  padding-left: 17px;
  padding-right: 17px;
  min-height: 400px;
  font-size: 16px;
  font-weight: 300;
  background: rgb(255, 255, 255);
  border-left: 4px black solid;
  border-right: 4px black solid;
  border-bottom: 4px black solid;
`;
const PrivateGame = styled.div`
  display: flex;
  flex-direction: column;
  width: 40%;
  height: 400px;
  font-size: 16px;
  font-weight: 300;
  padding-top: 7px;
  padding-left: 37px;
  padding-right: 37px;
  background: rgb(255, 255, 255);
  border-left: 4px black solid;
  border-right: 4px black solid;
  border-bottom: 4px black solid;
`;

const Heading = styled.h3`
  color: black;
  border: 4px black solid;
  background: rgb(0, 132, 0, 1);
  width: 100%;
  padding-bottom: 0;
  margin-bottom: 0;
  height: 50px;
  text-align: center;
  align-items: center;
  display: flex;
  justify-content: center;
`;

const InputField = styled.input`
  &::placeholder {
    color: rgba(0, 0, 0, 1);
  }
  height: 35px;
  padding-left: 15px;
  margin-left: -4px;
  font-weight: 200;
  margin-bottom: 20px;
  background: rgba(0, 102, 0, 0.2);
  color: black;
  border-color: rgb(0, 0, 0, 0.4);
`;

const CustomOverlay = styled.div`
  background: rgb(200, 213, 0, 0.25);
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
  
`;
const Link = styled.a`
 margin: 10px;
 color: black
`;


class JoinGame extends React.Component {
  constructor() {
    super();
    this.state = {
      games: [],
      errorMessage: null,
    };
  }


  exitJoinGame() {
    this.props.history.push("/mainView");
  }

  componentWillUnmount() {
    window.clearInterval(this.timer);
    this.timer = null;
  }

  async componentDidMount() {
    //Load Games for the first time
    await this.getGames();
    this.timer = setInterval(() => this.getGames(), 10000); //polling every 10 seconds
  }
  async getGames() {
    try {
      //Api to get games
      const response = await api.get("/games/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(response.data);
      this.setState({ games: response.data });
    } catch (error) {
      this.setState({
        errorMessage: error.message,
      });
    }
  }
  async joinGame(gameid) {
    try {

       //Api Call to join the Game by ID
      const response = await api.post("/games/" + gameid, {},{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log(response);
      this.props.history.push({
        pathname: "/game/lobby",
        state: { gameId: gameid },
      });


    } catch (error) {
      this.setState({
        errorMessage: error.message,
      });
    }
  }
  handleInputChange(key, value) {
    this.setState({ [key]: value });
  }
  joinPrivateGame() {
    // APi Call for joining game
  }

  render() {
    return (
      <OverlayContainer>
        <CustomOverlay style={{ align: "flex" }}>
          <Container style={{ display: "flex" }}>
            <Heading style={{ width: "50%", marginRight: "50px" }}>
              Join Game
            </Heading>
            { /* <Heading style={{ width: "40%" }}>Join Private Game </Heading>*/}
          </Container>
          <Container style={{ display: "flex" }}>
            <Games style={{ marginRight: "50px" }}>
              {
                this.state.games.map((game,index) =>
                    <Button
                      width="100%"
                      style={{ backgroundColor: "gray" }}
                      key=  {game.id}
                      onClick={() => {
                        this.joinGame(game.id);
                      }}
                    >
                     {game.name}
                    </Button>

                )}
            </Games>
            { /*
            <PrivateGame>
              <InputField
                placeholder="Enter Game ID  ..."
                onChange={(e) => {
                  this.handleInputChange("gameid", e.target.value);
                }}
              />
              <InputField
                type="password"
                placeholder="Enter private Password ..."
                onChange={(e) => {
                  this.handleInputChange("gamepassword", e.target.value);
                }}
              />
              <Button
                disabled={!this.state.gameid || !this.state.gamepassword}
                width="50%"
                style={{ margin: "5px" }}
                onClick={() => {
                  this.joinPrivateGame();
                }}
              >
                Login
              </Button>
            </PrivateGame>
            */ }
          </Container>
          <Container
          style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
          <ButtonContainer>
            <Button style={{marginRight: 60}}>
              <Link
                width="25%"
                onClick={() => {
                  this.exitJoinGame();
                }}
              >
                Exit Join Game
              </Link>
            </Button>
          </ButtonContainer>

        </Container>
        </CustomOverlay>
        <Error message={this.state.errorMessage} />
      </OverlayContainer>
    );
  }
}

export default withRouter(JoinGame);
