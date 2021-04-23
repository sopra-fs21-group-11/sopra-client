import SockJS from "sockjs-client";
import * as Stomp from "@stomp/stompjs";




export let stompClient

export const initializeStomp = () => {

  const socket = SockJS('http://localhost:8080/gs-guide-websocket');

  stompClient = Stomp.Stomp.over(socket);

  stompClient.connect({}, function () {

    let url = stompClient.ws._transport.url;
    url = url.replace("ws://localhost:8080/gs-guide-websocket/", "");
    url = url.replace("/websocket", "");
    url = url.replace(/^[0-9]+\//, "");
    const sessionId = url;

    stompClient.subscribe('/topic/game/queue/specific-game-game' + sessionId,   function(message) {
      let mes = JSON.parse(message.body);
      localStorage.setItem("gameState", mes["gamestate"])
      localStorage.setItem("cards", mes["cards"])
      localStorage.setItem("currentPlayer", mes["playersturn"])
      localStorage.setItem("token", mes["playerstokens"])
      localStorage.setItem("nextCard", mes["nextCardOnStack"])
      console.log(mes);
    });

    stompClient.send("/app/game", {}, JSON.stringify(
      {
        'name': localStorage.getItem("username"),
        'id': localStorage.getItem("loginUserId"),
        'gameId': localStorage.getItem("gameId")
      }));



  });
}
