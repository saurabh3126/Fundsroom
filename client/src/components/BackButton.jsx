function BackButton({ onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="mb-5 flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
        >
            <span className="text-lg">←</span>
            Back
        </button>
    );
}

export default BackButton;