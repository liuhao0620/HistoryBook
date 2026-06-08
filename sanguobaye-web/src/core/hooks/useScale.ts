import { useGameStore } from '../state/useGameStore';

export const useScale = () => {
    const resolution = useGameStore(state => state.resolution);
    return resolution.width / 1920;
};