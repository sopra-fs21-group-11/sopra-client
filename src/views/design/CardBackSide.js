import React from "react";
import styled from "styled-components";
import placeCard from "../design/cards/placeCard.png";
import {formatLatLong} from "../../helpers/formatter";



const Image = styled.img`
`;


const CardContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
`;


const CardContainerGreen = styled.div`
  position: relative;
  display: none;
  justify-content: center;
  -webkit-box-shadow: 0 0 10px green;
  box-shadow: 0 0 10px green;
`;

const CardContainerRed = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  -webkit-box-shadow: 0 0 10px red;
  box-shadow: 0 0 10px red;
`;


const CardTextContainerContainer = styled.div`
  position: absolute;
  overflow-wrap: break-word;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CardTextContainer = styled.div`
  
`;

const CardText = styled.div`
  font-weight: bold;
  color: white;
  text-align: center;
`;



class CardBackSide extends React.Component {

  displayText(cardTextStyle){

    switch('Coordinates'){
      case 'Coordinates':
        if(this.props.axis === "top" || this.props.axis === "bottom"){
          return (
            <div>
              <CardText style={cardTextStyle}>
                {this.props.cardInfo.name}
              </CardText>
              <CardText style={cardTextStyle}>
                Lat.: {formatLatLong(this.props.cardInfo.ncoord)}
              </CardText>
            </div>

          );
        }
        if(this.props.axis === "left" || this.props.axis === "right"){
          return (
            <div>
              <CardText style={cardTextStyle}>
                {this.props.cardInfo.name}
              </CardText>
              <CardText style={cardTextStyle}>
                Long.: {formatLatLong(this.props.cardInfo.ecoord)}
              </CardText>
            </div>

          );

        }
        if(this.props.cardInfo.id === this.props.startingCard.id){
          return(
            <div>
              <CardText style={cardTextStyle}>
                {this.props.cardInfo.name}
              </CardText>
              <CardText style={cardTextStyle}>
                Lat.: {formatLatLong(this.props.cardInfo.ncoord)}
              </CardText>
              <CardText style={cardTextStyle}>
                Long.: {formatLatLong(this.props.cardInfo.ecoord)}
              </CardText>
            </div>
          );
        }
        break;
      default:
        return(
          <CardText>
            Something went wrong
          </CardText>
        )
    }
  }



  render(){
    let image;
    let standardMultiplier = 1;
    let standardCardWith = 100 * standardMultiplier;
    let standardCardHeight = 69 * standardMultiplier;
    let standardFontSize = 13;
    let standardTopOffset = 5 * standardMultiplier;
    let cardWidth = standardCardWith * this.props.sizeCard/100;
    let cardHeight = standardCardHeight * this.props.sizeCard/100;
    let textContainerWidth = (standardCardWith - 10 * standardMultiplier) * this.props.sizeCard /100;
    let textContainerHeigth = (standardCardHeight - 10 * standardMultiplier) * this.props.sizeCard /100;
    let topOffset = standardTopOffset * this.props.sizeCard /100;
    let sizeFont = standardFontSize * this.props.sizeFont/100;
    let cardStyle = {width: `${cardWidth}px`, height: `${cardHeight}px`}
    let cardTextStyle = {fontSize: `${sizeFont}px`, width: `${textContainerWidth}px`}
    let textContainerContainerStyle = {width: `${textContainerWidth}px`, height: `${textContainerHeigth}px`, top: `${topOffset}px`}


    let placeholder = "place";
    if(placeholder === "place" || placeholder === "river"){
      image = <Image style={cardStyle} src={placeCard} alt="BackSide of a blue Card"/>;
    }else{
      image = <Image style={cardStyle} src={placeCard} alt="BackSide of a brown Card"/>;
    }

    // change card shadow in the Evaluation phase
    if(this.props.cardInfo.correct === true && this.props.cardInfo.id !== this.props.startingCard.id){
      cardStyle = {width: `${cardWidth}px`, height: `${cardHeight}px`, WebkitBoxShadow: `0 0 10px green`}
    }
    if(this.props.cardInfo.correct === false && this.props.cardInfo.id !== this.props.startingCard.id){
      cardStyle = {width: `${cardWidth}px`, height: `${cardHeight}px`, WebkitBoxShadow: `0 0 10px red`}
    }

    return(

      <CardContainer style={cardStyle} >
        {image}
        <CardTextContainerContainer style={textContainerContainerStyle}>
          <CardTextContainer>
            {this.displayText(cardTextStyle)}
          </CardTextContainer>
        </CardTextContainerContainer>
      </CardContainer>
    )
  }
}



export default CardBackSide;