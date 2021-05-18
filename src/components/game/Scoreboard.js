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

const Users = styled.ul`
  list-style: none;
  width: 40%;
  margin-top: 0;
  font-size: 90%;
  font-weight: 300;
  margin-right: auto;
  margin-left: auto;
  height: 30vh;
  padding: 0;
  background: rgb(255, 255, 255);
  border: 0.15em black solid;
`;



const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
  
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


  render() {
    return (
      <OverlayContainer>
        <CustomOverlay>
          <h2
            style={{textAlign: "center", paddingTop: "20px"}}>Leaderboard</h2>
          <Container>
            <Container>
              <Users>
                {this.state.scoreboard.map((player) => {
                  return (<Name>{player.username}: {player.currentTokens}</Name>);
                })}
              </Users>
            </Container>
          </Container>
          <ButtonContainer>
            <Button>
              <Link
                onClick={() => {
                  this.exitLobby();
                }}
              >
                Back to main view
              </Link>
            </Button>
          </ButtonContainer>
        </CustomOverlay>
        <NotificationContainer/>
      </OverlayContainer>
    );
  }
}



export default withRouter(Scoreboard);
