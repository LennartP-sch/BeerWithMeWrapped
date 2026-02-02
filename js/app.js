/**
 * Main Application - Beer With Me Wrapped
 * Handles file upload, data management, and UI updates
 */

(function () {
    'use strict';

    // State
    let rawData = [];
    let processedData = [];
    let currentRange = 'all';

    // DOM Elements
    const fileInput = document.getElementById('fileInput');
    const uploadSection = document.getElementById('uploadSection');
    const mainContent = document.getElementById('mainContent');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const particlesContainer = document.getElementById('particles');

    /**
     * Initialize the application
     */
    function init() {
        // Setup file input
        fileInput.addEventListener('change', handleFileUpload);

        // Setup drag and drop
        setupDragDrop();

        // Setup filter buttons
        setupFilterButtons();

        // Create particles
        createParticles();

        // Check for sample data (for demo purposes)
        loadSampleDataIfNeeded();
    }

    /**
     * Handle file upload
     */
    function handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.name.endsWith('.json')) {
            alert('Please upload a JSON file');
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                rawData = JSON.parse(e.target.result);
                processedData = DataProcessor.parseData(rawData);
                showMainContent();
                updateUI();
            } catch (error) {
                console.error('Error parsing JSON:', error);
                alert('Error parsing JSON file. Please make sure it\'s a valid Beer With Me export.');
            }
        };
        reader.readAsText(file);
    }

    /**
     * Setup drag and drop
     */
    function setupDragDrop() {
        const uploadCard = document.querySelector('.upload-card');

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(event => {
            uploadCard.addEventListener(event, preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(event => {
            uploadCard.addEventListener(event, () => {
                uploadCard.style.borderColor = 'var(--gold-primary)';
                uploadCard.style.transform = 'translateY(-8px)';
            }, false);
        });

        ['dragleave', 'drop'].forEach(event => {
            uploadCard.addEventListener(event, () => {
                uploadCard.style.borderColor = '';
                uploadCard.style.transform = '';
            }, false);
        });

        uploadCard.addEventListener('drop', handleDrop, false);
    }

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length > 0) {
            fileInput.files = files;
            handleFileUpload({ target: { files } });
        }
    }

    /**
     * Setup filter buttons
     */
    function setupFilterButtons() {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Update range and refresh
                currentRange = btn.dataset.range;
                updateUI();
            });
        });
    }

    /**
     * Show main content and hide upload section
     */
    function showMainContent() {
        uploadSection.style.display = 'none';
        mainContent.style.display = 'block';

        // Animate sections in
        const sections = mainContent.querySelectorAll('.chart-section, .hero-stats, .fun-facts');
        sections.forEach((section, index) => {
            section.style.animationDelay = `${index * 0.1}s`;
            section.classList.add('animate-in');
        });
    }

    /**
     * Update all UI elements
     */
    function updateUI() {
        const filteredData = DataProcessor.filterByRange(processedData, currentRange);

        // Update stats
        updateStats(filteredData);

        // Update charts
        Charts.updateAll(filteredData);

        // Update fun facts
        updateFunFacts(filteredData);
    }

    /**
     * Update hero statistics
     */
    function updateStats(data) {
        const stats = DataProcessor.getBasicStats(data);

        // Animate counter
        animateCounter('totalDrinks', stats.totalDrinks);
        animateCounter('totalCountries', stats.totalCountries);
        animateCounter('totalLocations', stats.totalLocations);

        // Update favorite drink
        document.getElementById('favoriteDrink').textContent = stats.favoriteDrink;
        document.getElementById('favoriteDrinkIcon').textContent =
            DataProcessor.getEmoji(stats.favoriteDrink);
    }

    /**
     * Update fun facts section
     */
    function updateFunFacts(data) {
        const facts = DataProcessor.getFunFacts(data);

        animateCounter('maxDrinksDay', facts.maxDrinksDay);
        animateCounter('longestStreak', facts.longestStreak);

        document.getElementById('avgPerWeek').textContent = facts.avgPerWeek;
        document.getElementById('peakHour').textContent = facts.peakHour;
    }

    /**
     * Animate a counter element
     */
    function animateCounter(elementId, targetValue) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const startValue = parseInt(element.textContent) || 0;
        const duration = 1000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);

            const currentValue = Math.round(startValue + (targetValue - startValue) * easeOutQuart);
            element.textContent = currentValue;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.classList.add('counter-animate');
                setTimeout(() => element.classList.remove('counter-animate'), 300);
            }
        }

        requestAnimationFrame(update);
    }

    /**
     * Create floating particles
     */
    function createParticles() {
        const particleCount = 20;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 8}s`;
            particle.style.animationDuration = `${6 + Math.random() * 4}s`;
            particlesContainer.appendChild(particle);
        }
    }

    /**
     * Load sample data if available (for demo/testing)
     */
    async function loadSampleDataIfNeeded() {
        // Check if we're in a demo context or have sample data
        try {
            const response = await fetch('history_all.json');
            if (response.ok) {
                // Sample data exists, we could auto-load it
                // For now, just leave the upload option
                console.log('Sample data available at history_all.json');
            }
        } catch (e) {
            // No sample data, that's fine
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
