/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import styled from "styled-components";
import {BaseContainer} from "../../helpers/layout";
import {Button} from "../../views/design/Button";
import {withRouter} from "react-router-dom";
import Error from "../../views/Error";
import {api} from "../../helpers/api";
import {OverlayContainer} from "../../views/design/Overlay";
import {InputField} from "../../views/design/InputField";
import LoadingOverlay from 'react-loading-overlay';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import {Tooltip} from "@material-ui/core";

const Container = styled(BaseContainer)`
  color: white;
  text-align: center;
  overflow: hidden;
  width: 80%;
  height: 80%;
`;

const Users = styled.ul`
  list-style: none;
  width: 25%;
  margin-top: 0;
  font-size: 90%;
  font-weight: 300;
  margin-right: 5%;
  height: 58vh;
  padding: 0;
  background: rgb(255, 255, 255);
  border-left: 0.15em black solid;
  border-right: 0.15em black solid;
  border-bottom: 0.15em black solid;
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

const Name = styled.p`
  margin: 10px;
  color: black;
  font-size: 16px;
  font-weight: 300;
`;

const Heading = styled.h4`
  color: black;
  border: 0.15em black solid;
  background: rgb(0, 132, 0, 1);
  width: 100%;
  padding-bottom: 0;
  margin-bottom: 0;
  height: 50%;
  align-items: center;
  display: flex;
  justify-content: center;
  border-radius:   4px 4px 0px 0px;
`;

const SettingsForm = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: auto;
  width: 70%;
  height: 58vh;
  font-size: 90%;
  font-weight: 300;
  padding-top: 7px;
  padding-left: 37px;
  padding-right: 37px;
  background: rgb(255, 255, 255);
  border-left: 0.15em black solid;
  border-right: 0.15em black solid;
  border-bottom: 0.15em black solid;
  overflow: scroll;
  border-radius:  0px 0px 4px 4px;
`;

const CustomSelect = styled.select`
  margin-bottom: 2%;
  border-color: rgb(0, 0, 0, 0.4);
  background: rgba(0, 102, 0, 0.2);
  border-radius:   4px;
`;

const CustomOverlay = styled.div`
  background: rgb(200, 213, 0, 0.25);
  height: 90%;
`;


class Lobby extends React.Component {
  constructor() {
    super();
    this.state = {
      players: [],
      possibleNumPlayers: [2, 3, 4, 5, 6],
      possibleTokenGainOrLoss: [1, 2, 3, 4, 5],
      gameId: null,
      horizontalCategories: [],
      verticalCategories: [],
      nrOfEvaluations: 2,
      doubtCountdown: 10,
      visibleAfterDoubtCountdown: 5,
      playerTurnCountdown: 30,
      horizontalValueCategoryId: {name: ""},
      verticalValueCategoryId: {name: ""},
      tokenGainOnCorrectGuess: 2,
      tokenGainOnNearestGuess: 2,
      playerMin: 2,
      playerMax: 6,
      editable: true,
      created: null,
      host: true,
      gameName: "",
      loading:false,
      oneAxis: false,
      deckId: 0,
      nrOfStartingTokens: 0,
      evaluationCountdown: 0,
      evaluationCountdownVisible: 0,
      decks: [],
      deck: 0,
    };
  }
  async componentDidMount() {
     if(this.props.location.state) {
       let gameId = this.props.location.state.gameId;
       this.setState({
         gameId: gameId,
         created: true,
         editable: false,
         host: false,
         loading:true
       }, () => {console.log(this.state.gameId);});
       NotificationManager.warning('Host will start the Game soon. Please wait..', '', 3000);
       await this.getPlayersAndGameState();
       this.timer = setInterval(() => this.getPlayersAndGameState(), 10000); //polling every 10 seconds
     }

     else {
       const settingResponse = await api.get("games/settings/");
       const deckResponse = await api.get("decks/");
       const compareResponse = await api.get("decks/comparetypes")

       console.log(compareResponse);
       console.log(settingResponse);
       console.log(deckResponse);

       this.setState({
         decks: deckResponse.data,
         deckId: settingResponse.data.deckId,
         playerMin: settingResponse.data.playersMin,
         playerMax: settingResponse.data.playersMax,
         evaluationCountdown: settingResponse.data.evaluationCountdown,
         evaluationCountdownVisible: settingResponse.data.evaluationCountdownVisible,
         nrOfEvaluations: settingResponse.data.nrOfEvaluations,
         nrOfStartingTokens: settingResponse.data.nrOfStartingTokens,
         doubtCountdown: settingResponse.data.doubtCountdown,
         visibleAfterDoubtCountdown: settingResponse.data.visibleAfterDoubtCountdown,
         playerTurnCountdown: settingResponse.data.playerTurnCountdown,
         horizontalValueCategoryId: settingResponse.data.horizontalValueCategoryId.name,
         verticalValueCategoryId: settingResponse.data.verticalValueCategoryId.name,
         tokenGainOnCorrectGuess: settingResponse.data.tokenGainOnCorrectGuess,
         tokenGainOnNearestGuess: settingResponse.data.tokenGainOnNearestGuess,
         horizontalCategories: compareResponse.data,
         verticalCategories: compareResponse.data,
       })




       console.log(deckResponse.data);
     }

    }

  componentWillUnmount() {
    window.clearInterval(this.timer);
    this.timer = null;
  }

  async exitLobby() {
    if (this.state.gameId && this.state.host) {
      const response = await api.get("/games/" + this.state.gameId+"/leave",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`}
      });
    console.log(response);
    this.props.history.push("/mainView")
    }else{
      this.props.history.push("/mainView")
    }
  }

  handleInputChange(key, value) {
    this.setState({[key]: value});
  }

  async getPlayersAndGameState() {
    if (this.state.gameId) {
      const response = await api.get("/games/" + this.state.gameId);

      const players = await Promise.all(response.data.players);
      this.handleInputChange("players", players);

      // for non host players and if there list of players is not updated, there will be loading sign
      if(!this.state.host && players.length>0) {
        this.setState({loading: false})
      }

        const gameStart = response.data.gameStarted;

        if (gameStart) {
          this.props.history.push("/game");
        }
    }
  }


  async createGame() {
    try {

      const requestBody = JSON.stringify({
        hostId: localStorage.getItem("loginUserId"),
        token: localStorage.getItem("token"),
        name: this.state.gameName,
        playerMin: this.state.playerMin,
        playerMax: this.state.playerMax,
        cardEvaluationNumber: this.state.cardEvaluationNumber,
        nrOfEvaluations: this.state.nrOfEvaluations,
        doubtCountdown: this.state.doubtCountdown,
        visibleAfterDoubtCountdown: this.state.visibleAfterDoubtCountdown,
        playerTurnCountdown: this.state.playerTurnCountdown,
        horizontalValueCategoryId: 1, // TODO: fix categories in backend
        verticalValueCategoryId: 1,
        tokenGainOnCorrectGuess: this.state.tokenGainOnCorrectGuess,
        tokenGainOnNearestGuess: this.state.tokenGainOnNearestGuess,
      });

      console.log(requestBody);

      // create game
      const response = await api.post("/games", requestBody, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`}}
        );

      //console.log(response);
      NotificationManager.success('Game is Created', 'Hurray',3000);
      localStorage.setItem("gameId", response.data.id);
      localStorage.setItem("hostId", localStorage.getItem("loginUserId"));

      // create variable for created userOverview
      this.handleInputChange("created", true);
      this.handleInputChange("editable", false);
      this.handleInputChange("gameId", response.data.id);

      await this.getPlayersAndGameState();
      this.timer = setInterval(() => this.getPlayersAndGameState(), 10000); //polling every 10 seconds



    } catch (error) {
      NotificationManager.error(error.message,'',3000);
    }

  }

  async startGame() {
    try {

      if(this.state.playerMin>this.state.players.length)
      {
        NotificationManager.warning("Minimum "+this.state.playerMin+" Players should join to start the game",'',3000);
      } else{
      // start userOverview
      const response = await api.post("/games/" + localStorage.getItem("gameId") + "/start",
        {token: localStorage.getItem("token")},
        {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      this.props.history.push("/game");
    }


    } catch (error) {
        NotificationManager.error(error.message,'',3000);
    }
  }



  render() {
    let users;
    let titleUsers;
    let settingsStyle;
    let styleHeading;
    let settingsText;
    let disabled;

    if (this.state.created) {
      users = <Users>
        {this.state.players.map((player) => {
          return (<Name key={player.id}>{player.username}</Name>);
        })}
      </Users>
      titleUsers = <Heading style={{width: "25%", marginRight: "5%"}}>Players</Heading>
      settingsStyle = {}
      styleHeading = {width: "70%", marginLeft: "auto"}

      disabled = true;
    }


    else {
      settingsStyle = {marginRight: "auto"}
      styleHeading = {width: "70%", marginLeft: "auto", marginRight: "auto"}
      settingsText = "You can change all the game settings here. If you don't change them, the default settings will be used." +
        " You cannot change them anymore once the game is created."

      disabled = false;
    }


    return (
      <OverlayContainer>
        <LoadingOverlay
            active={this.state.loading}
            spinner
            text='Loading ...'
            >
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
              style={{color: "black", textAlign: "center", fontSize: "100%"}}
            >
              {settingsText}
            </p>
            <Label>Game Name</Label>
            <InputField
              disabled={!this.state.editable}
              placeholder="Enter a game name ..."
              value={this.state.gameName}
              onChange={(e) => {
                this.handleInputChange("gameName", e.target.value);
              }}
            />
            <Label>Deck</Label>
            <CustomSelect
              disabled={disabled}
              onChange={(e) => {
                console.log(e);
                this.handleInputChange("deck", e.target.value);
              }}>
              {this.state.decks.map((deck) => {
                return (
                  <option
                    key={deck.id.toString()}
                    title={deck.description}>
                    {deck.name}
                  </option>);
              })}
            </CustomSelect>
            <Label>Min Players</Label>
            <CustomSelect
              disabled={disabled}
              defaultValue={this.state.playerMin}
              onChange={(e) => {
                this.handleInputChange("playerMin", e.target.value);
              }}>
              {this.state.possibleNumPlayers.map((num) => {
                return (
                  <option key={num.toString()}>{num}</option>);
              })}
            </CustomSelect>
            <Label>Max Players</Label>
            <CustomSelect
              disabled={disabled}
              defaultValue={this.state.playerMax}
              onChange={(e) => {
                this.handleInputChange("playerMax", e.target.value);
              }}>
              {this.state.possibleNumPlayers.map((num) => {
                return (<option key={num.toString()}>{num}</option>);
              })}
            </CustomSelect>
            <Label>Number of evaluations</Label>
            <CustomSelect
              disabled={disabled}
              defaultValue={this.state.nrOfEvaluations}
              onChange={(e) => {
                this.handleInputChange("nrOfEvaluations", e.target.value);
              }}>{this.state.possibleTokenGainOrLoss.map((num) => {
              return (<option key={num.toString()}>{num}</option>);
            })}
            </CustomSelect>
            <Label>Doubt countdown time</Label>
            <InputField
              disabled={disabled}
              placeholder="Enter time in seconds ..."
              defaultValue={this.state.created ? this.state.doubtCountdown + " seconds" : null}
              onChange={(e) => {
                this.handleInputChange("doubtCountdown", e.target.value);
              }}
            />
            <Label>How long cards are visible after doubt</Label>
            <InputField
              disabled={disabled}
              placeholder="Enter time in seconds ..."
              defaultValue={this.state.created ? this.state.visibleAfterDoubtCountdown + " seconds" : null}
              onChange={(e) => {
                this.handleInputChange("visibleAfterDoubtCountdown", e.target.value);
              }}
            />
            <Label>Countdown for one player turn</Label>
            <InputField
              disabled={disabled}
              placeholder="Enter time in seconds ... "
              defaultValue={this.state.created ? this.state.playerTurnCountdown + " seconds" : null}
              onChange={(e) => {
                this.handleInputChange("playerTurnCountdown", e.target.value);
              }}
            />
            <Label>Tokens for correct Guess</Label>
            <CustomSelect
              disabled={disabled}
              defaultValue={this.state.tokenGainOnCorrectGuess}
              onChange={(e) => {
                this.handleInputChange("tokenGainOnCorrectGuess", e.target.value);
              }}>{this.state.possibleTokenGainOrLoss.map((num) => {
              return (<option key={num.toString()}>{num}</option>);
            })}
            </CustomSelect>
            <Label>Tokens on nearest guess</Label>
            <CustomSelect
              disabled={disabled}
              defaultValue={this.state.tokenGainOnNearestGuess}
              onChange={(e) => {
                this.handleInputChange("tokenGainOnNearestGuess", e.target.value);
              }}>{this.state.possibleTokenGainOrLoss.map((num) => {
              return (<option key={num.toString()}>{num}</option>);
            })}
            </CustomSelect>
            <Label>First comparison type</Label>
            <CustomSelect
              disabled={disabled}
              defaultValue={this.state.verticalValueCategoryId.name}
              onChange={(e) => {
                this.handleInputChange("verticalValueCategoryId", e.target.value);
              }}
            >{this.state.verticalCategories.map((category) => {
              return (<option title={category.description} key={category.id.toString()}>{category.name}</option>);
            })}
            </CustomSelect>
            <Label>Second comparison type</Label>
            <CustomSelect
              disabled={disabled}
              defaultValue={this.state.horizontalValueCategoryId.name}
              onChange={(e) => {
                this.handleInputChange("horizontalValueCategoryId", e.target.value);
              }}
            >{this.state.horizontalCategories.map((category) => {
              return (<option key={category.id.toString()}>{category.name}</option>);
            })}
            </CustomSelect>
          </SettingsForm>
        </Container>
        <Container
          style={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
          <ButtonContainer>
            <Button
              style={{marginRight: 60}}
              onClick={() => {
                this.exitLobby();
              }}
            >
                Exit Lobby
            </Button>
          </ButtonContainer>
          <ButtonContainer>
            <Button
               disabled={!this.state.host}
              style={{marginRight: 60}}
                onClick={() => {this.state.created ?
                  this.startGame(): this.createGame()}}
              >
                {this.state.created ?  "Start Game": "Create Game"}
            </Button>
          </ButtonContainer>
        </Container>
        </CustomOverlay>
        </LoadingOverlay>
        <NotificationContainer/>
      </OverlayContainer>
    );
  }
}

export default withRouter(Lobby);
