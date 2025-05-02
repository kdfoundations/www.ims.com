// Inventory Component
class InventoryComponent {
    constructor() {
        this.inventory = window.inventory || [];
        this.currentItem = null;
        this.initializeEventListeners();
        this.renderInventory();
    }

    initializeEventListeners() {
        // Add Item Button
        document.getElementById('addItemBtn').addEventListener('click', () => this.openModal());

        // Close Modal
        document.querySelector('.close').addEventListener('click', () => this.closeModal());

        // Form Submission
        document.getElementById('itemForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Search Input
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.filterInventory(e.target.value);
        });

        // Category Filter
        document.getElementById('categoryFilter').addEventListener('change', (e) => {
            this.filterByCategory(e.target.value);
        });

        // Hamburger menu for mobile
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
        hamburger.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') navLinks.classList.toggle('open');
        });
    }

    openModal(item = null) {
        this.currentItem = item;
        const modal = document.getElementById('itemModal');
        const modalTitle = document.getElementById('modalTitle');
        
        if (item) {
            modalTitle.textContent = 'Edit Item';
            document.getElementById('itemName').value = item.name;
            document.getElementById('itemCategory').value = item.category;
            document.getElementById('itemQuantity').value = item.quantity;
            document.getElementById('itemPrice').value = item.price;
        } else {
            modalTitle.textContent = 'Add New Item';
            document.getElementById('itemForm').reset();
        }
        
        modal.style.display = 'block';
    }

    closeModal() {
        document.getElementById('itemModal').style.display = 'none';
        this.currentItem = null;
    }

    handleFormSubmit() {
        const formData = {
            name: document.getElementById('itemName').value,
            category: document.getElementById('itemCategory').value,
            quantity: parseInt(document.getElementById('itemQuantity').value),
            price: parseFloat(document.getElementById('itemPrice').value)
        };

        if (this.currentItem) {
            // Update existing item
            const index = this.inventory.findIndex(item => item.id === this.currentItem.id);
            this.inventory[index] = { ...this.currentItem, ...formData };
        } else {
            // Add new item
            const newId = Math.max(...this.inventory.map(item => item.id), 0) + 1;
            this.inventory.push({ id: newId, ...formData });
        }

        this.renderInventory();
        this.closeModal();
        this.updateDashboardStats();
    }

    deleteItem(id) {
        if (confirm('Are you sure you want to delete this item?')) {
            this.inventory = this.inventory.filter(item => item.id !== id);
            this.renderInventory();
            this.updateDashboardStats();
        }
    }

    filterInventory(searchTerm) {
        const filteredItems = this.inventory.filter(item => 
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.renderInventory(filteredItems);
    }

    filterByCategory(category) {
        if (!category) {
            this.renderInventory();
            return;
        }
        const filteredItems = this.inventory.filter(item => item.category === category);
        this.renderInventory(filteredItems);
    }

    renderInventory(items = this.inventory) {
        const tbody = document.getElementById('inventoryTableBody');
        tbody.innerHTML = '';

        items.forEach((item, idx) => {
            const tr = document.createElement('tr');
            tr.style.animationDelay = `${idx * 0.07}s`;
            tr.innerHTML = `
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.category}</td>
                <td>${item.quantity}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td class="action-buttons">
                    <button class="btn-edit" onclick="inventoryComponent.openModal(${JSON.stringify(item)})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="inventoryComponent.deleteItem(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    updateDashboardStats() {
        if (typeof window.updateDashboardStats === 'function') {
            window.updateDashboardStats();
        }
    }
}

// Initialize the inventory component
const inventoryComponent = new InventoryComponent(); 