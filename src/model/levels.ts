export interface Level {
    id: number,
    status: 'HIDDEN' | 'CURRENT' | 'DEFEATED',
    background: string,
    rivalAvatar: string,
}

export function getLevels(): Level[] {
    return [
        { id: 0, status: 'CURRENT', background: 'forest1', rivalAvatar: 'dog' },
        { id: 1, status: 'HIDDEN', background: 'sunflowers1', rivalAvatar: 'snail' },
        { id: 2, status: 'HIDDEN', background: 'river1', rivalAvatar: 'elephant' },
        { id: 3, status: 'HIDDEN', background: 'waterfall1', rivalAvatar: 'fish' },
        { id: 4, status: 'HIDDEN', background: 'forest2', rivalAvatar: 'monkey' },
        { id: 5, status: 'HIDDEN', background: 'school1', rivalAvatar: 'cat' },
        { id: 6, status: 'HIDDEN', background: 'volcano2', rivalAvatar: 'rock' },
        { id: 7, status: 'HIDDEN', background: 'sky1', rivalAvatar: 'eagle' },
        { id: 8, status: 'HIDDEN', background: 'rome1', rivalAvatar: 'tiger' },
        { id: 9, status: 'HIDDEN', background: 'castle1', rivalAvatar: 'mage' },
    ];
}