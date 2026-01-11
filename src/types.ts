export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades'
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K'

export interface Card {
  suit: Suit
  rank: Rank
  value: number
}

export interface Deck {
  cards: Card[]
  shuffle(): void
  draw(): Card | undefined
}

export interface Hand {
  cards: Card[]
  addCard(card: Card): void
  getScore(): number
  isBust(): boolean
  isBlackjack(): boolean
}

export interface Player {
  hand: Hand
  chips: number
  bet: number
  isStanding: boolean
}

export interface Dealer {
  hand: Hand
  isStanding: boolean
}

export type GameState = 'betting' | 'playing' | 'dealer-turn' | 'game-over'

export interface GameResult {
  winner: 'player' | 'dealer' | 'tie'
  message: string
}