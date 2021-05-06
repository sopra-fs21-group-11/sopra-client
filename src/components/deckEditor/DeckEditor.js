import React from "react";
import {withRouter} from "react-router-dom";

import styled from "styled-components";
import {Button} from "../../views/design/Button";
import {api} from "../../helpers/api";
import LoadingOverlay from "react-loading-overlay";

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
  border-radius:   4px 4px 0 0;
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
  border-radius:   0 0 4px 4px;
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

const Container = styled.div`
  margin-top: 2.5%;
  width: 100%;
`;


const Item = styled.div`
  margin-bottom: 5px;
  width: 100%;
  text-align: center;

  &:hover {
    cursor: pointer;
    background-color: rgba(0, 128, 0, 0.3);
  }
`;

const ClickedItem = styled.div`
  margin-bottom: 5px;
  width: 100%;
  text-align: center;
  background-color: rgba(0, 128, 0, 0.3);
  &:hover {
    cursor: pointer;
    
  }
`;

class DeckEditor extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      decks: null,
      cards: null,
      cardInfo: null,
      clickedDeck: null,
      clickedCard: null,
      loading:false
    };
  }

  async componentDidMount() {

    const response = await api.get("/decks/");
    console.log(response.data);
    this.setState({
      decks: response.data
    })

  }

  async getCards(){
    const response = await api.get("/cards/");
    console.log(response.data);
    this.setState({
      cards: response.data
    })
  }

  async getCardInfo(cardId){
    const response = await api.get("/cards/" + cardId);
    console.log(response.data);
    this.setState({
      cardInfo: response.data
    })
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
                {!this.state.decks?
                  (
                    <LoadingOverlay
                      active={this.state.loading}
                      spinner
                      text='Loading ...'
                    />
                  ):(
                    <Container>
                      {this.state.decks.map((deck)=>{
                        return (
                          <Container>
                            {this.state.clickedDeck === deck.id?
                              (
                                <ClickedItem>
                                  {deck.name}
                                </ClickedItem>
                              ):(
                                <Item
                                  key={deck.id}
                                  onClick={()=>{
                                    this.setState({clickedDeck: deck.id});
                                    this.getCards();
                                  }}
                                >
                                  {deck.name}
                                </Item>
                              )
                            }
                          </Container>
                        )

                      })}
                    </Container>
                  )
                }
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
                {!this.state.cards?
                  (
                    ""
                  ):(
                    <Container>
                      {this.state.cards.map((card)=>{
                        return (
                          <Container>
                            {this.state.clickedCard === card.id?
                              (
                                <ClickedItem>
                                  {card.name}
                                </ClickedItem>
                              ):(
                                <Item
                                  key={card.id}
                                  onClick={()=>{
                                    this.setState({clickedCard: card.id});
                                    this.getCardInfo(card.id);
                                  }}
                                >
                                  {card.name}
                                </Item>
                              )
                            }
                          </Container>
                        )

                      })}
                    </Container>
                  )
                }
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
                {!this.state.cardInfo?
                  (
                    ""
                  ):(
                    <Container>
                      <Item>
                        Name: {this.state.cardInfo.name}
                      </Item>
                      <Item>
                        Lat.: {this.state.cardInfo.nCoordinate}
                      </Item>
                      <Item>
                        Long.: {this.state.cardInfo.eCoordinate}
                      </Item>
                    </Container>
                  )
                }
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