import styled from "styled-components";
import AddBoxIcon from '@material-ui/icons/AddBox';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';


export const ItemContainer = styled.div`
  min-height: 35px;
  height: 35px;
  width: 100%;
  display: flex;
  align-items: center;
`;


export const Item = styled.div`
  width: 100%;
  text-align: center;

  &:hover {
    cursor: pointer;
    background-color: rgba(0, 128, 0, 0.3);
  }
`;

export const ItemDeckCreator = styled(Item)`
  width: 85%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ItemFillUp = styled.div`
  width: 10%;
`;

export const ItemCardDetails = styled.div`
  width: 100%;
  text-align: center;
`;

export const PlusMinusButtonContainer = styled.div`
  width: 20%;
  height: 30px;
  background: rgb(0, 132, 0, 1);
  border-radius: 4px;
  font-size: 20px;
  padding: 0;
  font-weight: bold;
`;

export const Explaination = styled.div`
  height: 13%;
  margin: 1% 4.2% 1% 4.2%;
  width: 91.6%;
  background-color: white;
  padding-left: 5px;
  padding-right: 5px;
  border: 0.15em black solid;
  border-radius: 4px;
`;

export const AddBoxPlus = styled(AddBoxIcon)`
  &:hover {
    cursor: pointer;
    background-color: rgba(0, 128, 0, 0.3);
  }
`;

export const MinusBox = styled(IndeterminateCheckBoxIcon)`
  &:hover {
    cursor: pointer;
    background-color: rgba(128, 0, 0, 0.3);
  }
`;