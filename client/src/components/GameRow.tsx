import React from 'react';
import { CellStatus } from '../types/types';
import styles from '../styles/GameBoard.module.css';
import { GAME_CONFIG } from '../config/gameConfig';

interface GameRowProps {
    word: string;
    evaluation: CellStatus[] | null;
    submitted: boolean;
}

const GameRow: React.FC<GameRowProps> = ({ word, evaluation, submitted }) => {
    const tiles = Array(GAME_CONFIG.WORD_LENGTH).fill('').map((_, i) => word[i] || '');

    return (
        <div className={styles.row}>
            {tiles.map((letter, i) => (
                <div 
                    key={i} 
                    className={`${styles.tile} 
                        ${letter ? styles.filled : ''} 
                        ${submitted && evaluation ? styles[evaluation[i]] : ''}`}
                >
                    {letter}
                </div>
            ))}
        </div>
    );
};

export default GameRow; 