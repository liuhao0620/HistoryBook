import { useState, useEffect } from 'react';
import { useGameStore } from '../state/useGameStore';

export const useScale = () => {
    const resolution = useGameStore(state => state.resolution);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const handleResize = () => {
            const scaleX = window.innerWidth / resolution.width;
            const scaleY = window.innerHeight / resolution.height;
            // Use the smaller scale to ensure the game fits in the window without cropping
            setScale(Math.min(scaleX, scaleY));
        };

        handleResize(); // Initial calculation
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [resolution]);

    return scale;
};