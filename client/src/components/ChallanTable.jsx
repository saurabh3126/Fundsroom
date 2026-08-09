import { useState } from "react";
import { confirmChallan } from "../services/api";

function ChallanTable({
    data = [],
    fetchData
}) {
    const [confirmingId, setConfirmingId] = useState(null);

    const handleConfirm = async (id) => {
        try {
            setConfirmingId(id);

            const result = await confirmChallan(id);

            if (!result.success) {
                throw new Error(
                    result.message || "Unable to confirm challan."
                );
            }

            await fetchData();

        } catch (error) {
            console.error(error);
            alert(error.message);

        } finally {
            setConfirmingId(null);
        }
    };


    if (data.length === 0) {
        return (
            <div className="p-8 text-center text-sm text-slate-500">
                No sales challans found.
            </div>
        );
    }


    return (
        <div className="overflow-x-auto">

            <table className="w-full">

                <thead className="bg-slate-50">

                    <tr>

                        <th className="px-6 py-3 text-left text-xs text-slate-500">
                            ID
                        </th>

                        <th className="px-6 py-3 text-left text-xs text-slate-500">
                            Customer
                        </th>

                        <th className="px-6 py-3 text-left text-xs text-slate-500">
                            Company
                        </th>

                        <th className="px-6 py-3 text-left text-xs text-slate-500">
                            Products
                        </th>

                        <th className="px-6 py-3 text-left text-xs text-slate-500">
                            Status
                        </th>

                        <th className="px-6 py-3 text-left text-xs text-slate-500">
                            Total
                        </th>

                        <th className="px-6 py-3 text-left text-xs text-slate-500">
                            Action
                        </th>

                    </tr>

                </thead>


                <tbody>

                    {data.map((challan) => (

                        <tr
                            key={challan.id}
                            className="border-t border-slate-100 hover:bg-slate-50"
                        >

                            {/* ID */}

                            <td className="px-6 py-4 text-sm font-semibold">
                                #{challan.id}
                            </td>


                            {/* Customer */}

                            <td className="px-6 py-4 text-sm">
                                {challan.customer_name}
                            </td>


                            {/* Company */}

                            <td className="px-6 py-4 text-sm text-slate-500">
                                {challan.company_name}
                            </td>


                            {/* Products */}

                            <td className="px-6 py-4">

                                {Array.isArray(challan.items) &&
                                challan.items.length > 0 ? (

                                    <div className="space-y-1">

                                        {challan.items.map(
                                            (item) => (

                                                <div
                                                    key={item.id}
                                                    className="text-sm"
                                                >

                                                    <span className="font-medium text-slate-800">
                                                        {
                                                            item.product_name
                                                        }
                                                    </span>

                                                    <span className="ml-2 text-slate-500">
                                                        ×{" "}
                                                        {
                                                            item.quantity
                                                        }
                                                    </span>

                                                </div>

                                            )
                                        )}

                                    </div>

                                ) : (

                                    <span className="text-sm text-slate-400">
                                        Product details unavailable
                                    </span>

                                )}

                            </td>


                            {/* Status */}

                            <td className="px-6 py-4">

                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                                        challan.status ===
                                        "Confirmed"
                                            ? "bg-green-100 text-green-700"
                                            : challan.status ===
                                              "Cancelled"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-yellow-100 text-yellow-700"
                                    }`}
                                >
                                    {challan.status}
                                </span>

                            </td>


                            {/* Total */}

                            <td className="px-6 py-4 text-sm font-semibold">

                                ₹
                                {Number(
                                    challan.total_amount || 0
                                ).toLocaleString("en-IN")}

                            </td>


                            {/* Action */}

                            <td className="px-6 py-4">

                                {challan.status === "Draft" && (

                                    <button
                                        onClick={() =>
                                            handleConfirm(
                                                challan.id
                                            )
                                        }
                                        disabled={
                                            confirmingId ===
                                            challan.id
                                        }
                                        className="rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >

                                        {confirmingId ===
                                        challan.id
                                            ? "Confirming..."
                                            : "Confirm"}

                                    </button>

                                )}


                                {challan.status ===
                                    "Confirmed" && (

                                    <span className="text-xs font-medium text-green-600">
                                        Completed
                                    </span>

                                )}

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}

export default ChallanTable;