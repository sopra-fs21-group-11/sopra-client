import React from "react";
import styled from "styled-components";
import { BaseContainer } from "../../helpers/layout";
import { api } from "../../helpers/api";
import User from "../shared/models/User";
import { withRouter, useParams } from "react-router-dom";
import { Button } from "../../views/design/Button";
import Error from "../../views/Error";
import Header from "../../views/Header";

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
  height: 450px;
  font-size: 16px;
  font-weight: 300;
  padding-left: 37px;
  padding-right: 37px;
  border-radius: 5px;
  background: rgb(200, 213, 0, 0.25);
  transition: opacity 0.5s ease, transform 0.5s ease;
`;

const FormTitleContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;

`;


const FormTitle = styled.div`
  font-size: 30px;
  font-weight: 900;
`;



const InputField = styled.input`
  &::placeholder {
    color: rgba(0, 0, 0, 1);
  }
  height: 35px;
  padding-left: 15px;
  margin-left: -4px;
  font-weight: 200;
  margin-bottom: 20px;
  background: rgba(0, 102, 0, 0.2);
  color: black;
  border-color: rgb(0, 0, 0, 0.4);
`;

const Label = styled.label`
  color: black;
  font-weight: 900;
  margin-bottom: 10px;
  text-transform: uppercase;
`;



const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const Link = styled.a`
 margin: 10px;
 color: green
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
class Registration extends React.Component {
  /**
   * If you don’t initialize the state and you don’t bind methods, you don’t need to implement a constructor for your React component.
   * The constructor for a React component is called before it is mounted (rendered).
   * In this case the initial state is defined in the constructor. The state is a JS object containing two fields: name and username
   * These fields are then handled in the onChange() methods in the resp. InputFields
   */
  constructor() {
    super();
    this.state = {
      username: null,
      password: null
    };
  }
  /**
   * HTTP POST request is sent to the backend.
   * If the request is successful, a new user is returned to the front-end
   * and its token is stored in the localStorage.
   */
  async registration() {
    try {
      const requestBody = JSON.stringify({
        username: this.state.username,
        password: this.state.password
      });
      const response = await api.post("/users", requestBody);

      console.log(response);

      // Store the token into the local storage.
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("loginUserId", response.data.id);
      localStorage.setItem("username", this.state.username);

      // registration successfully worked --> navigate to the route /userOverview in the GameRouter
      this.props.history.push("/mainView");
    } catch (error) {
      this.setState({
        errorMessage: error.message,
      });
      //alert(`Something went wrong during the registration: \n${handleError(error)}`);
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
    this.setState({ [key]: value });
  }

  /**
   * componentDidMount() is invoked immediately after a component is mounted (inserted into the tree).
   * Initialization that requires DOM nodes should go here.
   * If you need to load data from a remote endpoint, this is a good place to instantiate the network request.
   * You may call setState() immediately in componentDidMount().
   * It will trigger an extra rendering, but it will happen before the browser updates the screen.
   */
  componentDidMount() {}

  render() {
    return (
      <div>
        
        <Header height={"100"} />
        <BaseContainer>
          <FormContainer>
            <Form>
              <FormTitleContainer>
                <FormTitle>
                  Registration
                </FormTitle>
              </FormTitleContainer>
              <Label>Username</Label>
              <InputField
                placeholder="Enter here.."
                onChange={(e) => {
                  this.handleInputChange("username", e.target.value);
                }}
              />
              <Label>Password</Label>
              <InputField
                type="Password"
                placeholder="Enter here.."
                onChange={(e) => {
                  this.handleInputChange("password", e.target.value);
                }}
              />
              <ButtonContainer>
                <Button
                  disabled={!this.state.username || !this.state.password}
                  width="50%"
                  style={{ margin: "5px" }}
                  onClick={() => {
                    this.registration();
                  }}
                >
                  Register
                </Button>
              </ButtonContainer>
              <ButtonContainer>
                <Button
                  width ="50%"
                  onClick={() => {
                    this.props.history.push("/login");
                  }}
                >
                  Go to Login
                </Button>
              </ButtonContainer>
              <Error message={this.state.errorMessage}/>
            </Form>
          </FormContainer>
        </BaseContainer>
      </div>
    );
  }
}

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default withRouter(Registration);
