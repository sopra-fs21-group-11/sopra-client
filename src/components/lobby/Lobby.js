/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import styled from "styled-components";
import { BaseContainer } from "../../helpers/layout";
import { Button } from "../../views/design/Button";
import { withRouter } from "react-router-dom";
import Error from "../../views/Error";
import {api} from "../../helpers/api";
import GameModel from "../shared/models/GameModel";

const Container = styled(BaseContainer)`
  color: white;
  text-align: center;
  overflow: hidden;
`;

const Users = styled.ul`
  list-style: none;
  width: 30%;
  margin-top: 0;
  padding-left: 17px;
  padding-right: 17px;
  height: 600px;
  font-size: 16px;
  font-weight: 300;
  background: rgb(255, 255, 255);
  border-left: 4px black solid;
  border-right: 4px black solid;
  border-bottom: 4px black solid;
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
  
`;
const Label = styled.label`
  color: black;
  margin-bottom: 10px;
  text-align: left;
`;


const Link = styled.a`
 margin: 10px;
 color: black
`;

const Name = styled.p`
  margin: 10px;
  color: black;
  font-size: 16px;
  font-weight: 300;
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



const SettingsForm = styled.div`
  display: flex;
  flex-direction: column;
  width: 70%;
  height: 600px;
  font-size: 16px;
  font-weight: 300;
  padding-top: 7px;
  padding-left: 37px;
  padding-right: 37px;
  background: rgb(255, 255, 255);
  border-left: 4px black solid;
  border-right: 4px black solid;
  border-bottom: 4px black solid;
  overflow: scroll;
`;

const InputField = styled.input`
  &::placeholder {
    color: rgba(255, 255, 255, 1);
  }
  height: 35px;
  padding-left: 15px;
  margin-left: -4px;
  border: none;
  border-radius: 20px;
  margin-bottom: 20px;
  background: rgba(140, 140, 140, 0.2);
  color: black;
`;


class Lobby extends React.Component {
  constructor() {
    super();
    this.state = {
      users: [1, 2, 3, 4],
      userId: null,
      gameId: null,
      errorMessage: null,
      horizontalCategories: [1, 2, 3],
      verticalCategories: [1, 2, 3],
      nrOfEvaluations: null,
      doubtCountdown: null,
      visibleAfterDoubtCountdown: null,
      playerTurnCountdown: null,
      horizontalValueCategoryId: null,
      verticalValueCategoryId: null,
      editable: true,
    };
  }

  exitLobby() {
    this.props.history.push("/game")
  }

  handleInputChange(key, value) {
    // Example: if the key is username, this statement is the equivalent to the following one:
    // this.setState({'username': value});
    this.setState({[key]: value});
  }

  async componentDidMount() {
    try {
      let id = this.props.location.state.userId;
      this.setState({
        editable: localStorage.getItem("loginUserid") == id ? true : false,
      });

      this.setState({userId: id});

      const response = await api.get("/games/" + this.state.gameId);
      const game = new GameModel(response.data);

      this.setState({users: game.players});

    } catch (error) {
      this.setState({
        errorMessage: error.message,
      });
    }
  }


  async startGame() {
    try {

      const requestBody = JSON.stringify({
        hostId: this.state.hostId,
        nrOfEvaluations: this.state.nrOfEvaluations,
        doubtCountdown: this.state.doubtCountdown,
        visibleAfterDoubtCountdown: this.state.visibleAfterDoubtCountdown,
        playerTurnCountdown: this.state.playerTurnCountdown,
        horizontalValueCategoryId: this.state.horizontalValueCategoryId,
        verticalValueCategoryId: this.state.verticalValueCategoryId
      });

      const response = await api.put("/games/" + this.state.gameId, requestBody);


    } catch (error) {
      this.setState({
        errorMessage: error.message,
      });
      //alert(`Something went wrong while fetching the users: \n${handleError(error)}`);
    }

  }


  render() {
    return (
      <Container>
        <h2>Game Lobby</h2>
        <Container
          style={{display: "flex", flexDirection: "row", justifyContent: "right"}}>
          <ButtonContainer>
            <Button style={{marginRight: 60}}>
              <Link
                width="25%"
                onClick={() => {
                  this.exitLobby();
                }}
              >
                Exit Lobby
              </Link>
            </Button>
          </ButtonContainer>
          <ButtonContainer>
            <Button>
              <Link
                width="25%"
                onClick={() => {
                  this.startGame();
                }}
              >
                Start Game
              </Link>
            </Button>
          </ButtonContainer>
        </Container>
        <Container style={{display: "flex"}}>
          <Heading style={{width: "30%", marginRight: "50px"}}>Players</Heading>
          <Heading style={{width: "70%"}}>Game Settings</Heading>
        </Container>
        <Container style={{display: "flex"}}>
          <Users
            style={{marginRight: "50px"}}
          >
            {this.state.users.map((user) => {
              return (<Name>{user}</Name>);
            })}
          </Users>
          <SettingsForm>
            <Label>Number of evaluations</Label>
            <select
              disabled={!this.state.editable}
              name="evaluations"
              style={{marginBottom: 10}}
              defaultValue={this.state.nrOfEvaluations}
              onChange={(e) => {
                this.handleInputChange("nrOfEvaluations", e.target.value);
              }}>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </select>
            <Label>Doubt countdown time</Label>
            <InputField
              disabled={!this.state.editable}
              type={"time"}
              defaultValue={this.state.doubtCountdown}
              step="1"
              onChange={(e) => {
                this.handleInputChange("doubtCountdown", e.target.value);
              }}
            />
            <Label>How long cards are visible after doubt</Label>
            <InputField
              disabled={!this.state.editable}
              type={"time"}
              step="1"
              defaultValue={this.state.visibleAfterDoubtCountdown}
              onChange={(e) => {
                this.handleInputChange("visibleAfterDoubtCountdown", e.target.value);
              }}
            />
            <Label>Countdown for one player turn</Label>
            <InputField
              disabled={!this.state.editable}
              type={"time"}
              step="1"
              defaultValue={this.state.playerTurnCountdown}
              onChange={(e) => {
                this.handleInputChange("playerTurnCountdown", e.target.value);
              }}
            />
            <Label>Tokens for correct Guess</Label>
            <select
              disabled={!this.state.editable}
              name="tokenGainOnCorrectGuess"
              style={{marginBottom: 10}}
              defaultValue={this.state.tokenGainOnCorrectGuess}
              onChange={(e) => {
                this.handleInputChange("tokenGainOnCorrectGuess", e.target.value);
              }}>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </select>
            <Label>Tokens on nearest guess</Label>
            <select
              disabled={!this.state.editable}
              name="tokenGainOnNearestGuess"
              style={{marginBottom: 10}}
              defaultValue={this.state.tokenGainOnNearestGuess}
              onChange={(e) => {
                this.handleInputChange("tokenGainOnNearestGuess", e.target.value);
              }}>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </select>
            <Label>Horizontal comparison type</Label>
            <select
              disabled={!this.state.editable}
              style={{marginBottom: 10}}
              defaultValue={this.state.horizontalValueCategoryId}
              onChange={(e) => {
                this.handleInputChange("horizontalValueCategoryId", e.target.value);
              }}
            >{this.state.horizontalCategories.map((category) => {
              return (<option>{category}</option>);
            })}
            </select>
            <Label>Vertical comparison type</Label>
            <select
              disabled={!this.state.editable}
              style={{marginBottom: 10}}
              defaultValue={this.state.verticalValueCategoryId}
              onChange={(e) => {
                this.handleInputChange("verticalValueCategoryId", e.target.value);
              }}
            >{this.state.verticalCategories.map((category) => {
              return (<option>{category}</option>);
            })}
            </select>
          </SettingsForm>

        </Container>
        <Error message={this.state.errorMessage}/>
      </Container>
    );
  }
}

export default withRouter(Lobby);
