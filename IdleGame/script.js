//Variable setup
let enemyPool = [];
let currentLocation = null;
let player = { health: 100 };
let enemy = null;

// DOM Elements
const locationButtons = document.querySelectorAll('.location-button');
const battleButton = document.getElementById('battle-button');
const playerHealthEl = document.getElementById('player-health');
const enemyNameEl = document.getElementById('enemy-name');
const enemyHealthEl = document.getElementById('enemy-health');
const enemyDamageEl = document.getElementById('enemy-damage');
const battleLogEl = document.getElementById('battle-log');

//Load enemies from JSON
function loadEnemiesForLocation(locationName) {
    fetch('enemyData.json')
        .then(response => response.json())
        .then(data => {
            const location = data.locations.find(loc => loc.name === locationName);
            if (!location) {
                console.error(`Location "${locationName}" not found.`);
                return;
            }

            currentLocation = locationName;
            enemyPool = location.enemies;
            console.log(`Enemies loaded for ${locationName}:`, enemyPool);

            // Enable battle button
            battleButton.disabled = false;

            // Update UI
            document.getElementById('explore-menu').style.display = 'none';
            document.getElementById('battle-menu').style.display = 'block';
            logMessage(`You are exploring the ${locationName}. Prepare for battle!`);
        })
        .catch(error => console.error('Error loading enemies:', error));
}
//Battle Function
function startBattle() {
    if (enemyPool.length === 0) {
        logMessage('No enemies found. Choose a location to explore.');
        return;
    }

    // Select a random enemy
    const randomIndex = Math.floor(Math.random() * enemyPool.length);
    enemy = { ...enemyPool[randomIndex] }; // Clone to modify health

    // Update enemy stats in UI
    enemyNameEl.textContent = enemy.name;
    enemyHealthEl.textContent = enemy.baseHealth;
    enemyDamageEl.textContent = `${enemy.baseDamage} - ${enemy.baseDamage + 5}`;

    logMessage(`A wild ${enemy.name} appears!`);
    battleButton.disabled = true;

    // Start attacks (auto or manual, as preferred)

//Logs
function logMessage(message) {
    battleLogEl.innerHTML += `<p>${message}</p>`;
    battleLogEl.scrollTop = battleLogEl.scrollHeight; // Auto-scroll
}

//Event Listeners
locationButtons.forEach(button => {
    button.addEventListener('click', () => loadEnemiesForLocation(button.dataset.location));
});

battleButton.addEventListener('click', startBattle);
