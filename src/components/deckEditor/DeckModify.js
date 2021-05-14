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

    let id = this.props.location.state.deckID;
    const response = await api.get("/decks/"+id);
    console.log(response.data);
    this.setState({
      deck:response.data,
      cardsInDeck: response.data.cards,
      deckId:id
    })
    this.getCards()
  }

  async getCards(){
    const response = await api.get("/decks/"+this.state.deckId+"/cards");
    console.log(response.data);
    this.setState({
      cardsOutOfDeck: response.data
    })
  }

  async getCardInfo(cardId){
    const response = await api.get("/cards/" + cardId);
    console.log(response.data);
    this.setState({
      cardInfo: response.data
    })
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

      const response = await api.put(url, requestBody,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`}
        }
      );

    }catch (error){
      console.log(error)
    }
    this.props.history.push("/DeckEditor");
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
                              <Container>
                                <Item
                                  key={card.id}
                                  onClick={()=>{
                                    this.addCardToDeck(card);
                                  }}
                                >
                                  {card.name}
                                </Item>
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
                    {this.state.cardsInDeck === []?
                      (
                        ""
                      ):(
                        <Container>
                          {this.state.cardsInDeck.map((card)=>{
                            return (
                              <Container>
                                <Item
                                  key={card.id}
                                  onClick={()=>{
                                    this.getCardInfo(card.id);
                                    this.removeCardFromDeck(card);
                                  }}
                                >
                                  {card.name}
                                </Item>
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
        </Overlay>
      </OverlayContainer>
    )
  }
}

export default withRouter(DeckModify);

