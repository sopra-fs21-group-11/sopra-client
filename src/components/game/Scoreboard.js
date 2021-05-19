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

const Container = styled(BaseContainer)`
  color: white;
  text-align: center;
  justify-content: center;
  width: 80%;
  height: 80%;
`;

const Users = styled.table`
  width: 60%;
  table-layout: auto;
  border-collapse: collapse;  
  margin-top: 0;
  font-size: 90%;
  font-weight: 300;
  color: black;
  margin-right: auto;
  margin-left: auto;
  height: auto;
  padding: 0;
  text-align: left;
  background: rgb(255, 255, 255);
  border: 0.15em black solid;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
  
`;

const TableHeader = styled.th`
  column-width: auto;
  border: 0.15em black solid;
  padding-left: 5px;
  background: rgb(0, 132, 0, 1);
`;

const TableEntry = styled.td`
  padding-left: 5px;
  border-left: 0.15em black solid;
  
`;

const CustomOverlay = styled.div`
  background: rgb(200, 213, 0, 0.25);
  height: 90%;
`;


class Scoreboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameId: 0,
      scoreboard:  [],
      gameTooShort: false,
      winnerIds: [],
      gameMinutes: 0,
    };
  }
  async componentDidMount() {

    if(this.props.location.state) {
      let gameId = this.props.location.state.gameEndScore.gameId;
      let scoreboard = this.props.location.state.gameEndScore.scoreboard;
      let gameTooShort = this.props.location.state.gameEndScore.gameTooShort;
      let winnerIds = this.props.location.state.gameEndScore.winnerIds;
      let gameMinutes = this.props.location.state.gameEndScore.gameMinutes;
      this.setState({
        gameId: gameId,
        scoreboard:  scoreboard,
        gameTooShort: gameTooShort,
        winnerIds: winnerIds,
        gameMinutes: gameMinutes
      }, () => {console.log(this.state);});}

  }


  exitLobby() {
    this.props.history.push("/mainView")
  }

  handleInputChange(key, value) {
    this.setState({[key]: value});
  }

  getScoreboardEntry(player) {
    console.log(player);
    let tableEntry = <tr key={player.id + 1}>
      <TableEntry>{player.username}</TableEntry>
      <TableEntry>{player.currentToken}</TableEntry>
      <TableEntry>{player.totalWins}</TableEntry>
      <TableEntry>{player.totalTokens}</TableEntry>
      <TableEntry>{player.playTime}</TableEntry>
    </tr>

    console.log(tableEntry);

    return tableEntry
  }

  getScoreboard() {

    let scoreboard = [<tr key={0}>
      <TableHeader>Username</TableHeader>
      <TableHeader>Tokens</TableHeader>
      <TableHeader>Total Wins</TableHeader>
      <TableHeader>Total Won Tokens</TableHeader>
      <TableHeader>Time Played</TableHeader>
    </tr>]
    this.state.scoreboard.map((player) => {
      scoreboard.push(this.getScoreboardEntry(player));
    });

    console.log(scoreboard);

    return scoreboard;

  }


  render() {
    return (
      <OverlayContainer>
        <CustomOverlay>
          <h2
            style={{textAlign: "center", paddingTop: "20px"}}>Leaderboard</h2>
          <Container>
              <Users>
                {this.getScoreboard()}
              </Users>
          </Container>
          <ButtonContainer>
            <Button
                onClick={() => {
                  this.exitLobby();
                }}
              >
                Back to main view
            </Button>
          </ButtonContainer>
        </CustomOverlay>
        <NotificationContainer/>
      </OverlayContainer>
    );
  }
}



export default withRouter(Scoreboard);
