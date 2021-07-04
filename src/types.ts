export interface Player {
    account: string;
    number: number;
}

export interface History {
    id: number;
    pot: string;
    distribution: string;
    winning_number: number;
    time_played: number;
    players: Player[];
    winners: string[];
}