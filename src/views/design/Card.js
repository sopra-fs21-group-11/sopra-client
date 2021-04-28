import React from "react";
import styled from "styled-components";
import placeCard from "../design/cards/placeCard.png";
import historicCard from "../design/cards/historicCard.png";
import mountainCard from "../design/cards/mountainCard.png";
import riverCard from "../design/cards/riverCard.png";


const Image = styled.img`
`;

const CardContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
`;

const CardTextContainerContainer = styled.div`
  position: absolute;
  overflow-wrap: break-word;

`;

const CardTextContainer = styled.div`
  
`;

const CardText = styled.div`
  text-align: center;
  font-weight: bold;
  color: white;
`;

class Card extends React.Component{
  
  constructor(props){
    super(props);

    this.state= {
      name:" "
    };
  }

  componentDidMount() {
  //console.log(this.props.cardInfo["name"]);
    /*if (!this.props.cardInfo) {
      this.setState({name: this.props.cardInfo.name})
    }*/
  }

  getData(){

    let j = this.props.cardInfo;
    let j2 = JSON.parse(j);

    return JSON.stringify(j2);

  }


  render(){
    let image;
    let standardCardWith = 100;
    let standardCardHeight = 69;
    let standardFontSize = 13;
    let standardTopOffset = 5;
    let cardWidth = standardCardWith * this.props.sizeCard/100;
    let cardHeight = standardCardHeight * this.props.sizeCard/100;
    let textContainerWidth = (standardCardWith - 10) * this.props.sizeCard /100;
    let textContainerHeigth = (standardCardHeight - 10) * this.props.sizeCard /100;
    let topOffset = standardTopOffset * this.props.sizeCard /100;
    let sizeFont = standardFontSize * this.props.sizeFont/100;
    let cardStyle = {width: `${cardWidth}px`, height: `${cardHeight}px`, margin: "1%"}
    let cardTextStyle = {fontSize: `${sizeFont}px`, width: `${textContainerWidth}px`}
    let textContainerContainerStyle = {width: `${textContainerWidth}px`, height: `${textContainerHeigth}px`, top: `${topOffset}px`}
    let textContainerStyle = {
      width: `${textContainerWidth}px`,
      height: `${textContainerHeigth}px`,
      display: "flex",
      justifyContent: "center",
      alignItems: "center"}

/*    switch('place'){ // replace here with this.props.cardType
      case 'mountain':
        image = <Image style={cardStyle} src={mountainCard} alt="Card of a location" />
        break;
      case 'historic':
        image = <Image style={cardStyle} src={historicCard} alt="Card of a location"/>
        break;
      case 'place':
        textContainerStyle = {
          width: `${textContainerWidth}px`,
          height: `${textContainerHeigth}px`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }
        image = <Image style={cardStyle} src={placeCard} alt="Card of a location"/>
        break;
      case 'river':
        image = <Image style={cardStyle} src={riverCard} alt="Card of a location"/>
        break;}*/


    return(


      <CardContainer style={cardStyle}>
        {this.props.frontSide ?
          [<Image style={cardStyle} src={placeCard}/>,
          <CardTextContainerContainer style={textContainerContainerStyle}>
          <CardTextContainer style={textContainerStyle}>
            <CardText style={cardTextStyle}>
              {this.props.cardInfo.name}
            </CardText>
          </CardTextContainer>
        </CardTextContainerContainer>]
          :
          [<CardTextContainerContainer style={textContainerContainerStyle}>
            <CardTextContainer>
              <CardText style={cardTextStyle}>
                {/* should be replaced by the this.props.cardName */}
                Coordinates (South - North):
              </CardText>
              <CardText style={cardTextStyle}>
                Coordinates (West - East):
              </CardText>
              <CardText style={cardTextStyle}>
                Area:
              </CardText>
              <CardText style={cardTextStyle}>
                Height:
              </CardText>
            </CardTextContainer>
          </CardTextContainerContainer>]
        }
      </CardContainer>
    );
  }
}

export default Card;