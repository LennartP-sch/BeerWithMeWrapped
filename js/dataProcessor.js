/**
 * Data Processor for Beer With Me Wrapped
 * Handles parsing, filtering, and statistical calculations
 */

const DataProcessor = {
    // Drink type to color mapping
    drinkColors: {
        'Beer': '#F5A623',
        'White wine': '#F5E6AA',
        'Red wine': '#8B2942',
        'Rose wine': '#FFB6C1',
        'Champagne': '#F7E7CE',
        'Shot': '#FF6B6B',
        'Cocktail': '#9B59B6',
        'Grog': '#D35400',
        'Seltzer': '#5DADE2',
        'Mulled wine': '#922B21',
        'Weinschorle': '#C9B037',
        'Spritzer': '#88D8B0',
        'Mass': '#E8941A',
        'Cuba libre': '#8B4513',
        'Ribbed cider': '#90EE90',
        'Other': '#7F8C8D'
    },

    // Drink type to emoji mapping
    drinkEmojis: {
        'Beer': '🍺',
        'White wine': '🍷',
        'Red wine': '🍷',
        'Rose wine': '🍷',
        'Champagne': '🥂',
        'Shot': '🥃',
        'Cocktail': '🍸',
        'Grog': '🍹',
        'Seltzer': '🥤',
        'Mulled wine': '🍷',
        'Weinschorle': '🍷',
        'Spritzer': '🍷',
        'Mass': '🍺',
        'Cuba libre': '🍹',
        'Ribbed cider': '🍎',
        'Other': '🥤'
    },

    parseData: function (rawData) {
        var self = this;
        return rawData.map(function (entry) {
            return {
                timestamp: entry.timestamp,
                address: entry.address,
                glassType: entry.glassType,
                date: new Date(entry.timestamp),
                drinkType: self.normalizeDrinkType(entry.glassType)
            };
        }).sort(function (a, b) {
            return a.date - b.date;
        });
    },

    normalizeDrinkType: function (glassType) {
        var knownTypes = Object.keys(this.drinkColors);
        if (knownTypes.indexOf(glassType) !== -1) {
            return glassType;
        }
        return 'Other';
    },

    filterByRange: function (data, range) {
        if (range === 'all') return data;

        var now = new Date();
        var cutoff;

        if (range === '3m') {
            cutoff = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        } else if (range === '6m') {
            cutoff = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
        } else if (range === '1y') {
            cutoff = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        } else {
            return data;
        }

        return data.filter(function (entry) {
            return entry.date >= cutoff;
        });
    },

    getBasicStats: function (data) {
        var totalDrinks = data.length;

        var drinkCounts = this.countByProperty(data, 'drinkType');
        var drinkEntries = Object.entries(drinkCounts).sort(function (a, b) {
            return b[1] - a[1];
        });
        var favoriteDrink = drinkEntries[0];

        var countries = {};
        data.forEach(function (entry) {
            if (entry.address) {
                var parts = entry.address.split(', ');
                if (parts.length > 0) {
                    var country = parts[parts.length - 1];
                    if (country && country.length > 1) {
                        countries[country] = true;
                    }
                }
            }
        });

        var locations = {};
        data.forEach(function (entry) {
            if (entry.address) {
                locations[entry.address] = true;
            }
        });

        return {
            totalDrinks: totalDrinks,
            favoriteDrink: favoriteDrink ? favoriteDrink[0] : 'N/A',
            favoriteDrinkCount: favoriteDrink ? favoriteDrink[1] : 0,
            totalCountries: Object.keys(countries).length,
            totalLocations: Object.keys(locations).length
        };
    },

    countByProperty: function (data, property) {
        var counts = {};
        data.forEach(function (entry) {
            var key = entry[property] || 'Unknown';
            counts[key] = (counts[key] || 0) + 1;
        });
        return counts;
    },

    getDrinkDistribution: function (data) {
        var self = this;
        var counts = this.countByProperty(data, 'drinkType');
        var sorted = Object.entries(counts).sort(function (a, b) {
            return b[1] - a[1];
        });

        return {
            labels: sorted.map(function (item) { return item[0]; }),
            values: sorted.map(function (item) { return item[1]; }),
            colors: sorted.map(function (item) {
                return self.drinkColors[item[0]] || self.drinkColors['Other'];
            })
        };
    },

    // CUMULATIVE timeline - values should ONLY GO UP
    getTimelineData: function (data) {
        var self = this;
        var monthlyData = {};
        var drinkTypesSet = {};

        // Group data by month
        data.forEach(function (entry) {
            var year = entry.date.getFullYear();
            var month = entry.date.getMonth() + 1;
            var monthKey = year + '-' + (month < 10 ? '0' + month : month);

            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = {};
            }

            var drinkType = entry.drinkType;
            drinkTypesSet[drinkType] = true;
            monthlyData[monthKey][drinkType] = (monthlyData[monthKey][drinkType] || 0) + 1;
        });

        // Sort months chronologically
        var sortedMonths = Object.keys(monthlyData).sort();

        // Get top 6 drink types
        var drinkTypeTotals = [];
        Object.keys(drinkTypesSet).forEach(function (type) {
            var total = 0;
            data.forEach(function (e) {
                if (e.drinkType === type) total++;
            });
            drinkTypeTotals.push({ type: type, total: total });
        });
        drinkTypeTotals.sort(function (a, b) { return b.total - a.total; });
        var topDrinkTypes = drinkTypeTotals.slice(0, 6).map(function (d) { return d.type; });

        // Create CUMULATIVE datasets - running total that only goes UP
        var datasets = [];

        topDrinkTypes.forEach(function (drinkType) {
            var runningTotal = 0;
            var cumulativeValues = [];

            sortedMonths.forEach(function (month) {
                var monthCount = (monthlyData[month][drinkType] || 0);
                runningTotal = runningTotal + monthCount;
                cumulativeValues.push(runningTotal);
            });

            datasets.push({
                label: drinkType,
                data: cumulativeValues,
                borderColor: self.drinkColors[drinkType] || self.drinkColors['Other'],
                backgroundColor: 'transparent',
                tension: 0.4,
                pointRadius: 3,
                pointHoverRadius: 6,
                fill: false
            });
        });

        // Format month labels
        var labels = sortedMonths.map(function (m) {
            var parts = m.split('-');
            var year = parts[0];
            var month = parseInt(parts[1], 10);
            var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return monthNames[month - 1] + ' ' + year.substring(2);
        });

        return {
            labels: labels,
            datasets: datasets
        };
    },

    getDayOfWeekData: function (data) {
        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var counts = [0, 0, 0, 0, 0, 0, 0];

        data.forEach(function (entry) {
            counts[entry.date.getDay()]++;
        });

        var colors = counts.map(function (_, i) {
            return (i === 5 || i === 6) ? '#F5A623' : '#C9B037';
        });

        return {
            labels: days,
            values: counts,
            colors: colors
        };
    },

    getHourlyData: function (data) {
        var counts = [];
        for (var i = 0; i < 24; i++) {
            counts.push(0);
        }

        data.forEach(function (entry) {
            counts[entry.date.getHours()]++;
        });

        var labels = [];
        for (var h = 0; h < 24; h++) {
            labels.push((h < 10 ? '0' + h : h) + ':00');
        }

        return {
            labels: labels,
            values: counts
        };
    },

    getCountryData: function (data) {
        var countryCounts = {};

        data.forEach(function (entry) {
            if (entry.address) {
                var parts = entry.address.split(', ');
                var country = parts[parts.length - 1];
                if (country && country.length > 1) {
                    countryCounts[country] = (countryCounts[country] || 0) + 1;
                }
            }
        });

        var sorted = Object.entries(countryCounts)
            .sort(function (a, b) { return b[1] - a[1]; })
            .slice(0, 10);

        return {
            labels: sorted.map(function (item) { return item[0]; }),
            values: sorted.map(function (item) { return item[1]; })
        };
    },

    getSessionData: function (data) {
        var sessions = [];
        var currentSession = [];

        var sortedData = data.slice().sort(function (a, b) {
            return a.date - b.date;
        });

        sortedData.forEach(function (entry) {
            if (currentSession.length === 0) {
                currentSession.push(entry);
            } else {
                var lastDrink = currentSession[currentSession.length - 1];
                var hoursDiff = (entry.date - lastDrink.date) / (1000 * 60 * 60);

                if (hoursDiff <= 4) {
                    currentSession.push(entry);
                } else {
                    sessions.push(currentSession.length);
                    currentSession = [entry];
                }
            }
        });

        if (currentSession.length > 0) {
            sessions.push(currentSession.length);
        }

        var sessionCounts = {};
        sessions.forEach(function (size) {
            var label = size >= 6 ? '6+' : String(size);
            sessionCounts[label] = (sessionCounts[label] || 0) + 1;
        });

        var orderedLabels = ['1', '2', '3', '4', '5', '6+'];

        return {
            labels: orderedLabels,
            values: orderedLabels.map(function (l) { return sessionCounts[l] || 0; })
        };
    },

    getYearComparison: function (data) {
        var yearlyData = {};

        data.forEach(function (entry) {
            var year = entry.date.getFullYear();
            var month = entry.date.getMonth();

            if (!yearlyData[year]) {
                yearlyData[year] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            }
            yearlyData[year][month]++;
        });

        var years = Object.keys(yearlyData).sort();
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var colors = ['#F5A623', '#5DADE2', '#9B59B6', '#2ECC71', '#E74C3C'];

        var datasets = years.map(function (year, i) {
            return {
                label: year,
                data: yearlyData[year],
                borderColor: colors[i % colors.length],
                backgroundColor: 'transparent',
                tension: 0.3
            };
        });

        return {
            labels: months,
            datasets: datasets
        };
    },

    getMonthlyActivity: function (data) {
        var monthlyCounts = {};

        data.forEach(function (entry) {
            var year = entry.date.getFullYear();
            var month = entry.date.getMonth() + 1;
            var monthKey = year + '-' + (month < 10 ? '0' + month : month);
            monthlyCounts[monthKey] = (monthlyCounts[monthKey] || 0) + 1;
        });

        var sortedMonths = Object.keys(monthlyCounts).sort();

        var labels = sortedMonths.map(function (m) {
            var parts = m.split('-');
            var year = parts[0];
            var month = parseInt(parts[1], 10);
            var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return monthNames[month - 1] + ' ' + year.substring(2);
        });

        return {
            labels: labels,
            values: sortedMonths.map(function (m) { return monthlyCounts[m]; })
        };
    },

    getDrinkingPatterns: function (data) {
        var patterns = {};
        var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        days.forEach(function (day) {
            patterns[day] = [];
            for (var i = 0; i < 24; i++) {
                patterns[day].push(0);
            }
        });

        data.forEach(function (entry) {
            var day = days[entry.date.getDay()];
            var hour = entry.date.getHours();
            patterns[day][hour]++;
        });

        var max = 0;
        days.forEach(function (day) {
            patterns[day].forEach(function (count) {
                if (count > max) max = count;
            });
        });

        return { patterns: patterns, days: days, max: max };
    },

    getTopLocations: function (data, limit) {
        limit = limit || 10;
        var locationCounts = {};

        data.forEach(function (entry) {
            if (entry.address && entry.address.trim()) {
                var simplified = entry.address.split(',')[0].trim();
                if (simplified) {
                    locationCounts[simplified] = (locationCounts[simplified] || 0) + 1;
                }
            }
        });

        var sorted = Object.entries(locationCounts)
            .sort(function (a, b) { return b[1] - a[1]; })
            .slice(0, limit);

        var maxCount = sorted.length > 0 ? sorted[0][1] : 1;

        return sorted.map(function (item, index) {
            return {
                rank: index + 1,
                name: item[0],
                count: item[1],
                percentage: (item[1] / maxCount) * 100
            };
        });
    },

    getFunFacts: function (data) {
        if (data.length === 0) {
            return {
                maxDrinksDay: 0,
                maxDrinksDayDate: 'N/A',
                longestStreak: 0,
                avgPerWeek: 0,
                peakHour: 'N/A'
            };
        }

        var dailyCounts = {};
        data.forEach(function (entry) {
            var dateKey = entry.date.toISOString().split('T')[0];
            dailyCounts[dateKey] = (dailyCounts[dateKey] || 0) + 1;
        });

        var maxDrinksEntry = Object.entries(dailyCounts)
            .sort(function (a, b) { return b[1] - a[1]; })[0];

        var sortedDates = Object.keys(dailyCounts).sort();
        var longestStreak = 1;
        var currentStreak = 1;

        for (var i = 1; i < sortedDates.length; i++) {
            var prev = new Date(sortedDates[i - 1]);
            var curr = new Date(sortedDates[i]);
            var diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                currentStreak++;
                if (currentStreak > longestStreak) longestStreak = currentStreak;
            } else {
                currentStreak = 1;
            }
        }

        var firstDate = data[0].date;
        var lastDate = data[data.length - 1].date;
        var weeks = Math.max(1, (lastDate - firstDate) / (1000 * 60 * 60 * 24 * 7));
        var avgPerWeek = (data.length / weeks).toFixed(1);

        var hourCounts = [];
        for (var h = 0; h < 24; h++) hourCounts.push(0);
        data.forEach(function (entry) {
            hourCounts[entry.date.getHours()]++;
        });
        var maxHour = Math.max.apply(null, hourCounts);
        var peakHourIndex = hourCounts.indexOf(maxHour);

        return {
            maxDrinksDay: maxDrinksEntry ? maxDrinksEntry[1] : 0,
            maxDrinksDayDate: maxDrinksEntry ? maxDrinksEntry[0] : 'N/A',
            longestStreak: longestStreak,
            avgPerWeek: parseFloat(avgPerWeek),
            peakHour: (peakHourIndex < 10 ? '0' + peakHourIndex : peakHourIndex) + ':00'
        };
    },

    getColor: function (drinkType) {
        return this.drinkColors[drinkType] || this.drinkColors['Other'];
    },

    getEmoji: function (drinkType) {
        return this.drinkEmojis[drinkType] || this.drinkEmojis['Other'];
    }
};

window.DataProcessor = DataProcessor;
