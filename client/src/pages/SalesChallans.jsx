import { useState } from "react";

import PageHeading from "../components/PageHeading";
import BackButton from "../components/BackButton";

import {
    createChallan,
    confirmChallan
} from "../services/api";


function SalesChallans({
    customers = [],
    products = [],
    inventory = [],
    challans = [],
    fetchData,
    onBack
}) {

    const [customerId, setCustomerId] = useState("");

    const [items, setItems] = useState([
        {
            product_id: "",
            quantity: 1
        }
    ]);

    const [creating, setCreating] = useState(false);

    const [confirmingId, setConfirmingId] = useState(null);

    const [message, setMessage] = useState("");


    // =========================================
    // GET PRODUCT STOCK
    // =========================================

    const getProductStock = (productId) => {

        const stockItem = inventory.find(
            (item) =>
                Number(item.product_id) ===
                Number(productId)
        );

        if (!stockItem) {
            return 0;
        }

        return Number(stockItem.quantity || 0);
    };


    // =========================================
    // GET PRODUCT
    // =========================================

    const getProduct = (productId) => {

        return products.find(
            (product) =>
                Number(product.id) ===
                Number(productId)
        );

    };


    // =========================================
    // ADD PRODUCT
    // =========================================

    const addProduct = () => {

        setItems([
            ...items,
            {
                product_id: "",
                quantity: 1
            }
        ]);

        setMessage("");

    };


    // =========================================
    // REMOVE PRODUCT
    // =========================================

    const removeProduct = (index) => {

        if (items.length === 1) {
            return;
        }

        setItems(
            items.filter(
                (_, itemIndex) =>
                    itemIndex !== index
            )
        );

        setMessage("");

    };


    // =========================================
    // UPDATE PRODUCT
    // =========================================

    const updateProduct = (index, value) => {

        setItems((current) =>
            current.map(
                (item, itemIndex) =>
                    itemIndex === index
                        ? {
                            ...item,
                            product_id: value
                        }
                        : item
            )
        );

        setMessage("");

    };


    // =========================================
    // UPDATE QUANTITY
    // =========================================

    const updateQuantity = (index, value) => {

        setItems((current) =>
            current.map(
                (item, itemIndex) =>
                    itemIndex === index
                        ? {
                            ...item,
                            quantity: value
                        }
                        : item
            )
        );

        setMessage("");

    };


    // =========================================
    // CREATE DRAFT
    // =========================================

    const handleCreate = async () => {

        setMessage("");


        if (!customerId) {

            setMessage(
                "Please select a customer."
            );

            return;
        }


        // Validate every product

        for (const item of items) {

            if (!item.product_id) {

                setMessage(
                    "Please select a product for every row."
                );

                return;
            }


            const requestedQuantity =
                Number(item.quantity);


            if (
                !Number.isInteger(
                    requestedQuantity
                ) ||
                requestedQuantity <= 0
            ) {

                const product =
                    getProduct(
                        item.product_id
                    );

                setMessage(
                    `Please enter a valid quantity for ${product?.product_name || "the product"}.`
                );

                return;
            }


            const availableStock =
                getProductStock(
                    item.product_id
                );


            const product =
                getProduct(
                    item.product_id
                );


            const productName =
                product?.product_name ||
                "Product";


            // No stock

            if (availableStock <= 0) {

                setMessage(
                    `${productName} is not in stock.`
                );

                return;
            }


            // Not enough stock

            if (
                requestedQuantity >
                availableStock
            ) {

                setMessage(
                    `Only ${availableStock} units of ${productName} are available.`
                );

                return;
            }

        }


        // =====================================
        // PREVENT DUPLICATE PRODUCTS
        // =====================================

        const productIds =
            items.map(
                (item) =>
                    Number(item.product_id)
            );


        if (
            new Set(productIds).size !==
            productIds.length
        ) {

            setMessage(
                "The same product cannot be added twice."
            );

            return;
        }


        // =====================================
        // CREATE
        // =====================================

        try {

            setCreating(true);


            const result =
                await createChallan(
                    customerId,
                    items
                );


            if (!result.success) {

                throw new Error(
                    result.message ||
                    "Failed to create challan."
                );

            }


            setMessage(
                "Sales challan created successfully."
            );


            setCustomerId("");

            setItems([
                {
                    product_id: "",
                    quantity: 1
                }
            ]);


            if (fetchData) {
                await fetchData();
            }


        } catch (error) {

            console.error(
                "Create challan error:",
                error
            );


            setMessage(
                error.message ||
                "Something went wrong."
            );

        } finally {

            setCreating(false);

        }

    };


    // =========================================
    // CONFIRM CHALLAN
    // =========================================

    const handleConfirm = async (challanId) => {

        setMessage("");

        try {

            setConfirmingId(challanId);


            const result =
                await confirmChallan(
                    challanId
                );


            if (!result.success) {

                throw new Error(
                    result.message ||
                    "Failed to confirm challan."
                );

            }


            setMessage(
                "Sales challan confirmed successfully. Stock has been reduced."
            );


            if (fetchData) {
                await fetchData();
            }


        } catch (error) {

            console.error(
                "Confirm challan error:",
                error
            );


            setMessage(
                error.message ||
                "Unable to confirm challan."
            );

        } finally {

            setConfirmingId(null);

        }

    };


    // =========================================
    // FORMAT MONEY
    // =========================================

    const formatAmount = (amount) => {

        const number =
            Number(amount || 0);

        return `₹${number.toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        )}`;

    };


    // =========================================
    // UI
    // =========================================

    return (

        <div>

            {/* BACK BUTTON */}

            <BackButton
                onClick={onBack}
            />


            {/* PAGE HEADING */}

            <PageHeading
                title="Sales Challans"
                description="Create and manage sales challans"
            />


            {/* ================================= */}
            {/* CREATE CHALLAN */}
            {/* ================================= */}

            <div className="rounded-xl border border-slate-200 bg-white p-6">

                <h2 className="mb-6 text-lg font-semibold text-slate-800">
                    Create Sales Challan
                </h2>


                {/* CUSTOMER */}

                <div className="mb-6 max-w-md">

                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Customer
                    </label>


                    <select
                        value={customerId}
                        onChange={(event) =>
                            setCustomerId(
                                event.target.value
                            )
                        }
                        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >

                        <option value="">
                            Select customer
                        </option>


                        {customers.map(
                            (customer) => (

                                <option
                                    key={customer.id}
                                    value={customer.id}
                                >
                                    {customer.customer_name}
                                    {" - "}
                                    {customer.company_name}
                                </option>

                            )
                        )}

                    </select>


                    {customers.length === 0 && (

                        <p className="mt-2 text-sm text-red-500">
                            No customers found.
                        </p>

                    )}

                </div>


                {/* PRODUCTS HEADER */}

                <div className="mb-3 flex items-center justify-between">

                    <h3 className="text-sm font-semibold text-slate-700">
                        Products
                    </h3>


                    <button
                        type="button"
                        onClick={addProduct}
                        className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                    >
                        + Add Product
                    </button>

                </div>


                {/* PRODUCT ROWS */}

                <div className="space-y-3">

                    {items.map(
                        (item, index) => {

                            const selectedProduct =
                                getProduct(
                                    item.product_id
                                );

                            const availableStock =
                                getProductStock(
                                    item.product_id
                                );

                            const requestedQuantity =
                                Number(
                                    item.quantity
                                );


                            return (

                                <div
                                    key={index}
                                    className="grid grid-cols-1 gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 md:grid-cols-[1fr_180px_auto]"
                                >

                                    {/* PRODUCT */}

                                    <div>

                                        <label className="mb-2 block text-xs font-medium text-slate-500">
                                            Product
                                        </label>


                                        <select
                                            value={
                                                item.product_id
                                            }
                                            onChange={(event) =>
                                                updateProduct(
                                                    index,
                                                    event.target.value
                                                )
                                            }
                                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        >

                                            <option value="">
                                                Select product
                                            </option>


                                            {products.map(
                                                (product) => (

                                                    <option
                                                        key={
                                                            product.id
                                                        }
                                                        value={
                                                            product.id
                                                        }
                                                    >
                                                        {
                                                            product.product_name
                                                        }

                                                        {product.sku
                                                            ? ` - ${product.sku}`
                                                            : ""}
                                                    </option>

                                                )
                                            )}

                                        </select>


                                        {/* STOCK STATUS */}

                                        {item.product_id && (

                                            <div className="mt-2">

                                                {availableStock <= 0 ? (

                                                    <p className="text-xs font-semibold text-red-600">
                                                        ⚠ Not in stock
                                                    </p>

                                                ) : availableStock <= 5 ? (

                                                    <p className="text-xs font-semibold text-orange-600">
                                                        ⚠ Low stock — only{" "}
                                                        {availableStock}{" "}
                                                        {availableStock === 1
                                                            ? "unit"
                                                            : "units"}{" "}
                                                        available
                                                    </p>

                                                ) : (

                                                    <p className="text-xs font-medium text-green-600">
                                                        ✓{" "}
                                                        {availableStock}{" "}
                                                        units available
                                                    </p>

                                                )}

                                            </div>

                                        )}


                                        {/* QUANTITY ERROR */}

                                        {item.product_id &&
                                            availableStock > 0 &&
                                            requestedQuantity >
                                                availableStock && (

                                                <p className="mt-1 text-xs font-semibold text-red-600">

                                                    Only{" "}
                                                    {availableStock}{" "}
                                                    units of{" "}
                                                    {
                                                        selectedProduct?.product_name
                                                    }{" "}
                                                    are available.

                                                </p>

                                            )}

                                    </div>


                                    {/* QUANTITY */}

                                    <div>

                                        <label className="mb-2 block text-xs font-medium text-slate-500">
                                            Quantity
                                        </label>


                                        <input
                                            type="number"
                                            min="1"
                                            value={
                                                item.quantity
                                            }
                                            onChange={(event) =>
                                                updateQuantity(
                                                    index,
                                                    event.target.value
                                                )
                                            }
                                            className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:ring-1 ${
                                                item.product_id &&
                                                availableStock > 0 &&
                                                requestedQuantity >
                                                    availableStock
                                                    ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                                                    : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                                            }`}
                                        />

                                    </div>


                                    {/* REMOVE */}

                                    <div className="flex items-end">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeProduct(
                                                    index
                                                )
                                            }
                                            disabled={
                                                items.length === 1
                                            }
                                            className="w-full rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                                        >
                                            Remove
                                        </button>

                                    </div>

                                </div>

                            );

                        }
                    )}

                </div>


                {/* MESSAGE */}

                {message && (

                    <div
                        className={`mt-5 rounded-lg px-4 py-3 text-sm ${
                            message.includes(
                                "successfully"
                            )
                                ? "bg-green-50 text-green-700"
                                : "bg-red-50 text-red-700"
                        }`}
                    >
                        {message}
                    </div>

                )}


                {/* CREATE BUTTON */}

                <button
                    type="button"
                    onClick={handleCreate}
                    disabled={creating}
                    className="mt-6 rounded-lg bg-green-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {creating
                        ? "Creating..."
                        : "Create Draft"}
                </button>

            </div>


            {/* ================================= */}
            {/* SAVED CHALLANS */}
            {/* ================================= */}

            <div className="mt-8">

                <div className="mb-4">

                    <h2 className="text-xl font-semibold text-slate-800">
                        Sales Challans
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        View created challans and their products.
                    </p>

                </div>


                {challans.length === 0 ? (

                    <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">

                        <p className="text-sm text-slate-500">
                            No sales challans found.
                        </p>

                    </div>

                ) : (

                    <div className="space-y-5">

                        {challans.map(
                            (challan) => (

                                <div
                                    key={
                                        challan.id
                                    }
                                    className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                                >

                                    {/* CHALLAN HEADER */}

                                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">

                                        <div>

                                            <h3 className="text-lg font-semibold text-slate-800">
                                                Challan #
                                                {challan.id}
                                            </h3>

                                            <p className="mt-1 text-sm text-slate-500">
                                                {
                                                    challan.customer_name
                                                }
                                                {" - "}
                                                {
                                                    challan.company_name
                                                }
                                            </p>

                                            {challan.challan_date && (

                                                <p className="mt-1 text-xs text-slate-400">
                                                    Date:{" "}
                                                    {
                                                        new Date(
                                                            challan.challan_date
                                                        ).toLocaleDateString(
                                                            "en-IN"
                                                        )
                                                    }
                                                </p>

                                            )}

                                        </div>


                                        {/* STATUS */}

                                        <span
                                            className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                                                challan.status ===
                                                "Confirmed"
                                                    ? "bg-green-100 text-green-700"
                                                    : challan.status ===
                                                      "Cancelled"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                            }`}
                                        >
                                            {
                                                challan.status
                                            }
                                        </span>

                                    </div>


                                    {/* PRODUCTS */}

                                    <div className="mt-5">

                                        <h4 className="mb-3 text-sm font-semibold text-slate-700">
                                            Products
                                        </h4>


                                        {challan.items &&
                                        challan.items.length >
                                            0 ? (

                                            <div className="overflow-hidden rounded-lg border border-slate-200">

                                                <table className="w-full text-left text-sm">

                                                    <thead className="bg-slate-50 text-xs uppercase text-slate-500">

                                                        <tr>

                                                            <th className="px-4 py-3">
                                                                Product
                                                            </th>

                                                            <th className="px-4 py-3">
                                                                SKU
                                                            </th>

                                                            <th className="px-4 py-3 text-center">
                                                                Quantity
                                                            </th>

                                                            <th className="px-4 py-3 text-right">
                                                                Price
                                                            </th>

                                                            <th className="px-4 py-3 text-right">
                                                                Subtotal
                                                            </th>

                                                        </tr>

                                                    </thead>


                                                    <tbody className="divide-y divide-slate-200">

                                                        {challan.items.map(
                                                            (item) => (

                                                                <tr
                                                                    key={
                                                                        item.id
                                                                    }
                                                                >

                                                                    <td className="px-4 py-3 font-medium text-slate-800">
                                                                        {
                                                                            item.product_name
                                                                        }
                                                                    </td>

                                                                    <td className="px-4 py-3 text-slate-500">
                                                                        {
                                                                            item.sku
                                                                        }
                                                                    </td>

                                                                    <td className="px-4 py-3 text-center text-slate-700">
                                                                        {
                                                                            item.quantity
                                                                        }
                                                                    </td>

                                                                    <td className="px-4 py-3 text-right text-slate-700">
                                                                        {formatAmount(
                                                                            item.price
                                                                        )}
                                                                    </td>

                                                                    <td className="px-4 py-3 text-right font-medium text-slate-800">
                                                                        {formatAmount(
                                                                            item.subtotal
                                                                        )}
                                                                    </td>

                                                                </tr>

                                                            )
                                                        )}

                                                    </tbody>

                                                </table>

                                            </div>

                                        ) : (

                                            <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
                                                No products found for this challan.
                                            </p>

                                        )}

                                    </div>


                                    {/* FOOTER */}

                                    <div className="mt-5 flex flex-col gap-4 border-t border-slate-200 pt-5 md:flex-row md:items-center md:justify-between">

                                        <div>

                                            <span className="text-sm text-slate-500">
                                                Total Amount
                                            </span>

                                            <p className="text-xl font-bold text-slate-800">
                                                {formatAmount(
                                                    challan.total_amount
                                                )}
                                            </p>

                                        </div>


                                        {/* CONFIRM */}

                                        {challan.status ===
                                            "Draft" && (

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleConfirm(
                                                        challan.id
                                                    )
                                                }
                                                disabled={
                                                    confirmingId ===
                                                    challan.id
                                                }
                                                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {confirmingId ===
                                                challan.id
                                                    ? "Confirming..."
                                                    : "Confirm Challan"}
                                            </button>

                                        )}

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>

        </div>
    );
}

export default SalesChallans;