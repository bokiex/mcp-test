"use strict";
/**
 * MCP Pokemon API Integration
 *
 * This module provides a simple interface to communicate with the Pokemon API
 * using TypeScript for type safety and error handling.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PokemonAPI = void 0;
const axios_1 = __importDefault(require("axios"));
class PokemonAPI {
    /**
     * Fetches a Pokemon by name or ID
     * @param identifier Pokemon name or ID
     * @returns Promise containing Pokemon data
     */
    static getPokemon(identifier) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(`${this.BASE_URL}/pokemon/${identifier}`);
                return response.data;
            }
            catch (error) {
                if (axios_1.default.isAxiosError(error)) {
                    throw new Error(`Failed to fetch Pokemon: ${error.message}`);
                }
                throw new Error(`Failed to fetch Pokemon: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        });
    }
    /**
     * Fetches Pokemon types
     * @returns Promise containing array of Pokemon types
     */
    static getTypes() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(`${this.BASE_URL}/type`);
                return response.data.results.map((type) => type.name);
            }
            catch (error) {
                if (axios_1.default.isAxiosError(error)) {
                    throw new Error(`Failed to fetch Pokemon types: ${error.message}`);
                }
                throw new Error(`Failed to fetch Pokemon types: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        });
    }
    /**
     * Fetches Pokemon by type
     * @param typeName Type name to filter by
     * @returns Promise containing array of Pokemon matching the type
     */
    static getPokemonByType(typeName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(`${this.BASE_URL}/type/${typeName}`);
                return Promise.all(response.data.pokemon.map((pokemon) => this.getPokemon(pokemon.pokemon.name)));
            }
            catch (error) {
                throw new Error(`Failed to fetch Pokemon by type ${typeName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        });
    }
}
exports.PokemonAPI = PokemonAPI;
PokemonAPI.BASE_URL = 'https://pokeapi.co/api/v2';
// Example usage:
function example() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Get a specific Pokemon
            const pikachu = yield PokemonAPI.getPokemon('pikachu');
            console.log('Pikachu:', pikachu);
            // Get all Pokemon types
            const types = yield PokemonAPI.getTypes();
            console.log('Types:', types);
            // Get Pokemon by type
            const electricPokemon = yield PokemonAPI.getPokemonByType('electric');
            console.log('Electric Pokemon:', electricPokemon);
        }
        catch (error) {
            console.error('Error:', error);
        }
    });
}
