export class Config {
  private static instance: Config;
  private constructor() {
    // Load environment variables
    // In a real application, this would be handled by dotenv
  }

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  // Pokemon API configuration
  public get pokemonApiBaseUrl(): string {
    return 'https://pokeapi.co/api/v2/';
  }

  // Rate limiting configuration
  public get maxRequestsPerMinute(): number {
    return 60; // Default rate limit
  }
}
