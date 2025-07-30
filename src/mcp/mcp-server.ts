/**
 * MCP Server Adapter
 * 
 * This module adapts the Pokemon API to the Model Context Protocol
 * for use with the MCP Inspector tool.
 */

import express from 'express';
import cors from 'cors';
import { PokemonAPI } from './pokemon-api';

const app = express();

// Configure CORS with specific options for MCP Inspector
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-MCP-Version', 'X-MCP-Token'],
  exposedHeaders: ['X-MCP-Version', 'X-MCP-Token']
}));

app.use(express.json());

// Add MCP protocol headers to all responses
app.use((req, res, next) => {
  res.header('X-MCP-Version', '1.0.0');
  next();
});

// MCP Server Info
app.get('/', (req, res) => {
  res.json({
    name: 'pokemon-mcp',
    version: '1.0.0',
    description: 'Pokemon MCP Server',
    resources: {
      pokemon: {
        description: 'Get Pokemon by name or ID'
      },
      types: {
        description: 'Get all Pokemon types'
      },
      'pokemon-by-type': {
        description: 'Get Pokemon by type'
      }
    }
  });
});

// Get Pokemon by name or ID
app.get('/pokemon/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    const pokemon = await PokemonAPI.getPokemon(identifier);
    
    // Transform to MCP format
    const transformedPokemon = {
      id: pokemon.id,
      name: pokemon.name,
      height: pokemon.height,
      weight: pokemon.weight,
      types: pokemon.types.map(t => t.type.name)
    };
    
    res.json(transformedPokemon);
  } catch (error) {
    res.status(404).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Get all Pokemon types
app.get('/types', async (req, res) => {
  try {
    const types = await PokemonAPI.getTypes();
    res.json(types);
  } catch (error) {
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Get Pokemon by type
app.get('/pokemon-by-type/:typeName', async (req, res) => {
  try {
    const { typeName } = req.params;
    const typeStr = String(typeName).toLowerCase();
    const pokemon = await PokemonAPI.getPokemonByType(typeStr);
    
    // Transform to MCP format
    const transformedPokemon = pokemon.map(p => ({
      id: p.id,
      name: p.name,
      height: p.height,
      weight: p.weight,
      types: p.types.map(t => t.type.name)
    }));
    
    res.json(transformedPokemon);
  } catch (error) {
    res.status(404).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Start the MCP server on a different port than the main app
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`MCP Server running on port ${PORT}`);
});

export default app;
