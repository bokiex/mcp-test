import axios, { AxiosError, AxiosResponse, AxiosInstance } from 'axios';
import { Config } from '../config/config';
import { Pokemon } from '../models/pokemon';

export class PokemonService {
  private config: Config;
  private readonly axiosInstance: AxiosInstance;

  constructor(config: Config) {
    this.config = config;
    // Initialize axios with base URL and default config
    this.axiosInstance = axios.create({
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
  public async getPokemon(name: string): Promise<Pokemon> {
    try {
      // Validate input
      if (!name) {
        throw new Error('Pokemon name is required');
      }

      // Make API call
      const response = await this.axiosInstance.get<Pokemon>(`pokemon/${name.toLowerCase()}`);
      
      // Transform response data
      const pokemon = this.transformPokemonResponse(response.data);
      
      return pokemon;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // Handle API-specific errors
        if (error.response?.status === 404) {
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
  }

  /**
   * Transform raw API response into our Pokemon model
   * @param data Raw API response data
   * @returns Transformed Pokemon object
   */
  private transformPokemonResponse(data: any): Pokemon {
    return {
      id: data.id,
      name: data.name,
      height: data.height,
      weight: data.weight,
      baseExperience: data.base_experience,
      types: data.types.map((type: any) => type.type.name),
      abilities: data.abilities.map((ability: any) => ability.ability.name),
      stats: data.stats.map((stat: any) => ({
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
