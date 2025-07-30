/**
 * MCP Inspector Test Utility
 * 
 * This script helps test the Pokemon MCP implementation with the MCP Inspector tool.
 * It provides a simple command-line interface to interact with the MCP server.
 */

const http = require('http');

// MCP Server URL
const MCP_SERVER_URL = 'http://localhost:3001';

// Function to make a request to the MCP server
async function mcpRequest(path) {
  return new Promise((resolve, reject) => {
    http.get(`${MCP_SERVER_URL}${path}`, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (error) {
          reject(new Error(`Failed to parse JSON: ${error.message}`));
        }
      });
    }).on('error', (error) => {
      reject(new Error(`Request failed: ${error.message}`));
    });
  });
}

// Main function
async function main() {
  try {
    // Test MCP server info
    console.log('Testing MCP Server Info:');
    const serverInfo = await mcpRequest('/');
    console.log(JSON.stringify(serverInfo, null, 2));
    console.log('\n');
    
    // Test getting Pokemon types
    console.log('Testing Pokemon Types:');
    const types = await mcpRequest('/types');
    console.log(JSON.stringify(types.slice(0, 5), null, 2)); // Show first 5 types
    console.log(`... and ${types.length - 5} more types`);
    console.log('\n');
    
    // Test getting Pokemon by name
    console.log('Testing Get Pokemon by Name:');
    const pokemon = await mcpRequest('/pokemon/pikachu');
    console.log(JSON.stringify(pokemon, null, 2));
    console.log('\n');
    
    // Test getting Pokemon by type
    console.log('Testing Get Pokemon by Type:');
    const electricPokemon = await mcpRequest('/pokemon-by-type/electric');
    console.log(`Found ${electricPokemon.length} electric Pokemon`);
    console.log(JSON.stringify(electricPokemon.slice(0, 2), null, 2)); // Show first 2 Pokemon
    console.log(`... and ${electricPokemon.length - 2} more electric Pokemon`);
    
    console.log('\nAll tests completed successfully!');
    console.log('\nTo use with MCP Inspector:');
    console.log('1. Open the MCP Inspector at https://modelcontextprotocol.io/legacy/tools/inspector');
    console.log('2. Use the "Inspecting locally developed servers" section');
    console.log('3. Connect to http://localhost:3001');
    console.log('4. Explore the available resources: pokemon, types, and pokemon-by-type');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the main function
main();
