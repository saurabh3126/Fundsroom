// const API_URL = "http://localhost:5000";
const API_URL =
  "https://fundsroom-api.onrender.com";

// =========================================
// HEADERS
// =========================================

export function getHeaders() {

    const token =
        localStorage.getItem("token");

    return {

        "Content-Type":
            "application/json",

        ...(token
            ? {
                Authorization:
                    `Bearer ${token}`
            }
            : {})

    };
}


// =========================================
// INVENTORY
// =========================================

// Get all inventory

export async function getInventory() {

    const response =
        await fetch(
            `${API_URL}/api/inventory`,
            {
                headers: getHeaders()
            }
        );

    return response.json();
}


// Create inventory

export async function createInventory(
    inventory
) {

    const response =
        await fetch(
            `${API_URL}/api/inventory`,
            {
                method: "POST",

                headers:
                    getHeaders(),

                body:
                    JSON.stringify(
                        inventory
                    )
            }
        );

    return response.json();
}


// Update inventory

export async function updateInventory(
    id,
    inventory
) {

    const response =
        await fetch(
            `${API_URL}/api/inventory/${id}`,
            {
                method: "PUT",

                headers:
                    getHeaders(),

                body:
                    JSON.stringify(
                        inventory
                    )
            }
        );

    return response.json();
}


// =========================================
// CHALLANS
// =========================================

export async function getChallans() {

    const response =
        await fetch(
            `${API_URL}/api/challans`,
            {
                headers: getHeaders()
            }
        );

    return response.json();
}


// =========================================
// STOCK MOVEMENTS
// =========================================

export async function getStockMovements() {

    const response =
        await fetch(
            `${API_URL}/api/stock-movements`,
            {
                headers: getHeaders()
            }
        );

    return response.json();
}


// =========================================
// CUSTOMERS
// =========================================

// Get customers

export async function getCustomers(
    page = 1,
    limit = 10
) {

    const response =
        await fetch(
            `${API_URL}/api/customers?page=${page}&limit=${limit}`,
            {
                headers: getHeaders()
            }
        );

    return response.json();
}


// Search customers

export async function searchCustomers(
    query
) {

    const response =
        await fetch(
            `${API_URL}/api/customers/search?query=${encodeURIComponent(query)}`,
            {
                headers: getHeaders()
            }
        );

    return response.json();
}


// Get customer by ID

export async function getCustomerById(
    id
) {

    const response =
        await fetch(
            `${API_URL}/api/customers/${id}`,
            {
                headers: getHeaders()
            }
        );

    return response.json();
}


// Create customer

export async function createCustomer(
    customer
) {

    const response =
        await fetch(
            `${API_URL}/api/customers`,
            {
                method: "POST",

                headers:
                    getHeaders(),

                body:
                    JSON.stringify(
                        customer
                    )
            }
        );

    return response.json();
}


// Update customer

export async function updateCustomer(
    id,
    customer
) {

    const response =
        await fetch(
            `${API_URL}/api/customers/${id}`,
            {
                method: "PUT",

                headers:
                    getHeaders(),

                body:
                    JSON.stringify(
                        customer
                    )
            }
        );

    return response.json();
}


// Delete customer

export async function deleteCustomer(
    id
) {

    const response =
        await fetch(
            `${API_URL}/api/customers/${id}`,
            {
                method: "DELETE",

                headers:
                    getHeaders()
            }
        );

    return response.json();
}


// =========================================
// PRODUCTS
// =========================================

// Get all products

export async function getProducts() {

    const response =
        await fetch(
            `${API_URL}/api/products`,
            {
                headers: getHeaders()
            }
        );

    return response.json();
}


// Create product

export async function createProduct(
    product
) {

    const response =
        await fetch(
            `${API_URL}/api/products`,
            {
                method: "POST",

                headers:
                    getHeaders(),

                body:
                    JSON.stringify(
                        product
                    )
            }
        );

    return response.json();
}


// Update product

export async function updateProduct(
    id,
    product
) {

    const response =
        await fetch(
            `${API_URL}/api/products/${id}`,
            {
                method: "PUT",

                headers:
                    getHeaders(),

                body:
                    JSON.stringify(
                        product
                    )
            }
        );

    return response.json();
}


// Delete product

export async function deleteProduct(
    id
) {

    const response =
        await fetch(
            `${API_URL}/api/products/${id}`,
            {
                method: "DELETE",

                headers:
                    getHeaders()
            }
        );

    return response.json();
}


// Search products

export async function searchProducts(
    query
) {

    const response =
        await fetch(
            `${API_URL}/api/products/search?query=${encodeURIComponent(query)}`,
            {
                headers: getHeaders()
            }
        );

    return response.json();
}


// =========================================
// CREATE CHALLAN
// =========================================

export async function createChallan(
    customerId,
    items
) {

    const response =
        await fetch(
            `${API_URL}/api/challans`,
            {
                method: "POST",

                headers:
                    getHeaders(),

                body:
                    JSON.stringify({

                        customer_id:
                            Number(
                                customerId
                            ),

                        items:
                            items.map(
                                (item) => ({

                                    product_id:
                                        Number(
                                            item.product_id
                                        ),

                                    quantity:
                                        Number(
                                            item.quantity
                                        )

                                })
                            )

                    })
            }
        );

    return response.json();
}


// =========================================
// CONFIRM CHALLAN
// =========================================

export async function confirmChallan(
    id
) {

    const response =
        await fetch(
            `${API_URL}/api/challans/${id}/confirm`,
            {
                method: "PUT",

                headers:
                    getHeaders()
            }
        );

    return response.json();
}


// =========================================
// LOGIN
// =========================================

export async function login(
    email,
    password
) {

    const response =
        await fetch(
            `${API_URL}/api/auth/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify({

                        email,

                        password

                    })

            }
        );

    return response.json();
}