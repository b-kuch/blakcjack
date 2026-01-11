import { Card, Deck, Suit, Rank } from './types'

export class StandardDeck implements Deck {
  cards: Card[] = []

  constructor() {
    this.initializeDeck()
  }

  private initializeDeck(): void {
    const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades']
    const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']
    const values: { [key in Rank]: number } = {
      'A': 11, // Ace can be 1 or 11, handled in scoring
      '2': 2,
      '3': 3,
      '4': 4,
      '5': 5,
      '6': 6,
      '7': 7,
      '8': 8,
      '9': 9,
      '10': 10,
      'J': 10,
      'Q': 10,
      'K': 10
    }

    for (const suit of suits) {
      for (const rank of ranks) {
        this.cards.push({
          suit,
          rank,
          value: values[rank]
        })
      }
    }
  }

  shuffle(): void {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]]
    }
  }

  draw(): Card | undefined {
    return this.cards.pop()
  }
}