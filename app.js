// Product Catalog Application - Core JavaScript

class ProductCatalog {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.categories = [];
        this.subcategories = {};
        this.brands = [];
        this.currentFilters = {
            search: '',
            category: '',
            subcategory: '',
            brand: '',
            minPrice: null,
            maxPrice: null,
            rating: null,
            inStockOnly: false
        };
        this.currentSort = 'name';

        this.init();
    }

    async init() {
        try {
            await this.loadData();
            this.setupEventListeners();
            this.populateFilterOptions();
            this.applyFilters();
            this.hideLoadingSpinner();
        } catch (error) {
            console.error('Error initializing catalog:', error);
            this.hideLoadingSpinner();
            this.showError('Failed to load product data');
        }
    }

    async loadData() {
        try {
            const response = await fetch('data/products.json');
            if (!response.ok) {
                throw new Error('Failed to fetch product data');
            }
            const data = await response.json();

            this.products = data.products;
            this.categories = data.categories.filter(cat => cat !== 'All');
            this.subcategories = data.subcategories;
            this.brands = data.brands;

            console.log('Product data loaded successfully:', this.products.length, 'products');
        } catch (error) {
            console.error('Error loading data:', error);
            throw error;
        }
    }

    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => {
            this.currentFilters.search = e.target.value.toLowerCase();
            this.applyFilters();
        });

        // Filter controls
        document.getElementById('categoryFilter').addEventListener('change', (e) => {
            this.currentFilters.category = e.target.value;
            this.updateSubcategoryFilter();
            this.applyFilters();
        });

        document.getElementById('subcategoryFilter').addEventListener('change', (e) => {
            this.currentFilters.subcategory = e.target.value;
            this.applyFilters();
        });

        document.getElementById('brandFilter').addEventListener('change', (e) => {
            this.currentFilters.brand = e.target.value;
            this.applyFilters();
        });

        document.getElementById('minPrice').addEventListener('input', (e) => {
            this.currentFilters.minPrice = e.target.value ? parseFloat(e.target.value) : null;
            this.applyFilters();
        });

        document.getElementById('maxPrice').addEventListener('input', (e) => {
            this.currentFilters.maxPrice = e.target.value ? parseFloat(e.target.value) : null;
            this.applyFilters();
        });

        document.getElementById('ratingFilter').addEventListener('change', (e) => {
            this.currentFilters.rating = e.target.value ? parseFloat(e.target.value) : null;
            this.applyFilters();
        });

        document.getElementById('inStockOnly').addEventListener('change', (e) => {
            this.currentFilters.inStockOnly = e.target.checked;
            this.applyFilters();
        });

        // Sort control
        document.getElementById('sortBy').addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.applyFilters();
        });

        // Clear filters button
        document.getElementById('clearFilters').addEventListener('click', () => {
            this.clearAllFilters();
        });
    }

    populateFilterOptions() {
        // Populate category filter
        const categorySelect = document.getElementById('categoryFilter');
        this.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });

        // Populate brand filter
        const brandSelect = document.getElementById('brandFilter');
        this.brands.forEach(brand => {
            const option = document.createElement('option');
            option.value = brand;
            option.textContent = brand;
            brandSelect.appendChild(option);
        });
    }

    updateSubcategoryFilter() {
        const subcategorySelect = document.getElementById('subcategoryFilter');
        const selectedCategory = this.currentFilters.category;

        // Clear existing options
        subcategorySelect.innerHTML = '<option value="">All Subcategories</option>';

        if (selectedCategory && this.subcategories[selectedCategory]) {
            this.subcategories[selectedCategory].forEach(subcategory => {
                const option = document.createElement('option');
                option.value = subcategory;
                option.textContent = subcategory;
                subcategorySelect.appendChild(option);
            });
        }

        this.currentFilters.subcategory = '';
    }

    applyFilters() {
        let filtered = [...this.products];

        // Apply search filter
        if (this.currentFilters.search) {
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(this.currentFilters.search) ||
                product.description.toLowerCase().includes(this.currentFilters.search) ||
                product.brand.toLowerCase().includes(this.currentFilters.search)
            );
        }

        // Apply category filter
        if (this.currentFilters.category) {
            filtered = filtered.filter(product => 
                product.category === this.currentFilters.category
            );
        }

        // Apply subcategory filter
        if (this.currentFilters.subcategory) {
            filtered = filtered.filter(product => 
                product.subcategory === this.currentFilters.subcategory
            );
        }

        // Apply brand filter
        if (this.currentFilters.brand) {
            filtered = filtered.filter(product => 
                product.brand === this.currentFilters.brand
            );
        }

        // Apply price filters
        if (this.currentFilters.minPrice !== null) {
            filtered = filtered.filter(product => 
                product.price >= this.currentFilters.minPrice
            );
        }

        if (this.currentFilters.maxPrice !== null) {
            filtered = filtered.filter(product => 
                product.price <= this.currentFilters.maxPrice
            );
        }

        // Apply rating filter
        if (this.currentFilters.rating !== null) {
            filtered = filtered.filter(product => 
                product.rating >= this.currentFilters.rating
            );
        }

        // Apply stock filter
        if (this.currentFilters.inStockOnly) {
            filtered = filtered.filter(product => product.inStock);
        }

        // Apply sorting
        this.sortProducts(filtered);

        this.filteredProducts = filtered;
        this.renderProducts();
        this.updateProductCount();
    }

    sortProducts(products) {
        switch (this.currentSort) {
            case 'name':
                products.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'price-low':
                products.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                products.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                products.sort((a, b) => b.rating - a.rating);
                break;
        }
    }

    renderProducts() {
        const productsGrid = document.getElementById('productsGrid');
        const noProducts = document.getElementById('noProducts');

        if (this.filteredProducts.length === 0) {
            productsGrid.style.display = 'none';
            noProducts.style.display = 'block';
            return;
        }

        productsGrid.style.display = 'grid';
        noProducts.style.display = 'none';

        productsGrid.innerHTML = this.filteredProducts.map(product => 
            this.createProductCard(product)
        ).join('');
    }

    createProductCard(product) {
        const stars = this.generateStars(product.rating);
        const stockClass = product.inStock ? 'in-stock' : 'out-of-stock';
        const stockText = product.inStock ? 'In Stock' : 'Out of Stock';

        return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <i class="fas fa-image"></i>
                </div>
                <div class="product-name">${product.name}</div>
                <div class="product-category">${product.category} > ${product.subcategory}</div>
                <div class="product-price">₹${product.price.toLocaleString()}</div>
                <div class="product-rating">
                    <span class="stars">${stars}</span>
                    <span class="rating-text">(${product.rating})</span>
                </div>
                <div class="product-brand">Brand: ${product.brand}</div>
                <div class="stock-status ${stockClass}">${stockText}</div>
            </div>
        `;
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        let stars = '';

        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }

        if (halfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }

        const remainingStars = 5 - Math.ceil(rating);
        for (let i = 0; i < remainingStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }

        return stars;
    }

    updateProductCount() {
        const countElement = document.getElementById('productsCount');
        const count = this.filteredProducts.length;
        const total = this.products.length;
        countElement.textContent = `Showing ${count} of ${total} products`;
    }

    clearAllFilters() {
        // Reset filters
        this.currentFilters = {
            search: '',
            category: '',
            subcategory: '',
            brand: '',
            minPrice: null,
            maxPrice: null,
            rating: null,
            inStockOnly: false
        };

        // Reset form elements
        document.getElementById('searchInput').value = '';
        document.getElementById('categoryFilter').value = '';
        document.getElementById('subcategoryFilter').value = '';
        document.getElementById('brandFilter').value = '';
        document.getElementById('minPrice').value = '';
        document.getElementById('maxPrice').value = '';
        document.getElementById('ratingFilter').value = '';
        document.getElementById('inStockOnly').checked = false;
        document.getElementById('sortBy').value = 'name';

        // Reset sort
        this.currentSort = 'name';

        // Update subcategory filter
        this.updateSubcategoryFilter();

        // Apply filters
        this.applyFilters();
    }

    hideLoadingSpinner() {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) {
            spinner.style.display = 'none';
        }
    }

    showError(message) {
        const productsGrid = document.getElementById('productsGrid');
        productsGrid.innerHTML = `
            <div class="error-message" style="text-align: center; padding: 2rem; color: #721c24; background: #f8d7da; border-radius: 8px;">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                <p>${message}</p>
            </div>
        `;
    }

    // Public method for testing
    getFilteredProducts() {
        return this.filteredProducts;
    }

    // Public method for testing
    getCurrentFilters() {
        return this.currentFilters;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.productCatalog = new ProductCatalog();
});

// Export for testing (if running in Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductCatalog;
}