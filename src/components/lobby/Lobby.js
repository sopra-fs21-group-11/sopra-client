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
import { FiHelpCircle } from 'react-icons/fi';
import ReactTooltip from 'react-tooltip';

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
  font-size: larger;
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
  opacity: ${props => (props.disabled ? 0.4 : 1)};
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
      possibleNumEval: [1, 2, 3, 4, 5],
      gameId: null,
      gameName: "",
      deckId: 1,
      deck: {
        deck: {},
        possibilities: [],
        description: "You can customize your decks in the deck creator. The default deck consists of Swiss locations only.",
      },
      settings: {
        playersMin: {
          name: "Minimal Number of Players",
          value: 2,
          possibilities: [2, 3, 4, 5, 6],
          description: "The minimal number of players that have to join the game to play, default is 2.",
        },
        playersMax: {
          name: "Maximal Number of Players",
          value: 6,
          possibilities: [2, 3, 4, 5, 6],
          description: "The maximal number of players that can join the game, default is 6",
        },
        nrOfStartingTokens: {
          name: "Number of Starting Tokens",
          value: 0,
          possibilities: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
          description: "The amount of token each player gets at the beginning of the game.",
        },
        tokenGainOnCorrectGuess: {
          name: "Tokens for Correct Guess",
          value: 2,
          possibilities: [0, 1, 2, 3, 4, 5],
          description: "Amount of tokens a player can win in the evaluation phase when the bet was exactly correct.",
        },
        tokenGainOnNearestGuess: {
          name: "Tokens for Closest Guess",
          value: 2,
          possibilities: [0, 1, 2, 3, 4, 5],
          description: "Amount of tokens a player can win in the evaluation phase when the bet was closest to the actual number.",
        },
        nrOfEvaluations: {
          name: "Number of Evaluations",
          value: 2,
          possibilities: [1, 2, 3, 4, 5],
          description: "Specifies the number of times an evaluation takes place during the game.",
        },
      },
      countdowns: {
        playerTurnCountdown: {
          name: "Countdown for One Turn",
          value: 30,
          possibilities: [],
          description: "The time a player has to place a card.",
        },
        doubtCountdown: {
          name: "Doubt Countdown",
          value: 5,
          possibilities: [],
          description: "The time each player has to doubt the placement of a card.",
        },
        visibleAfterDoubtCountdown: {
          name: "Visible after Doubt Countdown",
          value: 10,
          possibilities: [],
          description: "How long the backsides of the cards (i.e. the coordinates) are visible after the doubting phase.",
        },
        evaluationCountdown: {
          name: "Evaluation Countdown",
          value: 10,
          possibilities: [],
          description: "The time each user has to make a bet on how many cards are wrongly placed.",
        },
        evaluationCountdownVisible: {
          name: "Visible after Evaluation Countdown",
          value: 10,
          possibilities: [],
          description: "How long the backsides of the cards (i.e. the coordinates) are visible after the evaluation phase.",
        },
      },
      editable: true,
      created: null,
      host: true,
      loading:false,
      placeholderCountdown: "Enter time in seconds (between 1 and 300) ...",
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

       console.log(deckResponse);
       console.log(settingResponse);

       for (let setting in this.state.settings) {
         if (this.state.settings.hasOwnProperty(setting) && settingResponse.data.hasOwnProperty(setting)) {
           let newSetting = this.state.settings[setting];
           newSetting["value"]= settingResponse.data[setting]

           let newSettings = this.state.settings;
           newSettings[setting] = newSetting;
           this.setState({settings: newSettings})
       }}

       for (let countdown in this.state.countdowns) {
         if (this.state.countdowns.hasOwnProperty(countdown) && settingResponse.data.hasOwnProperty(countdown)) {
         let newCountdown = this.state.countdowns[countdown];
         newCountdown["value"]= settingResponse.data[countdown]

         let newCountdowns = this.state.countdowns;
         newCountdowns[countdown] = newCountdown;
         this.setState({countdowns: newCountdowns})
       }}

       let deck = this.state.deck;
       deck["possibilities"] = deckResponse.data;
       deck["deck"] = deckResponse.data[0];

       this.setState({deck: deck, deckId: settingResponse.data.deckId});


       console.log(this.state);

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

  handleCountdownChange(key, event)  {
      if (event.target.value<= 0 || event.target.value > 300) {
        NotificationManager.error("The countdown has to be between 1 and 300 seconds",'',3000);
        event.target.value = ""
      }
      else {
        let newState = this.state;
        newState.countdowns[key].value = event.target.value;
        this.setState(newState);
      }
    }

  handleSettingsChange(key, event)  {
    let newState = this.state.settings;
    newState[key].value = event.target.value;
    this.setState({settings: newState});
    if (key === "playersMin" || key === "playersMax") {
      if (this.state.settings.playersMin.value > this.state.settings.playersMax.value) {
        NotificationManager.error("Minimal number of players cannot be greater than maximal number", '', 3000);
        event.target.value = key === "playersMin" ? 2 : 6;
      }
    }
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
        playerMin: this.state.settings.playersMin.value,
        playerMax: this.state.settings.playersMax.value,
        nrOfEvaluations: this.state.settings.nrOfEvaluations.value,
        doubtCountdown: this.state.countdowns.doubtCountdown.value,
        playerTurnCountdown: this.state.countdowns.playerTurnCountdown.value,
        visibleAfterDoubtCountdown: this.state.countdowns.visibleAfterDoubtCountdown.value,
        tokenGainOnCorrectGuess: this.state.settings.tokenGainOnCorrectGuess.value,
        tokenGainOnNearestGuess: this.state.settings.tokenGainOnNearestGuess.value,
        nrOfStartingTokens: this.state.settings.nrOfStartingTokens.value,
        evaluationCountdownVisible: this.state.countdowns.evaluationCountdownVisible.value,
        deckId: this.state.deckId,
        evaluationCountdown: this.state.countdowns.evaluationCountdown.value,
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

  getSetting(name, setting) {
    let component = [
      <Label>{setting.name} <FiHelpCircle data-tip={setting.description} /> </Label>,
      <CustomSelect
      disabled={!this.state.editable}
      defaultValue={setting.value}
      onChange={(e) => {
        this.handleSettingsChange(name, e);
      }}>
      {setting.possibilities.map((num) => {
        return (
          <option key={num.toString()}>{num}</option>);
      })}
      </CustomSelect>
    ]

    return (component);
  }

  getCountdown(name, countdown) {
    let component = [
      <Label>{countdown.name} <FiHelpCircle data-tip={countdown.description} /> </Label>,
      <InputField
        type="number"
        min={"1"}
        max={"300"}
        disabled={!this.state.editable}
        placeholder={this.state.placeholderCountdown}
        onChange={(e) => {this.handleCountdownChange(name, e);}}
      />
    ];

    return (component);

  }

  render() {
    let users;
    let titleUsers;
    let settingsStyle;
    let styleHeading;
    let settingsText;

    if (this.state.created) {
      users = <Users>
        {this.state.players.map((player) => {
          return (<Name key={player.id}>{player.username}</Name>);
        })}
      </Users>
      titleUsers = <Heading style={{width: "25%", marginRight: "5%"}}>Players</Heading>
      settingsStyle = {}
      styleHeading = {width: "70%", marginLeft: "auto"}
      settingsText =
          [<h4>Quick recap of the game rules </h4>,
          <ul>1. Card placement phase: One player gets to place a card in relation to the cards already on the board based on
            the coordinates. You can place it either north, south, east or west of another card. </ul>,
          <ul>2. Doubting phase: All the other players that did not just place a card can doubt the placement of the last card.
            You can gain/lose tokens if your doubt was (in)correct. </ul>,
          <ul>3. Evaluation phase: All players can place a bet on how many cards on the board are wrongly placed. You can gain tokens
             if your bet is exactly correct or if your bet is closest to the actual number of wrongly placed cards.</ul>]
    }
    else {
      settingsStyle = {marginRight: "auto"}
      styleHeading = {width: "70%", marginLeft: "auto", marginRight: "auto"}
      settingsText = "You can change all the game settings here. If you don't change them, the default settings will be used." +
        " You cannot change them anymore once the game is created. Hover over the question mark icons to see more details on the settings."
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
            <div style={{color: "black", textAlign: "left", fontSize: "100%"}}>{settingsText}</div>
            <Label>Game Name</Label>
            <InputField
              disabled={!this.state.editable}
              placeholder="Enter a game name ..."
              value={this.state.gameName}
              onChange={(e) => {
                this.handleInputChange("gameName", e.target.value);
              }}
            />
            <Label>Deck <FiHelpCircle  data-tip={this.state.deck.description} /></Label>
            <ReactTooltip type="warning" />
            <CustomSelect
              disabled={!this.state.editable}
              onChange={(e) => {
                this.handleInputChange("deckId", e.target.value);
              }}>
              {this.state.deck.possibilities.map((deck) => {
                return (
                  <option
                    key={deck.id}
                    value={deck.id}
                  >
                    {deck.name}
                  </option>);
              })}
            </CustomSelect>

            {Object.entries(this.state.settings).map(([name, setting]) =>
              this.getSetting(name, setting))}

            {Object.entries(this.state.countdowns).map(([name, setting]) =>
              this.getCountdown(name, setting))}

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
