import styled from "styled-components";

export const InputField = styled.input`
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