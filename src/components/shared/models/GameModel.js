/**
 * Game model
 */
class GameModel {
  constructor(data = {}) {
    this.id = null;
    this.playersMin = null;
    this.playersMax = null;
    this.nrOfEvaluations = null;
    this.doubtCountdown = null;
    this.visibleAfterDoubtCountdown = null;
    this.playerTurnCountdown = null;
    this.tokenGainOnCorrectGuess = null;
    this.tokenGainOnNearestGuess = null;
    this.horizontalValueCategoryId = null;
    this.verticalValueCategoryId = null;
    this.name = null;
    this.hostId = null;
    this.players = null;
    Object.assign(this, data);
  }
}
export default GameModel;
