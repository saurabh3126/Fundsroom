function InventoryTable({
    data = [],
    canManageProducts = false,
    onEditProduct
}) {

    if (data.length === 0) {

        return (
            <div className="px-6 py-12 text-center text-sm text-slate-500">
                No inventory records found.
            </div>
        );

    }


    return (

        <div className="overflow-x-auto">

            <table className="w-full">

                {/* ================================= */}
                {/* HEADER */}
                {/* ================================= */}

                <thead className="bg-slate-50">

                    <tr>

                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">
                            Product
                        </th>


                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">
                            SKU
                        </th>


                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">
                            Category
                        </th>


                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">
                            Quantity
                        </th>


                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">
                            Minimum
                        </th>


                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">
                            Warehouse
                        </th>


                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">
                            Status
                        </th>


                        {canManageProducts && (

                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">
                                Action
                            </th>

                        )}

                    </tr>

                </thead>


                {/* ================================= */}
                {/* BODY */}
                {/* ================================= */}

                <tbody>

                    {data.map((item) => {

                        const quantity =
                            Number(
                                item.quantity || 0
                            );


                        const minimum =
                            Number(
                                item.minimum_stock || 0
                            );


                        const isLow =
                            quantity <= minimum;


                        return (

                            <tr
                                key={item.id}
                                className="border-t border-slate-100 transition hover:bg-slate-50"
                            >

                                {/* PRODUCT */}

                                <td className="px-6 py-4">

                                    <p className="text-sm font-medium text-slate-800">
                                        {item.product_name}
                                    </p>

                                </td>


                                {/* SKU */}

                                <td className="px-6 py-4 text-sm text-slate-500">
                                    {item.sku}
                                </td>


                                {/* CATEGORY */}

                                <td className="px-6 py-4 text-sm text-slate-500">
                                    {item.category || "—"}
                                </td>


                                {/* QUANTITY */}

                                <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                                    {quantity}
                                </td>


                                {/* MINIMUM */}

                                <td className="px-6 py-4 text-sm text-slate-600">
                                    {minimum}
                                </td>


                                {/* WAREHOUSE */}

                                <td className="px-6 py-4 text-sm text-slate-600">
                                    {item.warehouse_location || "—"}
                                </td>


                                {/* STATUS */}

                                <td className="px-6 py-4">

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                                            isLow
                                                ? "bg-red-100 text-red-700"
                                                : "bg-green-100 text-green-700"
                                        }`}
                                    >

                                        {isLow
                                            ? "Low Stock"
                                            : "In Stock"}

                                    </span>

                                </td>


                                {/* ACTION */}

                                {canManageProducts && (

                                    <td className="px-6 py-4">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                onEditProduct(item)
                                            }
                                            className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-100"
                                        >
                                            Edit
                                        </button>

                                    </td>

                                )}

                            </tr>

                        );

                    })}

                </tbody>

            </table>

        </div>

    );

}


export default InventoryTable;