import React from "react";
import styled from "styled-components";
import placeCard from "../design/cards/placeCard.png";
import historicCard from "../design/cards/historicCard.png";
import mountainCard from "../design/cards/mountainCard.png";
import riverCard from "../design/cards/riverCard.png";


const Image = styled.img`
  height: 69px;
  width: 100px;
`;

const CardContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  width: 100px;
`;

const CardTextContainer = styled.div`
  position: absolute;
  top: 5px;
  justifyContent: center;
  alignItems: center;
  width: 90px;
  overflow-wrap: break-word;
`;

const CardText = styled.div`

  font-size: 12px;
  font-weight: bold;
  color: white;
`;

class Card extends React.Component{
  
  constructor(props){
    super(props);
  }




  render(){
    let image;
    switch('place'){ // replace here with this.props.cardType
      case 'mountain':
        image = <Image src={mountainCard} alt="Card of a location"/>
        break;
      case 'historic':
        image = <Image src={historicCard} alt="Card of a location"/>
        break;
      case 'place':
        image = <Image src={placeCard} alt="Card of a location"/>
        break;
      case 'river':
        image = <Image src={riverCard} alt="Card of a location"/>
        break;
    }
    return(
      <CardContainer>
        {image}
        <CardTextContainer>
          <CardText>
            {/* should be replaced by the this.props.cardName */}
            Lausanneaskadkasdlkflasldflad
          </CardText>
        </CardTextContainer>
      </CardContainer>
    );
  }
}

export default Card;