
import React from "react";
import styled from "styled-components";
import {NotificationManager} from "react-notifications";

const EvaluationFormContainer = styled.form`
  width: ${(props)=>(props.width ? props.width : "140px")};
`;

const GuessInput = styled.input`
  &::placeholder {
    color: rgba(0, 0, 0, 1);
  }
  font-size: 13px;
  height: 30px;
  font-weight: 200;
  margin-bottom: 5px;
  background: rgba(0, 102, 0, 0.2);
  color: black;
  border-color: rgb(0, 0, 0, 0.4);
  text-align: center;
  opacity: ${props => (props.placeholder === "submitted" ? 0.4 : 1)};
  width: 100%;
`;

const GuessSubmitButton =styled.button`
  &:hover {
    transform: translateY(-2px);
  }
  margin-left: 0px;
  padding: 3px;
  font-weight: 900;
  text-transform: uppercase;
  font-size: 13px;
  text-align: center;
  color: black;
  height: 30px;
  border-color: rgb(0, 0, 0, 1);
  border-width: 4px;
  border-style: solid;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  background: rgb(0, 132, 0, 1);
  transition: all 0.3s ease;
  width: 100%;
`;


export class Evaluation extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      guess: null,
      placeholder: "Enter guess here.."
    };
  }

  sendGuess(){
    let requestBody={
      "nrOfWrongPlacedCards": this.state.guess,
      "gameId": this.props.gameId
    };
    this.props.stompClient.send("/app/game/guess", {},
      JSON.stringify(requestBody));


    console.log(requestBody)


    this.setState({guess: null});
    this.setState({placeholder: "submitted"});
  }


  handleInputChange(event) {
    if (event.target.value<= 0) {
      NotificationManager.error("Please enter a number between greater than 0",'',3000);
      event.target.value = ""
    }

    else {this.setState({ guess: event.target.value });}

  }


  render () {
    return (
      <EvaluationFormContainer>
        <GuessInput
          type="number"
          placeholder={this.state.placeholder}
          disabled={this.state.placeholder === "submitted"}
          maxLength={2}
          min={1}
          max={10}
          pattern="[0-9]+"
          onChange={(e) => {
            this.handleInputChange(e);
          }}
        />
        <GuessSubmitButton
          disabled={!this.state.guess || this.state.placeholder === "submitted"}
          onClick={() => {
            this.sendGuess();
          }}
        >
          Submit guess
        </GuessSubmitButton>
      </EvaluationFormContainer>
      )
  }
}

