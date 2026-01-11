# Blackjack Game

A fully functional blackjack game built with TypeScript and Vite for the browser. Features casino-style gameplay with betting, animations, sound effects, and realistic card handling.

## Features

- **Complete Blackjack Rules**: Standard 21-point game with dealer standing on 17+
- **Betting System**: Place bets with chip tracking and payout calculations
- **Realistic Cards**: Authentic playing card design with proper suits, ranks, and inverted corners
- **Smooth Animations**: Cards slide in from the deck, dealer draws with suspenseful delays
- **Sound Effects**: Audio feedback for card draws and round endings
- **Casino Styling**: Dark green felt table with gold accents
- **Infinite Gameplay**: Automatic deck reshuffling when cards run out
- **Responsive Layout**: Fixed-size game area with proper card positioning

## Technologies Used

- **TypeScript**: Type-safe game logic
- **Vite**: Fast development and build tool
- **CSS**: Casino-themed styling with animations

## Sound Effects

Add the following audio files to `public/sounds/`:
- `draw.mp3`: Sound played when cards are drawn
- `gather.mp3`: Sound played at the end of each round

You can find free sound effects online or create your own. The files should be MP3 format.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Deployment

This project is configured for Vercel deployment. Simply connect your GitHub repository to Vercel for automatic deployments.

## Gameplay

1. Place your bet amount
2. Click "Start Game" to deal initial cards
3. Choose to "Hit" (draw a card) or "Stand" (end turn)
4. Dealer plays automatically after you stand
5. Win/lose based on standard blackjack rules
6. Play again with updated chip count

## Rules

- **Blackjack**: Ace + 10/J/Q/K = 21 (pays 3:2)
- **Regular Win**: Higher score than dealer (pays 1:1)
- **Push**: Tie with dealer (bet returned)
- **Bust**: Over 21 (lose bet)
- **Dealer**: Must hit on 16, stand on 17+