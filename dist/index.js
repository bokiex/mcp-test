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
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const pokemon_service_1 = require("./services/pokemon.service");
const config_1 = require("./config/config");
const pokemon_api_1 = require("./mcp/pokemon-api");
// Initialize configuration
const config = config_1.Config.getInstance();
// Initialize Pokemon Service
const pokemonService = new pokemon_service_1.PokemonService(config);
// Create Express app
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Serve static files from the src/public directory
app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'src', 'public')));
// API info route
app.get('/api', (req, res) => {
    res.json({
        status: 'Pokemon MCP is running',
        version: '1.0.0',
        endpoints: {
            pokemon: '/api/pokemon/{name}',
            types: '/api/types/{type}',
            moves: '/api/moves/{move}'
        }
    });
});
// Root route - serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '..', 'src', 'public', 'index.html'));
});
// Natural language search endpoint
app.get('/api/pokemon/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { types, characteristics, query } = req.query;
        // Parse query parameters
        const typesList = types ? String(types).split(',') : [];
        const characteristicsList = characteristics ? String(characteristics).split(',') : [];
        let results = [];
        // If types are specified, search by type
        if (typesList.length > 0) {
            // For each type, get Pokémon of that type
            for (const type of typesList) {
                try {
                    // Ensure type is a string before using it
                    const typeStr = String(type).toLowerCase();
                    console.log(`Searching for Pokémon of type: ${typeStr}`);
                    const pokemonOfType = yield pokemon_api_1.PokemonAPI.getPokemonByType(typeStr);
                    results = [...results, ...pokemonOfType];
                }
                catch (error) {
                    console.error(`Error fetching Pokémon of type ${type}:`, error);
                }
            }
            // Filter by characteristics if specified
            if (characteristicsList.length > 0) {
                results = results.filter(pokemon => {
                    // This is a simple implementation - in a real app, you'd have more sophisticated matching
                    const pokemonName = pokemon.name.toLowerCase();
                    return characteristicsList.some(char => {
                        // Map characteristics to Pokémon names or descriptions
                        switch (char.toLowerCase()) {
                            case 'rat':
                            case 'mouse':
                                return pokemonName.includes('rat') || pokemonName.includes('chu') ||
                                    pokemonName === 'rattata' || pokemonName === 'raticate' ||
                                    pokemonName === 'pikachu' || pokemonName === 'raichu' ||
                                    pokemonName === 'dedenne';
                            case 'cat':
                                return pokemonName.includes('meo') || pokemonName.includes('persian') ||
                                    pokemonName.includes('purr') || pokemonName.includes('espe') ||
                                    pokemonName.includes('umbr') || pokemonName === 'skitty' ||
                                    pokemonName === 'delcatty' || pokemonName === 'glameow' ||
                                    pokemonName === 'purugly' || pokemonName === 'litten';
                            case 'dog':
                            case 'wolf':
                                return pokemonName.includes('dog') || pokemonName.includes('pup') ||
                                    pokemonName.includes('growl') || pokemonName.includes('arca') ||
                                    pokemonName === 'houndour' || pokemonName === 'houndoom' ||
                                    pokemonName === 'poochyena' || pokemonName === 'mightyena' ||
                                    pokemonName === 'rockruff' || pokemonName === 'lycanroc';
                            case 'bird':
                            case 'flying':
                                return pokemon.types.includes('Flying') ||
                                    pokemonName.includes('bird') || pokemonName.includes('pidg') ||
                                    pokemonName.includes('spear') || pokemonName.includes('fear') ||
                                    pokemonName.includes('wing');
                            case 'dragon':
                                return pokemon.types.includes('Dragon') ||
                                    pokemonName.includes('dragon') || pokemonName.includes('dratini') ||
                                    pokemonName.includes('dragonair') || pokemonName.includes('dragonite');
                            default:
                                return false;
                        }
                    });
                });
            }
        }
        else if (query) {
            // If no types but query is specified, do a simple search
            // In a real app, you'd implement more sophisticated search
            const allTypes = yield pokemon_api_1.PokemonAPI.getTypes();
            results = [];
            // Try to find Pokémon matching the query
            for (const type of allTypes) {
                try {
                    // Ensure type is a string before using it
                    const typeStr = String(type).toLowerCase();
                    console.log(`Searching for Pokémon of type: ${typeStr}`);
                    const pokemonOfType = yield pokemon_api_1.PokemonAPI.getPokemonByType(typeStr);
                    const matchingPokemon = pokemonOfType.filter(p => p.name.toLowerCase().includes(query.toString().toLowerCase()));
                    results = [...results, ...matchingPokemon];
                }
                catch (error) {
                    console.error(`Error fetching Pokémon of type ${type}:`, error);
                    // Continue with next type if one fails
                }
            }
        }
        else {
            // If no parameters, return a default set of popular Pokémon
            const defaultPokemon = ['pikachu', 'charizard', 'bulbasaur', 'squirtle', 'eevee'];
            for (const name of defaultPokemon) {
                try {
                    const pokemon = yield pokemon_api_1.PokemonAPI.getPokemon(name);
                    results.push(pokemon);
                }
                catch (error) {
                    console.error(`Error fetching Pokémon ${name}:`, error);
                }
            }
        }
        // Remove duplicates by ID
        const uniqueResults = Array.from(new Map(results.map(item => [item.id, item])).values());
        // Limit results to prevent overwhelming the frontend
        const limitedResults = uniqueResults.slice(0, 10);
        res.json(limitedResults);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ error: errorMessage });
    }
}));
// Individual Pokemon route - must come after the search route
app.get('/api/pokemon/:name', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pokemon = yield pokemonService.getPokemon(req.params.name);
        res.json(pokemon);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ error: errorMessage });
    }
}));
// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
