import { useEffect, useState } from "react";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import SalesChallans from "./pages/SalesChallans";
import StockMovements from "./pages/StockMovements";

import {
    getInventory,
    getChallans,
    getStockMovements,
    getCustomers,
    getProducts
} from "./services/api";

function App() {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");

        try {
            return savedUser
                ? JSON.parse(savedUser)
                : null;
        } catch {
            return null;
        }
    });

    const [activePage, setActivePage] = useState("Dashboard");

    const [inventory, setInventory] = useState([]);
    const [challans, setChallans] = useState([]);
    const [movements, setMovements] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);

            const [
                inventoryResult,
                challanResult,
                movementResult,
                customerResult,
                productResult
            ] = await Promise.all([
                getInventory(),
                getChallans(),
                getStockMovements(),
                getCustomers(),
                getProducts()
            ]);

            if (inventoryResult.success) {
                setInventory(inventoryResult.data || []);
            }

            if (challanResult.success) {
                setChallans(challanResult.data || []);
            }

            if (movementResult.success) {
                setMovements(movementResult.data || []);
            }

            if (customerResult.success) {
                setCustomers(customerResult.data || []);
            }

            if (productResult.success) {
                setProducts(productResult.data || []);
            }

        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const handleLogin = (loggedInUser) => {
        setUser(loggedInUser);
        setActivePage("Dashboard");
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);

        setInventory([]);
        setChallans([]);
        setMovements([]);
        setCustomers([]);
        setProducts([]);
    };

    if (!user) {
        return <Login onLogin={handleLogin} />;
    }

    const totalStock = inventory.reduce(
        (total, item) =>
            total + Number(item.quantity || 0),
        0
    );

    const lowStock = inventory.filter(
        (item) =>
            Number(item.quantity || 0) <=
            Number(item.minimum_stock || 0)
    );

    return (
        <div className="min-h-screen bg-slate-100">

            <Sidebar
                activePage={activePage}
                setActivePage={setActivePage}
            />

            <main className="ml-64 min-h-screen">

                <Header
                    user={user}
                    onLogout={handleLogout}
                />

                <section className="p-8">

                    {loading ? (

                        <div className="flex h-96 items-center justify-center">

                            <div className="text-center">

                                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                                <p className="mt-4 text-sm text-slate-500">
                                    Loading...
                                </p>

                            </div>

                        </div>

                    ) : (

                        <>
                            {activePage === "Dashboard" && (
                                <Dashboard
                                    inventory={inventory}
                                    challans={challans}
                                    totalStock={totalStock}
                                    lowStock={lowStock}
                                    setActivePage={setActivePage}
                                    fetchData={fetchData}
                                />
                            )}

                            {activePage === "Inventory" && (
                                <Inventory
                                    inventory={inventory}
                                />
                            )}

                            {activePage === "Sales Challans" && (
                                <SalesChallans
                                    challans={challans}
                                    customers={customers}
                                    products={products}
                                    fetchData={fetchData}
                                    onBack={() =>
                                        setActivePage("Dashboard")
                                    }
                                />
                            )}

                            {activePage === "Stock Movements" && (
                                <StockMovements
                                    movements={movements}
                                    onBack={() =>
                                        setActivePage("Dashboard")
                                    }
                                />
                            )}
                        </>

                    )}

                </section>

            </main>

        </div>
    );
}

export default App;