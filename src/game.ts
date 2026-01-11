import { Player, Dealer, GameState, GameResult, Card } from './types'
import { StandardDeck } from './deck'
import { BlackjackHand } from './hand'

export class BlackjackGame {
  private player: Player
  private dealer: Dealer
  private deck: StandardDeck
  private discard: Card[] = []
  private state: GameState = 'betting'
  private appElement: HTMLElement
  private drawSound = new Audio('/sounds/draw.mp3')
  private gatherSound = new Audio('/sounds/gather.mp3')

  constructor(appElement: HTMLElement) {
    this.appElement = appElement
    this.deck = new StandardDeck()
    this.player = {
      hand: new BlackjackHand(),
      chips: 1000,
      bet: 0,
      isStanding: false
    }
    this.dealer = {
      hand: new BlackjackHand(),
      isStanding: false
    }
  }

  init(): void {
    this.render()
  }

  private getCard(): Card {
    let card = this.deck.draw()
    if (!card) {
      // Reshuffle discard back into deck
      this.deck.cards.push(...this.discard)
      this.discard = []
      this.deck.shuffle()
      card = this.deck.draw()!
    }
    return card
  }

  private startNewGame(): void {
    // Play gather sound
    this.gatherSound.play()

    // Gather used cards to discard
    this.discard.push(...this.player.hand.cards, ...this.dealer.hand.cards)

    // Reset hands
    this.player.hand = new BlackjackHand()
    this.dealer.hand = new BlackjackHand()
    this.player.isStanding = false
    this.dealer.isStanding = false

    // Shuffle deck
    this.deck.shuffle()

    // Deal initial cards
    this.player.hand.addCard(this.getCard())
    this.dealer.hand.addCard(this.getCard())
    this.player.hand.addCard(this.getCard())
    this.dealer.hand.addCard(this.getCard())

    this.state = 'playing'
    this.render()
  }

  private placeBet(amount: number): void {
    if (amount > 0 && amount <= this.player.chips) {
      this.player.bet = amount
      this.startNewGame()
    } else {
      alert('Invalid bet amount')
    }
  }

  private updateChips(): void {
    const result = this.getGameResult()
    if (result.winner === 'player') {
      if (this.player.hand.isBlackjack()) {
        this.player.chips += Math.floor(this.player.bet * 1.5) // 3:2 payout
      } else {
        this.player.chips += this.player.bet
      }
    } else if (result.winner === 'tie') {
      // Bet stays
    } else {
      this.player.chips -= this.player.bet
    }
    this.player.bet = 0
  }

  private playerHit(): void {
    if (this.state !== 'playing') return

    this.drawSound.play()
    this.player.hand.addCard(this.getCard())
    if (this.player.hand.isBust()) {
      this.state = 'game-over'
    }
    this.render()
  }

  private playerStand(): void {
    if (this.state !== 'playing') return

    this.player.isStanding = true
    this.state = 'dealer-turn'
    this.dealerTurn()
  }

  private dealerTurn(): void {
    if (this.dealer.hand.getScore() < 17) {
      setTimeout(() => {
        this.drawSound.play()
        this.dealer.hand.addCard(this.getCard())
        this.render()
        this.dealerTurn() // Recursive call
      }, 1000) // 1 second delay for suspense
    } else {
      this.dealer.isStanding = true
      this.state = 'game-over'
      this.render()
    }
  }

  private getGameResult(): GameResult {
    const playerScore = this.player.hand.getScore()
    const dealerScore = this.dealer.hand.getScore()
    const playerBust = this.player.hand.isBust()
    const dealerBust = this.dealer.hand.isBust()
    const playerBlackjack = this.player.hand.isBlackjack()
    const dealerBlackjack = this.dealer.hand.isBlackjack()

    if (playerBlackjack && dealerBlackjack) {
      return { winner: 'tie', message: 'Both have Blackjack! Push!' }
    }
    if (playerBlackjack) {
      return { winner: 'player', message: 'Blackjack! You win!' }
    }
    if (dealerBlackjack) {
      return { winner: 'dealer', message: 'Dealer has Blackjack! You lose!' }
    }
    if (playerBust) {
      return { winner: 'dealer', message: 'Bust! You lose!' }
    }
    if (dealerBust) {
      return { winner: 'player', message: 'Dealer busts! You win!' }
    }
    if (playerScore > dealerScore) {
      return { winner: 'player', message: 'You win!' }
    }
    if (dealerScore > playerScore) {
      return { winner: 'dealer', message: 'Dealer wins!' }
    }
    return { winner: 'tie', message: 'Push!' }
  }

  private render(): void {
    this.appElement.innerHTML = `
      <div class="game">
        <div class="left-side">
          <h1>Blackjack</h1>
          <div class="chips">Chips: $${this.player.chips}</div>
          <div class="dealer">
            <h2>Dealer</h2>
            <div class="dealer-area">
            <div class="deck">
              <div class="card back" style="position: absolute; z-index: 1; transform: translate(4px, 4px);"></div>
              <div class="card back" style="position: absolute; z-index: 2; transform: translate(2px, 2px);"></div>
              <div class="card back" style="position: absolute; z-index: 3;"></div>
            </div>
              <div class="hand">
                ${this.renderHand(this.dealer.hand, this.state !== 'game-over' && this.state !== 'dealer-turn')}
              </div>
            </div>
            <div class="score">Score: ${this.state === 'game-over' || this.state === 'dealer-turn' ? this.dealer.hand.getScore() : '?'}</div>
          </div>
          <div class="player">
            <h2>Player</h2>
            <div class="hand">
              ${this.renderHand(this.player.hand, false)}
            </div>
            <div class="score">Score: ${this.player.hand.getScore()}</div>
            <div class="bet">Bet: $${this.player.bet}</div>
          </div>
          <div class="controls">
            ${this.renderControls()}
          </div>
          <div class="message">${this.state === 'game-over' ? this.getGameResult().message : ''}</div>
        </div>
        <div class="discard">
          ${this.renderDiscard()}
        </div>
      </div>
    `

    // Add event listeners
    this.addEventListeners()
  }

  private renderHand(hand: BlackjackHand, hideSecondCard: boolean): string {
    return hand.cards.map((card, index) => {
      if (hideSecondCard && index === 1) {
        return `<div class="card back"></div>`
      }
      const colorClass = (card.suit === 'hearts' || card.suit === 'diamonds') ? 'red' : 'black'
      const isNew = index === hand.cards.length - 1
      const animateClass = isNew ? 'new-card' : ''
      return `<div class="card ${colorClass} ${animateClass}">
        <div class="top">
          <div class="rank">${card.rank}</div>
          <div class="suit-small">${this.getSuitSymbol(card.suit)}</div>
        </div>
        <div class="center">${this.getSuitSymbol(card.suit)}</div>
        <div class="bottom">
          <div class="rank">${card.rank}</div>
          <div class="suit-small">${this.getSuitSymbol(card.suit)}</div>
        </div>
      </div>`
    }).join('')
  }

  private renderDiscard(): string {
    if (this.discard.length === 0) return ''
    const stackSize = Math.min(this.discard.length, 5) // Show up to 5 cards in stack
    return Array.from({ length: stackSize }, (_, i) => {
      const zIndex = i + 1
      const offset = i * 2
      return `<div class="card back" style="position: absolute; z-index: ${zIndex}; transform: translate(${offset}px, ${offset}px);"></div>`
    }).join('')
  }

  private getSuitSymbol(suit: string): string {
    const symbols = {
      hearts: '♥',
      diamonds: '♦',
      clubs: '♣',
      spades: '♠'
    }
    return symbols[suit as keyof typeof symbols] || suit
  }

  private renderControls(): string {
    if (this.state === 'betting') {
      return `
        <input type="number" id="bet-amount" min="1" max="${this.player.chips}" value="10" step="10">
        <button id="place-bet">Place Bet</button>
      `
    }
    if (this.state === 'playing') {
      return `
        <button id="hit">Hit</button>
        <button id="stand">Stand</button>
      `
    }
    if (this.state === 'game-over') {
      return `<button id="new-game">New Game</button>`
    }
    return ''
  }

  private addEventListeners(): void {
    const placeBetBtn = document.getElementById('place-bet') as HTMLButtonElement
    const betAmountInput = document.getElementById('bet-amount') as HTMLInputElement
    const hitBtn = document.getElementById('hit')
    const standBtn = document.getElementById('stand')
    const newGameBtn = document.getElementById('new-game')

    placeBetBtn?.addEventListener('click', () => {
      const amount = parseInt(betAmountInput.value)
      this.placeBet(amount)
    })
    hitBtn?.addEventListener('click', () => this.playerHit())
    standBtn?.addEventListener('click', () => this.playerStand())
    newGameBtn?.addEventListener('click', () => {
      this.updateChips()
      this.state = 'betting'
      this.render()
    })
  }
}