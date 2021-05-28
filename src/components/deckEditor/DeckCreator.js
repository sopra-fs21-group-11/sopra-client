import React from "react";
import {withRouter} from "react-router-dom";

import styled from "styled-components";
import {Button} from "../../views/design/Button";
import {api} from "../../helpers/api";
import LoadingOverlay from "react-loading-overlay";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import { FiHelpCircle } from 'react-icons/fi';
import ReactTooltip from "react-tooltip";

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

const Label = styled.label`
  color: black;
  text-align: left;
  margin-top: 5px;
  font-size: xx-large;
  margin-right: 1%;
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
  font-size: 14px;
  height: 50%;
  width: 12%;
  margin-right: 2%;
  border-radius:   4px 4px 4px 4px;
  &::placeholder {
    color: rgba(0, 0, 0, 1);
  }
`;

const DeckCountryDropdown = styled.select`
  width: 60%;
  margin-right: 2%;
  font-size: 14px;
`;

const DeckInputForm = styled.div`
  width: 30%;
`;

const LoadingInputContainer = styled.div`
  width: 42%;
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const Explaination = styled.div`
  height: 8%;
  margin: 1% 5%;
  width: 90%;
`;

const BodyContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  height: 55%;
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


const Item = styled.div`
  margin-bottom: 5px;
  width: 100%;
  text-align: center;

  &:hover {
    cursor: pointer;
    background-color: rgba(0, 128, 0, 0.3);
  }
`;


const DisabledButton = styled(Button)`
  &:hover {
    transform: translateY(0px);
    color: black;
  }
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
      countryForLoading: "",
      populationForLoading: "",
      deckId: null,
      waitingTimeForFetchingCards: null,
      cardsInDeck: [],
      isCardsLoaded: false,
      loadingFetch:false
    };
  }

  async componentDidMount() {
    try{
      const response = await api.get("/decks/");
      console.log(response.data);
      this.setState({
        decks: response.data
      })
    }catch(error){

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

  handleInputChange(key, value){
    this.setState({
      [key]: value
    });
  }

  async createDeck(){

    console.log(this.state.deckName);

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
        deckId: response.data.id,
        isDeckCreated: true
      });

    }catch (error) {
      console.log(error);
      NotificationManager.error('There was a server error','Sorry for the inconvenience',3000);
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


    if(this.state.deckCreatingMethod === "existingCards"){
      try{
        const response = await api.get("/cards");
        console.log(response.data);
        this.setState({
          cardsOutOfDeck: response.data,
          isDeckCreatingMethodSubmitted: true
        })
      }catch (error){
        console.log(error);
        NotificationManager.error('There was a server error','Sorry for the inconvenience',3000);
      }
    }else{
      this.setState({isDeckCreatingMethodSubmitted: true});
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
      console.log(error);
      NotificationManager.error('There was a server error','Sorry for the inconvenience',3000);
    }
     

  }
  async goBack()
  {
    if(this.state.deckId)
    {
      try{
        const response = await api.get("decks/" + this.state.deckId+'/delete',{
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`}
        });
        console.log(response)
        this.props.history.push("/deckEditor");
      }catch(error){
        console.log(error);
        NotificationManager.error('There was a server error','Sorry for the inconvenience',3000);
      }

    } else
    {
      this.props.history.push("/deckEditor");
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
        NotificationManager.error('External service is currently unavailable. Please create a deck with the existing card or try again later','Sorry for the inconvenience',8000);
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
      console.log(response);
      this.props.history.push("/DeckEditor");

    }catch (error){

      console.log(error);

      if(error.response.status === 400){
        NotificationManager.error('A deck can have a minimum of 10 cards and maximum of 60 cards.','Saving failed',8000);
      }else{
        NotificationManager.error('There was a server error.','Sorry for the inconvenience',8000);
      }

    }

  }

  handleCountryInput(value){
    console.log(value);
    let possibleValue = value.replace(/[^a-z\s]/gi, "");
    console.log(possibleValue);

    this.setState({
      countryForLoading: possibleValue
    });
  }

  handlePopulationInput(value){
    let possibleValue = value.replace(/[^0-9]/gi, "");
    if(possibleValue.charAt(0) === "0"){
      possibleValue = possibleValue.charAt(0);
    }

    this.setState({
      populationForLoading: possibleValue
    });
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
                [<DeckNameInput
                  placeholder={this.state.deckName}
                  disabled={this.state.isDeckCreated}
                />,
              <DisabledButton
                style={{marginRight: "2%", minWidth: "60px"}}
                disabled={!this.state.deckName || this.state.isDeckCreated}
                onClick={() => {
                  this.createDeck()
                }}
              >
                Next
              </DisabledButton>]
              ):(
                [<DeckNameInput
                  placeholder="Name of deck"
                  value={this.state.deckName}
                  onChange={(e)=> this.handleInputChange("deckName", e.target.value)}
                />,
              <Button
              style={{marginRight: "2%", minWidth: "60px"}}
              disabled={!this.state.deckName || this.state.isDeckCreated}
              onClick={() => {
              this.createDeck()
            }}
              >
              Next
              </Button>]
              )
            }



            {this.state.isDeckCreated?
              (
                this.state.isDeckCreatingMethodSubmitted?
                  (
                    <DeckInputForm>
                      <DeckCountryDropdown
                        value={this.state.deckCreatingMethod}
                        disabled={this.state.isDeckCreatingMethodSubmitted}
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
                      <DisabledButton
                        style={{opacity: "0.4", minWidth: "60px"}}
                        disabled={this.state.isDeckCreatingMethodSubmitted}
                      >
                        Next
                      </DisabledButton>
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
                        style={{minWidth: "60px"}}
                      disabled={this.state.deckCreatingMethod==="Choose deck creating method"}
                        onClick={()=>
                          this.provideMethodForAddingCards()
                          }
                      >
                        Next
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
                  <Label>
                    <FiHelpCircle data-tip="Country or region for creating cards, i.e. Italy or Europe"/>
                  </Label>
                  <ReactTooltip type="warning" />

                  <DeckNameInput
                    style={{width: "30%"}}
                    disabled={this.state.isCardsLoaded||this.state.loadingFetch}
                    placeholder="Country"
                    value={this.state.countryForLoading}
                    onChange={(e)=> {
                      this.handleCountryInput(e.target.value);
                    }}
                  />

                  <Label>
                    <FiHelpCircle data-tip="Only cities with a population higher than the one inserted will be fetched, i.e. 100000 or 500000"/>
                  </Label>

                  <DeckNameInput
                    style={{width: "55%"}}
                    disabled={this.state.isCardsLoaded||this.state.loadingFetch}
                    placeholder="Population"
                    value={this.state.populationForLoading}
                    onChange={(e)=> this.handlePopulationInput( e.target.value)}
                  />

                  {this.state.isCardsLoaded || (this.state.isDeckCreatingMethodSubmitted && this.state.deckCreatingMethod === "existingCards") ?
                    (
                      <DisabledButton
                        style={{marginRight: "5%", width: "30%"}}
                        disabled={(this.state.countryForLoading === "" || this.state.populationForLoading === "") || this.state.isCardsLoaded|| this.state.loadingFetch}
                        onClick={() => {
                          this.loadCards();
                        }}
                      >
                        Load cards
                      </DisabledButton>
                    ):(
                      <Button
                        style={{marginRight: "5%", width: "30%"}}
                        disabled={(this.state.countryForLoading === "" || this.state.populationForLoading === "") || this.state.isCardsLoaded|| this.state.loadingFetch}
                        onClick={() => {
                          this.loadCards();
                        }}
                      >
                        Load cards
                      </Button>
                    )}

                </LoadingInputContainer>
              ):(
                ""
              )
            }


          </DeckInfoContainer>

          {this.state.isCardsLoaded || (this.state.isDeckCreatingMethodSubmitted && this.state.deckCreatingMethod === "existingCards") ?
            (
              [<Explaination>
                All cards in the middle box will be in your deck when you save the deck. You can remove cards from your deck by clicking on the name
                of a card which is located in middle box. Cards can be added by clicking on the names of the cards in the left box. A deck needs a least 10 cards
                and can have at most 60 cards.
              </Explaination>,
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
                              <Container
                                key={card.id + "1"}
                              >
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
                              <Container
                                key={card.id + "1"}
                              >
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
              </BodyContainer>]
            ) : (
              [<Explaination/>,
              <BodyContainer/>]
            )
          }

          <Footer>
            <Button
              style={{marginRight: "5%", width: "15%"}}
              onClick={() => {
                this.goBack();
               
              }}
            >
              Back to Deck Editor
            </Button>
            {this.state.isCardsLoaded || (this.state.isDeckCreatingMethodSubmitted && this.state.deckCreatingMethod === "existingCards") ?
              (
                <Button
                  style={{width: "15%"}}
                  onClick={() => {
                    this.updateDeck();
                  }}
                >
                  Save Deck
                </Button>
              ):(
                ""
              )}

          </Footer>
        
        </Overlay>
        <NotificationContainer/>
       
      </OverlayContainer>
      </LoadingOverlay>
    )
  }
}

export default withRouter(DeckCreator);

