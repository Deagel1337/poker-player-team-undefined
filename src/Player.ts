export class Player {
  public betRequest(gameState: GameState, betCallback: (bet: number) => void): void {
    betCallback(gameState.current_buy_in - gameState.players[gameState.in_action].bet + gameState.minimum_raise);
  }

  public showdown(gameState: {
    players: Array<GamePlayer>
  }): void {
    console.log(gameState)
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
  hole_cards: Array<any>,
  version: string,
  id: number
}