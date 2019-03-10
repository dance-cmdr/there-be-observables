
import { Momentum, apply } from './momentum';

describe('apply', () => {
    it('should add momentum a to b', () => {
        const a: Momentum = {x: 1, y: 1}
        const b: Momentum = {x: 2, y: 2}
        const expectation: Momentum = {x: 3, y: 3};

        expect(apply(a, b)).toEqual(expectation);

    });
});