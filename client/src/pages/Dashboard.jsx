import StatCard from "../components/StatCard";

function Dashboard({
    inventory = [],
    challans = [],
    totalStock = 0,
    lowStock = [],
    setActivePage
}) {
    return (
        <div>

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800">
                    Dashboard
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    Overview of your business operations
                </p>
            </div>


            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

                <StatCard
                    title="Products"
                    value={inventory.length}
                />

                <StatCard
                    title="Total Stock"
                    value={totalStock}
                />

                <StatCard
                    title="Sales Challans"
                    value={challans.length}
                />

                <StatCard
                    title="Low Stock"
                    value={lowStock.length}
                />

            </div>


            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">

                <div className="rounded-xl border border-slate-200 bg-white p-6">

                    <h3 className="text-lg font-semibold text-slate-800">
                        Inventory
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                        View and manage your current inventory.
                    </p>

                    <button
                        onClick={() => setActivePage("Inventory")}
                        className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        View Inventory
                    </button>

                </div>


                <div className="rounded-xl border border-slate-200 bg-white p-6">

                    <h3 className="text-lg font-semibold text-slate-800">
                        Sales Challans
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                        Create and manage sales challans.
                    </p>

                    <button
                        onClick={() =>
                            setActivePage("Sales Challans")
                        }
                        className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        View Challans
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;