import styled from "styled-components";

export const OverlayContainer = styled.div`
  min-height: 500px;
  width: 100vw;
  height: 80vh;
  margin: 0;
  position: absolute;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
`;

export const Overlay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
  background: rgb(200, 213, 0, 0.25);
  
`;