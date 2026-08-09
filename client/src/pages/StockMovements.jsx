import PageHeading from "../components/PageHeading";
import MovementTable from "../components/MovementTable";

function StockMovements({ movements = [] }) {
    return (
        <div>

            <PageHeading
                title="Stock Movements"
                description="Track inventory IN and OUT movements"
            />

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">

                <MovementTable
                    movements={movements}
                />

            </div>

        </div>
    );
}

export default StockMovements;