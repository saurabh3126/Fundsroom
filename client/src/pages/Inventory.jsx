import PageHeading from "../components/PageHeading";
import InventoryTable from "../components/InventoryTable";

function Inventory({ inventory = [] }) {
    return (
        <div>
            <PageHeading
                title="Inventory"
                description="Monitor current stock levels"
            />

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <InventoryTable data={inventory} />
            </div>
        </div>
    );
}

export default Inventory;