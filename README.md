# SoPra FS21 - Group 11 - Usgrächnet Bünzen

## The Game - Usgrächnet Bünzen

Our project's aim is to implement the game *Usgrächnet Bünzen*. The original game allows users to test their
knowledge of Swiss locations in a playful manner. Each player can place location cards on a board
in relation to other locations based on their coordinates. All other players have the chance to doubt the 
card placement if they believe it is wrong. Players that continuously place cards correctly and prove other 
people's card placement to be wrong will be awarded tokens. The player with most tokens wins the game.
For a more extensive explanation of the original game please check out this **[manual](public/Usgrachnet_Help.pdf)**.


In order to introduce more complexity we added the following features:
* players can choose their **own game settings**
* players can **customize** the card decks to play with
* players can fetch international locations and create **new cards and decks**

Check out this project's [:computer: server repo](https://github.com/sopra-fs21-group-11/sopra-server).

## Technologies 

- **WebSocket** 🧦: Enables bidirectional communication between client and server. We used this to implement the game. 

- **[React-js](https://reactjs.org/)** :rocket: : React-js is a framwork for building JavaScript user interfacesin a component-based way. 

- **[Spring Boot](https://spring.io/)** :boot: : 

- [**JPA**](https://www.oracle.com/java/technologies/persistence-jsp.html): for card / deck and user database

## High-level components

- **[Lobby](https://github.com/sopra-fs21-group-11/sopra-client/blob/master/src/components/lobby/Lobby.js)**: Users can customize the game settings in the lobby and pick the deck to play with. Only the game host can do so. 
- **[Game](https://github.com/sopra-fs21-group-11/sopra-client/blob/master/src/components/game/Game.js)**: This is the implementation of the main game flow.

- **[Deck Creator](https://github.com/sopra-fs21-group-11/sopra-client/blob/master/src/components/deckEditor/DeckCreator.js)**: Users can create customized decks in the DeckCreator. This is the front-end intersection with the external API. 

- **[Join Game](https://github.com/sopra-fs21-group-11/sopra-client/blob/master/src/components/joinGame/JoinGame.js)**: Users other than the host can join any game via the JoinGame interface. 

These are the four major pillars of our application flow on the client side. The lobby allows choosing customized settings including a customized deck that can be created beforehand in the deck creator. Every user can join a game via the join game component. The final stage is the game itself. 

## Launch & Deployment - for joining developers

For your local development environment you'll need Node.js >= 8.10. You can download it [here](https://nodejs.org). All other dependencies including React get installed with:

#### `npm install`

This has to be done before starting the application for the first time (only once).

#### `npm run dev`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
The page will reload if you make edits.
You will also see any lint errors in the console (use Google Chrome!).

#### `npm run test`

Launches the test runner in the interactive watch mode.
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

> For macOS user running into an 'fsevents' error: https://github.com/jest-community/vscode-jest/issues/423

#### `npm run build`

Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.
The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Illustrations of Game

The project consists of two main parts: the game and a deck creator. 

### Game
Every user can create a new game and set it up with customized settings. --> add picture of lobby

--> add max three small pictures of game (placement, doubt and evaluation)

Users can join the game

### Deck creator

--> add max two pictures of editor /new deck creation

## Roadmap
Joining developers can contribute the following things:

- Add more comparison types, i.e. compare population instead of coordinates
- Add profile pages for the users
- ... whatever creative extensions you can come up with! :smile:

## Authors and acknowledgment

A special thanks goes to our TA Raffi and the sopra team FS21.

### Authors
- [Martin](https://github.com/tinu0816)
- [Tobias](https://github.com/tobcode)
- [Lukas](https://github.com/LukZeh)
- [Tanzil](https://github.com/tanzilkm)
- [Debby](https://github.com/theDebbister)



## License

The project is licensed under the Apache License 2.0. For more information check [this :page_with_curl:](https://github.com/sopra-fs21-group-11/sopra-client/blob/master/LICENSE) out.







