import React from "react";
import {withRouter} from "react-router-dom";

import styled from "styled-components";
import {Button} from "../../views/design/Button";
import {api} from "../../helpers/api";
import LoadingOverlay from "react-loading-overlay";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import {formatLatLong} from "../../helpers/formatter";
import {Explaination, ItemContainer, ItemCardDetails, Item} from "./EditorElements";


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
  height: 65%;
`;




const ComponentContainer = styled.div`
  width: 25%;
  height: 95%;
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
  padding-top: 2%;
  padding-bottom: 2%;
`;

const Footer = styled.div`
  height: 15%;
  display: flex;
  justify-content: center;
  align-items: center;
`;





const ClickedItem = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  
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

    this.getDeck();

  }

  async getDeck()
  {
    try{
      const response = await api.get("/decks/");
      console.log(response.data);
      this.setState({
        decks: response.data
      })
    }catch(error){
      NotificationManager.error('There was a server error','Sorry for the inconvenience',3000);
    }

  }

  async deleteDeck(deckId){
    try{
      const response = await api.get("decks/" + deckId+'/delete',{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`}
      });
      console.log(response.data);
      this.getDeck();
    }catch(error){
      NotificationManager.error('There was a server error','Sorry for the inconvenience',3000);
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
      NotificationManager.error('There was a server error','Sorry for the inconvenience',3000);
    }

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
          <Explaination style={{height: "8%"}}>
            In the left box you see all available decks. By clicking on a name of a deck, its cards will be displayed in the middle box.
            If you click on the name of a card, the details of a card will be shown in the right box. After creating a deck, you can also edit it.
          </Explaination>
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
                    this.state.decks.map((deck)=>{
                      return (
                        <ItemContainer
                          key={deck.id + "1"}
                        >
                          {this.state.clickedDeck !== null?
                            (
                              this.state.clickedDeck.id === deck.id?
                                (
                                  <ClickedItem
                                    key={deck.id}
                                  >
                                    {deck.name}
                                  </ClickedItem>
                                ):(
                                  <Item
                                    key={deck.id}
                                    onClick={()=>{
                                      this.setState({
                                        clickedDeck: deck,
                                        cards: deck.cards
                                      });
                                    }}
                                  >
                                    {deck.name}
                                  </Item>
                                )
                            ):(
                              <Item
                                key={deck.id}
                                onClick={()=>{
                                  this.setState({
                                    clickedDeck: deck,
                                    cards: deck.cards
                                  });
                                }}
                              >
                                {deck.name}
                              </Item>
                            )

                          }
                        </ItemContainer>
                      )
                    })
                  )
                }
              </BoxBody>

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
                    this.state.cards.map((card)=>{
                      return (
                        <ItemContainer
                          key={card.id + "1"}
                        >
                          {this.state.clickedCard === card.id?
                            (
                              <ClickedItem
                                key={card.id}
                              >
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
                        </ItemContainer>
                      )
                    })
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
                  this.props.history.push("/mainView");
                }}
              >
                Back to Main View
              </Button>
            <Button
              style={{ marginRight: "5%",width: "15%"}}
              onClick={() => {
                this.props.history.push("/deckCreator")
              }}
            >
              Create new deck
            </Button>
            { this.state.clickedDeck && this.state.clickedDeck.name !== "Default Deck" && localStorage.getItem("loginUserId") === this.state.clickedDeck.createdBy.toString(10)?(
            <Button
              style={{ marginRight: "5%",width: "10%",  background: "yellow"}}
              onClick={() => {
                this.props.history.push({
                  pathname: "/DeckModify",
                  state: { deckID: this.state.clickedDeck.id },
                });
              }}
            >
              Edit deck
            </Button>
            ):("")}
            { this.state.clickedDeck && this.state.clickedDeck.name !== "Default Deck" && localStorage.getItem("loginUserId") === this.state.clickedDeck.createdBy.toString(10)?(
            <Button
              style={{ marginRight: "5%",width: "10%", background: "red"}}
              onClick={() => {
               this.deleteDeck(this.state.clickedDeck.id)
              }}
            >
              Delete deck
            </Button>
            ):("")}
            {this.state.clickedDeck ?
              (console.log(this.state.clickedDeck.createdBy.toString(10))):("")
            }
         
          </Footer>
          <NotificationContainer/>
        </Overlay>
      </OverlayContainer>
    )
  }
}

export default withRouter(DeckEditor);