const API_URL = "http://localhost:5000";

export function getHeaders() {
    const token = localStorage.getItem("token");

    return {
        "Content-Type": "application/json",
        ...(token
            ? { Authorization: `Bearer ${token}` }
            : {})
    };
}

export async function getInventory() {
    const response = await fetch(
        `${API_URL}/api/inventory`,
        {
            headers: getHeaders()
        }
    );

    return response.json();
}

export async function getChallans() {
    const response = await fetch(
        `${API_URL}/api/challans`,
        {
            headers: getHeaders()
        }
    );

    return response.json();
}

export async function getStockMovements() {
    const response = await fetch(
        `${API_URL}/api/stock-movements`,
        {
            headers: getHeaders()
        }
    );

    return response.json();
}

export async function getCustomers() {
    const response = await fetch(
        `${API_URL}/api/customers`,
        {
            headers: getHeaders()
        }
    );

    return response.json();
}

export async function getProducts() {
    const response = await fetch(
        `${API_URL}/api/products`,
        {
            headers: getHeaders()
        }
    );

    return response.json();
}

export async function createChallan(customerId, items) {
    const response = await fetch(
        `${API_URL}/api/challans`,
        {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({
                customer_id: Number(customerId),
                items: items.map((item) => ({
                    product_id: Number(item.product_id),
                    quantity: Number(item.quantity)
                }))
            })
        }
    );

    return response.json();
}

export async function confirmChallan(id) {
    const response = await fetch(
        `${API_URL}/api/challans/${id}/confirm`,
        {
            method: "PUT",
            headers: getHeaders()
        }
    );

    return response.json();
}
export async function login(email, password) {
    const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        }
    );

    return response.json();
}