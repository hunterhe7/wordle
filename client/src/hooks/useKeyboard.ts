import { useEffect, useCallback } from 'react';

interface KeyboardProps {
    onInput: (letter: string) => void;
    onEnter: () => void;
    onBackspace: () => void;
    disabled?: boolean;
}

export const useKeyboard = ({
    onInput,
    onEnter,
    onBackspace,
    disabled = false
}: KeyboardProps) => {
    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (disabled) return;

        const key = event.key.toUpperCase();

        if (event.key === 'Enter') {
            event.preventDefault();
            onEnter();
            return;
        }

        if (event.key === 'Backspace') {
            event.preventDefault();
            onBackspace();
            return;
        }

        if (/^[A-Z]$/.test(key)) {
            event.preventDefault();
            onInput(key);
        }
    }, [onInput, onEnter, onBackspace, disabled]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    return {
        handleKey: useCallback((key: string) => {
            if (disabled) return;
            
            if (key === 'ENTER') {
                onEnter();
            } else if (key === 'BACKSPACE') {
                onBackspace();
            } else if (/^[A-Z]$/.test(key)) {
                onInput(key);
            }
        }, [onInput, onEnter, onBackspace, disabled])
    };
}; 