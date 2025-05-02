class ReportsComponent {
    constructor() {
        this.charts = {};
        this.initializeEventListeners();
        this.initializeDateRange();
        this.loadSampleData();
        this.initializeCharts();
    }

    initializeEventListeners() {
        document.getElementById('updateReports').addEventListener('click', () => this.updateReports());
        
        // Hamburger menu
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('open');
        });
    }

    initializeDateRange() {
        const today = new Date();
        const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
        
        document.getElementById('startDate').value = this.formatDate(thirtyDaysAgo);
        document.getElementById('endDate').value = this.formatDate(today);
    }

    formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    loadSampleData() {
        // Sample data for demonstration
        this.salesData = {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            values: [12500, 15000, 17500, 20000]
        };

        this.categoryData = {
            labels: ['Electronics', 'Accessories', 'Peripherals', 'Storage'],
            values: [40, 25, 20, 15]
        };

        this.inventoryData = {
            labels: ['In Stock', 'Low Stock', 'Out of Stock'],
            values: [70, 20, 10]
        };

        this.topProducts = [
            { name: 'Gaming Setup', sales: 150, revenue: 149998.50, image: 'images/pexels-alxs-919734.jpg' },
            { name: 'Professional Setup', sales: 300, revenue: 8997, image: 'images/pexels-joshsorenson-1714208.jpg' },
            { name: 'Gaming Setup Pro', sales: 250, revenue: 12497.50, image: 'images/pexels-alxs-919734.jpg' },
            { name: 'Office Setup', sales: 100, revenue: 29999, image: 'images/pexels-joshsorenson-1714208.jpg' }
        ];
    }

    initializeCharts() {
        // Sales Chart
        this.charts.sales = new Chart(document.getElementById('salesChart'), {
            type: 'line',
            data: {
                labels: this.salesData.labels,
                datasets: [{
                    label: 'Sales Revenue',
                    data: this.salesData.values,
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                animation: {
                    duration: 2000,
                    easing: 'easeOutQuart'
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });

        // Category Chart
        this.charts.category = new Chart(document.getElementById('categoryChart'), {
            type: 'doughnut',
            data: {
                labels: this.categoryData.labels,
                datasets: [{
                    data: this.categoryData.values,
                    backgroundColor: [
                        '#2563eb',
                        '#3b82f6',
                        '#60a5fa',
                        '#93c5fd'
                    ]
                }]
            },
            options: {
                responsive: true,
                animation: {
                    duration: 2000,
                    animateRotate: true
                }
            }
        });

        // Inventory Chart
        this.charts.inventory = new Chart(document.getElementById('inventoryChart'), {
            type: 'bar',
            data: {
                labels: this.inventoryData.labels,
                datasets: [{
                    data: this.inventoryData.values,
                    backgroundColor: [
                        '#22c55e',
                        '#f59e0b',
                        '#ef4444'
                    ]
                }]
            },
            options: {
                responsive: true,
                animation: {
                    duration: 2000
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });

        this.renderTopProducts();
        this.updateStatistics();
    }

    renderTopProducts() {
        const container = document.getElementById('topProducts');
        container.innerHTML = '';

        this.topProducts.forEach((product, index) => {
            const productElement = document.createElement('div');
            productElement.className = 'product-item';
            productElement.style.animationDelay = `${index * 0.1}s`;
            
            productElement.innerHTML = `
                <div class="product-info">
                    <span class="product-rank">${index + 1}</span>
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    <div class="product-details">
                        <h4>${product.name}</h4>
                        <small>${product.sales} units sold</small>
                    </div>
                </div>
                <div class="product-revenue">
                    $${product.revenue.toFixed(2)}
                </div>
            `;
            
            container.appendChild(productElement);
        });
    }

    updateStatistics() {
        const totalRevenue = this.salesData.values.reduce((a, b) => a + b, 0);
        const totalOrders = 800; // Sample data
        const productsSold = this.topProducts.reduce((sum, product) => sum + product.sales, 0);
        const growthRate = 15.7; // Sample data

        this.animateValue('totalRevenue', totalRevenue, true);
        this.animateValue('totalOrders', totalOrders);
        this.animateValue('productsSold', productsSold);
        this.animateValue('growthRate', growthRate, false, '%');
    }

    animateValue(elementId, final, isCurrency = false, suffix = '') {
        const element = document.getElementById(elementId);
        const start = 0;
        const duration = 2000;
        const steps = 60;
        const increment = final / steps;
        let current = start;
        let step = 0;

        const animate = () => {
            step++;
            current += increment;
            if (isCurrency) {
                element.textContent = `$${current.toFixed(2)}`;
            } else {
                element.textContent = `${Math.round(current)}${suffix}`;
            }

            if (step < steps) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    updateReports() {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;

        // Add loading state
        document.querySelectorAll('.report-card').forEach(card => {
            card.classList.add('loading');
        });

        // Simulate API call delay
        setTimeout(() => {
            // Remove loading state
            document.querySelectorAll('.report-card').forEach(card => {
                card.classList.remove('loading');
            });

            // Update charts with new data
            this.loadSampleData(); // In real app, this would be an API call
            
            // Update all charts
            this.charts.sales.data.labels = this.salesData.labels;
            this.charts.sales.data.datasets[0].data = this.salesData.values;
            this.charts.sales.update();

            this.charts.category.data.labels = this.categoryData.labels;
            this.charts.category.data.datasets[0].data = this.categoryData.values;
            this.charts.category.update();

            this.charts.inventory.data.labels = this.inventoryData.labels;
            this.charts.inventory.data.datasets[0].data = this.inventoryData.values;
            this.charts.inventory.update();

            this.renderTopProducts();
            this.updateStatistics();
        }, 1500);
    }
}

// Initialize the reports component
const reportsComponent = new ReportsComponent(); 