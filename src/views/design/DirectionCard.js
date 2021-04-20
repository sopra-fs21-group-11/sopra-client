import React from "react";
import styled from "styled-components";
import directionCard from "./cards/directionCard.png";




const Image = styled.img`

`;



const CardContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  background-color: red;
`;



class DirectionCard extends React.Component{

  constructor(props) {
    super(props);

  }


  render(){

    let standardCardWith = 69*1.5;
    let standardCardHeight = 100*1.5;

    let cardWidth = standardCardWith * this.props.sizeCard /100;
    let cardHeight = standardCardHeight * this.props.sizeCard / 100;
    let cardStyle = {width: `${cardWidth}px`,  height: `${cardHeight}px`}

    return (
      <CardContainer style={cardStyle}>
        <Image src={directionCard} alt={"Green direction card for the background"}/>
      </CardContainer>
    )
  }
}

export default DirectionCard;