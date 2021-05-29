import React from "react";
import {withRouter} from "react-router-dom";

import styled from "styled-components";
import {Button} from "../../views/design/Button";
import {api} from "../../helpers/api";
import LoadingOverlay from "react-loading-overlay";
import {NotificationContainer, NotificationManager} from "react-notifications";
import {formatLatLong} from "../../helpers/formatter";
import {Explaination, ItemCardDetails, ItemContainer, ItemDeckCreator, AddBoxPlus, MinusBox} from "./EditorElements";


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
  height: 60%;
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
  height: 15%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  margin-top: 2.5%;
  width: 100%;
`;



class DeckModify extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      deck:null,
      cardsOutOfDeck: [],
      cardInfo: null,
      loading:false,
      deckId: null,
      cardsInDeck: []
    };
  }

  async componentDidMount() {

    try{
      let id = this.props.location.state.deckID;
      const response = await api.get("/decks/"+id);
      console.log(response.data);
      this.setState({
        deck:response.data,
        cardsInDeck: response.data.cards,
        deckId:id
      })
      this.getCards()
    }catch(error){
      console.log(error);
      NotificationManager.error('There was a server error.','Sorry for the inconvenience',3000);
    }

  }

  async getCards(){
    try{
      const response = await api.get("/decks/"+this.state.deckId+"/cards");
      console.log(response.data);
      this.setState({
        cardsOutOfDeck: response.data
      })
    }catch(error){
      console.log(error);
      NotificationManager.error('There was a server error.','Sorry for the inconvenience',3000);
    }

  }

  async getCardInfo(cardId){
    try{
      const response = await api.get("/cards/" + cardId);
      console.log(response.data);
      this.setState({
        cardInfo: response.data
      })
    }catch(error){
      console.log(error);
      NotificationManager.error('There was a server error.','Sorry for the inconvenience',3000);
    }
  }


  removeCardFromDeck(card){
    let arrayForCardsInDeck = this.state.cardsInDeck;
    let arrayForCardsOutOfDeck = this.state.cardsOutOfDeck;
    let indexCard = arrayForCardsInDeck.indexOf(card);
    arrayForCardsOutOfDeck.push(card);
    arrayForCardsInDeck.splice(indexCard, 1);
    this.setState({
      cardsInDeck: arrayForCardsInDeck,
      cardsOutOfDeck: arrayForCardsOutOfDeck
    });

  }

  addCardToDeck(card){
    let arrayForCardsOutOfDeck = this.state.cardsOutOfDeck;
    let arrayForCardsInDeck = this.state.cardsInDeck;
    let indexCard = arrayForCardsOutOfDeck.indexOf(card);
    arrayForCardsInDeck.push(card);
    arrayForCardsOutOfDeck.splice(indexCard, 1);
    this.setState({
      cardsOutOfDeck: arrayForCardsOutOfDeck,
      cardsInDeck: arrayForCardsInDeck
    });
    console.log(this.state.cardsInDeck);
  }

  async updateDeck(){
    try{
      const url = "/decks/" + this.state.deckId;
      console.log(url);

      let i=0;
      let cardIds = [];
      for(i; i < this.state.cardsInDeck.length; i++){
        cardIds.push(this.state.cardsInDeck[i].id);
      }

      const requestBody = JSON.stringify({
        "name": this.state.deck.name,
        "description": this.state.deck.description,
        "cards": cardIds
      });

      await api.put(url, requestBody,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`}
        }
      );
      this.props.history.push("/DeckEditor");
    }catch (error){
      console.log(error);
      console.log(error.response);

      if(error.response.status === 400){
        console.log(typeof error.response.status);
        NotificationManager.error('A deck can have a minimum of 10 cards and maximum of 60 cards.','Saving failed',8000);
      }else{
        NotificationManager.error('There was a server error.','Sorry for the inconvenience',8000);
      }
    }

  }

  render() {
    return(
      <OverlayContainer>
        <Overlay>
          <HeaderContainer>
            <Header>
              Deck Edit
            </Header>
          </HeaderContainer>
            <Explaination>
              All cards in the middle box will be in your deck when you update the deck. You can remove cards from your deck by clicking on the minus button
              of a card in the middle box. Cards can be added by clicking on the plus buttons of the cards in the left box. Clicking on the card name,
              will reveal its details in the right box. A deck needs a least 10 cards
              and can have at most 60 cards.
            </Explaination>
            <BodyContainer>
              <ComponentContainer>
                <BoxHeading>
                  Loaded Cards
                </BoxHeading>
                <BoxBody>
                  {!this.state.cardsOutOfDeck?
                    (
                      <LoadingOverlay
                        active={this.state.loading}
                        spinner
                        text='Loading ...'
                      />
                    ):(
                      <Container>
                        {this.state.cardsOutOfDeck.map((card)=>{
                          return (
                            <ItemContainer
                              key={card.id + "1"}
                            >
                              <ItemDeckCreator
                                key={card.id}
                                onClick={()=>{
                                  this.getCardInfo(card.id);
                                }}
                              >
                                {card.name}
                              </ItemDeckCreator>
                              <AddBoxPlus
                                fontSize="large"
                                style={{ color: "green"}}
                                onClick={()=>{
                                  this.addCardToDeck(card);
                                }}
                              />
                            </ItemContainer>
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
                  {this.state.cardsInDeck === []?
                    (
                      ""
                    ):(
                      <Container>
                        {this.state.cardsInDeck.map((card)=>{
                          return (
                            <ItemContainer
                              key={card.id + "1"}
                            >
                              <ItemDeckCreator
                                key={card.id}
                                onClick={()=>{
                                  this.getCardInfo(card.id);

                                }}
                              >
                                {card.name}
                              </ItemDeckCreator>
                              <MinusBox
                                fontSize="large"
                                style={{ color: "red" }}
                                onClick={()=>{
                                  this.removeCardFromDeck(card);
                                }}
                              />
                            </ItemContainer>
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
                      [<ItemContainer>
                        <ItemCardDetails>
                          Name: {this.state.cardInfo.name}
                        </ItemCardDetails>
                      </ItemContainer>,
                        <ItemContainer>
                          <ItemCardDetails>
                            Lat.: {formatLatLong(this.state.cardInfo.nCoordinate)}
                          </ItemCardDetails>
                        </ItemContainer>,
                        <ItemContainer>
                          <ItemCardDetails>
                            Long.: {formatLatLong(this.state.cardInfo.eCoordinate)}
                          </ItemCardDetails>
                        </ItemContainer>]
                    )
                  }
                </BoxBody>

              </ComponentContainer>
            </BodyContainer>

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
                this.updateDeck();
              }}
            >
              Update Deck
            </Button>
          </Footer>
          <NotificationContainer/>
        </Overlay>
      </OverlayContainer>
    )
  }
}

export default withRouter(DeckModify);

