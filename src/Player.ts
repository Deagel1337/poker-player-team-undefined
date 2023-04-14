export class Player {
  public betRequest(gameState: GameState, betCallback: (bet: number) => void): void {
    let cardValues
    if (this.isRoyalFlush(gameState.community_cards.concat(...gameState.players[gameState.in_action].hole_cards)) === true) {
      betCallback(gameState.current_buy_in - gameState.players[gameState.in_action].bet + gameState.minimum_raise + 50)
    }
    if (this.isStraightFlush(gameState.community_cards.concat(...gameState.players[gameState.in_action].hole_cards)) === true) {
      betCallback(gameState.current_buy_in - gameState.players[gameState.in_action].bet + gameState.minimum_raise + 50)
    }
    if (this.isQuads(gameState.community_cards.concat(...gameState.players[gameState.in_action].hole_cards)) === true) {
      betCallback(gameState.current_buy_in - gameState.players[gameState.in_action].bet + gameState.minimum_raise + 50)
    }
    if (this.isFullHouse(gameState.community_cards.concat(...gameState.players[gameState.in_action].hole_cards)) === true) {
      betCallback(gameState.current_buy_in - gameState.players[gameState.in_action].bet + gameState.minimum_raise + 50)
    }
    if (this.isFlush(gameState.community_cards.concat(...gameState.players[gameState.in_action].hole_cards)) === true) {
      betCallback(gameState.current_buy_in - gameState.players[gameState.in_action].bet + gameState.minimum_raise + 50)
    }
    if (this.isStraight(gameState.community_cards.concat(...gameState.players[gameState.in_action].hole_cards)) === true) {
      betCallback(gameState.current_buy_in - gameState.players[gameState.in_action].bet + gameState.minimum_raise + 50)
    }
    if (this.isTrips(gameState.community_cards.concat(...gameState.players[gameState.in_action].hole_cards)) === true) {
      betCallback(gameState.current_buy_in - gameState.players[gameState.in_action].bet + gameState.minimum_raise + 50)
    }
    if (this.isTwoPair(gameState.community_cards.concat(...gameState.players[gameState.in_action].hole_cards)) === true) {
      betCallback(gameState.current_buy_in - gameState.players[gameState.in_action].bet + gameState.minimum_raise + 50)
    }
    if (this.isTrips(gameState.community_cards.concat(...gameState.players[gameState.in_action].hole_cards)) === true) {
      betCallback(gameState.current_buy_in - gameState.players[gameState.in_action].bet + gameState.minimum_raise + 50)
    }
    if (this.isHighCard(gameState.community_cards.concat(...gameState.players[gameState.in_action].hole_cards)) === true) {
      betCallback(gameState.current_buy_in - gameState.players[gameState.in_action].bet + gameState.minimum_raise + 50)
    }
    for (let card of gameState.players[gameState.in_action].hole_cards) {
      cardValues += this.toRank(card.rank)
    }
    if (cardValues > 20)
      betCallback(gameState.current_buy_in - gameState.players[gameState.in_action].bet + gameState.minimum_raise);

    betCallback(gameState.current_buy_in - gameState.players[gameState.in_action].bet)
  }

  public showdown(gameState: {
    players: Array<GamePlayer>
  }): void {
    console.log(gameState)
  }

  toRank(cardRank: string): number {
    if (cardRank == "J") return 10;
    if (cardRank == "Q") return 11;
    if (cardRank == "K") return 12;
    if (cardRank == "A") return 13;
    return parseInt(cardRank)
  }


  isRoyalFlush(cards: Array<GameCard>): boolean {
    return false;
  }
  isStraightFlush(cards: Array<GameCard>): boolean {
    return false;
  }
  isQuads(cards: Array<GameCard>): boolean {
    return false;
  }
  isFullHouse(cards: Array<GameCard>): boolean {
    return false;
  }
  isFlush(cards: Array<GameCard>): boolean {
    return false;
  }
  isStraight(cards: Array<GameCard>): boolean {
    return false;
  }
  isTrips(cards: Array<GameCard>): boolean {
    return false;
  }
  isTwoPair(cards: Array<GameCard>): boolean {
    return false;
  }
  isPair(cards: Array<GameCard>): boolean {
    for (const card of cards) {
      if (cards.filter((c) => c.rank == card.rank).length > 0) return true
    }
    return false
  }
  isHighCard(cards: Array<GameCard>): boolean {
    return false;
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

export type GameCard = {
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
