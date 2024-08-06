type Speed = number;        // seconds
type Experience = number;    // 1 to 10 points
type Difficulty = number;    // ? to ?? points

interface Character {
    speed: Speed,
    experience: Experience
}

interface GameLevel {
    targetDifficulty: Difficulty,
    questionsNumber: number,
    
}