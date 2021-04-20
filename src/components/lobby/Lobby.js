/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import styled from "styled-components";
import { BaseContainer } from "../../helpers/layout";
import { Button } from "../../views/design/Button";
import { withRouter } from "react-router-dom";
import Error from "../../views/Error";
import {api} from "../../helpers/api";
import {OverlayContainer} from "../../views/design/Overlay";

import SockJS from "sockjs-client";
import * as Stomp from "@stomp/stompjs";
import {InputField} from "../../views/design/InputField";

const Container = styled(BaseContainer)`
  color: white;
  text-align: center;
  overflow: hidden;
`;

const Users = styled.ul`
  list-style: none;
  width: 25%;
  margin-top: 0;
  padding-left: 17px;
  padding-right: 17px;
  height: 600px;
  font-size: 16px;
  font-weight: 300;
  marginRight: "50px";
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
  text-align: left;
  margin-top: 5px;
`;


const Link = styled.a`
 width: 25%;
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
  align-items: center;
  display: flex;
  justify-content: center;
`;

const SettingsForm = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: auto;
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

const CustomSelect = styled.select`
  margin-bottom: 10px;
  border-color: rgb(0, 0, 0, 0.4);
  background: rgba(0, 102, 0, 0.2);
`;

const CustomOverlay = styled.div`
  background: rgb(200, 213, 0, 0.25);
`;

let stompClient;

class Lobby extends React.Component {
  constructor() {
    super();
    this.state = {
      users: [1, 2],
      possibleNumPlayers: [2, 3, 4, 5, 6],
      gameId: null,
      errorMessage: null,
      horizontalCategories: [1, 2, 3],
      verticalCategories: [1, 2, 3],
      nrOfEvaluations: 2,
      doubtCountdown: 5,
      visibleAfterDoubtCountdown: 5,
      playerTurnCountdown: 30,
      horizontalValueCategoryId: 1,
      verticalValueCategoryId: 1,
      tokenGainOnCorrectGuess: 2,
      tokenGainOnNearestGuess: 2,
      playerMin: 2,
      playerMax: 6,
      editable: true,
      created: null,
      host:true
    };
  }
  async componentDidMount() {
     if(this.props.location.state)
     {
      let gameId = this.props.location.state.gameId;
      this.setState({
        gameId,
        created:true,
        editable:false,
        host:false
      });
     }
    }
  exitLobby() {
    this.props.history.push("/mainView")
  }

  handleInputChange(key, value) {
    this.setState({[key]: value});
  }

  initializeStomp(){
    const socket = new SockJS('http://localhost:8080/gs-guide-websocket');
    stompClient = Stomp.Stomp.over(socket);
    var sessionId;
    stompClient.connect({}, function() {
      var url = stompClient.ws._transport.url;
      url = url.replace("ws://localhost:8080/gs-guide-websocket/",  "");
      url = url.replace("/websocket", "");
      url = url.replace(/^[0-9]+\//, "");
      sessionId = url;

      stompClient.subscribe('/topic/game/queue/specific-game-game'+sessionId, function(test){ //
        alert(JSON.parse(test.body).content);
      });

      stompClient.send("/app/game", {}, JSON.stringify(
        {
          'name':localStorage.getItem("username"),
          'id':localStorage.getItem("loginUserId"),
          'gameId':localStorage.getItem("gameId")
        }));

    });
  }


  async createGame() {
    try {

      const requestBody = JSON.stringify({
        hostId: localStorage.getItem("loginUserId"),
        token: localStorage.getItem("token"),
        name: localStorage.getItem("username"),
        playerMin: 3,
        playerMax: 5,
        cardEvaluationNumber: 2,
        nrOfEvaluations: this.state.nrOfEvaluations,
        doubtCountdown: this.state.doubtCountdown,
        visibleAfterDoubtCountdown: this.state.visibleAfterDoubtCountdown,
        playerTurnCountdown: this.state.playerTurnCountdown,
        horizontalValueCategoryId: this.state.horizontalValueCategoryId,
        verticalValueCategoryId: this.state.verticalValueCategoryId,
        tokenGainOnCorrectGuess: 2,
        tokenGainOnNearestGuess: 2
      });

      // create userOverview
      const response = await api.post("/games", requestBody, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`}}
        );

      console.log(response);

      localStorage.setItem("gameId", response.data.id);
      localStorage.setItem("hostId", this.state.hostId);

      // create variable for created userOverview
      this.handleInputChange("created", true);
      this.handleInputChange("editable", false);

      this.initializeStomp();




    } catch (error) {
      this.setState({
        errorMessage: error.message,
      });
    }

  }

  async startGame() {
    try {

      // start userOverview
      const response = await api.post("/games/" + localStorage.getItem("gameId") + "/start",
        {token: localStorage.getItem("token")},
        {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      console.log(response);
		  stompClient.send("/app/game", {}, JSON.stringify(
		    {
          'name':localStorage.getItem("username"),
          'id':localStorage.getItem("loginUserId"),
          'gameId':localStorage.getItem("gameId")
		    }));

		  this.props.history.push("/game");



    } catch (error) {
      this.setState({
        errorMessage: error.message,
      });
    }
  }



  render() {
    let users;
    let titleUsers;
    let settingsStyle;
    let styleHeading;
    let settingsText;

    if (this.state.created) {
      users = <Users
        style={{marginRight: "50px"}}
      >
        {this.state.users.map((user) => {
          return (<Name>{user}</Name>);
        })}
      </Users>
      titleUsers = <Heading style={{width: "25%", marginRight: "50px"}}>Players</Heading>
      settingsStyle = {}
      styleHeading = {width: "70%", marginLeft: "auto"}
    }

    else {
      settingsStyle = {marginRight: "auto"}
      styleHeading = {width: "70%", marginLeft: "auto", marginRight: "auto"}
      settingsText = "You can change all the game settings here. If you don't change them, the default settings will be used." +
        " You cannot change them anymore once the game is created."
    }


    return (
      <OverlayContainer>
        <CustomOverlay>
        <h2
        style={{textAlign: "center", paddingTop: "20px"}}>Game Lobby</h2>
        <Container style={{display: "flex"}}>
          {titleUsers}
          <Heading style={styleHeading}>Game Settings</Heading>
        </Container>
        <Container style={{display: "flex"}}>
          {users}
          <SettingsForm
          style={settingsStyle}>
            <p
              style={{color: "black", textAlign: "left", fontSize: 18}}
            >
              {settingsText}
            </p>
            <Label>Min Players</Label>
            <CustomSelect
              disabled={!this.state.editable}
              defaultValue={this.state.playerMin}
              onChange={(e) => {
                this.handleInputChange("playerMin", e.target.value);
              }}>
              {this.state.possibleNumPlayers.map((num) => {
                return (<option>{num}</option>);
              })}
            </CustomSelect>
            <Label>Max Players</Label>
            <CustomSelect
              disabled={!this.state.editable}
              defaultValue={this.state.playerMax}
              onChange={(e) => {
                this.handleInputChange("playerMax", e.target.value);
              }}>
              {this.state.possibleNumPlayers.map((num) => {
                return (<option>{num}</option>);
              })}
            </CustomSelect>
            <Label>Number of evaluations</Label>
            <CustomSelect
              disabled={!this.state.editable}
              defaultValue={this.state.nrOfEvaluations}
              onChange={(e) => {
                this.handleInputChange("nrOfEvaluations", e.target.value);
              }}>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </CustomSelect>
            <Label>Doubt countdown time</Label>
            <InputField
              disabled={!this.state.editable}
              placeholder="Enter time in seconds ..."
              defaultValue={this.state.created ? this.state.doubtCountdown + " seconds" : null}
              onChange={(e) => {
                this.handleInputChange("doubtCountdown", e.target.value);
              }}
            />
            <Label>How long cards are visible after doubt</Label>
            <InputField
              disabled={!this.state.editable}
              placeholder="Enter time in seconds ..."
              defaultValue={this.state.created ? this.state.visibleAfterDoubtCountdown + " seconds" : null}
              onChange={(e) => {
                this.handleInputChange("visibleAfterDoubtCountdown", e.target.value);
              }}
            />
            <Label>Countdown for one player turn</Label>
            <InputField
              disabled={!this.state.editable}
              placeholder="Enter time in seconds ... "
              defaultValue={this.state.created ? this.state.playerTurnCountdown + " seconds" : null}
              onChange={(e) => {
                this.handleInputChange("playerTurnCountdown", e.target.value);
              }}
            />
            <Label>Tokens for correct Guess</Label>
            <CustomSelect
              disabled={!this.state.editable}
              defaultValue={this.state.tokenGainOnCorrectGuess}
              onChange={(e) => {
                this.handleInputChange("tokenGainOnCorrectGuess", e.target.value);
              }}>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </CustomSelect>
            <Label>Tokens on nearest guess</Label>
            <CustomSelect
              disabled={!this.state.editable}
              defaultValue={this.state.tokenGainOnNearestGuess}
              onChange={(e) => {
                this.handleInputChange("tokenGainOnNearestGuess", e.target.value);
              }}>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </CustomSelect>
            <Label>Horizontal comparison type</Label>
            <CustomSelect
              disabled={!this.state.editable}
              defaultValue={this.state.horizontalValueCategoryId}
              onChange={(e) => {
                this.handleInputChange("horizontalValueCategoryId", e.target.value);
              }}
            >{this.state.horizontalCategories.map((category) => {
              return (<option>{category}</option>);
            })}
            </CustomSelect>
            <Label>Vertical comparison type</Label>
            <CustomSelect
              disabled={!this.state.editable}
              defaultValue={this.state.verticalValueCategoryId}
              onChange={(e) => {
                this.handleInputChange("verticalValueCategoryId", e.target.value);
              }}
            >{this.state.verticalCategories.map((category) => {
              return (<option>{category}</option>);
            })}
            </CustomSelect>
          </SettingsForm>
        </Container>
        <Container
          style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
          <ButtonContainer>
            <Button style={{marginRight: 60}}>
              <Link
                onClick={() => {
                  this.exitLobby();
                }}
              >
                Exit Lobby
              </Link>
            </Button>
          </ButtonContainer>
          <ButtonContainer>
            <Button
               disabled={!this.state.host}
              style={{marginRight: 60}}>
              <Link
                onClick={() => {this.state.created ?
                  this.startGame(): this.createGame()}}
              >
                {this.state.created ?  "Start Game": "Create Game"}
              </Link>
            </Button>
          </ButtonContainer>
        </Container>
        </CustomOverlay>
        <Error message={this.state.errorMessage}/>
      </OverlayContainer>
    );
  }
}

export default withRouter(Lobby);
