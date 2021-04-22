import SockJS from "sockjs-client";
import * as Stomp from "@stomp/stompjs";


const socket = SockJS('http://localhost:8080/gs-guide-websocket');

export const stompClient = Stomp.Stomp.over(socket);

export const initializeStomp = () => {

  let sessionId;
  stompClient.connect({}, function () {
    let url = stompClient.ws._transport.url;
    url = url.replace("ws://localhost:8080/gs-guide-websocket/", "");
    url = url.replace("/websocket", "");
    url = url.replace(/^[0-9]+\//, "");
    sessionId = url;

    stompClient.subscribe('/topic/game/queue/specific-game-game' + sessionId, function (test) { //
      console.log(JSON.parse(test.body).content);
    });

    stompClient.send("/app/game", {}, JSON.stringify(
      {
        'name': localStorage.getItem("username"),
        'id': localStorage.getItem("loginUserId"),
        'gameId': localStorage.getItem("gameId")
      }));

    stompClient.onmessage = function (event) {
      console.log(event.data);
    };

  });

  localStorage.setItem("sessionId", sessionId);
}
