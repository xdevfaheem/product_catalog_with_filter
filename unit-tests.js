// Node.js Unit Tests for Product Catalog
// Run with: node tests/unit-tests.js

// Simple test framework for Node.js
class TestFramework {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }

    test(name, testFunc) {
        this.tests.push({ name, testFunc });
    }

    async runTests() {
        console.log('🧪 Running Product Catalog Unit Tests\n');

        for (let { name, testFunc } of this.tests) {
            try {
                await testFunc();
                this.passed++;
                console.log(`✓ ${name}`);
            } catch (error) {
                this.failed++;
                console.log(`✗ ${name}: ${error.message}`);
            }
        }

        this.displaySummary();
    }

    displaySummary() {
        const total = this.passed + this.failed;
        console.log(`\n📊 Test Summary:`);
        console.log(`Tests run: ${total} | Passed: ${this.passed} | Failed: ${this.failed}`);

        if (this.failed === 0) {
            console.log('🎉 All tests passed!');
        } else {
            console.log('⚠️  Some tests failed');
        }
    }

    assertEqual(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(`${message || 'Assertion failed'}: expected ${expected}, got ${actual}`);
        }
    }

    assertTrue(value, message) {
        if (!value) {
            throw new Error(message || 'Expected true, got false');
        }
    }

    assertFalse(value, message) {
        if (value) {
            throw new Error(message || 'Expected false, got true');
        }
    }
}

// Mock product data
const testProducts = [
    {
        id: 1,
        name: "Samsung Galaxy S23",
        category: "Electronics",
        subcategory: "Mobile Phones",
        price: 75000,
        brand: "Samsung",
        rating: 4.5,
        inStock: true,
        description: "Latest Samsung smartphone"
    },
    {
        id: 2,
        name: "Nike Air Max",
        category: "Fashion",
        subcategory: "Shoes",
        price: 8500,
        brand: "Nike",
        rating: 4.3,
        inStock: true,
        description: "Comfortable running shoes"
    },
    {
        id: 3,
        name: "MacBook Pro M3",
        category: "Electronics",
        subcategory: "Laptops",
        price: 185000,
        brand: "Apple",
        rating: 4.8,
        inStock: false,
        description: "High-performance laptop"
    },
    {
        id: 4,
        name: "Adidas T-Shirt",
        category: "Fashion",
        subcategory: "Clothing",
        price: 1200,
        brand: "Adidas",
        rating: 4.0,
        inStock: true,
        description: "Cotton sports t-shirt"
    }
];

// Filter functions to test
class ProductFilter {
    static filterByCategory(products, category) {
        if (!category) return products;
        return products.filter(product => product.category === category);
    }

    static filterBySubcategory(products, subcategory) {
        if (!subcategory) return products;
        return products.filter(product => product.subcategory === subcategory);
    }

    static filterByBrand(products, brand) {
        if (!brand) return products;
        return products.filter(product => product.brand === brand);
    }

    static filterByPriceRange(products, minPrice, maxPrice) {
        let filtered = products;
        if (minPrice !== null) {
            filtered = filtered.filter(product => product.price >= minPrice);
        }
        if (maxPrice !== null) {
            filtered = filtered.filter(product => product.price <= maxPrice);
        }
        return filtered;
    }

    static filterByRating(products, minRating) {
        if (!minRating) return products;
        return products.filter(product => product.rating >= minRating);
    }

    static filterByStock(products, inStockOnly) {
        if (!inStockOnly) return products;
        return products.filter(product => product.inStock);
    }

    static searchProducts(products, searchTerm) {
        if (!searchTerm) return products;
        const term = searchTerm.toLowerCase();
        return products.filter(product => 
            product.name.toLowerCase().includes(term) ||
            product.description.toLowerCase().includes(term) ||
            product.brand.toLowerCase().includes(term)
        );
    }

    static sortProducts(products, sortBy) {
        const sorted = [...products];
        switch (sortBy) {
            case 'name':
                return sorted.sort((a, b) => a.name.localeCompare(b.name));
            case 'price-low':
                return sorted.sort((a, b) => a.price - b.price);
            case 'price-high':
                return sorted.sort((a, b) => b.price - a.price);
            case 'rating':
                return sorted.sort((a, b) => b.rating - a.rating);
            default:
                return sorted;
        }
    }
}

// Initialize test framework
const testFramework = new TestFramework();

// Category Filter Tests
testFramework.test('Filter by Electronics category', () => {
    const result = ProductFilter.filterByCategory(testProducts, 'Electronics');
    testFramework.assertEqual(result.length, 2, 'Should return 2 electronics products');
});

testFramework.test('Filter by Fashion category', () => {
    const result = ProductFilter.filterByCategory(testProducts, 'Fashion');
    testFramework.assertEqual(result.length, 2, 'Should return 2 fashion products');
});

testFramework.test('Filter by non-existent category', () => {
    const result = ProductFilter.filterByCategory(testProducts, 'NonExistent');
    testFramework.assertEqual(result.length, 0, 'Should return 0 products');
});

// Subcategory Filter Tests
testFramework.test('Filter by Mobile Phones subcategory', () => {
    const result = ProductFilter.filterBySubcategory(testProducts, 'Mobile Phones');
    testFramework.assertEqual(result.length, 1, 'Should return 1 mobile phone');
});

// Brand Filter Tests
testFramework.test('Filter by Samsung brand', () => {
    const result = ProductFilter.filterByBrand(testProducts, 'Samsung');
    testFramework.assertEqual(result.length, 1, 'Should return 1 Samsung product');
});

testFramework.test('Filter by Apple brand', () => {
    const result = ProductFilter.filterByBrand(testProducts, 'Apple');
    testFramework.assertEqual(result.length, 1, 'Should return 1 Apple product');
});

// Price Range Filter Tests
testFramework.test('Filter by minimum price', () => {
    const result = ProductFilter.filterByPriceRange(testProducts, 50000, null);
    testFramework.assertEqual(result.length, 2, 'Should return 2 products above ₹50,000');
});

testFramework.test('Filter by maximum price', () => {
    const result = ProductFilter.filterByPriceRange(testProducts, null, 10000);
    testFramework.assertEqual(result.length, 2, 'Should return 2 products below ₹10,000');
});

testFramework.test('Filter by price range', () => {
    const result = ProductFilter.filterByPriceRange(testProducts, 5000, 80000);
    testFramework.assertEqual(result.length, 2, 'Should return 2 products in price range');
});

// Rating Filter Tests
testFramework.test('Filter by minimum rating 4.5', () => {
    const result = ProductFilter.filterByRating(testProducts, 4.5);
    testFramework.assertEqual(result.length, 2, 'Should return 2 products with rating >= 4.5');
});

testFramework.test('Filter by minimum rating 4.0', () => {
    const result = ProductFilter.filterByRating(testProducts, 4.0);
    testFramework.assertEqual(result.length, 4, 'Should return 4 products with rating >= 4.0');
});

// Stock Filter Tests
testFramework.test('Filter by in-stock only', () => {
    const result = ProductFilter.filterByStock(testProducts, true);
    testFramework.assertEqual(result.length, 3, 'Should return 3 in-stock products');
});

// Search Tests
testFramework.test('Search by product name', () => {
    const result = ProductFilter.searchProducts(testProducts, 'Samsung');
    testFramework.assertEqual(result.length, 1, 'Should find 1 Samsung product');
});

testFramework.test('Search by description', () => {
    const result = ProductFilter.searchProducts(testProducts, 'laptop');
    testFramework.assertEqual(result.length, 1, 'Should find 1 laptop product');
});

testFramework.test('Search case-insensitive', () => {
    const result = ProductFilter.searchProducts(testProducts, 'NIKE');
    testFramework.assertEqual(result.length, 1, 'Should find 1 Nike product (case-insensitive)');
});

// Sort Tests
testFramework.test('Sort by name alphabetically', () => {
    const result = ProductFilter.sortProducts(testProducts, 'name');
    testFramework.assertEqual(result[0].name, 'Adidas T-Shirt', 'First product should be Adidas T-Shirt');
});

testFramework.test('Sort by price low to high', () => {
    const result = ProductFilter.sortProducts(testProducts, 'price-low');
    testFramework.assertEqual(result[0].price, 1200, 'First product should have lowest price');
    testFramework.assertEqual(result[3].price, 185000, 'Last product should have highest price');
});

testFramework.test('Sort by price high to low', () => {
    const result = ProductFilter.sortProducts(testProducts, 'price-high');
    testFramework.assertEqual(result[0].price, 185000, 'First product should have highest price');
    testFramework.assertEqual(result[3].price, 1200, 'Last product should have lowest price');
});

testFramework.test('Sort by rating', () => {
    const result = ProductFilter.sortProducts(testProducts, 'rating');
    testFramework.assertEqual(result[0].rating, 4.8, 'First product should have highest rating');
});

// Combined Filter Tests
testFramework.test('Combined filter: Electronics + in-stock + price range', () => {
    let result = ProductFilter.filterByCategory(testProducts, 'Electronics');
    result = ProductFilter.filterByStock(result, true);
    result = ProductFilter.filterByPriceRange(result, null, 100000);
    testFramework.assertEqual(result.length, 1, 'Should return 1 product matching all criteria');
});

// Run all tests
testFramework.runTests();