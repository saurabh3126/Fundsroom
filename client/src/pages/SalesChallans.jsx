import { useState } from "react";

import PageHeading from "../components/PageHeading";
import BackButton from "../components/BackButton";

import { createChallan } from "../services/api";

function SalesChallans({
    customers = [],
    products = [],
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

    const [message, setMessage] = useState("");


    // Add product row
    const addProduct = () => {
        setItems([
            ...items,
            {
                product_id: "",
                quantity: 1
            }
        ]);
    };


    // Remove product row
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
    };


    // Change product
    const updateProduct = (
        index,
        value
    ) => {

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
    };


    // Change quantity
    const updateQuantity = (
        index,
        value
    ) => {

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
    };


    // Create draft
    const handleCreate = async () => {

        setMessage("");


        if (!customerId) {

            setMessage(
                "Please select a customer."
            );

            return;
        }


        for (const item of items) {

            if (!item.product_id) {

                setMessage(
                    "Please select a product for every row."
                );

                return;
            }


            if (Number(item.quantity) <= 0) {

                setMessage(
                    "Quantity must be greater than 0."
                );

                return;
            }
        }


        // Prevent duplicate products
        const productIds = items.map(
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


            // Reset form
            setCustomerId("");


            setItems([
                {
                    product_id: "",
                    quantity: 1
                }
            ]);


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


    return (
        <div>

            {/* Back */}

            <BackButton
                onClick={onBack}
            />


            {/* Heading */}

            <PageHeading
                title="Sales Challans"
                description="Create and manage sales challans"
            />


            {/* Form */}

            <div className="rounded-xl border border-slate-200 bg-white p-6">

                <h2 className="mb-6 text-lg font-semibold text-slate-800">
                    Create Sales Challan
                </h2>


                {/* Customer */}

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
                                    key={
                                        customer.id
                                    }
                                    value={
                                        customer.id
                                    }
                                >
                                    {
                                        customer.customer_name
                                    }

                                    {" - "}

                                    {
                                        customer.company_name
                                    }

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


                {/* Products header */}

                <div className="mb-3 flex items-center justify-between">

                    <h3 className="text-sm font-semibold text-slate-700">
                        Products
                    </h3>


                    <button
                        type="button"
                        onClick={
                            addProduct
                        }
                        className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
                    >
                        + Add Product
                    </button>

                </div>


                {/* Product rows */}

                <div className="space-y-3">

                    {items.map(
                        (item, index) => (

                            <div
                                key={index}
                                className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 md:grid-cols-[1fr_180px_auto]"
                            >

                                {/* Product */}

                                <div>

                                    <label className="mb-2 block text-xs font-medium text-slate-500">
                                        Product
                                    </label>


                                    <select
                                        value={
                                            item.product_id
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            updateProduct(
                                                index,
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    >

                                        <option value="">
                                            Select product
                                        </option>


                                        {products.map(
                                            (
                                                product
                                            ) => (

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

                                </div>


                                {/* Quantity */}

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
                                        onChange={(
                                            event
                                        ) =>
                                            updateQuantity(
                                                index,
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />

                                </div>


                                {/* Remove */}

                                <div className="flex items-end">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeProduct(
                                                index
                                            )
                                        }
                                        disabled={
                                            items.length ===
                                            1
                                        }
                                        className="w-full rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        Remove
                                    </button>

                                </div>

                            </div>

                        )
                    )}

                </div>


                {/* Message */}

                {message && (

                    <div className="mt-5 rounded-lg bg-slate-100 px-4 py-3 text-sm text-slate-700">
                        {message}
                    </div>

                )}


                {/* Create */}

                <button
                    type="button"
                    onClick={
                        handleCreate
                    }
                    disabled={
                        creating
                    }
                    className="mt-6 rounded-lg bg-green-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {creating
                        ? "Creating..."
                        : "Create Draft"}
                </button>

            </div>

        </div>
    );
}

export default SalesChallans;