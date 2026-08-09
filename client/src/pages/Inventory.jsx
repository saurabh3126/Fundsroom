import { useState } from "react";

import InventoryTable from "../components/InventoryTable";

import {
    createProduct,
    updateProduct,
    createInventory,
    updateInventory
} from "../services/api";


const emptyProduct = {
    product_name: "",
    sku: "",
    description: "",
    category: "",
    price: "",
    quantity: "",
    minimum_stock: ""
};


function Inventory({
    inventory = [],
    products = [],
    fetchData,
    user
}) {

    // =========================================
    // STATE
    // =========================================

    const [showForm, setShowForm] =
        useState(false);

    const [editingProduct, setEditingProduct] =
        useState(null);

    const [editingInventory, setEditingInventory] =
        useState(null);

    const [form, setForm] =
        useState(emptyProduct);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [message, setMessage] =
        useState("");


    // =========================================
    // ROLE
    // =========================================

    const role =
        user?.role || "Admin";


    const canManageProducts =
        role === "Admin" ||
        role === "Warehouse";


    // =========================================
    // ADD PRODUCT
    // =========================================

    const openAddProduct = () => {

        setEditingProduct(null);

        setEditingInventory(null);

        setForm({
            ...emptyProduct
        });

        setError("");

        setMessage("");

        setShowForm(true);

    };


    // =========================================
    // EDIT PRODUCT
    // =========================================

    const openEditProduct = (item) => {

        setEditingProduct(item);

        setEditingInventory(item);

        setForm({

            product_name:
                item.product_name || "",

            sku:
                item.sku || "",

            description:
                item.description || "",

            category:
                item.category || "",

            price:
                item.price ?? "",

            quantity:
                item.quantity ?? "",

            minimum_stock:
                item.minimum_stock ?? ""

        });

        setError("");

        setMessage("");

        setShowForm(true);

    };


    // =========================================
    // CLOSE FORM
    // =========================================

    const closeForm = () => {

        setShowForm(false);

        setEditingProduct(null);

        setEditingInventory(null);

        setForm({
            ...emptyProduct
        });

        setError("");

    };


    // =========================================
    // HANDLE INPUT
    // =========================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setForm((previous) => ({

            ...previous,

            [name]: value

        }));

    };


    // =========================================
    // SUBMIT
    // =========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setSaving(true);

        setError("");

        setMessage("");


        try {

            // =====================================
            // VALIDATION
            // =====================================

            if (!form.product_name.trim()) {

                throw new Error(
                    "Product name is required"
                );

            }


            if (!form.sku.trim()) {

                throw new Error(
                    "SKU is required"
                );

            }


            if (
                form.quantity === "" ||
                Number(form.quantity) < 0
            ) {

                throw new Error(
                    "Quantity must be 0 or more"
                );

            }


            if (
                form.minimum_stock === "" ||
                Number(form.minimum_stock) < 0
            ) {

                throw new Error(
                    "Minimum stock must be 0 or more"
                );

            }


            if (
                form.price === "" ||
                Number(form.price) < 0
            ) {

                throw new Error(
                    "Price must be 0 or more"
                );

            }


            // =====================================
            // PRODUCT DATA
            // =====================================

            const productData = {

                product_name:
                    form.product_name.trim(),

                sku:
                    form.sku.trim(),

                description:
                    form.description.trim(),

                category:
                    form.category.trim(),

                /*
                 * We keep the existing database
                 * unit internally.
                 *
                 * It is NOT shown in the UI.
                 */
                unit:
                    editingProduct?.unit ||
                    "piece",

                price:
                    Number(form.price)

            };


            // =====================================
            // CREATE PRODUCT
            // =====================================

            if (!editingProduct) {

                const productResult =
                    await createProduct(
                        productData
                    );


                if (
                    !productResult ||
                    !productResult.success
                ) {

                    throw new Error(
                        productResult?.message ||
                        "Unable to create product"
                    );

                }


                const newProduct =
                    productResult.data;


                // =================================
                // CREATE INVENTORY
                // =================================

                const inventoryResult =
                    await createInventory({

                        product_id:
                            Number(
                                newProduct.id
                            ),

                        quantity:
                            Number(
                                form.quantity
                            ),

                        minimum_stock:
                            Number(
                                form.minimum_stock
                            )

                    });


                if (
                    !inventoryResult ||
                    !inventoryResult.success
                ) {

                    throw new Error(
                        inventoryResult?.message ||
                        "Product created but inventory could not be created"
                    );

                }


                setMessage(
                    "Product created successfully."
                );

            }


            // =====================================
            // UPDATE PRODUCT
            // =====================================

            else {

                const productId =
                    editingProduct.product_id ||
                    editingProduct.id;


                const productResult =
                    await updateProduct(
                        productId,
                        productData
                    );


                if (
                    !productResult ||
                    !productResult.success
                ) {

                    throw new Error(
                        productResult?.message ||
                        "Unable to update product"
                    );

                }


                // =================================
                // UPDATE INVENTORY
                // =================================

                if (editingInventory?.id) {

                    const inventoryResult =
                        await updateInventory(
                            editingInventory.id,
                            {

                                quantity:
                                    Number(
                                        form.quantity
                                    ),

                                minimum_stock:
                                    Number(
                                        form.minimum_stock
                                    )

                            }
                        );


                    if (
                        !inventoryResult ||
                        !inventoryResult.success
                    ) {

                        throw new Error(
                            inventoryResult?.message ||
                            "Inventory could not be updated"
                        );

                    }

                }


                setMessage(
                    "Product and inventory updated successfully."
                );

            }


            // =====================================
            // REFRESH
            // =====================================

            if (fetchData) {

                await fetchData();

            }


            closeForm();


        } catch (err) {

            console.error(
                "Product / Inventory Error:",
                err
            );


            setError(
                err.message ||
                "Unable to save product."
            );

        } finally {

            setSaving(false);

        }

    };


    // =========================================
    // UI
    // =========================================

    return (

        <div>

            {/* ================================= */}
            {/* HEADER */}
            {/* ================================= */}

            <div className="mb-8 flex items-center justify-between">

                <div>

                    <h1 className="text-2xl font-bold text-slate-800">
                        Inventory
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Manage products and current stock
                    </p>

                </div>


                {canManageProducts && (

                    <button
                        type="button"
                        onClick={openAddProduct}
                        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                        + Add Product
                    </button>

                )}

            </div>


            {/* ================================= */}
            {/* SUCCESS MESSAGE */}
            {/* ================================= */}

            {message && (

                <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {message}
                </div>

            )}


            {/* ================================= */}
            {/* ERROR MESSAGE */}
            {/* ================================= */}

            {error && (

                <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>

            )}


            {/* ================================= */}
            {/* INVENTORY TABLE */}
            {/* ================================= */}

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">

                <InventoryTable
                    data={inventory}
                    products={products}
                    canManageProducts={
                        canManageProducts
                    }
                    onEditProduct={
                        openEditProduct
                    }
                />

            </div>


            {/* ================================= */}
            {/* MODAL */}
            {/* ================================= */}

            {showForm && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

                    <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-xl">


                        {/* ================================= */}
                        {/* MODAL HEADER */}
                        {/* ================================= */}

                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

                            <div>

                                <h2 className="text-xl font-bold text-slate-800">

                                    {editingProduct
                                        ? "Edit Product"
                                        : "Add Product"}

                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Enter product and stock information
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={closeForm}
                                className="text-2xl text-slate-400 hover:text-slate-700"
                            >
                                ×
                            </button>

                        </div>


                        {/* ================================= */}
                        {/* FORM */}
                        {/* ================================= */}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5 p-6"
                        >

                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">


                                {/* PRODUCT NAME */}

                                <div>

                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Product Name *
                                    </label>

                                    <input
                                        type="text"
                                        name="product_name"
                                        value={
                                            form.product_name
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />

                                </div>


                                {/* SKU */}

                                <div>

                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        SKU *
                                    </label>

                                    <input
                                        type="text"
                                        name="sku"
                                        value={
                                            form.sku
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm uppercase outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />

                                </div>


                                {/* CATEGORY */}

                                <div>

                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Category
                                    </label>

                                    <input
                                        type="text"
                                        name="category"
                                        value={
                                            form.category
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Electronics"
                                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />

                                </div>


                                {/* QUANTITY */}

                                <div>

                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Quantity *
                                    </label>

                                    <input
                                        type="number"
                                        name="quantity"
                                        value={
                                            form.quantity
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        min="0"
                                        step="1"
                                        required
                                        placeholder="0"
                                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />

                                </div>


                                {/* MINIMUM STOCK */}

                                <div>

                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Minimum Stock *
                                    </label>

                                    <input
                                        type="number"
                                        name="minimum_stock"
                                        value={
                                            form.minimum_stock
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        min="0"
                                        step="1"
                                        required
                                        placeholder="5"
                                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />

                                </div>


                                {/* PRICE */}

                                <div>

                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Unit Price *
                                    </label>

                                    <input
                                        type="number"
                                        name="price"
                                        value={
                                            form.price
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        min="0"
                                        step="0.01"
                                        required
                                        placeholder="0.00"
                                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />

                                </div>

                            </div>


                            {/* ================================= */}
                            {/* DESCRIPTION */}
                            {/* ================================= */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={
                                        form.description
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    rows="4"
                                    placeholder="Product description..."
                                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />

                            </div>


                            {/* ================================= */}
                            {/* ACTIONS */}
                            {/* ================================= */}

                            <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">

                                <button
                                    type="button"
                                    onClick={closeForm}
                                    disabled={saving}
                                    className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >

                                    {saving
                                        ? "Saving..."
                                        : editingProduct
                                        ? "Update Product"
                                        : "Create Product"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>

    );

}


export default Inventory;