export class Player {
  public betRequest(gameState: GameState, betCallback: (bet: number) => void): void {
    const allCards = gameState.community_cards.concat(...gameState.players[gameState.in_action].hole_cards);
    const minRaise = gameState.current_buy_in - gameState.players[gameState.in_action].bet + gameState.minimum_raise;
    const stack = gameState.players[gameState.in_action].stack;
    const minRaise_stack_percent = minRaise / stack;
    const activePlayers = gameState.players.filter((p) => p.status == "active");
    const raiseUnit = 10;


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
      let raise = minRaise + stack / 2
      if (raise > stack) {
        this.bet(stack, "fullhouse", betCallback)
        return;
      }
      else
        this.bet(raise, "fullhouse-raise", betCallback)
      return;
    }
    if (stack < 300) {
      this.bet(0, "stack to low", betCallback);
      return;
    }
    if (minRaise_stack_percent > 0.5 && activePlayers.length > 4) {
      this.bet(0, "fold too high min bet with more than 4 players", betCallback);
      return;
    }
    if (this.isFlush(allCards) === true) {
      let raise = minRaise + stack / 4
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
    if (this.isTrips(allCards) === true) {
      this.bet(minRaise + 2 * raiseUnit * allCards.length, "trips", betCallback)
      return;
    }
    if (this.isTwoPair(allCards) === true) {
      this.bet(minRaise + raiseUnit * allCards.length, "2pair", betCallback)
      return;
    }
    if (this.isPair(allCards) === true) {
      this.bet(minRaise + raiseUnit * allCards.length, "pair", betCallback)
      return;
    }
    if (this.isHighCard(gameState.players[gameState.in_action].hole_cards) === true) {
      this.bet(minRaise + raiseUnit * allCards.length, "highcard", betCallback)
      return;
    }

    //Stop losses b/c royal recognition is not implemented
    if (allCards.length >= 4) {
      this.bet(0, "stoploss", betCallback)
      return;
    }
    this.bet(42, 'N', betCallback)
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

  isTrips(cards: Array<GameCard>): boolean {
    for (const card of cards) {
      if (cards.filter((c) => c.rank == card.rank).length == 3) return true;
    }
    return false;
  }

  isTwoPair(cards: Array<GameCard>): boolean {
    let pairs = new Array<string>();
    for (const card of cards) {
      if (cards.filter((c) => c.rank == card.rank).length == 2 && pairs.filter((c) => c == card.rank).length == 0) { pairs.push(card.rank); }
      if (pairs.length > 1) { return true }
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
    let cardValues = 0;
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
