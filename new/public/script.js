const API_BASE_URL = 'http://localhost:3000/api';
;
const gamesContainer = document.getElementById('gamesContainer');
const gameTemplate = document.getElementById('gameTemplate');
const platformFilter = document.getElementById('platformFilter');
const sortByFilter = document.getElementById('sortBy');

// Function to fetch giveaways from the GamerPower API
// Updated script.js with enhanced error handling and CORS proxy


async function fetchGiveaways(platform = 'all', sortBy = 'date') {
    try {
        const proxyUrl = `${API_BASE_URL}/giveaways?platform=${platform}&sort-by=${sortBy}`;
        console.log('Fetching from:', proxyUrl);
        const response = await fetch(proxyUrl);
        
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        
        const data = await response.json();
        console.log('Received data:', data);
        return data.data; // Return the array of giveaways directly
    } catch (error) {
        console.error('API Error:', error);
        showErrorMessage(`Service temporarily unavailable. Try refreshing or check back later. (${error.message})`);
        return [];
    }
}


function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        ⚠️ ${message}
        <button onclick="location.reload()">Retry</button>
    `;
    gamesContainer.innerHTML = '';
    gamesContainer.appendChild(errorDiv);
}


// Function to render giveaways in the UI
function renderGiveaways(giveaways) {
    // Convert to array first
    const giveawayArray = Array.from(giveaways || []);
    
    gamesContainer.innerHTML = ''; // Clear existing content

    if (!Array.isArray(giveawayArray)) {
        console.error('Giveaways is not an array:', giveawayArray);
        gamesContainer.innerHTML = '<p>Error: Invalid giveaway data received.</p>';
        return;
    }

    if (giveawayArray.length == 0) {
        gamesContainer.innerHTML = '<p>No giveaways found.</p>';
        return;
    }

    giveawayArray.forEach(giveaway => {
        const gameCard = gameTemplate.content.cloneNode(true);
        
        // Populate game card with data
        gameCard.querySelector('.game-image').src = giveaway.image;
        gameCard.querySelector('.game-title').textContent = giveaway.title;
        gameCard.querySelector('.game-platform').textContent = `Platform: ${giveaway.platform}`;
        gameCard.querySelector('.game-description').textContent = giveaway.description || 'No description available.';
        gameCard.querySelector('.claim-button').href = giveaway.open_giveaway_url;

        gamesContainer.appendChild(gameCard);
    });
}


// Function to handle filtering and sorting
async function filterAndSortGiveaways() {
    const platform = platformFilter.value;
    const sortBy = sortByFilter.value;

    // Show loading indicator
    gamesContainer.innerHTML = '<p>Loading giveaways...</p>';

    const giveaways = await fetchGiveaways(platform, sortBy);
    renderGiveaways(giveaways);
}

// Event listeners for filters
platformFilter.addEventListener('change', filterAndSortGiveaways);
sortByFilter.addEventListener('change', filterAndSortGiveaways);

// Initial load of giveaways
filterAndSortGiveaways();
