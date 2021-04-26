import React from "react";
import styled from "styled-components";
import { Redirect, Route } from "react-router-dom";
import Game from "../../game/Game";
import Lobby from "../../lobby/Lobby";
import JoinGame from "../../joinGame/JoinGame";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

class GameRouter extends React.Component {
  render() {
    /**
     * "this.props.base" is "/app" because as been passed as a prop in the parent of GameRouter, i.e., App.js
     */
    return (
      <Container>
        <Route
          exact
          path={`${this.props.base}`}
          render={() => (
            <Game  />)}
        />
        <Route
          path={`${this.props.base}/lobby`}
          exact
          render={() => (
            <Lobby />
          )}
        />
        <Route
          path={`${this.props.base}/join`}
          exact
          render={() => (
            <JoinGame />
          )}
        />
      </Container>
    );
  }
}
/*
* Don't forget to export your component!
 */
export default GameRouter;
