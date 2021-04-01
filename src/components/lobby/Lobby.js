/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import styled from "styled-components";
import { BaseContainer } from "../../helpers/layout";
import { Button } from "../../views/design/Button";
import { withRouter } from "react-router-dom";
import Error from "../../views/Error";

const Container = styled(BaseContainer)`
  color: white;
  text-align: center;
  overflow: hidden;
`;

const Users = styled.ul`
  list-style: none;
  padding-left: 0;
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;
const Label = styled.label`
  color: white;
  margin-bottom: 10px;
  text-transform: uppercase;
`;
const Link = styled.a`
 margin: 10px;
 color: green
`;


class Lobby extends React.Component {
    constructor() {
        super();
        this.state = {
            users: null,
            userId: null,
            errorMessage:null
        };
    }

  exitLobby(userId) {
  }


    render() {
        return (
            <Container>
                <h2>Game Lobby</h2>
              <ButtonContainer>
                <Button>
                <Link
                    style={{ color: "red" }}
                    width="25%"
                    onClick={() => {
                        this.exitLobby();
                    }}
                >
                    exit lobby
                </Link>
                </Button>
              </ButtonContainer>
                <Container style={{ display: "flex" }}>
                        <Container>
                          players
                            <Users>
                            </Users>
                        </Container>
                        <Error message={this.state.errorMessage}/>
                  <Container>
                    <Container>
                      game settings
                    </Container>
                  </Container>
                </Container>
            </Container>
        );
    }
}

export default withRouter(Lobby);
