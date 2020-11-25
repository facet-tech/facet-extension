import { useEffect } from 'react';

// @Depracated this is buggy, do not use
export default function useEffectAsync(effect, inputs) {
    useEffect(() => {
        effect();
    }, inputs);
}