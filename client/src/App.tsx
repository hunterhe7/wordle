import React, { useState, useEffect } from 'react';
import { GameContainer } from './components/GameContainer';
import RoomControls from './components/RoomControls';
import { useGame } from './hooks/useGame';
import { useKeyboard } from './hooks/useKeyboard';
import socket from './services/socket';
import styles from './styles/App.module.css';

const App: React.FC = () => {
    const [message, setMessage] = useState<string>('');
    const [messageType, setMessageType] = useState<'error' | 'success' | 'info'>('info');

    const {
        gameState,
        addLetter,
        removeLetter,
        submitGuess,
        createRoom,
        joinRoom,
        startGame
    } = useGame(socket);

    const { handleKey } = useKeyboard({
        onInput: addLetter,
        onEnter: submitGuess,
        onBackspace: removeLetter,
        disabled: gameState.gameOver
    });

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage('');
            }, 3000); // Clear message after 3 seconds
            return () => clearTimeout(timer);
        }
    }, [message]);

    useEffect(() => {
        if (gameState.roomId) {
            setMessage('');
        }
    }, [gameState.roomId]);

    const handleCreateRoom = () => {
        createRoom();
        setMessage('Creating room...');
        setMessageType('info');
    };

    const handleJoinRoom = (roomId: string) => {
        if (!roomId.trim()) {
            setMessage('Please enter a room ID');
            setMessageType('error');
            return;
        }
        joinRoom(roomId);
        setMessage(`Joining room ${roomId}...`);
        setMessageType('info');
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Multiplayer Wordle</h1>
            
            {message && (
                <div className={`${styles.message} ${styles[messageType]}`}>
                    {message}
                </div>
            )}
            
            {!gameState.roomId ? (
                <RoomControls
                    onCreateRoom={handleCreateRoom}
                    onJoinRoom={handleJoinRoom}
                />
            ) : (
                <GameContainer
                    players={gameState.players}
                    currentPlayerId={socket.id || ''}
                    currentGuess={gameState.currentGuess}
                    onKeyPress={handleKey}
                    roomId={gameState.roomId}
                    isHost={gameState.isHost}
                    onStartGame={startGame}
                    letterStatuses={gameState.letterStatuses}
                />
            )}
        </div>
    );
};

export default App;