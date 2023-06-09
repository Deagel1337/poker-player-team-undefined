export class Player {
  public betRequest(gameState: GameState, betCallback: (bet: number) => void): void {
    const ownCards = gameState.players[gameState.in_action].hole_cards;
    const allCards = gameState.community_cards.concat(...ownCards);
    const call = gameState.current_buy_in - gameState.players[gameState.in_action].bet;
    const minRaise = gameState.current_buy_in - gameState.players[gameState.in_action].bet + gameState.minimum_raise;
    const stack = gameState.players[gameState.in_action].stack;
    const minRaise_stack_percent = minRaise / stack;
    const activePlayers = gameState.players.filter((p) => p.status == "active");
    const raiseUnit = 200


    console.log(`MinRaise: ${minRaise} - Stack: ${stack} - ${minRaise_stack_percent}`)
    console.log(gameState.players[gameState.in_action].hole_cards.map((c) => c.rank))
    console.log(allCards.map((c) => c.rank))

    if (this.isRoyalFlush(allCards) === true) {
      this.bet(stack, "ryoal flush", betCallback)
      return;
    }
    if (this.isStraightFlush(allCards) === true) {
      this.bet(stack, "straight flush", betCallback)
      return;
    }
    if (this.isQuads(allCards) === true) {
      this.bet(stack, "quads", betCallback)
      return;
    }
    if (this.isFullHouse(allCards) === true) {
      let raise = call + stack / 2
      if (raise > stack) {
        this.bet(stack, "fullhouse", betCallback)
        return;
      }
      else
        this.bet(raise, "fullhouse-raise", betCallback)
      return;
    }
    if(call > stack) {
      this.bet(0, "fold because call is higher than stack", betCallback);
      return;
    }
    // if (minRaise_stack_percent > 0.5 && activePlayers.length > 4) {
    //   this.bet(0, "fold too high min bet with more than 4 players", betCallback);
    //   return;
    // }
    if (this.isFlush(allCards) === true) {
      let raise = call + stack / 4
      if (raise > stack) {
        betCallback(stack);
        return;
      }
      else {
        this.bet(raise, "flush-raise", betCallback)
        return;
      }
    }
    if (this.isStraight(allCards) === true) {
      this.bet(minRaise + raiseUnit * allCards.length, "straight", betCallback)
      return;
    }
    const trips = this.isTrips(ownCards, allCards)
    if (trips !== 0) {
      this.bet(minRaise + 2 * raiseUnit * allCards.length * trips, "trips", betCallback)
      return;
    }
    if (this.isTwoPair(allCards, ownCards) === true) {
      this.bet(minRaise + raiseUnit * allCards.length, "2pair", betCallback)
      return;
    }
    if (this.isPair(allCards, ownCards) > 0) {
      this.bet(minRaise + raiseUnit * allCards.length * this.isPair(allCards, ownCards), "pair", betCallback)
      return;
    }

    if(this.isAce(ownCards) && this.isPair(allCards, allCards)==0){
      this.bet(call, "ace on hand and no pair", betCallback);
      return;
    }

    if(call > 100){
      this.bet(0, "raise too high", betCallback);
      return;
    }

    if (stack < 300 && this.isHighCard(ownCards) < 20) {
      this.bet(0, "stack to low", betCallback);
      return;
    }
    if (this.isLowCard(ownCards)) {
      this.bet(0, "low card", betCallback);
      return;
    }


    if(allCards.length >=5){
      this.bet(0, "only highcard", betCallback)
      return;
    }
    if (this.isHighCard(ownCards) > 20) {
      this.bet(call, "highcard", betCallback)
      return;
    }

    //Stop losses b/c royal recognition is not implemented
    if (allCards.length >= 4) {
      this.bet(0, "stoploss", betCallback)
      return;
    }
    this.bet(call, 'fallback call', betCallback)
    return;
  }

  private bet(bet: number, reason: string, betCallback: (bet: number) => void): void {
    console.log(`Bet: ${bet} - Reason: ${reason}`);
    betCallback(bet);
  }

  public showdown(gameState: {
    players: Array<GamePlayer>
  }): void {
    // console.log(gameState)
  }

  toRank(cardRank: string): number {
    if (cardRank == "J") return 18;
    if (cardRank == "Q") return 19;
    if (cardRank == "K") return 20;
    if (cardRank == "A") return 21;
    return parseInt(cardRank)
  }

  isRoyalFlush(cards: Array<GameCard>): boolean {
    cards.sort((a, b) => parseInt(a.rank) - parseInt(b.rank))
    if (this.isStraightFlush(cards)) {
      if (cards[0].rank == "10") return true
    }
    return false
  }

  isStraightFlush(cards: Array<GameCard>): boolean {
    cards.sort((a, b) => parseInt(a.rank) - parseInt(b.rank))
    let isStraight: boolean = false
    for (const card of cards) {
      if (cards.filter((c) => card.suit === c.suit).length === 5) {
        isStraight = true
      }
    }
    if (!isStraight) return false
    let count = 1
    let index = 0
    for (const card of cards) {
      for (let i = index; i < cards.length - 1; i++) {
        if ((parseInt(card.rank) - parseInt(cards[i + 1].rank)) === -1) {
          count++
        }
      }
      index++
    }
    if (count === 5) return true
    return false
  }

  isQuads(cards: Array<GameCard>): boolean {
    for (const card of cards) {
      if (cards.filter((c) => c.rank == card.rank).length >= 4) return true
    }
    return false;
  }

  isFullHouse(cards: Array<GameCard>): boolean {
    if (cards.length < 5) return;
    // find triple
    let triple;
    for (const card of cards) {
      let possibleTriple = cards.filter((c) => c.rank == card.rank)
      if (possibleTriple.length == 3) {
        triple = possibleTriple;
      }
    }
    if (!triple) return false;
    for (const card of cards) {
      if (card.rank == triple[0].rank) continue;
      if (cards.filter((c) => c.rank == card.rank).length == 2)
        return true;
    }
    //find pair
    return false
  }

  isFlush(cards: Array<GameCard>): boolean {
    for (const card of cards) {
      if (cards.filter((c) => card.suit === c.suit).length === 5) return true
    }
    return false
  }

  isStraight(cards: Array<GameCard>): boolean {
    cards.sort((a, b) => parseInt(a.rank) - parseInt(b.rank))
    let count = 1
    let index = 0
    for (const card of cards) {
      for (let i = index; i < cards.length - 1; i++) {
        if (parseInt(card.rank) - parseInt(cards[i + 1].rank) === -1) count++
      }
    }
    if (count === 5) return true
    return false
  }

  isTrips(ownCards: Array<GameCard>, cards: Array<GameCard>): number {
    let r = 0;
    for (const card of ownCards) {
      if (cards.filter((c) => c.rank == card.rank).length == 3) r = 1;
    }
    if (r > 0 && this.isPair(cards, ownCards) > 0) { r = 0.5; }
    return r;
  }

  isTwoPair(cards: Array<GameCard>, ownCards: Array<GameCard>): boolean {
    let pairs = new Array<string>();
    for (const card of ownCards) {
      if (cards.filter((c) => c.rank == card.rank).length == 2 && pairs.filter((c) => c == card.rank).length == 0) { pairs.push(card.rank); }
      if (pairs.length > 1) { return true }
    }
    return false
  }

  isPair(cards: Array<GameCard>, ownCards: Array<GameCard>): number {
    for (const card of ownCards) {
      const possiblePair = cards.filter((c) => c.rank == card.rank)
      if (possiblePair.length == 2) {
        const highcard = this.isHighCard(ownCards);
        if (highcard>0){
          return 1
        }

        return 0.75
      }
      
    }
    return 0
  }

  isHighCard(cards: Array<GameCard>): number {
    let cardValues = 0;
    for (let card of cards) {
      cardValues += this.toRank(card.rank)
    }
    if (cardValues > 20) return cardValues;

    return cardValues;
  }

  isLowCard(cards: Array<GameCard>): boolean {
    let cardValues = 0;
    for (let card of cards) {
      cardValues += this.toRank(card.rank)
    }
    if (cardValues < 15) return true;
    return false;
  }

  isAce(cards: Array<GameCard>): boolean {
    for (let card of cards) {
      if (card.rank == "A"){
        return true
      }
    }
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
