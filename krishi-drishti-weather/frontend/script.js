document.addEventListener('DOMContentLoaded', () => {
    const advisoryForm = document.getElementById('advisoryForm');
    const latitudeInput = document.getElementById('latitude');
    const longitudeInput = document.getElementById('longitude');
    const submitBtn = document.getElementById('submitBtn');

    const loadingContainer = document.getElementById('loadingContainer');
    const loadingStatusText = document.getElementById('loadingStatusText');
    const errorContainer = document.getElementById('errorContainer');
    const errorMessage = document.getElementById('errorMessage');
    const dashboard = document.getElementById('dashboard');

    // API URL - default local FastAPI backend port
    const API_BASE_URL = 'http://localhost:8000';

    advisoryForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const lat = parseFloat(latitudeInput.value);
        const lon = parseFloat(longitudeInput.value);

        if (isNaN(lat) || isNaN(lon)) {
            showError('Please enter valid numeric latitude and longitude coordinates.');
            return;
        }

        // 1. Reset & Start Loading State
        hideError();
        hideDashboard();
        showLoading('Fetching live weather...');

        // Transition loading text after 700ms to demonstrate execution pipeline
        const statusTimer = setTimeout(() => {
            loadingStatusText.textContent = 'Analyzing agricultural conditions...';
        }, 700);

        try {
            const url = `${API_BASE_URL}/api/advisory?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}`;
            const response = await fetch(url);

            clearTimeout(statusTimer);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const detail = errorData.detail || `HTTP Error ${response.status}`;
                throw new Error(detail);
            }

            const data = await response.json();

            // 2. Populate UI with API response
            renderDashboard(data);

            // 3. Hide loading & display dashboard
            hideLoading();
            showDashboard();

        } catch (err) {
            clearTimeout(statusTimer);
            hideLoading();
            console.error('Fetch error:', err);
            showError('Unable to fetch weather data. Please check the backend connection and try again.');
        }
    });

    function showLoading(initialMessage) {
        loadingStatusText.textContent = initialMessage;
        loadingContainer.classList.remove('hidden');
        submitBtn.disabled = true;
    }

    function hideLoading() {
        loadingContainer.classList.add('hidden');
        submitBtn.disabled = false;
    }

    function showError(msg) {
        errorMessage.textContent = msg;
        errorContainer.classList.remove('hidden');
    }

    function hideError() {
        errorContainer.classList.add('hidden');
    }

    function showDashboard() {
        dashboard.classList.remove('hidden');
    }

    function hideDashboard() {
        dashboard.classList.add('hidden');
    }

    function setBadge(elementId, priorityText) {
        const badge = document.getElementById(elementId);
        if (!badge) return;

        const prio = (priorityText || 'LOW').toUpperCase();
        badge.textContent = prio;

        // Reset badge classes
        badge.className = 'badge';
        switch (prio) {
            case 'CRITICAL':
                badge.classList.add('badge-critical');
                break;
            case 'HIGH':
                badge.classList.add('badge-high');
                break;
            case 'MEDIUM':
                badge.classList.add('badge-medium');
                break;
            case 'LOW':
            default:
                badge.classList.add('badge-low');
                break;
        }
    }

    function populateList(listId, items) {
        const listEl = document.getElementById(listId);
        if (!listEl) return;

        listEl.innerHTML = '';
        if (Array.isArray(items) && items.length > 0) {
            items.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                listEl.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = 'None';
            listEl.appendChild(li);
        }
    }

    function renderDashboard(data) {
        const weather = data.weather || {};
        const advisory = data.advisory || {};

        // 1. Weather Summary
        document.getElementById('tempVal').textContent = weather.temperature !== undefined ? `${weather.temperature} °C` : '-- °C';
        document.getElementById('rainVal').textContent = weather.rainfall_24h !== undefined ? `${weather.rainfall_24h} mm` : '-- mm';
        document.getElementById('probVal').textContent = weather.rain_probability !== undefined ? `${weather.rain_probability} %` : '-- %';
        document.getElementById('humidityVal').textContent = weather.humidity !== undefined ? `${weather.humidity} %` : '-- %';
        document.getElementById('windVal').textContent = weather.wind_speed !== undefined ? `${weather.wind_speed} km/h` : '-- km/h';

        // 2. Irrigation Card
        const irr = advisory.irrigation || {};
        document.getElementById('irrigationAction').textContent = irr.action || '--';
        document.getElementById('irrigationReason').textContent = irr.reason || '--';
        setBadge('irrigationPriority', irr.priority);

        // 3. Fertilizer Card
        const fert = advisory.fertilizer || {};
        document.getElementById('fertilizerAction').textContent = fert.action || '--';
        document.getElementById('fertilizerReason').textContent = fert.reason || '--';
        setBadge('fertilizerPriority', fert.priority);

        // 4. Spraying Card
        const spray = advisory.spraying || {};
        document.getElementById('sprayingAction').textContent = spray.action || '--';
        document.getElementById('sprayingReason').textContent = spray.reason || '--';
        setBadge('sprayingPriority', spray.priority);

        // 5. Heat Stress Card
        const heat = advisory.heat || {};
        document.getElementById('heatStatus').textContent = heat.status || '--';
        document.getElementById('heatReason').textContent = heat.reason || '--';
        setBadge('heatPriority', heat.priority);
        populateList('heatRecommendationsList', heat.recommendations);

        // 6. Disease Risk Card
        const disease = advisory.disease || {};
        document.getElementById('diseaseRisk').textContent = disease.risk || '--';
        document.getElementById('diseaseReason').textContent = disease.reason || '--';
        setBadge('diseasePriority', disease.priority);
        populateList('diseaseRecommendationsList', disease.recommendations);

        // 7. Metadata timestamp
        const genAt = data.generated_at ? new Date(data.generated_at).toLocaleString() : new Date().toLocaleString();
        document.getElementById('generatedAt').textContent = genAt;
    }
});
