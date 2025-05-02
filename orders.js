class OrdersComponent {
    constructor() {
        this.orders = [];
        this.selectedItems = [];
        this.currentOrder = null;
        this.initializeEventListeners();
        this.loadSampleOrders();
        this.renderOrders();
        this.populateItemSelect();
    }

    initializeEventListeners() {
        // New Order Button
        document.getElementById('newOrderBtn').addEventListener('click', () => this.openModal());

        // Close Modal
        document.querySelector('.close').addEventListener('click', () => this.closeModal());

        // Form Submission
        document.getElementById('orderForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Add Item to Order
        document.getElementById('addItemToOrder').addEventListener('click', () => this.addItemToOrder());

        // Search and Filters
        document.getElementById('searchOrder').addEventListener('input', (e) => this.filterOrders());
        document.getElementById('statusFilter').addEventListener('change', () => this.filterOrders());
        document.getElementById('dateFilter').addEventListener('change', () => this.filterOrders());

        // Hamburger menu
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('open');
        });
    }

    loadSampleOrders() {
        this.orders = [
            {
                id: 1,
                date: new Date(),
                customer: "John Doe",
                items: [
                    { name: "Laptop", quantity: 1, price: 999.99 },
                    { name: "Mouse", quantity: 1, price: 29.99 }
                ],
                status: "pending",
                total: 1029.98
            },
            {
                id: 2,
                date: new Date(Date.now() - 86400000),
                customer: "Jane Smith",
                items: [
                    { name: "Keyboard", quantity: 2, price: 49.99 }
                ],
                status: "completed",
                total: 99.98
            }
        ];
    }

    openModal(order = null) {
        this.currentOrder = order;
        const modal = document.getElementById('orderModal');
        const modalTitle = document.getElementById('modalTitle');
        
        if (order) {
            modalTitle.textContent = 'Edit Order';
            document.getElementById('customerName').value = order.customer;
            document.getElementById('orderStatus').value = order.status;
            this.selectedItems = [...order.items];
        } else {
            modalTitle.textContent = 'New Order';
            document.getElementById('orderForm').reset();
            this.selectedItems = [];
        }
        
        this.renderSelectedItems();
        modal.style.display = 'block';
    }

    closeModal() {
        document.getElementById('orderModal').style.display = 'none';
        this.currentOrder = null;
        this.selectedItems = [];
    }

    populateItemSelect() {
        const select = document.getElementById('itemSelect');
        select.innerHTML = '';
        
        window.inventory.forEach(item => {
            const option = document.createElement('option');
            option.value = JSON.stringify(item);
            option.textContent = `${item.name} - $${item.price}`;
            select.appendChild(option);
        });
    }

    addItemToOrder() {
        const itemSelect = document.getElementById('itemSelect');
        const quantityInput = document.getElementById('itemQuantity');
        
        const item = JSON.parse(itemSelect.value);
        const quantity = parseInt(quantityInput.value);
        
        if (quantity > 0) {
            this.selectedItems.push({
                name: item.name,
                quantity: quantity,
                price: item.price
            });
            
            this.renderSelectedItems();
            quantityInput.value = 1;
        }
    }

    renderSelectedItems() {
        const container = document.getElementById('selectedItems');
        const totalItems = document.getElementById('totalItems');
        const totalAmount = document.getElementById('totalAmount');
        
        container.innerHTML = '';
        let total = 0;
        let itemCount = 0;
        
        this.selectedItems.forEach((item, idx) => {
            const itemTotal = item.quantity * item.price;
            total += itemTotal;
            itemCount += item.quantity;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'selected-item';
            itemElement.innerHTML = `
                <span>${item.name} x ${item.quantity} ($${item.price} each)</span>
                <span>
                    $${itemTotal.toFixed(2)}
                    <button type="button" onclick="ordersComponent.removeItem(${idx})">
                        <i class="fas fa-times"></i>
                    </button>
                </span>
            `;
            container.appendChild(itemElement);
        });
        
        totalItems.textContent = itemCount;
        totalAmount.textContent = `$${total.toFixed(2)}`;
    }

    removeItem(index) {
        this.selectedItems.splice(index, 1);
        this.renderSelectedItems();
    }

    handleFormSubmit() {
        const formData = {
            customer: document.getElementById('customerName').value,
            status: document.getElementById('orderStatus').value,
            items: [...this.selectedItems],
            date: new Date(),
            total: this.calculateTotal()
        };

        if (this.currentOrder) {
            // Update existing order
            const index = this.orders.findIndex(order => order.id === this.currentOrder.id);
            this.orders[index] = { ...this.currentOrder, ...formData };
        } else {
            // Add new order
            const newId = Math.max(...this.orders.map(order => order.id), 0) + 1;
            this.orders.push({ id: newId, ...formData });
        }

        this.renderOrders();
        this.closeModal();
    }

    calculateTotal() {
        return this.selectedItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    }

    filterOrders() {
        const searchTerm = document.getElementById('searchOrder').value.toLowerCase();
        const statusFilter = document.getElementById('statusFilter').value;
        const dateFilter = document.getElementById('dateFilter').value;
        
        let filtered = this.orders;
        
        if (searchTerm) {
            filtered = filtered.filter(order => 
                order.customer.toLowerCase().includes(searchTerm) ||
                order.id.toString().includes(searchTerm)
            );
        }
        
        if (statusFilter) {
            filtered = filtered.filter(order => order.status === statusFilter);
        }
        
        if (dateFilter) {
            const filterDate = new Date(dateFilter).toDateString();
            filtered = filtered.filter(order => 
                order.date.toDateString() === filterDate
            );
        }
        
        this.renderOrders(filtered);
    }

    renderOrders(orders = this.orders) {
        const tbody = document.getElementById('ordersTableBody');
        tbody.innerHTML = '';

        orders.forEach((order, idx) => {
            const tr = document.createElement('tr');
            tr.style.animationDelay = `${idx * 0.1}s`;
            
            const itemsList = order.items.map(item => 
                `${item.name} x${item.quantity}`
            ).join(', ');

            tr.innerHTML = `
                <td>#${order.id}</td>
                <td>${order.date.toLocaleDateString()}</td>
                <td>${order.customer}</td>
                <td>${itemsList}</td>
                <td>$${order.total.toFixed(2)}</td>
                <td><span class="status-badge status-${order.status}">${order.status}</span></td>
                <td>
                    <button class="btn-edit" onclick="ordersComponent.openModal(${JSON.stringify(order)})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-delete" onclick="ordersComponent.deleteOrder(${order.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    deleteOrder(id) {
        if (confirm('Are you sure you want to delete this order?')) {
            this.orders = this.orders.filter(order => order.id !== id);
            this.renderOrders();
        }
    }
}

// Initialize the orders component
const ordersComponent = new OrdersComponent(); 