document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const questionInput = document.getElementById('question-input');
    const searchButton = document.getElementById('search-button');
    const resultsArea = document.getElementById('results-area');
    const exampleQuestions = document.querySelectorAll('.examples li');
    
    // Event Listeners
    searchButton.addEventListener('click', handleSearch);
    questionInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    
    // Add click event to example questions
    exampleQuestions.forEach(example => {
        example.addEventListener('click', () => {
            questionInput.value = example.textContent;
            handleSearch();
        });
    });
    
    // Main search handler
    async function handleSearch() {
        const question = questionInput.value.trim();
        if (!question) return;
        
        // Show loading state
        resultsArea.innerHTML = '<div class="loading">Searching for Pokémon...</div>';
        
        try {
            // Parse the natural language query
            const queryParams = parseNaturalLanguage(question);
            
            // Fetch results from the API
            const results = await fetchPokemonData(queryParams);
            
            // Display results
            displayResults(results);
        } catch (error) {
            resultsArea.innerHTML = `<div class="error">${error.message}</div>`;
        }
    }
    
    // Parse natural language using compromise
    function parseNaturalLanguage(question) {
        // Initialize the query parameters
        const queryParams = {
            types: [],
            characteristics: []
        };
        
        // Load compromise with the numbers plugin
        const nlp = window.nlp;
        
        // Parse the question
        const doc = nlp(question.toLowerCase());
        
        // Extract Pokémon types
        const pokemonTypes = [
            'normal', 'fire', 'water', 'electric', 'grass', 'ice', 
            'fighting', 'poison', 'ground', 'flying', 'psychic', 
            'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
        ];
        
        // Look for type mentions
        pokemonTypes.forEach(type => {
            if (doc.has(type)) {
                queryParams.types.push(type);
            }
        });
        
        // Extract characteristics (animals, attributes, etc.)
        const characteristics = [
            'rat', 'mouse', 'cat', 'dog', 'bird', 'fish', 'dragon', 
            'plant', 'tree', 'flower', 'insect', 'bug', 'snake', 
            'lizard', 'turtle', 'frog', 'monkey', 'ape', 'fox', 
            'wolf', 'bear', 'rabbit', 'bat', 'ghost', 'dinosaur'
        ];
        
        characteristics.forEach(char => {
            if (doc.has(char)) {
                queryParams.characteristics.push(char);
            }
        });
        
        // If no specific parameters were found, use the whole question for semantic search
        if (queryParams.types.length === 0 && queryParams.characteristics.length === 0) {
            queryParams.query = question;
        }
        
        return queryParams;
    }
    
    // Fetch Pokémon data from the API
    async function fetchPokemonData(queryParams) {
        // Build the API endpoint based on the query parameters
        let endpoint = '/api/pokemon/search';
        
        // Convert query params to URL search params
        const searchParams = new URLSearchParams();
        
        if (queryParams.types.length > 0) {
            searchParams.append('types', queryParams.types.join(','));
        }
        
        if (queryParams.characteristics.length > 0) {
            searchParams.append('characteristics', queryParams.characteristics.join(','));
        }
        
        if (queryParams.query) {
            searchParams.append('query', queryParams.query);
        }
        
        // Append search params to endpoint
        const queryString = searchParams.toString();
        if (queryString) {
            endpoint += `?${queryString}`;
        }
        
        // Make the API request
        const response = await fetch(endpoint);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch Pokémon data');
        }
        
        return response.json();
    }
    
    // Display results in the UI
    function displayResults(results) {
        if (!results || results.length === 0) {
            resultsArea.innerHTML = '<p>No Pokémon found matching your query.</p>';
            return;
        }
        
        let html = '';
        
        results.forEach(pokemon => {
            const typeHtml = pokemon.types.map(type => 
                `<span class="pokemon-type ${type}">${type}</span>`
            ).join('');
            
            html += `
                <div class="pokemon-card">
                    <img class="pokemon-image" src="${pokemon.sprites.frontDefault}" alt="${pokemon.name}" />
                    <div class="pokemon-info">
                        <div class="pokemon-name">${capitalizeFirstLetter(pokemon.name)} (#${pokemon.id})</div>
                        <div class="pokemon-types">${typeHtml}</div>
                        <div>Height: ${pokemon.height / 10}m</div>
                        <div>Weight: ${pokemon.weight / 10}kg</div>
                    </div>
                </div>
            `;
        });
        
        resultsArea.innerHTML = html;
    }
    
    // Helper function to capitalize the first letter of a string
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
});
