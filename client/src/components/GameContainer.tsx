import React from 'react';
import GameBoard from './GameBoard';
import Keyboard from './Keyboard';
import RoomInfo from './RoomInfo';
import { Player, CellStatus } from '../types/types';
import styles from '../styles/GameContainer.module.css';

interface GameContainerProps {
  players: Player[];
  currentPlayerId: string;
  currentGuess: string;
  onKeyPress: (key: string) => void;
  roomId: string;
  isHost: boolean;
  onStartGame: () => void;
  letterStatuses: Record<string, CellStatus>;
}

export const GameContainer: React.FC<GameContainerProps> = ({
  players,
  currentPlayerId,
  currentGuess,
  onKeyPress,
  roomId,
  isHost,
  onStartGame,
  letterStatuses
}) => {
  const currentPlayer = players.find(p => p.id === currentPlayerId);
  const isGameOver = currentPlayer?.gameState.status === 'won' || 
                    currentPlayer?.gameState.status === 'lost' ||
                    players.some(p => p.gameState.status === 'won');
                    
  // Check if game has started
  const isGameStarted = players.some(p => p.gameState.status !== 'waiting');
  // Check if there's a winner or all players lost
  const hasWinner = players.some(p => p.gameState.status === 'won');
  const allLost = players.every(p => p.gameState.status === 'lost');
  const shouldShowRestartButton = isHost && (hasWinner || allLost);

  return (
    <div className={styles.container}>
      <RoomInfo
        roomId={roomId}
        players={players}
        isHost={isHost}
      />
      
      {!isGameStarted ? (
        // Display waiting area when game hasn't started
        <div className={styles.waitingArea}>
          {isHost && players.length > 1 ? (
            <button 
              className={styles.startButton}
              onClick={onStartGame}
            >
              Start Game
            </button>
          ) : (
            <div className={styles.waitingMessage}>
              {players.length <= 1 
                ? "Waiting for other players to join..." 
                : "Waiting for host to start the game..."}
            </div>
          )}
        </div>
      ) : (
        // Display game area when game has started
        <>
          <div className={styles.gameBoards}>
            {players.map(player => (
              <div key={player.id} className={styles.playerBoard}>
                <h3 className={styles.playerName}>
                  {player.name} {player.isHost && '(Host)'}
                  {player.id === currentPlayerId && ' (You)'}
                </h3>
                <GameBoard
                  guesses={player.gameState.guesses}
                  evaluations={player.gameState.evaluations}
                  currentGuess={player.id === currentPlayerId ? currentGuess : ''}
                  currentRow={player.gameState.currentRow}
                />
                {player.gameState.status === 'won' && (
                  <div className={styles.gameStatus}>Winner!</div>
                )}
                {player.gameState.status === 'lost' && (
                  <div className={styles.gameStatus}>Game Over</div>
                )}
              </div>
            ))}
          </div>
          
          {shouldShowRestartButton && (
            <button 
              className={styles.startButton}
              onClick={onStartGame}
            >
              Start New Game
            </button>
          )}
          
          <Keyboard
            onKey={onKeyPress}
            letterStatuses={letterStatuses}
            disabled={isGameOver}
          />
        </>
      )}
    </div>
  );
}; 