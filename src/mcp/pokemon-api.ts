/**
 * MCP Pokemon API Integration
 * 
 * This module provides a simple interface to communicate with the Pokemon API
 * using TypeScript for type safety and error handling.
 */

import axios, { AxiosError } from 'axios';

interface Pokemon {
    id: number;
    name: string;
    height: number;
    weight: number;
    types: Array<{
        type: {
            name: string;
        };
    }>;
}

export class PokemonAPI {
    private static readonly BASE_URL = 'https://pokeapi.co/api/v2';
    
    /**
     * Fetches a Pokemon by name or ID
     * @param identifier Pokemon name or ID
     * @returns Promise containing Pokemon data
     */
    static async getPokemon(identifier: string | number): Promise<Pokemon> {
        try {
            const response = await axios.get<Pokemon>(`${this.BASE_URL}/pokemon/${identifier}`);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                throw new Error(`Failed to fetch Pokemon: ${error.message}`); 
            }
            throw new Error(`Failed to fetch Pokemon: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Fetches Pokemon types
     * @returns Promise containing array of Pokemon types
     */
    static async getTypes(): Promise<string[]> {
        try {
            interface TypeResponse {
                results: Array<{ name: string }>;
            }
            const response = await axios.get<TypeResponse>(`${this.BASE_URL}/type`);
            return response.data.results.map((type) => type.name);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                throw new Error(`Failed to fetch Pokemon types: ${error.message}`);
            }
            throw new Error(`Failed to fetch Pokemon types: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Fetches Pokemon by type
     * @param typeName Type name to filter by
     * @returns Promise containing array of Pokemon matching the type
     */
    static async getPokemonByType(typeName: string): Promise<Pokemon[]> {
        try {
            interface TypeDetailResponse {
                pokemon: Array<{ pokemon: { name: string } }>;
            }
            const response = await axios.get<TypeDetailResponse>(`${this.BASE_URL}/type/${typeName}`);
            return Promise.all(response.data.pokemon.map((pokemon) => 
                this.getPokemon(pokemon.pokemon.name)
            ));
        } catch (error) {
            throw new Error(`Failed to fetch Pokemon by type ${typeName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}

// Example usage:
async function example() {
    try {
        // Get a specific Pokemon
        const pikachu = await PokemonAPI.getPokemon('pikachu');
        console.log('Pikachu:', pikachu);

        // Get all Pokemon types
        const types = await PokemonAPI.getTypes();
        console.log('Types:', types);

        // Get Pokemon by type
        const electricPokemon = await PokemonAPI.getPokemonByType('electric');
        console.log('Electric Pokemon:', electricPokemon);
    } catch (error) {
        console.error('Error:', error);
    }
}
