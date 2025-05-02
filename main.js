// Real-time clock functionality
function updateDateTime() {
    const now = new Date();
    
    // Update time
    const timeElement = document.getElementById('time');
    timeElement.textContent = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    // Update date
    const dateElement = document.getElementById('date');
    dateElement.textContent = now.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Update time every second
setInterval(updateDateTime, 1000);
updateDateTime(); // Initial call

// Sample inventory data
let inventory = [
    { id: 1, name: "Laptop", quantity: 10, price: 999.99, category: "Electronics" },
    { id: 2, name: "Mouse", quantity: 50, price: 29.99, category: "Accessories" },
    { id: 3, name: "Keyboard", quantity: 30, price: 49.99, category: "Accessories" }
];

// Sample activity data with timestamps
let activities = [
    { id: 1, type: "stock_update", item: "Laptop", quantity: 5, timestamp: new Date() },
    { id: 2, type: "new_item", item: "Mouse", quantity: 50, timestamp: new Date(Date.now() - 1000 * 60 * 30) },
    { id: 3, type: "low_stock", item: "Keyboard", quantity: 3, timestamp: new Date(Date.now() - 1000 * 60 * 60) }
];

// Hamburger menu functionality with animation
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
});

// Function to format relative time
function getRelativeTime(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
}

// Function to update dashboard statistics with animations
function updateDashboardStats() {
    const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);
    const lowStock = inventory.filter(item => item.quantity < 10).length;
    const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.price), 0);

    animateValue('totalItems', totalItems);
    animateValue('lowStock', lowStock);
    animateValue('totalValue', totalValue, true);
}

// Animate number changes
function animateValue(elementId, final, isCurrency = false) {
    const element = document.getElementById(elementId);
    const start = parseInt(element.textContent.replace(/[^0-9.-]+/g, "")) || 0;
    const duration = 1000;
    const steps = 60;
    const increment = (final - start) / steps;
    let current = start;
    let step = 0;

    const animate = () => {
        step++;
        current += increment;
        if (isCurrency) {
            element.textContent = `$${current.toFixed(2)}`;
        } else {
            element.textContent = Math.round(current);
        }

        if (step < steps) {
            requestAnimationFrame(animate);
        }
    };

    requestAnimationFrame(animate);
}

// Function to display recent activities with animations
function displayRecentActivities() {
    const activityList = document.getElementById('activityList');
    activityList.innerHTML = '';

    activities.forEach((activity, idx) => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item scale-in';
        activityItem.style.animationDelay = `${idx * 0.1}s`;
        
        let activityText = '';
        switch(activity.type) {
            case 'stock_update':
                activityText = `Updated stock for ${activity.item} (${activity.quantity} units)`;
                break;
            case 'new_item':
                activityText = `Added new item: ${activity.item} (${activity.quantity} units)`;
                break;
            case 'low_stock':
                activityText = `Low stock alert for ${activity.item} (${activity.quantity} units remaining)`;
                break;
        }

        activityItem.innerHTML = `
            <div class="activity-content">
                <p>${activityText}</p>
                <small>${getRelativeTime(activity.timestamp)}</small>
            </div>
        `;
        
        activityList.appendChild(activityItem);
    });
}

// Initialize dashboard when the page loads
document.addEventListener('DOMContentLoaded', () => {
    updateDashboardStats();
    displayRecentActivities();
    
    // Update activity timestamps every minute
    setInterval(() => {
        const timestamps = document.querySelectorAll('.activity-item small');
        timestamps.forEach((element, idx) => {
            element.textContent = getRelativeTime(activities[idx].timestamp);
        });
    }, 60000);
}); 