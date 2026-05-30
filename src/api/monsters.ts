import type { Monster } from "../types/types";

export default async function getMonsters(): Promise<Monster[]> {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/monsters`);
    if (!response.ok) {
        throw new Error('Failed to fetch monsters data from API.');
    } 
    
    return response.json() as Promise<Monster[]>
}