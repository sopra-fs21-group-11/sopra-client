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

const DeckInfoContainer = styled.div`
  
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 10%;
  margin-left: 2%;
`;

const Header = styled.h1`
`;

const DeckNameInput = styled.input`
  height: 50%;
  width: 15%;
  margin-right: 2%;
  border-radius:   4px 4px 4px 4px;
  &::placeholder {
    color: rgba(0, 0, 0, 1);
  }
`;

const DeckCountryDropdown = styled.select`
  width: 60%;
  margin-right: 2%;
`;

const DeckInputForm = styled.div`
  width: 30%;
`;

const LoadingInputContainer = styled.div`
  width: 40%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;


const BodyContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  height: 70%;
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
  height: 90%;
  background-color: white;
  overflow: scroll;
  border: 0.15em black solid;
  border-top: none;
  border-radius:   0 0 4px 4px;
`;

const Footer = styled.div`
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

class DeckCreator extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      decks: null,
      cards: null,
      cardInfo: null,
      clickedDeck: null,
      clickedCard: null,
      loading:false,
      deckName: "",
      isDeckCreated: false,
      deckCreatingMethod: "Choose deck creating method",
      isDeckCreatingMethodSubmitted: false
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

  handleInputChange(value){
    this.setState({
      deckName: value
    });
  }

  async createDeck(){

    console.log(this.state.deckName);
    this.setState(
      {
        isDeckCreated: true
      }
    );
    /*const response = await api.post("/games", requestBody, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`}}
    );

    this.props.history.push({
      pathname: "/deckCreator",
      state: response.data
      }
    )*/
  }

  setDeckCreatingMethod(value){
    console.log(value);
    this.setState(
      {
        deckCreatingMethod: value
      }
    );
  }

  async provideMethodForAddingCards(){
    this.setState({isDeckCreatingMethodSubmitted: true});
    if(this.state.deckCreatingMethod === "existingCards"){
      const response = await api.get("/cards");
      console.log(response.data);
      this.setState({
        cards: response.data
      })
    }
  }

  render() {
    return(
      <OverlayContainer>
        <Overlay>
          <HeaderContainer>
            <Header>
              Deck Creator
            </Header>
          </HeaderContainer>

          <DeckInfoContainer>
            {this.state.isDeckCreated?
              (
                <DeckNameInput
                  style={{opacity: "0.4"}}
                  placeholder={this.state.deckName}
                />
              ):(
                <DeckNameInput
                  placeholder="Enter here the name of deck"
                  value={this.state.deckName}
                  onChange={(e)=> this.handleInputChange(e.target.value)}
                />
              )
            }


            <Button
              style={{marginRight: "2%"}}
              disabled={!this.state.deckName || this.state.isDeckCreated}
              onClick={() => {
                this.createDeck()
              }}
            >
              Save Deck Name
            </Button>
            {this.state.isDeckCreated?
              (
                this.state.isDeckCreatingMethodSubmitted?
                  (
                    <DeckInputForm>
                      <DeckCountryDropdown
                        value={this.state.deckCreatingMethod}
                        style={{opacity: "0.4"}}
                      >
                        <option>
                          Choose deck creating method
                        </option>
                        <option
                          value={"existingCards"}
                        >
                          Create deck from existing cards
                        </option>
                        <option
                          value={"loadingFromApi"}
                        >
                          Load cards from new region
                        </option>
                      </DeckCountryDropdown>
                      <Button
                        style={{opacity: "0.4"}}
                      >
                        Submit choice
                      </Button>
                    </DeckInputForm>
                  ):(
                    <DeckInputForm>
                      <DeckCountryDropdown
                        value={this.state.deckCreatingMethod}
                        onChange={(e)=>this.setDeckCreatingMethod(e.target.value)}
                      >
                        <option>
                          Choose deck creating method
                        </option>
                        <option
                          value={"existingCards"}
                        >
                          Create deck from existing cards
                        </option>
                        <option
                          value={"loadingFromApi"}
                        >
                          Load cards from new region
                        </option>
                      </DeckCountryDropdown>
                      <Button
                        onClick={()=>
                          this.provideMethodForAddingCards()
                          }
                      >
                        Submit choice
                      </Button>
                    </DeckInputForm>
                  )

              ):(
                ""
              )
            }
            {this.state.isDeckCreatingMethodSubmitted && this.state.deckCreatingMethod === "loadingFromApi" ?
              (
                <LoadingInputContainer>
                  <DeckNameInput
                    style={{width: "30%"}}
                    placeholder="Enter Country or Region"
                  />

                  <DeckNameInput
                    style={{width: "30%"}}
                    placeholder="Enter minimum population of the places"

                  />
                  <Button
                    style={{marginRight: "5%", width: "30%"}}
                    onClick={() => {
                      this.props.history.push("/deckEditor");
                    }}
                  >
                    Load cards
                  </Button>
                </LoadingInputContainer>
              ):(
                ""
              )
            }


          </DeckInfoContainer>

          {!this.state.isDeckCreatingMethodSubmitted ?
            (
              <BodyContainer/>
            ) : (
              <BodyContainer>
                <ComponentContainer>
                  <BoxHeading>
                    Loaded Cards
                  </BoxHeading>
                  <BoxBody>
                    {!this.state.cards?
                      (
                        <LoadingOverlay
                          active={this.state.loading}
                          spinner
                          text='Loading ...'
                        />
                      ):(
                        <Container>
                          {this.state.cards.map((card)=>{
                            return (
                              <Container>
                                {this.state.clickedDeck === card.id?
                                  (
                                    <ClickedItem>
                                      {card.name}
                                    </ClickedItem>
                                  ):(
                                    <Item
                                      key={card.id}
                                      onClick={()=>{
                                        this.setState({clickedDeck: card.id});
                                        this.getCards();
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

                </ComponentContainer>
                <ComponentContainer>
                  <BoxHeading>
                    Cards in Deck
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

                </ComponentContainer>
              </BodyContainer>
            )
          }

          <Footer>
            <Button
              style={{marginRight: "5%", width: "15%"}}
              onClick={() => {
                this.props.history.push("/deckEditor");
              }}
            >
              Back to Deck Editor
            </Button>
            <Button
              style={{width: "15%"}}
              onClick={() => {
                this.props.history.push("/mainView");
              }}
            >
              Save Deck
            </Button>
          </Footer>
        </Overlay>
      </OverlayContainer>
    )
  }
}

export default withRouter(DeckCreator);

/*
const cards = (
  [
    {
      "id": 2,
      "name": "testCard1",
      "nCoordinate": 1.02,
      "eCoordinate": 2.22
    },
    {
      "id": 3,
      "name": "testCard2",
      "nCoordinate": 1.02,
      "eCoordinate": 2.22
    },
    {
      "id": 4,
      "name": "testCard3",
      "nCoordinate": 1.02,
      "eCoordinate": 2.22
    }
  ]
);*/
