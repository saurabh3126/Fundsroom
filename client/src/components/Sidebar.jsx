function Sidebar({ activePage, setActivePage }) {

    const menuItems = [
        "Dashboard",
        "Inventory",
        "Sales Challans",
        "Stock Movements"
    ];

    return (
        <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-slate-900 text-white">

            {/* Logo */}

            <div className="border-b border-slate-800 px-7 py-6">

                <h1 className="text-2xl font-bold">
                    Fundsroom ERP
                </h1>

                <p className="mt-2 text-sm text-slate-400">
                    Admin Panel
                </p>

            </div>


            {/* Navigation */}

            <nav className="flex-1 px-4 py-6">

                <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Navigation
                </p>


                <div className="space-y-2">

                    {menuItems.map((item) => (

                        <button
                            key={item}
                            type="button"
                            onClick={() =>
                                setActivePage(item)
                            }
                            className={`flex w-full items-center rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
                                activePage === item
                                    ? "bg-blue-600 text-white"
                                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                            }`}
                        >

                            {/* Simple icons */}

                            <span className="mr-3 w-5 text-center">

                                {item === "Dashboard" && "▦"}

                                {item === "Inventory" && "▤"}

                                {item === "Sales Challans" && "▣"}

                                {item === "Stock Movements" && "↕"}

                            </span>

                            {item}

                        </button>

                    ))}

                </div>

            </nav>


            {/* Bottom */}

            <div className="border-t border-slate-800 p-4">

                <div className="rounded-lg bg-slate-800 px-4 py-3">

                    <p className="text-xs text-slate-500">
                        Logged in as
                    </p>

                    <p className="mt-1 text-sm font-medium text-white">
                        Administrator
                    </p>

                </div>

            </div>

        </aside>
    );
}

export default Sidebar;