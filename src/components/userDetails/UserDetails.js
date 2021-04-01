import React from "react";
import styled from "styled-components";
import { BaseContainer } from "../../helpers/layout";
import { api } from "../../helpers/api";
import User from "../shared/models/User";
import { withRouter } from "react-router-dom";
import { Button } from "../../views/design/Button";
import moment from "moment";
import Error from "../../views/Error";

const FormContainer = styled.div`
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 300px;
  justify-content: center;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 60%;
  height: 530px;
  font-size: 16px;
  font-weight: 300;
  padding-left: 37px;
  padding-right: 37px;
  border-radius: 5px;
  background: linear-gradient(rgb(27, 124, 186), rgb(2, 46, 101));
  transition: opacity 0.5s ease, transform 0.5s ease;
`;

const InputField = styled.input`
  &::placeholder {
    color: rgba(255, 255, 255, 1);
  }
  height: 35px;
  padding-left: 15px;
  margin-left: -4px;
  border: none;
  border-radius: 20px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
`;

const Label = styled.label`
  color: white;
  margin-bottom: 10px;
  text-transform: uppercase;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;



/**
 * Classes in React allow you to have an internal state within the class and to have the React life-cycle for your component.
 * You should have a class (instead of a functional component) when:
 * - You need an internal state that cannot be achieved via props from other parent components
 * - You fetch data from the server (e.g., in componentDidMount())
 * - You want to access the DOM via Refs
 * https://reactjs.org/docs/react-component.html
 * @Class
 */
class UserDetails extends React.Component {
  /**
   * If you don’t initialize the state and you don’t bind methods, you don’t need to implement a constructor for your React component.
   * The constructor for a React component is called before it is mounted (rendered).
   * In this case the initial state is defined in the constructor. The state is a JS object containing two fields: name and username
   * These fields are then handled in the onChange() methods in the resp. InputFields
   */
  constructor() {
    super();
    this.state = {
      users: {},
      userId: null,
      editable: false,
      errorMessage:null
    };
  }

  /**
   * HTTP POST request is sent to the backend.
   * If the request is successful, a new user is returned to the front-end
   * and its token is stored in the localStorage.
   */
  async userDetails() {
    try {
      const response = await api.put(
        "/users/" + this.state.userId,
        this.state.users
      );

      // Get the returned user and update a new object.
      const user = new User(response.data);

      // Store the token into the local storage.
      localStorage.setItem("token", user.token);

      // registration successfully worked --> navigate to the route /game in the GameRouter
      this.props.history.push(`/game`);
    } catch (error) {
      //alert(`Something went wrong during the registration: \n${handleError(error)}`);
      this.setState({
        errorMessage: error.message,
      });

    }
  }

  /**
   *  Every time the user enters something in the input field, the state gets updated.
   * @param key (the key of the state for identifying the field that needs to be updated)
   * @param value (the value that gets assigned to the identified state key)
   */
  handleInputChange(key, value) {
    // Example: if the key is username, this statement is the equivalent to the following one:
    // this.setState({'username': value});

    if (value !== undefined) {
      let user = this.state.users;
      user[key] = value;
      this.setState({ users: user });
    }
  }

  /**
   * componentDidMount() is invoked immediately after a component is mounted (inserted into the tree).
   * Initialization that requires DOM nodes should go here.
   * If you need to load data from a remote endpoint, this is a good place to instantiate the network request.
   * You may call setState() immediately in componentDidMount().
   * It will trigger an extra rendering, but it will happen before the browser updates the screen.
   */
  async componentDidMount() {
    try {
      let id = this.props.location.state.userId;
      this.setState({
        editable: localStorage.getItem("loginUserid") == id ? true : false,
      });

      this.setState({ userId: id });
      const response = await api.get(
        "/users/" + this.props.location.state.userId
      );
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
      <BaseContainer>
        <FormContainer>
          <Form>
            <Label>Username</Label>
            <InputField
              disabled
              value={this.state.users.username}
              onChange={(e) => {
                this.handleInputChange("username", e.target.value);
              }}
            />
            <Label>Name</Label>
            <InputField
              disabled={!this.state.editable}
              value={this.state.users.name}
              onChange={(e) => {
                this.handleInputChange("name", e.target.value);
              }}
            />
            <Label>User Creation Date</Label>
            <InputField
              disabled
              value={moment(this.state.users.actionDate).format("L")}
              onChange={(e) => {
                this.handleInputChange("actionDate", e.target.value);
              }}
            />
            <Label>Status</Label>
            <InputField
              disabled
              value={this.state.users.status}
              onChange={(e) => {
                this.handleInputChange("password", e.target.value);
              }}
            />
            <Label>Date of Birth</Label>
            <InputField
              type="Date"
              disabled={!this.state.editable}
              value={this.state.users.dateOfBirth}
              onChange={(e) => {
                this.handleInputChange("dateOfBirth", e.target.value);
              }}
            />
            <ButtonContainer>
              {this.state.editable ? (
                <Button
                  width="50%"
                  style={{ margin: "5px" }}
                  onClick={() => {
                    this.userDetails();
                  }}
                >
                  Update
                </Button>
              ) : (
                ""
              )}
              <Button
                width="25%"
                style={{ margin: "5px" }}
                onClick={() => {
                  this.props.history.push("/game");
                }}
              >
                Back
              </Button>
            </ButtonContainer>
            <Error message={this.state.erroMessage}/>
          </Form>
        </FormContainer>
      </BaseContainer>
    );
  }
}

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default withRouter(UserDetails);
