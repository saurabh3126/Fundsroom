function Header({ user, onLogout }) {
    return (
        <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">

            <div>
                <h2 className="text-xl font-semibold text-slate-800">
                    Fundsroom ERP
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Business Management System
                </p>
            </div>


            <div className="flex items-center gap-4">

                <div className="text-right">

                    <p className="text-sm font-semibold text-slate-800">
                        {user?.name || "Admin"}
                    </p>

                    <p className="text-xs text-slate-500">
                        {user?.role || "Admin"}
                    </p>

                </div>


                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                    {(user?.name || "A")
                        .charAt(0)
                        .toUpperCase()}
                </div>


                <button
                    onClick={onLogout}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                    Logout
                </button>

            </div>

        </header>
    );
}

export default Header;