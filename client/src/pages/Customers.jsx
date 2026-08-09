import { useMemo, useState } from "react";

import {
    createCustomer,
    updateCustomer,
    deleteCustomer,
    searchCustomers
} from "../services/api";


const emptyForm = {
    customer_name: "",
    company_name: "",
    email: "",
    phone: "",
    gst_number: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    customer_type: "Retail",
    status: "Lead",
    follow_up_date: "",
    notes: ""
};


function Customers({
    customers = [],
    fetchData,
    user
}) {

    const [search, setSearch] = useState("");

    const [searchResults, setSearchResults] =
        useState(null);

    const [showForm, setShowForm] =
        useState(false);

    const [editingCustomer, setEditingCustomer] =
        useState(null);

    const [selectedCustomer, setSelectedCustomer] =
        useState(null);

    const [form, setForm] =
        useState(emptyForm);

    const [saving, setSaving] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");


    const role =
        user?.role || "Admin";


    // =========================================
    // CUSTOMER LIST
    // =========================================

    const displayedCustomers = useMemo(() => {

        if (searchResults !== null) {
            return searchResults;
        }

        return customers;

    }, [customers, searchResults]);


    // =========================================
    // SEARCH
    // =========================================

    const handleSearch = async (value) => {

        setSearch(value);
        setError("");

        if (!value.trim()) {

            setSearchResults(null);

            return;
        }

        try {

            const result =
                await searchCustomers(value);

            if (result.success) {

                setSearchResults(
                    result.data || []
                );

            } else {

                setSearchResults([]);

                setError(
                    result.message ||
                    "Search failed"
                );

            }

        } catch (err) {

            console.error(err);

            setError(
                "Unable to search customers."
            );

        }

    };


    // =========================================
    // FORM INPUT
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
    // OPEN ADD FORM
    // =========================================

    const openAddForm = () => {

        setEditingCustomer(null);

        setForm(emptyForm);

        setError("");

        setMessage("");

        setShowForm(true);

    };


    // =========================================
    // OPEN EDIT FORM
    // =========================================

    const openEditForm = (customer) => {

        setEditingCustomer(customer);

        setForm({

            customer_name:
                customer.customer_name || "",

            company_name:
                customer.company_name || "",

            email:
                customer.email || "",

            phone:
                customer.phone || "",

            gst_number:
                customer.gst_number || "",

            address:
                customer.address || "",

            city:
                customer.city || "",

            state:
                customer.state || "",

            pincode:
                customer.pincode || "",

            customer_type:
                customer.customer_type ||
                "Retail",

            status:
                customer.status ||
                "Lead",

            follow_up_date:
                customer.follow_up_date
                    ? customer.follow_up_date
                        .toString()
                        .slice(0, 10)
                    : "",

            notes:
                customer.notes || ""

        });

        setSelectedCustomer(null);

        setError("");

        setMessage("");

        setShowForm(true);

    };


    // =========================================
    // CLOSE FORM
    // =========================================

    const closeForm = () => {

        setShowForm(false);

        setEditingCustomer(null);

        setForm(emptyForm);

    };


    // =========================================
    // SAVE CUSTOMER
    // =========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setSaving(true);

        setError("");

        setMessage("");


        try {

            let result;


            if (editingCustomer) {

                result =
                    await updateCustomer(
                        editingCustomer.id,
                        form
                    );

            } else {

                result =
                    await createCustomer(
                        form
                    );

            }


            if (!result.success) {

                throw new Error(
                    result.message ||
                    "Operation failed"
                );

            }


            setMessage(
                editingCustomer
                    ? "Customer updated successfully."
                    : "Customer created successfully."
            );


            closeForm();


            await fetchData();


            if (search.trim()) {

                const searchResult =
                    await searchCustomers(
                        search
                    );

                if (searchResult.success) {

                    setSearchResults(
                        searchResult.data || []
                    );

                }

            }


        } catch (err) {

            console.error(err);

            setError(
                err.message ||
                "Unable to save customer."
            );

        } finally {

            setSaving(false);

        }

    };


    // =========================================
    // DELETE CUSTOMER
    // =========================================

    const handleDelete = async (customer) => {

        const confirmed =
            window.confirm(
                `Delete ${customer.customer_name}?`
            );


        if (!confirmed) {
            return;
        }


        setError("");

        setMessage("");


        try {

            const result =
                await deleteCustomer(
                    customer.id
                );


            if (!result.success) {

                throw new Error(
                    result.message ||
                    "Delete failed"
                );

            }


            setMessage(
                "Customer deleted successfully."
            );


            await fetchData();


            if (search.trim()) {

                const searchResult =
                    await searchCustomers(
                        search
                    );

                if (searchResult.success) {

                    setSearchResults(
                        searchResult.data || []
                    );

                }

            }


        } catch (err) {

            console.error(err);

            setError(
                err.message ||
                "Unable to delete customer."
            );

        }

    };


    // =========================================
    // ROLE PERMISSIONS
    // =========================================

    const canEdit =
        role === "Admin" ||
        role === "Sales";


    const canDelete =
        role === "Admin";


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
                        Customers
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Manage your customer relationships
                    </p>

                </div>


                {canEdit && (

                    <button
                        type="button"
                        onClick={openAddForm}
                        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                        + Add Customer
                    </button>

                )}

            </div>


            {/* ================================= */}
            {/* MESSAGES */}
            {/* ================================= */}

            {message && (

                <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {message}
                </div>

            )}


            {error && (

                <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>

            )}


            {/* ================================= */}
            {/* SEARCH */}
            {/* ================================= */}

            <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5">

                <label className="mb-2 block text-sm font-medium text-slate-700">
                    Search Customers
                </label>


                <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                        handleSearch(
                            e.target.value
                        )
                    }
                    placeholder="Search by name, company, email, phone or GST..."
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

            </div>


            {/* ================================= */}
            {/* CUSTOMER TABLE */}
            {/* ================================= */}

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-slate-50">

                            <tr>

                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Customer
                                </th>

                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Company
                                </th>

                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Type
                                </th>

                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Status
                                </th>

                                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Follow-up
                                </th>

                                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody className="divide-y divide-slate-100">

                            {displayedCustomers.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="px-5 py-12 text-center text-sm text-slate-500"
                                    >
                                        No customers found.
                                    </td>

                                </tr>

                            ) : (

                                displayedCustomers.map(
                                    (customer) => (

                                        <tr
                                            key={
                                                customer.id
                                            }
                                            className="transition hover:bg-slate-50"
                                        >

                                            <td className="px-5 py-4">

                                                <p className="font-medium text-slate-800">
                                                    {
                                                        customer.customer_name
                                                    }
                                                </p>

                                                <p className="mt-1 text-xs text-slate-500">
                                                    {
                                                        customer.phone ||
                                                        "No phone"
                                                    }
                                                </p>

                                            </td>


                                            <td className="px-5 py-4 text-sm text-slate-600">

                                                {
                                                    customer.company_name
                                                }

                                            </td>


                                            <td className="px-5 py-4">

                                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                                                    {
                                                        customer.customer_type ||
                                                        "Retail"
                                                    }
                                                </span>

                                            </td>


                                            <td className="px-5 py-4">

                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                        customer.status ===
                                                        "Active"
                                                            ? "bg-green-100 text-green-700"
                                                            : customer.status ===
                                                              "Inactive"
                                                            ? "bg-slate-200 text-slate-600"
                                                            : "bg-yellow-100 text-yellow-700"
                                                    }`}
                                                >
                                                    {
                                                        customer.status ||
                                                        "Lead"
                                                    }
                                                </span>

                                            </td>


                                            <td className="px-5 py-4 text-sm text-slate-600">

                                                {
                                                    customer.follow_up_date
                                                        ? new Date(
                                                              customer.follow_up_date
                                                          ).toLocaleDateString(
                                                              "en-IN"
                                                          )
                                                        : "—"
                                                }

                                            </td>


                                            <td className="px-5 py-4">

                                                <div className="flex justify-end gap-2">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setSelectedCustomer(
                                                                customer
                                                            )
                                                        }
                                                        className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                                                    >
                                                        View
                                                    </button>


                                                    {canEdit && (

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                openEditForm(
                                                                    customer
                                                                )
                                                            }
                                                            className="rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50"
                                                        >
                                                            Edit
                                                        </button>

                                                    )}


                                                    {canDelete && (

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    customer
                                                                )
                                                            }
                                                            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                                                        >
                                                            Delete
                                                        </button>

                                                    )}

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* ================================= */}
            {/* VIEW CUSTOMER */}
            {/* ================================= */}

            {selectedCustomer && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl">

                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

                            <div>

                                <h2 className="text-xl font-bold text-slate-800">
                                    Customer Details
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    {
                                        selectedCustomer.customer_name
                                    }
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    setSelectedCustomer(
                                        null
                                    )
                                }
                                className="text-2xl text-slate-400 hover:text-slate-700"
                            >
                                ×
                            </button>

                        </div>


                        <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">

                            <Detail
                                label="Customer Name"
                                value={
                                    selectedCustomer.customer_name
                                }
                            />

                            <Detail
                                label="Company"
                                value={
                                    selectedCustomer.company_name
                                }
                            />

                            <Detail
                                label="Email"
                                value={
                                    selectedCustomer.email
                                }
                            />

                            <Detail
                                label="Phone"
                                value={
                                    selectedCustomer.phone
                                }
                            />

                            <Detail
                                label="GST Number"
                                value={
                                    selectedCustomer.gst_number
                                }
                            />

                            <Detail
                                label="Customer Type"
                                value={
                                    selectedCustomer.customer_type
                                }
                            />

                            <Detail
                                label="Status"
                                value={
                                    selectedCustomer.status
                                }
                            />

                            <Detail
                                label="Follow-up Date"
                                value={
                                    selectedCustomer.follow_up_date
                                        ? new Date(
                                              selectedCustomer.follow_up_date
                                          ).toLocaleDateString(
                                              "en-IN"
                                          )
                                        : "—"
                                }
                            />

                            <Detail
                                label="Address"
                                value={
                                    selectedCustomer.address
                                }
                            />

                            <Detail
                                label="City"
                                value={
                                    selectedCustomer.city
                                }
                            />

                            <Detail
                                label="State"
                                value={
                                    selectedCustomer.state
                                }
                            />

                            <Detail
                                label="Pincode"
                                value={
                                    selectedCustomer.pincode
                                }
                            />

                            <div className="md:col-span-2">

                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Notes
                                </p>

                                <p className="mt-2 rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
                                    {
                                        selectedCustomer.notes ||
                                        "No notes added."
                                    }
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            )}


            {/* ================================= */}
            {/* ADD / EDIT FORM */}
            {/* ================================= */}

            {showForm && (

                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

                    <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-xl">

                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

                            <div>

                                <h2 className="text-xl font-bold text-slate-800">

                                    {editingCustomer
                                        ? "Edit Customer"
                                        : "Add Customer"}

                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Enter customer information
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


                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6 p-6"
                        >

                            {/* BASIC DETAILS */}

                            <div>

                                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
                                    Basic Information
                                </h3>


                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                                    <Input
                                        label="Customer Name *"
                                        name="customer_name"
                                        value={
                                            form.customer_name
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />


                                    <Input
                                        label="Company Name *"
                                        name="company_name"
                                        value={
                                            form.company_name
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />


                                    <Input
                                        label="Email"
                                        name="email"
                                        type="email"
                                        value={
                                            form.email
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />


                                    <Input
                                        label="Phone"
                                        name="phone"
                                        value={
                                            form.phone
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />


                                    <Input
                                        label="GST Number"
                                        name="gst_number"
                                        value={
                                            form.gst_number
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />


                                    <Input
                                        label="Pincode *"
                                        name="pincode"
                                        value={
                                            form.pincode
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />

                                </div>

                            </div>


                            {/* ADDRESS */}

                            <div>

                                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
                                    Address
                                </h3>


                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                                    <div className="md:col-span-2">

                                        <Input
                                            label="Address *"
                                            name="address"
                                            value={
                                                form.address
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                    </div>


                                    <Input
                                        label="City *"
                                        name="city"
                                        value={
                                            form.city
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />


                                    <Input
                                        label="State *"
                                        name="state"
                                        value={
                                            form.state
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />

                                </div>

                            </div>


                            {/* CRM DETAILS */}

                            <div>

                                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
                                    CRM Information
                                </h3>


                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                                    <Select
                                        label="Customer Type"
                                        name="customer_type"
                                        value={
                                            form.customer_type
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        options={[
                                            "Retail",
                                            "Wholesale",
                                            "Distributor"
                                        ]}
                                    />


                                    <Select
                                        label="Status"
                                        name="status"
                                        value={
                                            form.status
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        options={[
                                            "Lead",
                                            "Active",
                                            "Inactive"
                                        ]}
                                    />


                                    <Input
                                        label="Follow-up Date"
                                        name="follow_up_date"
                                        type="date"
                                        value={
                                            form.follow_up_date
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />


                                    <div className="md:col-span-2">

                                        <label className="mb-2 block text-sm font-medium text-slate-700">
                                            Notes
                                        </label>

                                        <textarea
                                            name="notes"
                                            value={
                                                form.notes
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            rows="4"
                                            placeholder="Add follow-up notes..."
                                            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />

                                    </div>

                                </div>

                            </div>


                            {/* ACTIONS */}

                            <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">

                                <button
                                    type="button"
                                    onClick={closeForm}
                                    className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
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
                                        : editingCustomer
                                        ? "Update Customer"
                                        : "Create Customer"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>

    );

}


// =========================================
// DETAIL COMPONENT
// =========================================

function Detail({
    label,
    value
}) {

    return (

        <div>

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {label}
            </p>

            <p className="mt-1 text-sm text-slate-800">
                {value || "—"}
            </p>

        </div>

    );

}


// =========================================
// INPUT COMPONENT
// =========================================

function Input({
    label,
    name,
    type = "text",
    value,
    onChange,
    required = false
}) {

    return (

        <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
                {label}
            </label>

            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

        </div>

    );

}


// =========================================
// SELECT COMPONENT
// =========================================

function Select({
    label,
    name,
    value,
    onChange,
    options
}) {

    return (

        <div>

            <label className="mb-2 block text-sm font-medium text-slate-700">
                {label}
            </label>

            <select
                name={name}
                value={value}
                onChange={onChange}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >

                {options.map(
                    (option) => (

                        <option
                            key={option}
                            value={option}
                        >
                            {option}
                        </option>

                    )
                )}

            </select>

        </div>

    );

}


export default Customers;