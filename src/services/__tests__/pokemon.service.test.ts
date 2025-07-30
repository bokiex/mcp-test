import { PokemonService } from '../pokemon.service';
import { Config } from '../../config/config';
import { Pokemon } from '../../models/pokemon';
import axios from 'axios';

// Mock axios
jest.mock('axios');

const mockAxios = axios as jest.Mocked<typeof axios>;

const mockPokemonResponse = {
  id: 1,
  name: 'bulbasaur',
  height: 7,
  weight: 69,
  base_experience: 64,
  types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
  abilities: [{ ability: { name: 'overgrow' } }],
  stats: [
    { stat: { name: 'hp' }, base_stat: 45, effort: 0 },
    { stat: { name: 'attack' }, base_stat: 49, effort: 0 }
  ],
  sprites: {
    front_default: 'https://example.com/bulbasaur.png',
    back_default: 'https://example.com/bulbasaur-back.png',
    front_shiny: 'https://example.com/bulbasaur-shiny.png',
    back_shiny: 'https://example.com/bulbasaur-back-shiny.png'
  }
};

describe('PokemonService', () => {
  let service: PokemonService;
  let config: Config;

  beforeEach(() => {
    config = Config.getInstance();
    service = new PokemonService(config);
    mockAxios.create.mockReturnValue({
      get: jest.fn()
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getPokemon', () => {
    it('should return Pokemon data when API call succeeds', async () => {
      // Arrange
      mockAxios.create().get.mockResolvedValue({
        data: mockPokemonResponse
      });

      // Act
      const result = await service.getPokemon('bulbasaur');

      // Assert
      expect(result).toEqual({
        id: 1,
        name: 'bulbasaur',
        height: 7,
        weight: 69,
        baseExperience: 64,
        types: ['grass', 'poison'],
        abilities: ['overgrow'],
        stats: [
          { name: 'hp', baseStat: 45, effort: 0 },
          { name: 'attack', baseStat: 49, effort: 0 }
        ],
        sprites: {
          frontDefault: 'https://example.com/bulbasaur.png',
          backDefault: 'https://example.com/bulbasaur-back.png',
          frontShiny: 'https://example.com/bulbasaur-shiny.png',
          backShiny: 'https://example.com/bulbasaur-back-shiny.png'
        }
      });
    });

    it('should throw error when Pokemon not found', async () => {
      // Arrange
      mockAxios.create().get.mockRejectedValue({
        response: {
          status: 404
        }
      });

      // Act & Assert
      await expect(service.getPokemon('nonexistent')).rejects.toThrow('Pokemon nonexistent not found');
    });

    it('should throw error when API returns invalid data', async () => {
      // Arrange
      mockAxios.create().get.mockResolvedValue({
        data: {} // Invalid response
      });

      // Act & Assert
      await expect(service.getPokemon('bulbasaur')).rejects.toThrow();
    });

    it('should throw error when name is empty', async () => {
      // Act & Assert
      await expect(service.getPokemon('')).rejects.toThrow('Pokemon name is required');
    });
  });
});
