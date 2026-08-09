function MovementTable({ movements = [] }) {
    if (movements.length === 0) {
        return (
            <div className="p-8 text-center text-sm text-slate-500">
                No stock movements found.
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
                            Type
                        </th>

                        <th className="px-6 py-3 text-left text-xs text-slate-500">
                            Reason
                        </th>

                        <th className="px-6 py-3 text-left text-xs text-slate-500">
                            Date
                        </th>

                    </tr>
                </thead>

                <tbody>

                    {movements.map((movement) => (

                        <tr
                            key={movement.id}
                            className="border-t border-slate-100 hover:bg-slate-50"
                        >

                            <td className="px-6 py-4 text-sm font-medium text-slate-800">
                                {movement.product_name}
                            </td>

                            <td className="px-6 py-4 text-sm text-slate-500">
                                {movement.sku}
                            </td>

                            <td className="px-6 py-4 text-sm font-semibold">
                                {movement.quantity}
                            </td>

                            <td className="px-6 py-4">

                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                                        movement.movement_type === "IN"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                    }`}
                                >
                                    {movement.movement_type}
                                </span>

                            </td>

                            <td className="px-6 py-4 text-sm text-slate-600">
                                {movement.reason}
                            </td>

                            <td className="px-6 py-4 text-sm text-slate-500">
                                {movement.created_at
                                    ? new Date(
                                          movement.created_at
                                      ).toLocaleDateString("en-IN")
                                    : "-"}
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}

export default MovementTable;