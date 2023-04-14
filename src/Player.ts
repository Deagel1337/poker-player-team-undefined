export class Player {
  public betRequest(gameState: GameState, betCallback: (bet: number) => void): void {
    console.log(gameState.in_action);
    const allCards = gameState.community_cards.concat(...gameState.players[gameState.in_action].hole_cards);
    const minRaise = gameState.current_buy_in - gameState.players[gameState.in_action].bet + gameState.minimum_raise;
    const stack = gameState.players[gameState.in_action].stack;
    const raiseUnit  = 30;

    console.log(allCards.map((c)=>c.rank))
    if (this.isRoyalFlush(allCards) === true) {
      this.bet(stack, "ryoal flush", betCallback)
    }
    if (this.isStraightFlush(allCards) === true) {
      this.bet(stack, "straight flush", betCallback)
    }
    if (this.isQuads(allCards) === true) {
      this.bet(stack, "quads", betCallback)
    }
    if (this.isFullHouse(allCards) === true) {
      console.log("Fullhouse")
      let raise = minRaise + stack/2
      if( raise > stack) betCallback(stack)
      else 
        betCallback(raise)
    }
    if (this.isFlush(allCards) === true) {
      console.log("Flush")
      let raise = minRaise + stack/4
      if( raise > stack) betCallback(stack)
      else 
        betCallback(raise)
      // this.bet(minRaise + raiseUnit*allCards.length, "fullhouse", betCallback)
    }
    if (this.isStraight(allCards) === true) {
      this.bet(minRaise + raiseUnit*allCards.length, "straight", betCallback)
    }
    if (this.isTrips(allCards) === true) {
      console.log("trips")
      betCallback(minRaise + 2*raiseUnit*allCards.length)
      // this.bet(minRaise + raiseUnit*allCards.length, "trips", betCallback)
    }
    if (this.isTwoPair(allCards) === true) {
      betCallback(minRaise + raiseUnit*allCards.length)
      this.bet(minRaise + raiseUnit*allCards.length, "2pair", betCallback)
    }
    if (this.isPair(allCards) === true) {
      this.bet(minRaise + raiseUnit*allCards.length, "pair", betCallback)
    }
    if (this.isHighCard(gameState.players[gameState.in_action].hole_cards) === true) {
      this.bet(minRaise + raiseUnit*allCards.length, "highcard", betCallback)
    }

    //Stop losses b/c royal recognition is not implemented
    if(allCards.length >= 4){
     this.bet(0, "stoploss", betCallback)
    }
  }

  private bet(bet: number, reason: string, betCallback: (bet: number) => void): void{
    console.log(`Bet: ${bet} - Reason: ${reason}`);
    betCallback(bet);
  }

  public showdown(gameState: {
    players: Array<GamePlayer>
  }): void {
    // console.log(gameState)
  }

  toRank(cardRank: string): number {
    if (cardRank == "J") return 10*2;
    if (cardRank == "Q") return 11*2;
    if (cardRank == "K") return 12*2;
    if (cardRank == "A") return 13*2;
    return parseInt(cardRank)
  }


  isRoyalFlush(cards: Array<GameCard>): boolean {
    cards.sort((a,b)=>parseInt(a.rank)-parseInt(b.rank))
    if(this.isStraightFlush(cards)) {
      if(cards[0].rank == "10") return true
    }
    return false
    }
  isStraightFlush(cards: Array<GameCard>): boolean {
    cards.sort((a,b)=>parseInt(a.rank)-parseInt(b.rank))
  let isStraight: boolean = false
  for (const card of cards) {
    if(cards.filter((c)=> card.suit === c.suit).length === 5){
      isStraight = true
    }
  }
  if(!isStraight) return false
  let count = 1
  let index = 0
  for (const card of cards) {
    for(let i = index; i < cards.length-1;i++)
    {
      if((parseInt(card.rank)-parseInt(cards[i+1].rank)) === -1){
        count++
      }
    }
    index++
  }
  if(count===5) return true
  return false
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
    for (const card of cards) {
      if(cards.filter((c)=> card.suit === c.suit).length === 5) return true
    }
    return false
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
      if (cards.filter((c) => c.rank == card.rank).length == 2) { pairs++; }
      if (pairs > 1) { return true }
    }
    return false
  }
  isPair(cards: Array<GameCard>): boolean {
    for (const card of cards) {
      if (cards.filter((c) => c.rank == card.rank).length == 2) return true
    }
    return false
  }
  isHighCard(cards: Array<GameCard>): boolean {
    let cardValues
    for (let card of cards) {
      cardValues += this.toRank(card.rank)
    }
    if (cardValues > 10) return true;
    
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
