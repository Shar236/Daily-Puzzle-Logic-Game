import { SequencePuzzle } from '../types';
import { pseudoRandom } from '../seed';

type SequenceLogic = (n: number, p1: number, p2: number) => number;

const SEQUENCES = [
    { name: 'Arithmetic', gen: (n: number, start: number, diff: number) => start + n * diff },
    { name: 'Geometric', gen: (n: number, start: number, ratio: number) => start * Math.pow(ratio, n) },
    {
        name: 'Fibonacci Variant', gen: (n: number, a: number, b: number) => {
            if (n === 0) return a;
            if (n === 1) return b;
            let x = a, y = b;
            for (let i = 2; i <= n; i++) {
                let temp = x + y;
                x = y;
                y = temp;
            }
            return y;
        }
    },
    { name: 'Squares', gen: (n: number, start: number, offset: number) => Math.pow(n + start, 2) + offset }
];

export const generateSequence = (seed: string): SequencePuzzle => {
    // @ts-ignore
    const rng = pseudoRandom(seed);

    // Pick a sequence type
    const typeIndex = Math.floor(rng() * SEQUENCES.length);
    const type = SEQUENCES[typeIndex];

    // Generate parameters based on rng
    const p1 = Math.floor(rng() * 10) + 1; // start or 'a'
    const p2 = Math.floor(rng() * 5) + 2;  // diff, ratio, 'b', or offset

    const length = 5; // standard length
    const sequence: number[] = [];

    for (let i = 0; i < length; i++) {
        sequence.push(type.gen(i, p1, p2));
    }

    const answer = sequence.pop()!;

    return {
        type: 'sequence_solver',
        difficulty: 'easy', // Could deterimine based on p2 values
        score: 50,
        sequence,
        answer,
        logic: `Sequence follows a ${type.name} pattern.`
    };
};
