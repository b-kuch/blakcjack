import { Card, Hand } from './types'

export class BlackjackHand implements Hand {
  cards: Card[] = []

  addCard(card: Card): void {
    this.cards.push(card)
  }

  getScore(): number {
    let score = 0
    let aces = 0

    for (const card of this.cards) {
      if (card.rank === 'A') {
        aces++
        score += 11
      } else {
        score += card.value
      }
    }

    // Adjust for aces if bust
    while (score > 21 && aces > 0) {
      score -= 10
      aces--
    }

    return score
  }

  isBust(): boolean {
    return this.getScore() > 21
  }

  isBlackjack(): boolean {
    return this.cards.length === 2 && this.getScore() === 21
  }
}