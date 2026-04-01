const searchInput = document.getElementById('search-input');
const breachesContainer = document.getElementById('breaches-container');
const loadingIndicator = document.getElementById('loading');
let breachesData = [];
async function fetchBreaches() {
    try {
        loadingIndicator.style.display = 'block';
        const response = await fetch('https://haveibeenpwned.com/api/v3/breaches');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        breachesData = data.sort((a, b) => a.Title.localeCompare(b.Title));
        loadingIndicator.style.display = 'none';
        renderBreaches(breachesData);
    } catch (error) {
        console.error("Could not fetch breaches:", error);
        loadingIndicator.style.display = 'none';
        breachesContainer.innerHTML = '<p style="color: red; text-align: center;">Failed to load data. Please try again later.</p>';
    }
}
function renderBreaches(data) {
    breachesContainer.innerHTML = ''; 
    
    if (data.length === 0) {
        breachesContainer.innerHTML = '<p style="text-align: center; color: #a8cddb;">No breaches found.</p>';
        return;
    }
    data.forEach(breach => {
        const card = document.createElement('div');
        card.className = 'breach-card';
        card.innerHTML = `
            <div class="card-header">
                <img src="${breach.LogoPath}" alt="${breach.Title} Logo" class="breach-logo" onerror="this.onerror=null; this.src='logo.png';">
                <div class="card-title">
                    <h3>${breach.Title}</h3>
                    <span>${breach.Domain || 'N/A'}</span>
                </div>
            </div>
            <div class="card-body">
                <p><strong>Breach Date:</strong> ${breach.BreachDate}</p>
                <p><strong>Accounts Compromised:</strong> ${breach.PwnCount.toLocaleString()}</p>
                <div class="description">${breach.Description}</div>
            </div>
        `;
        breachesContainer.appendChild(card);
    });
}
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    
    const filteredData = breachesData.filter(breach => 
        breach.Title.toLowerCase().includes(searchTerm)
    );
    
    renderBreaches(filteredData);
});
fetchBreaches();
