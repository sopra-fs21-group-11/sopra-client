
import React from "react";
import styled from "styled-components";
import { BaseContainer } from "../../helpers/layout";
import { api } from "../../helpers/api";
import User from "../shared/models/User";
import { withRouter } from "react-router-dom";
import { Button } from "../../views/design/Button";
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
  height: 375px;
  font-size: 16px;
  font-weight: 300;
  padding-left: 37px;
  padding-right: 37px;
  border-radius: 5px;
  background: rgb(255, 213, 0, 0.35);
  transition: opacity 0.5s ease, transform 0.5s ease;
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


class Main extends React.Component {




    render() {
        return (
            <BaseContainer>
                <FormContainer>
                    <Form>
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
                        registration
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
                    <Error message={this.state.erroMessage}/>
                    </Form>
                </FormContainer>
            </BaseContainer>
        );
    }
}


export default withRouter(Main);

