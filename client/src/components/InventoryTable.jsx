function InventoryTable({ data = [] }) {
    if (data.length === 0) {
        return (
            <div className="p-8 text-center text-sm text-slate-500">
                No inventory records found.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">

                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs text-slate-500">
                            Product
                        </th>

                        <th className="px-6 py-3 text-left text-xs text-slate-500">
                            SKU
                        </th>

                        <th className="px-6 py-3 text-left text-xs text-slate-500">
                            Quantity
                        </th>

                        <th className="px-6 py-3 text-left text-xs text-slate-500">
                            Minimum
                        </th>

                        <th className="px-6 py-3 text-left text-xs text-slate-500">
                            Status
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {data.map((item) => {
                        const quantity = Number(
                            item.quantity || 0
                        );

                        const minimum = Number(
                            item.minimum_stock || 0
                        );

                        const isLow = quantity <= minimum;

                        return (
                            <tr
                                key={item.id}
                                className="border-t border-slate-100 hover:bg-slate-50"
                            >
                                <td className="px-6 py-4 text-sm font-medium text-slate-800">
                                    {item.product_name}
                                </td>

                                <td className="px-6 py-4 text-sm text-slate-500">
                                    {item.sku}
                                </td>

                                <td className="px-6 py-4 text-sm font-semibold">
                                    {quantity}
                                </td>

                                <td className="px-6 py-4 text-sm">
                                    {minimum}
                                </td>

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
                            </tr>
                        );
                    })}
                </tbody>

            </table>
        </div>
    );
}

export default InventoryTable;