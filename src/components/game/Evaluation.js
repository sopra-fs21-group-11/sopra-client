
import React from "react";
import styled from "styled-components";
import {Button} from "../../views/design/Button";

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

const GuessSubmitButton =styled(Button)`
  
  width: 100%;
`;


export class Evaluation extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      guess: "",
      placeholder: "Enter guess here.."
    };
  }

  sendGuess(){
    let requestBoby={
      "nrOfWrongPlacedCards": this.state.guess,
      "gameId": this.props.gameId
    };
    this.props.stompClient.send("/app/game/guess", {},
      JSON.stringify(requestBoby));


    console.log(requestBoby)


    this.setState({guess: null});
    this.setState({placeholder: "submitted"});

  }


  isPositiveNumber(){
    return true;

  }


  handleInputChange(value) {
    console.log(value);

    let possibleValue = value.slice(0,2);
    possibleValue = possibleValue.replace(/[^0-9]/, "");
    if(value.charAt(0) === "0"){
      possibleValue = "0";
    }
    this.setState({ guess: possibleValue });

  }


  render () {
    return (
      <EvaluationFormContainer>
        <GuessInput
          placeholder={this.state.placeholder}
          disabled={this.state.placeholder === "submitted"}
          value={this.state.guess}
          onChange={(e) => {
            this.handleInputChange(e.target.value);
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

