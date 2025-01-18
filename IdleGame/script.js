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
    startPlayerAttacks(); // Start player's attack timer
    startEnemyAttacks();  // Start enemy's attack timer
}
//Logs
function logMessage(message) {
    battleLogEl.innerHTML += `<p>${message}</p>`;
    battleLogEl.scrollTop = battleLogEl.scrollHeight; // Auto-scroll
}

// Helper to start player's attacks
function startPlayerAttacks() {
    const form = player.forms[player.currentForm];
    const attackInterval = form.speed * 1000; // Convert speed to milliseconds

    player.attackInterval = setInterval(() => {
        if (enemy && enemy.health > 0) {
            const damage = Math.floor(Math.random() * (form.maxDamage - form.minDamage + 1)) + form.minDamage;
            enemy.health -= damage;
            logMessage(`You attack ${enemy.name} with ${form.name} for ${damage} damage!`);
            enemyHealthEl.textContent = Math.max(enemy.health, 0); // Update enemy health display

            // Check if the enemy is defeated
            if (enemy.health <= 0) {
                logMessage(`${enemy.name} is defeated!`);
                clearInterval(player.attackInterval); // Stop player's attacks
                clearInterval(enemy.attackInterval); // Stop enemy's attacks
                enemy = null;
                battleButton.disabled = false; // Re-enable the battle button
                logMessage('Click "Start Battle" to fight the next enemy.');
            }
        }
    }, attackInterval);
}

// Helper to start enemy's attacks
function startEnemyAttacks() {
    const attackInterval = 2000; // Enemy attacks every 2 seconds (adjust as needed)

    enemy.attackInterval = setInterval(() => {
        if (enemy && player.health > 0) {
            const damage = Math.floor(Math.random() * (enemy.baseDamage + 5 - enemy.baseDamage + 1)) + enemy.baseDamage;
            player.health -= damage;
            updatePlayerHealth(); // Update player's health display
            logMessage(`${enemy.name} attacks you for ${damage} damage!`);

            // Check if the player is defeated
            if (player.health <= 0) {
                logMessage('You have been defeated!');
                clearInterval(player.attackInterval); // Stop player's attacks
                clearInterval(enemy.attackInterval); // Stop enemy's attacks
                battleButton.disabled = true; // Keep battle button disabled
            }
        }
    }, attackInterval);
}

// Helper to update player's health
function updatePlayerHealth() {
    playerHealthEl.textContent = Math.max(player.health, 0); // Prevent negative health display
}
    
//Event Listeners
locationButtons.forEach(button => {
    button.addEventListener('click', () => loadEnemiesForLocation(button.dataset.location));
});

battleButton.addEventListener('click', startBattle);
