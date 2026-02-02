/**
 * Charts Configuration for Beer With Me Wrapped
 * Uses Chart.js for beautiful, responsive charts
 */

const Charts = {
    instances: {},

    // Chart.js global defaults
    initDefaults() {
        Chart.defaults.font.family = "'Inter', sans-serif";
        Chart.defaults.color = 'rgba(255, 255, 255, 0.7)';
        Chart.defaults.responsive = true;
        Chart.defaults.maintainAspectRatio = false;

        // Animation defaults
        Chart.defaults.animation = {
            duration: 800,
            easing: 'easeOutQuart'
        };
    },

    /**
     * Create Timeline Chart (Drinks over time by type)
     */
    createTimelineChart(ctx, data) {
        if (this.instances.timeline) {
            this.instances.timeline.destroy();
        }

        this.instances.timeline = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: data.datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            pointStyle: 'circle',
                            padding: 15,
                            font: {
                                size: 11
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(26, 26, 26, 0.95)',
                        titleColor: '#FFF8E7',
                        bodyColor: 'rgba(255, 255, 255, 0.8)',
                        borderColor: 'rgba(245, 166, 35, 0.3)',
                        borderWidth: 1,
                        cornerRadius: 8,
                        padding: 12,
                        displayColors: true,
                        usePointStyle: true
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45,
                            font: {
                                size: 10
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            stepSize: 5,
                            font: {
                                size: 10
                            }
                        }
                    }
                }
            }
        });

        return this.instances.timeline;
    },

    /**
     * Create Distribution Donut Chart
     */
    createDistributionChart(ctx, data) {
        if (this.instances.distribution) {
            this.instances.distribution.destroy();
        }

        this.instances.distribution = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.values,
                    backgroundColor: data.colors,
                    borderColor: '#1A1A1A',
                    borderWidth: 2,
                    hoverBorderColor: '#FFF8E7',
                    hoverBorderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                    legend: {
                        display: false // We'll use custom legend
                    },
                    tooltip: {
                        backgroundColor: 'rgba(26, 26, 26, 0.95)',
                        titleColor: '#FFF8E7',
                        bodyColor: 'rgba(255, 255, 255, 0.8)',
                        borderColor: 'rgba(245, 166, 35, 0.3)',
                        borderWidth: 1,
                        cornerRadius: 8,
                        padding: 12,
                        callbacks: {
                            label: function (context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.raw / total) * 100).toFixed(1);
                                return `${context.label}: ${context.raw} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });

        return this.instances.distribution;
    },

    /**
     * Create Monthly Activity Bar Chart
     */
    createMonthlyChart(ctx, data) {
        if (this.instances.monthly) {
            this.instances.monthly.destroy();
        }

        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, 250);
        gradient.addColorStop(0, 'rgba(245, 166, 35, 0.8)');
        gradient.addColorStop(1, 'rgba(200, 123, 21, 0.3)');

        this.instances.monthly = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Drinks',
                    data: data.values,
                    backgroundColor: gradient,
                    borderColor: '#F5A623',
                    borderWidth: 1,
                    borderRadius: 4,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(26, 26, 26, 0.95)',
                        titleColor: '#FFF8E7',
                        bodyColor: 'rgba(255, 255, 255, 0.8)',
                        borderColor: 'rgba(245, 166, 35, 0.3)',
                        borderWidth: 1,
                        cornerRadius: 8,
                        padding: 12
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            maxRotation: 45,
                            minRotation: 45,
                            font: {
                                size: 9
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            font: {
                                size: 10
                            }
                        }
                    }
                }
            }
        });

        return this.instances.monthly;
    },

    /**
     * Create Heatmap (day x hour)
     */
    createHeatmap(container, data) {
        container.innerHTML = '';

        const heatmap = document.createElement('div');
        heatmap.className = 'heatmap';

        // Header row with hours
        heatmap.appendChild(document.createElement('div')); // Empty corner
        for (let h = 0; h < 24; h += 2) {
            const header = document.createElement('div');
            header.className = 'heatmap-header';
            header.textContent = h;
            heatmap.appendChild(header);
        }

        // Day rows
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const dayMapping = { 'Mon': 'Mon', 'Tue': 'Tue', 'Wed': 'Wed', 'Thu': 'Thu', 'Fri': 'Fri', 'Sat': 'Sat', 'Sun': 'Sun' };

        days.forEach(day => {
            // Day label
            const label = document.createElement('div');
            label.className = 'heatmap-label';
            label.textContent = day;
            heatmap.appendChild(label);

            // Hour cells (show every 2 hours to fit mobile)
            for (let h = 0; h < 24; h += 2) {
                const cell = document.createElement('div');
                cell.className = 'heatmap-cell';

                // Sum 2 hours together
                const count = (data.patterns[day][h] || 0) + (data.patterns[day][h + 1] || 0);

                // Calculate level (1-5)
                const level = data.max > 0 ? Math.min(5, Math.ceil((count / data.max) * 5)) : 0;
                if (level > 0) {
                    cell.setAttribute('data-level', level);
                }

                cell.title = `${day} ${h}:00-${h + 2}:00: ${count} drinks`;
                heatmap.appendChild(cell);
            }
        });

        container.appendChild(heatmap);
    },

    /**
     * Create custom legend for donut chart
     */
    createDistributionLegend(container, data) {
        container.innerHTML = '';

        const maxItems = 8; // Limit legend items
        const items = data.labels.slice(0, maxItems);

        items.forEach((label, i) => {
            const item = document.createElement('div');
            item.className = 'legend-item';

            const color = document.createElement('div');
            color.className = 'legend-color';
            color.style.backgroundColor = data.colors[i];

            const text = document.createElement('span');
            text.textContent = label;

            item.appendChild(color);
            item.appendChild(text);
            container.appendChild(item);
        });

        if (data.labels.length > maxItems) {
            const more = document.createElement('div');
            more.className = 'legend-item';
            more.innerHTML = `<span>+${data.labels.length - maxItems} more</span>`;
            container.appendChild(more);
        }
    },

    /**
     * Create locations list
     */
    createLocationsList(container, locations) {
        container.innerHTML = '';

        if (locations.length === 0) {
            container.innerHTML = '<p style="color: var(--text-muted); text-align: center;">No location data available</p>';
            return;
        }

        locations.forEach(loc => {
            const item = document.createElement('div');
            item.className = 'location-item';
            item.innerHTML = `
                <span class="location-rank">#${loc.rank}</span>
                <div class="location-info">
                    <div class="location-name">${loc.name}</div>
                    <div class="location-count">${loc.count} drinks</div>
                </div>
                <div class="location-bar">
                    <div class="location-bar-fill" style="width: ${loc.percentage}%"></div>
                </div>
            `;
            container.appendChild(item);
        });
    },

    /**
     * Create Day of Week Bar Chart
     */
    createDayOfWeekChart(ctx, data) {
        if (this.instances.dayOfWeek) {
            this.instances.dayOfWeek.destroy();
        }

        this.instances.dayOfWeek = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels.map(d => d.substring(0, 3)),
                datasets: [{
                    label: 'Drinks',
                    data: data.values,
                    backgroundColor: data.colors,
                    borderColor: '#F5A623',
                    borderWidth: 1,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(26, 26, 26, 0.95)',
                        titleColor: '#FFF8E7',
                        bodyColor: 'rgba(255, 255, 255, 0.8)',
                        borderColor: 'rgba(245, 166, 35, 0.3)',
                        borderWidth: 1,
                        cornerRadius: 8,
                        padding: 12
                    }
                },
                scales: {
                    x: { grid: { display: false } },
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.05)' }
                    }
                }
            }
        });

        return this.instances.dayOfWeek;
    },

    /**
     * Create Hourly Area Chart
     */
    createHourlyChart(ctx, data) {
        if (this.instances.hourly) {
            this.instances.hourly.destroy();
        }

        const gradient = ctx.createLinearGradient(0, 0, 0, 250);
        gradient.addColorStop(0, 'rgba(245, 166, 35, 0.6)');
        gradient.addColorStop(1, 'rgba(245, 166, 35, 0.05)');

        this.instances.hourly = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels.map(l => l.replace(':00', 'h')),
                datasets: [{
                    label: 'Drinks',
                    data: data.values,
                    borderColor: '#F5A623',
                    backgroundColor: gradient,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 2,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(26, 26, 26, 0.95)',
                        titleColor: '#FFF8E7',
                        bodyColor: 'rgba(255, 255, 255, 0.8)',
                        borderColor: 'rgba(245, 166, 35, 0.3)',
                        borderWidth: 1,
                        cornerRadius: 8,
                        padding: 12
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { maxTicksLimit: 12, font: { size: 9 } }
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.05)' }
                    }
                }
            }
        });

        return this.instances.hourly;
    },

    /**
     * Create Country Horizontal Bar Chart
     */
    createCountryChart(ctx, data) {
        if (this.instances.country) {
            this.instances.country.destroy();
        }

        this.instances.country = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Drinks',
                    data: data.values,
                    backgroundColor: 'rgba(245, 166, 35, 0.7)',
                    borderColor: '#F5A623',
                    borderWidth: 1,
                    borderRadius: 4
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(26, 26, 26, 0.95)',
                        titleColor: '#FFF8E7',
                        bodyColor: 'rgba(255, 255, 255, 0.8)',
                        borderColor: 'rgba(245, 166, 35, 0.3)',
                        borderWidth: 1,
                        cornerRadius: 8,
                        padding: 12
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.05)' }
                    },
                    y: {
                        grid: { display: false },
                        ticks: { font: { size: 10 } }
                    }
                }
            }
        });

        return this.instances.country;
    },

    /**
     * Create Session Size Bar Chart
     */
    createSessionChart(ctx, data) {
        if (this.instances.session) {
            this.instances.session.destroy();
        }

        const gradient = ctx.createLinearGradient(0, 0, 0, 250);
        gradient.addColorStop(0, 'rgba(155, 89, 182, 0.8)');
        gradient.addColorStop(1, 'rgba(155, 89, 182, 0.3)');

        this.instances.session = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels.map(l => l + ' drink' + (l === '1' ? '' : 's')),
                datasets: [{
                    label: 'Sessions',
                    data: data.values,
                    backgroundColor: gradient,
                    borderColor: '#9B59B6',
                    borderWidth: 1,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(26, 26, 26, 0.95)',
                        titleColor: '#FFF8E7',
                        bodyColor: 'rgba(255, 255, 255, 0.8)',
                        borderColor: 'rgba(155, 89, 182, 0.3)',
                        borderWidth: 1,
                        cornerRadius: 8,
                        padding: 12
                    }
                },
                scales: {
                    x: { grid: { display: false } },
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.05)' }
                    }
                }
            }
        });

        return this.instances.session;
    },

    /**
     * Create Year Comparison Line Chart
     */
    createYearComparisonChart(ctx, data) {
        if (this.instances.yearComparison) {
            this.instances.yearComparison.destroy();
        }

        this.instances.yearComparison = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: data.datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            pointStyle: 'circle',
                            padding: 15,
                            font: { size: 11 }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(26, 26, 26, 0.95)',
                        titleColor: '#FFF8E7',
                        bodyColor: 'rgba(255, 255, 255, 0.8)',
                        borderColor: 'rgba(245, 166, 35, 0.3)',
                        borderWidth: 1,
                        cornerRadius: 8,
                        padding: 12
                    }
                },
                scales: {
                    x: { grid: { color: 'rgba(255, 255, 255, 0.05)' } },
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.05)' }
                    }
                }
            }
        });

        return this.instances.yearComparison;
    },

    /**
     * Update all charts with new data
     */
    updateAll(data) {
        const timelineData = DataProcessor.getTimelineData(data);
        const distributionData = DataProcessor.getDrinkDistribution(data);
        const monthlyData = DataProcessor.getMonthlyActivity(data);
        const patternsData = DataProcessor.getDrinkingPatterns(data);
        const locations = DataProcessor.getTopLocations(data);
        const dayOfWeekData = DataProcessor.getDayOfWeekData(data);
        const hourlyData = DataProcessor.getHourlyData(data);
        const countryData = DataProcessor.getCountryData(data);
        const sessionData = DataProcessor.getSessionData(data);
        const yearData = DataProcessor.getYearComparison(data);

        // Timeline (Cumulative)
        const timelineCtx = document.getElementById('timelineChart');
        if (timelineCtx) {
            this.createTimelineChart(timelineCtx.getContext('2d'), timelineData);
        }

        // Distribution
        const distributionCtx = document.getElementById('distributionChart');
        const legendContainer = document.getElementById('distributionLegend');
        if (distributionCtx) {
            this.createDistributionChart(distributionCtx.getContext('2d'), distributionData);
            this.createDistributionLegend(legendContainer, distributionData);
        }

        // Day of Week
        const dayOfWeekCtx = document.getElementById('dayOfWeekChart');
        if (dayOfWeekCtx) {
            this.createDayOfWeekChart(dayOfWeekCtx.getContext('2d'), dayOfWeekData);
        }

        // Hourly
        const hourlyCtx = document.getElementById('hourlyChart');
        if (hourlyCtx) {
            this.createHourlyChart(hourlyCtx.getContext('2d'), hourlyData);
        }

        // Heatmap
        const heatmapContainer = document.getElementById('heatmapContainer');
        if (heatmapContainer) {
            this.createHeatmap(heatmapContainer, patternsData);
        }

        // Countries
        const countryCtx = document.getElementById('countryChart');
        if (countryCtx) {
            this.createCountryChart(countryCtx.getContext('2d'), countryData);
        }

        // Sessions
        const sessionCtx = document.getElementById('sessionChart');
        if (sessionCtx) {
            this.createSessionChart(sessionCtx.getContext('2d'), sessionData);
        }

        // Year Comparison
        const yearCtx = document.getElementById('yearComparisonChart');
        if (yearCtx) {
            this.createYearComparisonChart(yearCtx.getContext('2d'), yearData);
        }

        // Monthly
        const monthlyCtx = document.getElementById('monthlyChart');
        if (monthlyCtx) {
            this.createMonthlyChart(monthlyCtx.getContext('2d'), monthlyData);
        }

        // Locations
        const locationsContainer = document.getElementById('locationsList');
        if (locationsContainer) {
            this.createLocationsList(locationsContainer, locations);
        }
    },

    /**
     * Destroy all chart instances
     */
    destroyAll() {
        Object.values(this.instances).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        this.instances = {}
    }
};

// Initialize defaults
Charts.initDefaults();

// Export for use in other files
window.Charts = Charts;
