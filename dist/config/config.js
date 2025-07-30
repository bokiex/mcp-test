"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
class Config {
    constructor() {
        // Load environment variables
        // In a real application, this would be handled by dotenv
    }
    static getInstance() {
        if (!Config.instance) {
            Config.instance = new Config();
        }
        return Config.instance;
    }
    // Pokemon API configuration
    get pokemonApiBaseUrl() {
        return 'https://pokeapi.co/api/v2/';
    }
    // Rate limiting configuration
    get maxRequestsPerMinute() {
        return 60; // Default rate limit
    }
}
exports.Config = Config;
