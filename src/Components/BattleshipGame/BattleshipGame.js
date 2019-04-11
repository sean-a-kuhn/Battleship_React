import React, {Component} from 'react';
import Board from '../Board/Board';
import GameToggles from '../GameToggles/GameToggles';
import ShipPlacement from './ShipPlacement/ShipPlacement';
import Fleet from './Fleet/Fleet';

class BattleshipGame extends Component {
   constructor(props) {
      super(props);
      this.state = {
         player: 0,
         wins: 0,
         losses: 0,
         isGameLive: true,
         currentBoard: "ships", // value is "ships" or "targets", indicating which board is active--defense or offense
         fleet: this.createFleet(), // object containing all ship objects
         shipOrientation: "vertical", // orientation of ship to be placed on board
         placeShip: "shipAir", // ship type currently selected to be placed on board
         placeShipCells: [], // array of cells showing where ship is to be placed
         placeShipCellsError: [], // array of cells showing where ship tries to be placed, but fails
         targetsHit: [], //offensive hits
         targetsMissed: [], //offensive misses
         currentTargetCell: "", // string of cell ID player currently hovering over when selecting target to strike
      };
   }
   render() {
      return (
         <div>
            <Board
               isGameLive={this.state.isGameLive}
               fleet={this.state.fleet}
               targetsHit={this.state.targetsHit}
               targetsMissed={this.state.targetsMissed}
               currentBoard={this.state.currentBoard}
               placeShip={this.state.placeShip}
               placeShipCells={this.state.placeShipCells}
               placeShipCellsError={this.state.placeShipCellsError}
               currentTargetCell={this.state.currentTargetCell}
               updatePlaceShipCells={this.updatePlaceShipCells}
               mouseHoverAction={this.handleHoverEvent}
               mouseExitAction={this.handleMouseLeaveEvent}
               mouseClickAction={this.handleClickEvent}
            />
            <br />
      {/*radios to select ships and ship orientation for placement, also radios to toggle between ships board and target board*/}
            <GameToggles 
               currentBoardState={this.state.currentBoard}
               shipOrientState={this.state.shipOrientation}
               placeShipState={this.state.placeShip}
               toggleBoard={this.toggleBoard}
               toggleOrientation={this.toggleOrientation}
               toggleShip={this.toggleShip}

               // development specific
               isGameLiveState={this.state.isGameLive}
               toggleMode={this.toggleMode}
            />   
         </div>
        
      );
   }
   // function to create and return a Fleet object
   createFleet = () => {
      let obj = new Fleet();
      return obj;
   }

   // functions to update states based on GameToggles selection
   toggleBoard = (board) => {
      this.setState({currentBoard: board});
   }
   toggleOrientation = (orientation) => {
      this.setState({shipOrientation: orientation});
   }
   toggleShip = (ship) => {
      this.setState({placeShip: ship});
   }
   // function to toggle game mode -> strictly for development purposes
   toggleMode = (mode) => {
      if ("setup" === mode) {
         this.setState({isGameLive: false});
      }
      else {
         this.setState({isGameLive: true});
      }
      
   }

   // hover methods
   handleHoverEvent = (cellId) => {
      const stateUpdate = (
         this.state.isGameLive
         ? this.hoverLive(cellId)
         : this.hoverSetup(cellId)
      );
      if (stateUpdate !== null) {
         this.setState(stateUpdate);
      }
   }
   hoverLive = (cellId) => {
      if ("targets"===this.state.currentBoard) {
         return this.hoverTargets(cellId);
      }
   }
   hoverTargets = (cellId) => {
      return (
         (!this.state.targetsHit.includes(cellId) && !this.state.targetsMissed.includes(cellId))
         ? {currentTargetCell: cellId}
         : {currentTargetCell: ""}
      );
   }
   hoverSetup = (cellId) => {
      // code for ship placement
      const shipPlacement = new ShipPlacement(this.state.fleet, this.state.shipOrientation, this.state.placeShip);
      this.setState(shipPlacement.selectPlaceShipCells(cellId));
   }

   // function to handle event when mouse cursor leaves GridCell: reset state values based on what is currently triggering render
   handleMouseLeaveEvent = () => {
      if (this.state.currentTargetCell.length) { // isGameLive: true, currentBoard: targets -> Player choosing strike targets
         this.setState({currentTargetCell: ""});
      }
      else if (this.state.placeShipCells.length) { //isGameLive: false, currentBoard: ships -> game setup
         this.setState({placeShipCells: []});
      }
      else if (this.state.placeShipCellsError.length) { // isGameLive: false, currentBoard: ships -> game setup (invalid ship positions)
         this.setState({placeShipCellsError: []});
      }
   }

   // click methods
   handleClickEvent = (cellId) => {
      if (this.state.isGameLive) { // handle click event when game is live: select target GridCell to strike
          
      }
      else { // handle click event when setting up game: place ship on board
         const shipPlacement = new ShipPlacement(this.state.fleet, this.state.shipOrientation, this.state.placeShip);
         let updateState = shipPlacement.clickGridCell(cellId);
         console.log("updateState object:");
         console.log(updateState);
         this.setState(updateState);
      }
   }

   // function to set states for start of game
   startGame = () => {
      this.setState({
         isGameLive: true,
         placeShip: "",
         placeShipCells: [],
         placeShipCellsError: []
      });
   }
}

export default BattleshipGame;