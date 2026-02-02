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

    /**
     * Parse raw JSON data
     */
    parseData(rawData) {
        return rawData.map(entry => ({
            ...entry,
            date: new Date(entry.timestamp),
            // Normalize glass type
            drinkType: this.normalizeDrinkType(entry.glassType)
        })).sort((a, b) => a.date - b.date);
    },

    /**
     * Normalize drink type names
     */
    normalizeDrinkType(glassType) {
        // Map variations to standard names
        const knownTypes = Object.keys(this.drinkColors);
        if (knownTypes.includes(glassType)) {
            return glassType;
        }
        return 'Other';
    },

    /**
     * Filter data by time range
     */
    filterByRange(data, range) {
        if (range === 'all') return data;
        
        const now = new Date();
        let cutoff;
        
        switch (range) {
            case '3m':
                cutoff = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
                break;
            case '6m':
                cutoff = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
                break;
            case '1y':
                cutoff = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
                break;
            default:
                return data;
        }
        
        return data.filter(entry => entry.date >= cutoff);
    },

    /**
     * Get basic statistics
     */
    getBasicStats(data) {
        const totalDrinks = data.length;
        
        // Favorite drink
        const drinkCounts = this.countByProperty(data, 'drinkType');
        const favoriteDrink = Object.entries(drinkCounts)
            .sort((a, b) => b[1] - a[1])[0];
        
        // Unique countries (extract from address)
        const countries = new Set();
        data.forEach(entry => {
            const parts = entry.address.split(', ');
            if (parts.length > 0) {
                const country = parts[parts.length - 1];
                if (country && country.length > 1) {
                    countries.add(country);
                }
            }
        });
        
        // Unique locations
        const locations = new Set(data.map(e => e.address).filter(a => a));
        
        return {
            totalDrinks,
            favoriteDrink: favoriteDrink ? favoriteDrink[0] : 'N/A',
            favoriteDrinkCount: favoriteDrink ? favoriteDrink[1] : 0,
            totalCountries: countries.size,
            totalLocations: locations.size
        };
    },

    /**
     * Count entries by property
     */
    countByProperty(data, property) {
        const counts = {};
        data.forEach(entry => {
            const key = entry[property] || 'Unknown';
            counts[key] = (counts[key] || 0) + 1;
        });
        return counts;
    },

    /**
     * Get drink distribution data
     */
    getDrinkDistribution(data) {
        const counts = this.countByProperty(data, 'drinkType');
        const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
        
        return {
            labels: sorted.map(([type]) => type),
            values: sorted.map(([, count]) => count),
            colors: sorted.map(([type]) => this.drinkColors[type] || this.drinkColors['Other'])
        };
    },

    /**
     * Get timeline data grouped by month and drink type
     */
    getTimelineData(data) {
        // Group by month
        const monthlyData = {};
        const drinkTypes = new Set();
        
        data.forEach(entry => {
            const monthKey = `${entry.date.getFullYear()}-${String(entry.date.getMonth() + 1).padStart(2, '0')}`;
            
            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = {};
            }
            
            const drinkType = entry.drinkType;
            drinkTypes.add(drinkType);
            monthlyData[monthKey][drinkType] = (monthlyData[monthKey][drinkType] || 0) + 1;
        });
        
        // Sort months
        const sortedMonths = Object.keys(monthlyData).sort();
        
        // Create datasets for each drink type
        const datasets = [];
        const topDrinkTypes = Array.from(drinkTypes)
            .map(type => ({
                type,
                total: data.filter(e => e.drinkType === type).length
            }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 6) // Top 6 drink types
            .map(d => d.type);
        
        topDrinkTypes.forEach(drinkType => {
            datasets.push({
                label: drinkType,
                data: sortedMonths.map(month => monthlyData[month][drinkType] || 0),
                borderColor: this.drinkColors[drinkType] || this.drinkColors['Other'],
                backgroundColor: 'transparent',
                tension: 0.4,
                pointRadius: 3,
                pointHoverRadius: 6
            });
        });
        
        return {
            labels: sortedMonths.map(m => {
                const [year, month] = m.split('-');
                return new Date(year, month - 1).toLocaleDateString('en', { month: 'short', year: '2-digit' });
            }),
            datasets
        };
    },

    /**
     * Get monthly activity data
     */
    getMonthlyActivity(data) {
        const monthlyCounts = {};
        
        data.forEach(entry => {
            const monthKey = `${entry.date.getFullYear()}-${String(entry.date.getMonth() + 1).padStart(2, '0')}`;
            monthlyCounts[monthKey] = (monthlyCounts[monthKey] || 0) + 1;
        });
        
        const sortedMonths = Object.keys(monthlyCounts).sort();
        
        return {
            labels: sortedMonths.map(m => {
                const [year, month] = m.split('-');
                return new Date(year, month - 1).toLocaleDateString('en', { month: 'short', year: '2-digit' });
            }),
            values: sortedMonths.map(m => monthlyCounts[m])
        };
    },

    /**
     * Get drinking patterns (day x hour heatmap)
     */
    getDrinkingPatterns(data) {
        const patterns = {};
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        // Initialize
        days.forEach(day => {
            patterns[day] = new Array(24).fill(0);
        });
        
        // Count
        data.forEach(entry => {
            const day = days[entry.date.getDay()];
            const hour = entry.date.getHours();
            patterns[day][hour]++;
        });
        
        // Find max for normalization
        let max = 0;
        days.forEach(day => {
            patterns[day].forEach(count => {
                if (count > max) max = count;
            });
        });
        
        return { patterns, days, max };
    },

    /**
     * Get top locations
     */
    getTopLocations(data, limit = 10) {
        const locationCounts = {};
        
        data.forEach(entry => {
            if (entry.address && entry.address.trim()) {
                // Simplify address - take first part
                const simplified = entry.address.split(',')[0].trim();
                if (simplified) {
                    locationCounts[simplified] = (locationCounts[simplified] || 0) + 1;
                }
            }
        });
        
        const sorted = Object.entries(locationCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit);
        
        const maxCount = sorted.length > 0 ? sorted[0][1] : 1;
        
        return sorted.map(([name, count], index) => ({
            rank: index + 1,
            name,
            count,
            percentage: (count / maxCount) * 100
        }));
    },

    /**
     * Get fun facts and statistics
     */
    getFunFacts(data) {
        if (data.length === 0) {
            return {
                maxDrinksDay: 0,
                maxDrinksDayDate: 'N/A',
                longestStreak: 0,
                avgPerWeek: 0,
                peakHour: 'N/A'
            };
        }
        
        // Max drinks in one day
        const dailyCounts = {};
        data.forEach(entry => {
            const dateKey = entry.date.toISOString().split('T')[0];
            dailyCounts[dateKey] = (dailyCounts[dateKey] || 0) + 1;
        });
        
        const maxDrinksEntry = Object.entries(dailyCounts)
            .sort((a, b) => b[1] - a[1])[0];
        
        // Longest streak
        const sortedDates = Object.keys(dailyCounts).sort();
        let longestStreak = 1;
        let currentStreak = 1;
        
        for (let i = 1; i < sortedDates.length; i++) {
            const prev = new Date(sortedDates[i - 1]);
            const curr = new Date(sortedDates[i]);
            const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                currentStreak++;
                longestStreak = Math.max(longestStreak, currentStreak);
            } else {
                currentStreak = 1;
            }
        }
        
        // Average per week
        const firstDate = data[0].date;
        const lastDate = data[data.length - 1].date;
        const weeks = Math.max(1, (lastDate - firstDate) / (1000 * 60 * 60 * 24 * 7));
        const avgPerWeek = (data.length / weeks).toFixed(1);
        
        // Peak hour
        const hourCounts = new Array(24).fill(0);
        data.forEach(entry => {
            hourCounts[entry.date.getHours()]++;
        });
        const peakHourIndex = hourCounts.indexOf(Math.max(...hourCounts));
        
        return {
            maxDrinksDay: maxDrinksEntry ? maxDrinksEntry[1] : 0,
            maxDrinksDayDate: maxDrinksEntry ? maxDrinksEntry[0] : 'N/A',
            longestStreak,
            avgPerWeek: parseFloat(avgPerWeek),
            peakHour: `${String(peakHourIndex).padStart(2, '0')}:00`
        };
    },

    /**
     * Get color for drink type
     */
    getColor(drinkType) {
        return this.drinkColors[drinkType] || this.drinkColors['Other'];
    },

    /**
     * Get emoji for drink type
     */
    getEmoji(drinkType) {
        return this.drinkEmojis[drinkType] || this.drinkEmojis['Other'];
    }
};

// Export for use in other files
window.DataProcessor = DataProcessor;
