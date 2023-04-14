export class Player {
  isPair(cards:Array<GameCard>):boolean{
    for (const card of cards) {
      const i = cards.findIndex((c) => {
        c.rank == card.rank
      })
      if(i !== -1) return true
    }
    return false
  }
  public betRequest(gameState: GameState, betCallback: (bet: number) => void): void {
    let cardValues
    if(this.isPair(gameState.community_cards.concat(...gameState.players[gameState.in_action].hole_cards)) === true){
      betCallback(gameState.current_buy_in - gameState.players[gameState.in_action].bet + gameState.minimum_raise + 5)
    }
        for (let card of gameState.players[gameState.in_action].hole_cards) {
            cardValues += this.toRank(card.rank)
        }
        if(cardValues > 20)
          betCallback(gameState.current_buy_in - gameState.players[gameState.in_action].bet + gameState.minimum_raise);
        
        betCallback(gameState.current_buy_in - gameState.players[gameState.in_action].bet)
    }

  public showdown(gameState: {
    players: Array<GamePlayer>
  }): void {
    console.log(gameState)
  }

  toRank(cardRank: string): number {
    if(cardRank == "J") return 10;
    if(cardRank == "Q") return 11;
    if(cardRank == "K") return 12;
    if(cardRank == "A") return 13;
    return parseInt(cardRank)
}
};


export default Player;

export type GameState = {
  players: Array<GamePlayer>;
  turnament_id: string;
  game_id: string;
  round: number;
  bet_index: number
  small_blind: number
  current_buy_in: number
  pot: number
  minimum_raise: number
  dealer: number
  orbits: number
  in_action: number
  community_cards: Array<GameCard>
}

export type GameCard= {
  rank: string,
  suit: string;
}

export type GamePlayer = {
  name: string,
  stack: number,
  status: string,
  bet: number,
  hole_cards: Array<GameCard>,
  version: string,
  id: number
}
