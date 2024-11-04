import React from 'react';
import { KeyboardProps } from '../types/types';
import { GAME_CONFIG } from '../config/gameConfig';
import styles from '../styles/Keyboard.module.css';

const Keyboard: React.FC<KeyboardProps> = ({ onKey, letterStatuses, disabled = false }) => {
    return (
        <div className={styles.keyboard}>
            {GAME_CONFIG.KEYBOARD_ROWS.map((row, i) => (
                <div key={i} className={styles.row}>
                    {row.map(key => (
                        <button
                            key={key}
                            className={`${styles.key} 
                                ${letterStatuses[key] ? styles[letterStatuses[key]] : ''} 
                                ${key.length > 1 ? styles.wide : ''}`}
                            onClick={() => !disabled && onKey(key)}
                            disabled={disabled}
                        >
                            {key}
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Keyboard; 