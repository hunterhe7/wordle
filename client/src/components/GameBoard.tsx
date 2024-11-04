import React from 'react';
import GameRow from './GameRow';
import { CellStatus } from '../types/types';
import { GAME_CONFIG } from '../config/gameConfig';
import styles from '../styles/GameBoard.module.css';

interface GameBoardProps {
    guesses: string[];
    evaluations: CellStatus[][];
    currentGuess: string;
    currentRow: number;
}

const GameBoard: React.FC<GameBoardProps> = ({
    guesses, 
    evaluations, 
    currentGuess, 
}) => {
    const safeGuesses = Array.isArray(guesses) ? guesses : [];
    const safeEvaluations = Array.isArray(evaluations) ? evaluations : [];
    
    const remainingRows = Math.max(0, GAME_CONFIG.MAX_GUESSES - safeGuesses.length - 1);
    const emptyRows = Array(remainingRows).fill('');

    return (
        <div className={styles.board}>
            {safeGuesses.map((guess, i) => (
                <GameRow 
                    key={i} 
                    word={guess} 
                    evaluation={safeEvaluations[i] || null}
                    submitted={true} 
                />
            ))}
            {safeGuesses.length < GAME_CONFIG.MAX_GUESSES && (
                <GameRow 
                    key="current"
                    word={currentGuess || ''} 
                    evaluation={null}
                    submitted={false} 
                />
            )}
            {emptyRows.map((_, i) => (
                <GameRow 
                    key={`empty-${i}`} 
                    word="" 
                    evaluation={null}
                    submitted={false} 
                />
            ))}
        </div>
    );
};

export default GameBoard; 