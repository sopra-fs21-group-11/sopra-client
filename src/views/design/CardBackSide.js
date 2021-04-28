import React from "react";
import styled from "styled-components";
import placeCard from "../design/cards/placeCard.png";



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
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  flex-wrap: wrap;
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
            <CardText style={cardTextStyle}>
              Lat.: {this.props.cardInfo.ncoord}
            </CardText>
          );
        }
        if(this.props.axis === "left" || this.props.axis === "right"){
          return (
            <CardText style={cardTextStyle}>
              Long.: {this.props.cardInfo.ecoord}
            </CardText>
          );

        }
        break;
      default:
        return(
          <CardText>
            Hallo World
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
    let cardTextStyle = {fontSize: `${sizeFont}px`, minWidth: `${textContainerWidth}px`}
    let textContainerContainerStyle = {width: `${textContainerWidth}px`, height: `${textContainerHeigth}px`, top: `${topOffset}px`}

    let placeholder = "place";
    if(placeholder === "place" || placeholder === "river"){
      image = <Image style={cardStyle} src={placeCard} alt="BackSide of a blue Card"/>;
    }else{
      image = <Image style={cardStyle} src={placeCard} alt="BackSide of a brown Card"/>;
    }

    return(
      <CardContainer style={cardStyle}>
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