// type Speed = number;        // seconds
// type Experience = number;    // 1 to 10 points
// type Difficulty = number;    // ? to ?? points

// interface Character {
//     speed: Speed,
//     experience: Experience
// }
//
// interface GameLevel {
//     targetDifficulty: Difficulty,
//     questionsNumber: number,
//
// }

export interface Question {
    question: string,
    response1: string,
    response2: string,
    response3: string,
    correctResponse: string,
}

export function nextQuestion(): Question {

    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    const correctResponse = a * b;
    const correctResponsePosition = Math.floor(Math.random() * 3) + 1;
    const randomResponse = () => Math.floor(Math.random() * 100) + 1;

    return {
        question: `${a} x ${b}`,
        response1: `${correctResponsePosition === 1 ? correctResponse : randomResponse()}`,
        response2: `${correctResponsePosition === 2 ? correctResponse : randomResponse()}`,
        response3: `${correctResponsePosition === 3 ? correctResponse : randomResponse()}`,
        correctResponse: `${correctResponse}`,
    };
}