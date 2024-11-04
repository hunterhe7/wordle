import React, { useState } from 'react';
import styles from '../styles/RoomControls.module.css';

interface RoomControlsProps {
    onCreateRoom: () => void;
    onJoinRoom: (roomId: string) => void;
}

const RoomControls: React.FC<RoomControlsProps> = ({
    onCreateRoom,
    onJoinRoom,
}) => {
    const [joinRoomId, setJoinRoomId] = useState('');

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        e.stopPropagation();
    };

    return (
        <div className={styles.container}>
            <>
                <button 
                    className={styles.button}
                    onClick={onCreateRoom}
                >
                    Create Room
                </button>
                <div className={styles.joinContainer}>
                    <input
                        type="text"
                        value={joinRoomId}
                        onChange={(e) => setJoinRoomId(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter Room ID"
                        className={styles.input}
                    />
                    <button 
                        className={styles.button}
                        onClick={() => onJoinRoom(joinRoomId)}
                    >
                        Join Room
                    </button>
                </div>
            </>
        </div>
    );
};

export default RoomControls;