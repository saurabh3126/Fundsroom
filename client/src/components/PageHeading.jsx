function PageHeading({ title, description }) {
    return (
        <div className="mb-7">
            <h1 className="text-2xl font-bold text-slate-800">
                {title}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
                {description}
            </p>
        </div>
    );
}

export default PageHeading;