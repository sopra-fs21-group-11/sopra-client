/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import styled from "styled-components";
import { BaseContainer } from "../../helpers/layout";
import { api } from "../../helpers/api";
import { Spinner } from "../../views/design/Spinner";
import { Button } from "../../views/design/Button";
import { withRouter } from "react-router-dom";
import Error from "../../views/Error";

const Container = styled(BaseContainer)`
  color: white;
  text-align: center;
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


class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      users: null,
      userId: null,
      erroMessage:null
    };
  }

  logout() {
    try {
      api
        .get("/users/logout/" + localStorage.getItem("loginUserid"))
        .then((res) => {
          console.log(res);
        });
    } catch (error) {
      //console.log( `Something went wrong while logout the users: \n${handleError(error)}`);
      this.setState({
        erroMessage: error.message,
      });
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("loginUserid");
      this.props.history.push("/login");
    }
  }
  goToDetails(userId) {
    this.props.history.push({
      pathname: "/userDetails",
      state: { userId: userId },
    });
  }

  async componentDidMount() {
    try {
      //this.setState({ loggedInUserId:this.props.location.state.loggedInUserId });
      const response = await api.get("/users");
      // delays continuous execution of an async operation for 1 second.
      // This is just a fake async call, so that the spinner can be displayed
      // feel free to remove it :)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Get the returned users and update the state.
      this.setState({ users: response.data });

      // This is just some data for you to see what is available.
      // Feel free to remove it.
      console.log("request to:", response.request.responseURL);
      console.log("status code:", response.status);
      console.log("status text:", response.statusText);
      console.log("requested data:", response.data);

      // See here to get more data.
      console.log(response);
    } catch (error) {
      this.setState({
        erroMessage: error.message,
      });
      //alert(`Something went wrong while fetching the users: \n${handleError(error)}`);
    }
  }

  render() {
    return (
      <Container>
        <h2>List of all Registered users </h2>
        <p>Click to open the user details:</p>
        <Link
          style={{ color: "red" }}
          width="25%"
          onClick={() => {
            this.logout();
          }}
        >
          Logout
        </Link>
        <Link
          width="25%"
          onClick={() => {
            this.goToDetails(localStorage.getItem("loginUserid"));
          }}
        >
          Edit profile
        </Link>
        {!this.state.users ? (
          <Spinner />
        ) : (
          <Container style={{ display: "flex" }}>
            <Container>
              <Users>
                {this.state.users.map((user) => {
                  return (
                    <ButtonContainer>
                      <Button
                        width="100%"
                        onClick={() => {
                          this.goToDetails(user.id);
                        }}
                      >
                        {user.username}
                      </Button>
                      <Label
                        style={
                          user.status === "ONLINE"
                            ? { margin: "5px", color: "green" }
                            : { margin: "5px", color: "red" }
                        }
                      >
                        {" "}
                        {user.status}
                      </Label>
                    </ButtonContainer>
                  );
                })}
              </Users>
            </Container>
            <Error message={this.state.erroMessage}/>
          </Container>
        )}
      </Container>
    );
  }
}

export default withRouter(Game);
