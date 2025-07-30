"use strict";
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
exports.PokemonService = void 0;
const axios_1 = __importDefault(require("axios"));
class PokemonService {
    constructor(config) {
        this.config = config;
        // Initialize axios with base URL and default config
        this.axiosInstance = axios_1.default.create({
            baseURL: this.config.pokemonApiBaseUrl,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
    /**
     * Get Pokemon data by name
     * @param name Pokemon name (case-insensitive)
     * @returns Promise containing Pokemon data
     * @throws Error if Pokemon not found or API error
     */
    getPokemon(name) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                // Validate input
                if (!name) {
                    throw new Error('Pokemon name is required');
                }
                // Make API call
                const response = yield this.axiosInstance.get(`pokemon/${name.toLowerCase()}`);
                // Transform response data
                const pokemon = this.transformPokemonResponse(response.data);
                return pokemon;
            }
            catch (error) {
                if (axios_1.default.isAxiosError(error)) {
                    // Handle API-specific errors
                    if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 404) {
                        throw new Error(`Pokemon ${name} not found`);
                    }
                    throw new Error(`API Error: ${error.message}`);
                }
                // For non-Axios errors, convert to Error if it isn't already
                if (error instanceof Error) {
                    throw error;
                }
                // Handle case where error is not an Error object
                throw new Error(`Unknown error occurred: ${String(error)}`);
            }
        });
    }
    /**
     * Transform raw API response into our Pokemon model
     * @param data Raw API response data
     * @returns Transformed Pokemon object
     */
    transformPokemonResponse(data) {
        return {
            id: data.id,
            name: data.name,
            height: data.height,
            weight: data.weight,
            baseExperience: data.base_experience,
            types: data.types.map((type) => type.type.name),
            abilities: data.abilities.map((ability) => ability.ability.name),
            stats: data.stats.map((stat) => ({
                name: stat.stat.name,
                baseStat: stat.base_stat,
                effort: stat.effort
            })),
            sprites: {
                frontDefault: data.sprites.front_default,
                backDefault: data.sprites.back_default,
                frontShiny: data.sprites.front_shiny,
                backShiny: data.sprites.back_shiny
            }
        };
    }
}
exports.PokemonService = PokemonService;
