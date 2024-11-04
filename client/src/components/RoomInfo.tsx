import React from 'react';
import { RoomInfoProps } from '../types/types';
import styles from '../styles/RoomInfo.module.css';

const RoomInfo: React.FC<RoomInfoProps> = ({ roomId, players }) => {
    return (
        <div className={styles.container}>
            {roomId && (
                <>
                    <h3>Room ID: {roomId}</h3>
                    <div className={styles.playersList}>
                        <h4>Players:</h4>
                        <ul>
                            {players.map((player) => (
                                <li key={player.id}>
                                    {player.name} {player.isHost && '(Host)'}
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
};

export default RoomInfo; 