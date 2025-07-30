import { PokemonAPI } from '../pokemon-api';

describe('PokemonAPI', () => {
    it('should fetch a specific Pokemon', async () => {
        try {
            const pikachu = await PokemonAPI.getPokemon('pikachu');
            expect(pikachu).toBeDefined();
            expect(pikachu.name).toBe('pikachu');
            expect(pikachu.types).toBeDefined();
            expect(pikachu.types.length).toBeGreaterThan(0);
        } catch (error) {
            console.error('Error fetching Pokemon:', error);
            fail('Failed to fetch Pokemon data');
        }
    });

    it('should fetch Pokemon types', async () => {
        try {
            const types = await PokemonAPI.getTypes();
            expect(types).toBeDefined();
            expect(types.length).toBeGreaterThan(0);
            expect(types).toContain('electric');
        } catch (error) {
            console.error('Error fetching types:', error);
            fail('Failed to fetch Pokemon types');
        }
    });

    it('should fetch Pokemon by type', async () => {
        try {
            const electricPokemon = await PokemonAPI.getPokemonByType('electric');
            expect(electricPokemon).toBeDefined();
            expect(electricPokemon.length).toBeGreaterThan(0);
            // Verify at least one Pokemon is electric
            const hasElectricType = electricPokemon.some(pokemon => 
                pokemon.types.some(type => type.type.name === 'electric')
            );
            expect(hasElectricType).toBe(true);
        } catch (error) {
            console.error('Error fetching Pokemon by type:', error);
            fail('Failed to fetch Pokemon by type');
        }
    });
});
