import styled from "styled-components";

export const Button = styled.button`
  &:hover {
    transform: translateY(-2px);
  }
  padding: 6px;
  font-weight: 900;
  text-transform: uppercase;
  font-size: 13px;
  text-align: center;
  color: black;
  width: ${props => props.width || null};
  height: 35px;
  border: rgb(0, 0, 0, 1);
  padding: none;
  border-width: 4px;
  border-style: solid;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  background: rgb(0, 132, 0, 1);
  transition: all 0.3s ease;
`;
