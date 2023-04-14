export class Player {
  public betRequest(gameState: GameState, betCallback: (bet: number) => void): void {
    const allCards = [...gameState.players[gameState.in_action].hole_cards, ...gameState.community_cards]
    const minRaise = gameState.current_buy_in - gameState.players[gameState.in_action].bet + gameState.minimum_raise;
    const stack = gameState.players[gameState.in_action].stack;

    if (this.isRoyalFlush(allCards) === true) {
      console.log("Royal Flush")
      betCallback(stack)
    }
    if (this.isStraightFlush(allCards) === true) {
      console.log("Straight Flush")
      betCallback(stack)
    }
    if (this.isQuads(allCards) === true) {
      console.log("Quads")
      betCallback(stack)
    }
    if (this.isFullHouse(allCards) === true) {
      console.log("Fullhouse")
      betCallback(minRaise + 50)
    }
    if (this.isFlush(allCards) === true) {
      console.log("Flush")
      betCallback(minRaise + 50)
    }
    if (this.isStraight(allCards) === true) {
      console.log("Straight")
      betCallback(minRaise + 50)
    }
    if (this.isTrips(allCards) === true) {
      console.log("trips")
      betCallback(minRaise + 50)
    }
    if (this.isTwoPair(allCards) === true) {
      console.log("2pair")
      betCallback(minRaise + 50)
    }
    if (this.isPair(allCards) === true) {
      console.log("pair")
      betCallback(minRaise + 50)
    }
    if (this.isHighCard(gameState.players[gameState.in_action].hole_cards) === true) {
      betCallback(minRaise + 50)
    }

    //Stop losses b/c royal recognition is not implemented
    if(allCards.length >= 4){
      betCallback(0)
    }


  }

  public showdown(gameState: {
    players: Array<GamePlayer>
  }): void {
    // console.log(gameState)
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
    for (const card of cards) {
      if(cards.filter((c)=>c.rank==card.rank).length >= 4) return true
    }
    return false;
  }
  isFullHouse(cards: Array<GameCard>): boolean {
    if(cards.length < 5) return;
  // find triple
    let triple;
    for (const card of cards) {
      let possibleTriple = cards.filter((c) => c.rank == card.rank)
      if(possibleTriple.length == 3){
        triple = possibleTriple;
      }
    }
    if(!triple) return false;
    for (const card of cards) {
      if(card.rank == triple[0].rank) continue;
      if(cards.filter((c) => c.rank == card.rank).length == 2)
        return true;
    }
    //find pair
    return false
  }
  isFlush(cards: Array<GameCard>): boolean {
    return false;
  }
  isStraight(cards: Array<GameCard>): boolean {
    return false;
  }
  isTrips(cards: Array<GameCard>): boolean {
    for (const card of cards) {
      if (cards.filter((c) => c.rank == card.rank).length == 3) return true;
    }
    return false;
  }
  isTwoPair(cards: Array<GameCard>): boolean {
    let pairs = 0;
    for (const card of cards) {
      if (cards.filter((c) => c.rank == card.rank).length > 0) { pairs++; }
      if (pairs > 1) { return true }
    }
    return false
  }
  isPair(cards: Array<GameCard>): boolean {
    for (const card of cards) {
      if (cards.filter((c) => c.rank == card.rank).length > 0) return true
    }
    return false
  }
  isHighCard(cards: Array<GameCard>): boolean {
    let cardValues
    for (let card of cards) {
      cardValues += this.toRank(card.rank)
    }
    if (cardValues > 20) return true;
    
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
