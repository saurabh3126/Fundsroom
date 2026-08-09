import { useEffect, useState } from "react";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
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

    // =========================================
    // USER
    // =========================================

    const [user, setUser] = useState(() => {

        const savedUser =
            localStorage.getItem("user");

        if (!savedUser) {
            return null;
        }

        try {
            return JSON.parse(savedUser);
        } catch {
            return null;
        }

    });


    // =========================================
    // ACTIVE PAGE
    // =========================================

    const [activePage, setActivePage] =
        useState("Dashboard");


    // =========================================
    // DATA
    // =========================================

    const [inventory, setInventory] =
        useState([]);

    const [challans, setChallans] =
        useState([]);

    const [movements, setMovements] =
        useState([]);

    const [customers, setCustomers] =
        useState([]);

    const [products, setProducts] =
        useState([]);


    // =========================================
    // LOADING
    // =========================================

    const [loading, setLoading] =
        useState(false);


    // =========================================
    // FETCH DATA
    // =========================================

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


            // Inventory

            if (
                inventoryResult &&
                inventoryResult.success
            ) {

                setInventory(
                    inventoryResult.data || []
                );

            }


            // Challans

            if (
                challanResult &&
                challanResult.success
            ) {

                setChallans(
                    challanResult.data || []
                );

            }


            // Stock Movements

            if (
                movementResult &&
                movementResult.success
            ) {

                setMovements(
                    movementResult.data || []
                );

            }


            // Customers

            if (
                customerResult &&
                customerResult.success
            ) {

                setCustomers(
                    customerResult.data || []
                );

            }


            // Products

            if (
                productResult &&
                productResult.success
            ) {

                setProducts(
                    productResult.data || []
                );

            }

        } catch (error) {

            console.error(
                "Error loading data:",
                error
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================================
    // LOAD DATA AFTER LOGIN
    // =========================================

    useEffect(() => {

        if (user) {
            fetchData();
        }

    }, [user]);


    // =========================================
    // LOGIN
    // =========================================

    const handleLogin = (loggedInUser) => {

        setUser(loggedInUser);

        setActivePage("Dashboard");

    };


    // =========================================
    // LOGOUT
    // =========================================

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);

        setInventory([]);
        setChallans([]);
        setMovements([]);
        setCustomers([]);
        setProducts([]);

        setActivePage("Dashboard");

    };


    // =========================================
    // LOGIN PAGE
    // =========================================

    if (!user) {

        return (
            <Login
                onLogin={handleLogin}
            />
        );

    }


    // =========================================
    // ROLE
    // =========================================

    const role =
        user?.role || "Admin";


    // =========================================
    // STOCK CALCULATIONS
    // =========================================

    const totalStock =
        inventory.reduce(
            (total, item) =>
                total +
                Number(item.quantity || 0),
            0
        );


    const lowStock =
        inventory.filter(
            (item) =>
                Number(item.quantity || 0) <=
                Number(item.minimum_stock || 0)
        );


    // =========================================
    // PAGE ACCESS
    // =========================================

    const canAccessPage = (page) => {

        // Admin

        if (role === "Admin") {
            return true;
        }


        // Sales

        if (role === "Sales") {

            return (
                page === "Dashboard" ||
                page === "Customers" ||
                page === "Sales Challans"
            );

        }


        // Warehouse

        if (role === "Warehouse") {

            return (
                page === "Dashboard" ||
                page === "Customers" ||
                page === "Inventory" ||
                page === "Stock Movements"
            );

        }


        // Accounts

        if (role === "Accounts") {

            return (
                page === "Dashboard" ||
                page === "Customers"
            );

        }


        return false;

    };


    // =========================================
    // PROTECT ACTIVE PAGE
    // =========================================

    useEffect(() => {

        if (!canAccessPage(activePage)) {

            setActivePage("Dashboard");

        }

    }, [activePage, role]);


    // =========================================
    // MAIN UI
    // =========================================

    return (

        <div className="min-h-screen bg-slate-100">


            {/* SIDEBAR */}

            <Sidebar
                activePage={activePage}
                setActivePage={setActivePage}
                user={user}
            />


            {/* MAIN */}

            <main className="ml-64 min-h-screen">


                {/* HEADER */}

                <Header
                    user={user}
                    onLogout={handleLogout}
                />


                {/* CONTENT */}

                <section className="p-8">


                    {/* LOADING */}

                    {loading ? (

                        <div className="flex h-96 items-center justify-center">

                            <div className="text-center">

                                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600">
                                </div>

                                <p className="mt-4 text-sm text-slate-500">
                                    Loading...
                                </p>

                            </div>

                        </div>

                    ) : (

                        <>


                            {/* DASHBOARD */}

                            {activePage === "Dashboard" && (

                                <Dashboard
                                    user={user}
                                    inventory={inventory}
                                    challans={challans}
                                    totalStock={totalStock}
                                    lowStock={lowStock}
                                    setActivePage={setActivePage}
                                    fetchData={fetchData}
                                />

                            )}


                            {/* CUSTOMERS */}

                            {activePage === "Customers" && (

                                <Customers
                                    customers={customers}
                                    fetchData={fetchData}
                                    user={user}
                                />

                            )}


                            {/* INVENTORY */}

                            {activePage === "Inventory" && (

                                <Inventory
                                    inventory={inventory}
                                    products={products}
                                    fetchData={fetchData}
                                    user={user}
                                />

                            )}


                            {/* SALES CHALLANS */}

                            {activePage === "Sales Challans" && (

                                <SalesChallans
                                    challans={challans}
                                    customers={customers}
                                    products={products}
                                    inventory={inventory}
                                    fetchData={fetchData}
                                    onBack={() =>
                                        setActivePage(
                                            "Dashboard"
                                        )
                                    }
                                />

                            )}


                            {/* STOCK MOVEMENTS */}

                            {activePage === "Stock Movements" && (

                                <StockMovements
                                    movements={movements}
                                    onBack={() =>
                                        setActivePage(
                                            "Dashboard"
                                        )
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
