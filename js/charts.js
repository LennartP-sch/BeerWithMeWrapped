/**
 * Charts for Beer With Me Wrapped
 * Uses Chart.js for beautiful, responsive charts
 */

var Charts = {
    instances: {},

    initDefaults: function () {
        Chart.defaults.font.family = "'Inter', sans-serif";
        Chart.defaults.color = 'rgba(255, 255, 255, 0.7)';
        Chart.defaults.responsive = true;
        Chart.defaults.maintainAspectRatio = false;
        Chart.defaults.animation = {
            duration: 800,
            easing: 'easeOutQuart'
        };
    },

    createTimelineChart: function (ctx, data) {
        var self = this;
        if (self.instances.timeline) {
            self.instances.timeline.destroy();
        }

        self.instances.timeline = new Chart(ctx, {
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
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { maxRotation: 45, minRotation: 45, font: { size: 10 } }
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.05)' }
                    }
                }
            }
        });

        return self.instances.timeline;
    },

    createDistributionChart: function (ctx, data) {
        var self = this;
        if (self.instances.distribution) {
            self.instances.distribution.destroy();
        }

        self.instances.distribution = new Chart(ctx, {
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
                    legend: { display: false },
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
                                var total = context.dataset.data.reduce(function (a, b) { return a + b; }, 0);
                                var percentage = ((context.raw / total) * 100).toFixed(1);
                                return context.label + ': ' + context.raw + ' (' + percentage + '%)';
                            }
                        }
                    }
                }
            }
        });

        return self.instances.distribution;
    },

    createMonthlyChart: function (ctx, data) {
        var self = this;
        if (self.instances.monthly) {
            self.instances.monthly.destroy();
        }

        var gradient = ctx.createLinearGradient(0, 0, 0, 250);
        gradient.addColorStop(0, 'rgba(245, 166, 35, 0.8)');
        gradient.addColorStop(1, 'rgba(200, 123, 21, 0.3)');

        self.instances.monthly = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Drinks',
                    data: data.values,
                    backgroundColor: gradient,
                    borderColor: '#F5A623',
                    borderWidth: 1,
                    borderRadius: 4
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
                        ticks: { maxRotation: 45, minRotation: 45, font: { size: 9 } }
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.05)' }
                    }
                }
            }
        });

        return self.instances.monthly;
    },

    createDayOfWeekChart: function (ctx, data) {
        var self = this;
        if (self.instances.dayOfWeek) {
            self.instances.dayOfWeek.destroy();
        }

        self.instances.dayOfWeek = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels.map(function (d) { return d.substring(0, 3); }),
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

        return self.instances.dayOfWeek;
    },

    createHourlyChart: function (ctx, data) {
        var self = this;
        if (self.instances.hourly) {
            self.instances.hourly.destroy();
        }

        var gradient = ctx.createLinearGradient(0, 0, 0, 250);
        gradient.addColorStop(0, 'rgba(245, 166, 35, 0.6)');
        gradient.addColorStop(1, 'rgba(245, 166, 35, 0.05)');

        self.instances.hourly = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels.map(function (l) { return l.replace(':00', 'h'); }),
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

        return self.instances.hourly;
    },

    createCountryChart: function (ctx, data) {
        var self = this;
        if (self.instances.country) {
            self.instances.country.destroy();
        }

        self.instances.country = new Chart(ctx, {
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

        return self.instances.country;
    },

    createSessionChart: function (ctx, data) {
        var self = this;
        if (self.instances.session) {
            self.instances.session.destroy();
        }

        var gradient = ctx.createLinearGradient(0, 0, 0, 250);
        gradient.addColorStop(0, 'rgba(155, 89, 182, 0.8)');
        gradient.addColorStop(1, 'rgba(155, 89, 182, 0.3)');

        self.instances.session = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels.map(function (l) {
                    return l + ' drink' + (l === '1' ? '' : 's');
                }),
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

        return self.instances.session;
    },

    createYearComparisonChart: function (ctx, data) {
        var self = this;
        if (self.instances.yearComparison) {
            self.instances.yearComparison.destroy();
        }

        self.instances.yearComparison = new Chart(ctx, {
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

        return self.instances.yearComparison;
    },

    createHeatmap: function (container, data) {
        container.innerHTML = '';

        var heatmap = document.createElement('div');
        heatmap.className = 'heatmap';

        // Row 1: Header row - empty corner + 12 hour headers
        var corner = document.createElement('div');
        corner.className = 'heatmap-label';
        corner.textContent = '';
        heatmap.appendChild(corner);

        for (var h = 0; h < 24; h += 2) {
            var header = document.createElement('div');
            header.className = 'heatmap-header';
            header.textContent = h;
            heatmap.appendChild(header);
        }

        // Day rows (Mon through Sun)
        var dayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        dayOrder.forEach(function (day) {
            // Day label
            var label = document.createElement('div');
            label.className = 'heatmap-label';
            label.textContent = day;
            heatmap.appendChild(label);

            // 12 cells for each 2-hour block
            for (var h = 0; h < 24; h += 2) {
                var cell = document.createElement('div');
                cell.className = 'heatmap-cell';

                var count = (data.patterns[day][h] || 0) + (data.patterns[day][h + 1] || 0);
                var level = data.max > 0 ? Math.min(5, Math.ceil((count / data.max) * 5)) : 0;

                if (level > 0) {
                    cell.setAttribute('data-level', level);
                }

                cell.title = day + ' ' + h + ':00-' + (h + 2) + ':00: ' + count + ' drinks';
                heatmap.appendChild(cell);
            }
        });

        container.appendChild(heatmap);
    },

    createDistributionLegend: function (container, data) {
        container.innerHTML = '';

        var maxItems = 8;
        var items = data.labels.slice(0, maxItems);

        items.forEach(function (label, i) {
            var item = document.createElement('div');
            item.className = 'legend-item';

            var color = document.createElement('div');
            color.className = 'legend-color';
            color.style.backgroundColor = data.colors[i];

            var text = document.createElement('span');
            text.textContent = label;

            item.appendChild(color);
            item.appendChild(text);
            container.appendChild(item);
        });

        if (data.labels.length > maxItems) {
            var more = document.createElement('div');
            more.className = 'legend-item';
            more.innerHTML = '<span>+' + (data.labels.length - maxItems) + ' more</span>';
            container.appendChild(more);
        }
    },

    createLocationsList: function (container, locations) {
        container.innerHTML = '';

        if (locations.length === 0) {
            container.innerHTML = '<p style="color: var(--text-muted); text-align: center;">No location data available</p>';
            return;
        }

        locations.forEach(function (loc) {
            var item = document.createElement('div');
            item.className = 'location-item';
            item.innerHTML =
                '<span class="location-rank">#' + loc.rank + '</span>' +
                '<div class="location-info">' +
                '<div class="location-name">' + loc.name + '</div>' +
                '<div class="location-count">' + loc.count + ' drinks</div>' +
                '</div>' +
                '<div class="location-bar">' +
                '<div class="location-bar-fill" style="width: ' + loc.percentage + '%"></div>' +
                '</div>';
            container.appendChild(item);
        });
    },

    updateAll: function (data) {
        var self = this;

        try {
            var timelineData = DataProcessor.getTimelineData(data);
            var distributionData = DataProcessor.getDrinkDistribution(data);
            var monthlyData = DataProcessor.getMonthlyActivity(data);
            var patternsData = DataProcessor.getDrinkingPatterns(data);
            var locations = DataProcessor.getTopLocations(data);
            var dayOfWeekData = DataProcessor.getDayOfWeekData(data);
            var hourlyData = DataProcessor.getHourlyData(data);
            var countryData = DataProcessor.getCountryData(data);
            var sessionData = DataProcessor.getSessionData(data);
            var yearData = DataProcessor.getYearComparison(data);

            // Timeline (Cumulative)
            var timelineEl = document.getElementById('timelineChart');
            if (timelineEl) {
                self.createTimelineChart(timelineEl.getContext('2d'), timelineData);
            }

            // Distribution
            var distributionEl = document.getElementById('distributionChart');
            var legendContainer = document.getElementById('distributionLegend');
            if (distributionEl) {
                self.createDistributionChart(distributionEl.getContext('2d'), distributionData);
                self.createDistributionLegend(legendContainer, distributionData);
            }

            // Day of Week
            var dayOfWeekEl = document.getElementById('dayOfWeekChart');
            if (dayOfWeekEl) {
                self.createDayOfWeekChart(dayOfWeekEl.getContext('2d'), dayOfWeekData);
            }

            // Hourly
            var hourlyEl = document.getElementById('hourlyChart');
            if (hourlyEl) {
                self.createHourlyChart(hourlyEl.getContext('2d'), hourlyData);
            }

            // Heatmap
            var heatmapContainer = document.getElementById('heatmapContainer');
            if (heatmapContainer) {
                self.createHeatmap(heatmapContainer, patternsData);
            }

            // Countries
            var countryEl = document.getElementById('countryChart');
            if (countryEl) {
                self.createCountryChart(countryEl.getContext('2d'), countryData);
            }

            // Sessions
            var sessionEl = document.getElementById('sessionChart');
            if (sessionEl) {
                self.createSessionChart(sessionEl.getContext('2d'), sessionData);
            }

            // Year Comparison
            var yearEl = document.getElementById('yearComparisonChart');
            if (yearEl) {
                self.createYearComparisonChart(yearEl.getContext('2d'), yearData);
            }

            // Monthly
            var monthlyEl = document.getElementById('monthlyChart');
            if (monthlyEl) {
                self.createMonthlyChart(monthlyEl.getContext('2d'), monthlyData);
            }

            // Locations
            var locationsContainer = document.getElementById('locationsList');
            if (locationsContainer) {
                self.createLocationsList(locationsContainer, locations);
            }
        } catch (e) {
            console.error('Error updating charts:', e);
        }
    },

    destroyAll: function () {
        var self = this;
        Object.keys(self.instances).forEach(function (key) {
            var chart = self.instances[key];
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        self.instances = {};
    }
};

Charts.initDefaults();
window.Charts = Charts;
