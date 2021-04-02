import styled from "styled-components";

export const Button = styled.button`
  &:hover {
    transform: translateY(-2px);
  }
  padding: 6px;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 13px;
  text-align: center;
  color: rgba(255, 255, 255, 1);
  width: ${props => props.width || null};
  height: 35px;
  border: 4px black solid;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  background: green;
  transition: all 0.3s ease;
`;
