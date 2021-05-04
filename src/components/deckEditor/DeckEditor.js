import React from "react";
import {withRouter} from "react-router-dom";

import styled from "styled-components";
import {Button} from "../../views/design/Button";

const OverlayContainer = styled.div`
  width: 100%;
  height: 100%;
  margin: 0;
  position: absolute;
  display: flex;
  align-items: center;
  top: 0;
  bottom: 0;
`;

const Overlay = styled.div`
  height: 90%;
  width: 100%;
  background: rgb(200, 213, 0, 0.25);
  
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 10%;
`;

const Header = styled.h1`
  
`;

const BodyContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  height: 80%;
`;

const ComponentContainer = styled.div`
  width: 25%;
  height: 90%;
  position: relative;
`;

const BoxHeading = styled.div`
  color: black;
  border: 0.15em black solid;
  background: rgb(0, 132, 0, 1);
  width: 100%;
  height: 10%;
  align-items: center;
  display: flex;
  justify-content: center;
  border-radius:   4px 4px 0px 0px;
  font-weight: bold;
  font-size: larger;
;
`;

const BoxBody = styled.div`
  height: 80%;
  background-color: white;
  overflow: scroll;
  border: 0.15em black solid;
  border-top: none;
  border-radius:   0px 0px 4px 4px;
`;

const ButtonContainer = styled.div`
  height: 10%;
  margin-top: 2%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
`;

const BackButtonContainer = styled.div`
  height: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

class DeckEditor extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading:false
    };
  }

  render() {
    return(
      <OverlayContainer>
        <Overlay>
          <HeaderContainer>
            <Header>
              Deck Editor
            </Header>
          </HeaderContainer>
          <BodyContainer>
            <ComponentContainer>
              <BoxHeading>
                Decks
              </BoxHeading>
              <BoxBody>

              </BoxBody>
              <ButtonContainer>
                  <Button
                    width="50%"
                    onClick={() => {

                    }}
                  >
                    Create new deck
                  </Button>
                  <Button
                    width="30%"
                    onClick={() => {

                    }}
                  >
                    Edit deck
                  </Button>
              </ButtonContainer>

            </ComponentContainer>
            <ComponentContainer>
              <BoxHeading>
                Cards
              </BoxHeading>
              <BoxBody>

              </BoxBody>
              <ButtonContainer>
                <Button
                  width="50%"
                  onClick={() => {

                  }}
                >
                  Create new card
                </Button>
                <Button
                  width="30%"
                  onClick={() => {

                  }}
                >
                  Edit card
                </Button>


              </ButtonContainer>

            </ComponentContainer>
            <ComponentContainer>
              <BoxHeading>
                Card Details
              </BoxHeading>
              <BoxBody>

              </BoxBody>
              <ButtonContainer>
                <Button
                  width="40%"
                  onClick={() => {

                  }}
                >
                  Safe
                </Button>
                <Button
                  width="40%"
                  onClick={() => {

                  }}
                >
                  Delete
                </Button>
              </ButtonContainer>
            </ComponentContainer>
          </BodyContainer>
          <BackButtonContainer>
            <Button
              width="15%"
              onClick={() => {
                this.props.history.push("/mainView");
              }}
            >
              Back to Main View
            </Button>
          </BackButtonContainer>

        </Overlay>
      </OverlayContainer>
    )
  }
}

export default withRouter(DeckEditor);