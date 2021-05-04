/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import styled from "styled-components";
import {BaseContainer} from "../../helpers/layout";
import {Button} from "../../views/design/Button";
import {withRouter} from "react-router-dom";
import Error from "../../views/Error";
import {api} from "../../helpers/api";
import {OverlayContainer} from "../../views/design/Overlay";
import {InputField} from "../../views/design/InputField";
import LoadingOverlay from 'react-loading-overlay';
import {NotificationContainer, NotificationManager} from 'react-notifications';

const Container = styled(BaseContainer)`
  color: white;
  text-align: center;
  justify-content: center;
  width: 80%;
  height: 80%;
`;

const Users = styled.ul`
  list-style: none;
  width: 40%;
  margin-top: 0;
  font-size: 90%;
  font-weight: 300;
  margin-right: auto;
  margin-left: auto;
  height: 30vh;
  padding: 0;
  background: rgb(255, 255, 255);
  border: 0.15em black solid;
`;



const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
  
`;

const Link = styled.a`
 width: 25%;
 margin: 10px;
 color: black
`;

const Name = styled.p`
  margin: 10px;
  color: black;
  font-size: 16px;
  font-weight: 300;
`;




const CustomOverlay = styled.div`
  background: rgb(200, 213, 0, 0.25);
  height: 90%;
`;


class Test extends React.Component {
  constructor() {
    super();
    this.state = {
      playersTokens: {"name": 5, "another Name": 1},
      loading: false,

    };
  }
  async componentDidMount() {
  }


  exitLobby() {
    this.props.history.push("/mainView")
  }

  handleInputChange(key, value) {
    this.setState({[key]: value});
  }


  render() {
    return (
      <OverlayContainer>
        <CustomOverlay>
          <h2
            style={{textAlign: "center", paddingTop: "20px"}}>Scoreboard</h2>
          <Container>
            <Container>
              <Users>
                {Object.entries(this.state.playersTokens).map(([name, tokens]) => {
                  return (<Name>{name}: {tokens}</Name>);
                })}
              </Users>
            </Container>
          </Container>
          <ButtonContainer>
            <Button>
              <Link
                onClick={() => {
                  this.exitLobby();
                }}
              >
                Back to main view
              </Link>
            </Button>
          </ButtonContainer>
        </CustomOverlay>
        <NotificationContainer/>
      </OverlayContainer>
    );
  }
}



export default withRouter(Test);
