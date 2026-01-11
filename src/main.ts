// Main entry point for the blackjack game
import './styles.css'
import { BlackjackGame } from './game'

const app = document.getElementById('app')!
const game = new BlackjackGame(app)
game.init()