import React from "react";
import {withRouter} from "react-router-dom";

import styled from "styled-components";
import {Button} from "../../views/design/Button";
import {api} from "../../helpers/api";
import LoadingOverlay from "react-loading-overlay";
import {NotificationContainer, NotificationManager} from 'react-notifications';

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
const CustomOverlay = styled.div`
  background: rgb(200, 213, 0, 0.25);
  height: 100%;
`;


class DeckCreator extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      decks: null,
      cardsOutOfDeck: [],
      cardInfo: null,
      loading:false,
      deckName: "",
      deckDescription: "This is a new testDeck",
      isDeckCreated: false,
      deckCreatingMethod: "Choose deck creating method",
      isDeckCreatingMethodSubmitted: false,
      countryForLoading: null,
      populationForLoading: null,
      deckId: null,
      waitingTimeForFetchingCards: null,
      cardsInDeck: [],
      isCardsLoaded: false,
      loadingFetch:false
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
    const response = await api.get("/decks/"+this.state.deckId+"/cards");
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

  handleInputChange(key, value){
    this.setState({
      [key]: value
    });
  }

  async createDeck(){

    console.log(this.state.deckName);
    this.setState(
      {
        isDeckCreated: true
      }
    );
    try{
      const requestBody = JSON.stringify({
        "name": this.state.deckName,
        "description": this.state.deckDescription
      });


      const response = await api.post("/decks", requestBody, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`}}
      );

      console.log(response);
      this.setState({
        deckId: response.data.id
      });
    }catch (error) {
      console.log(error);
    }






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
        cardsOutOfDeck: response.data
      })
    }
  }

  async loadCards(){

    try{
      const responseFetchingPossible = await api.get("/decks/" + this.state.deckId + "/fetch/available",
        {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`}
        }
      );

      this.setState({
        loadingFetch: true,
        loading:true
      });
      if(responseFetchingPossible.data !== true){
        let queueTime=responseFetchingPossible.data*1000;
        let t=setTimeout(this.fetchLocation(), queueTime);
        NotificationManager.warning('You are in a queue. We are trying to load in  '+responseFetchingPossible.data+' seconds or click here to create card from exsisting cards','External Server is busy',queueTime,() => {
          this.setState({
            isDeckCreatingMethodSubmitted:false,
            deckCreatingMethod: "Choose deck creating method",
            isCardsLoaded:false,
            loadingFetch:false,
            loading:false
          });
          clearTimeout(t);
        });
        this.setState({waitingTimeForFetchingCards: responseFetchingPossible.data,loading:false});
       
      }else{
        this.fetchLocation()
      }
    }catch (error){
      console.log(error)
      
    }
     

  }
  async fetchLocation()
  {
    try
        {
        const url = "/decks/" + this.state.deckId + "/fetch?population=" + this.state.populationForLoading + "&querry=" + this.state.countryForLoading;
        console.log(url);

        const response = await api.get(url,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`}
          }
        );
        this.setState({
          cardsInDeck: response.data.cards,
          isCardsLoaded:true,
          loading:false,
        });

        console.log(this.state.cardsInDeck);
        console.log(response.data);


      }catch (error){
        console.log(error)
        NotificationManager.error('External service is currently. Please create a deck with the existing card or try again later','Sorry for the inconvenience',8000);
        this.setState({
          isDeckCreatingMethodSubmitted:false,
          deckCreatingMethod: "Choose deck creating method",
          loading:false,
          isCardsLoaded:false,
           loadingFetch:false
        });
 
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
        "name": this.state.deckName,
        "description": this.state.deckDescription,
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
      <LoadingOverlay
      active={this.state.loading}
      spinner
      text='Loading the cards from external service ...'
      styles={{wrapper :'_loading_overlay_content'}}
      >
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
                  onChange={(e)=> this.handleInputChange("deckName", e.target.value)}
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
                    style={this.state.isCardsLoaded? {width: "30%", opacity: "0.4"}:{width: "30%"}}
                    disabled={this.state.isCardsLoaded||this.state.loadingFetch}
                    placeholder="Enter Country or Region"
                    onChange={(e)=> this.handleInputChange("countryForLoading", e.target.value)}
                  />

                  <DeckNameInput
                    style={{width: "50%"}}
                    disabled={this.state.isCardsLoaded||this.state.loadingFetch}
                    placeholder="Enter minimum population of the places"
                    onChange={(e)=> this.handleInputChange("populationForLoading", e.target.value)}
                  />
                  <Button
                    style={{marginRight: "5%", width: "30%"}}
                    disabled={this.state.isCardsLoaded|| this.state.loadingFetch}
                    onClick={() => {
                      this.loadCards();
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

          {this.state.isCardsLoaded || (this.state.isDeckCreatingMethodSubmitted && this.state.deckCreatingMethod === "existingCards") ?
            (
              <BodyContainer>
                <ComponentContainer>
                  <BoxHeading>
                    Loaded Cards
                  </BoxHeading>
                  <BoxBody>
                    {!this.state.cardsOutOfDeck?
                     "":(
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
            ) : (
              <BodyContainer/>
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
                this.updateDeck();
              }}
            >
              Save Deck
            </Button>
          </Footer>
        
        </Overlay>
        <NotificationContainer/>
       
      </OverlayContainer>
      </LoadingOverlay>
    )
  }
}

export default withRouter(DeckCreator);

