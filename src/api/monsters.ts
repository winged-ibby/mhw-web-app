import type { Monster } from "../types/types";

export default async function getMonsters(): Promise<Monster[]> {
    const response = await fetch('http://localhost:3001/monsters');
    if (!response.ok) {
        throw new Error('Failed to fetch monsters data from API.');
    } 
    
    return response.json() as Promise<Monster[]>
}