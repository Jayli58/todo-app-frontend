interface TodoFilterProps {
    filter: string
    setFilter: (value: string) => void;
}

function TodoFilter({filter, setFilter}: TodoFilterProps) {
    return (
        <div className="flex gap-2 mt-4">
            {["all", "active", "completed"].map((value) => (
                <button
                    key={value}
                    onClick={() => setFilter(value)}
                    className={
                        filter === value ? "btn-filter-active" : "btn-filter-inactive"
                    }
                >
                    {value[0].toUpperCase() + value.slice(1)}
                </button>
            ))}
            {/*<button className="btn-filter" onClick={() => setFilter('all')}>All</button>*/}
            {/*<button className="btn-filter" onClick={() => setFilter('active')}>Active</button>*/}
            {/*<button className="btn-filter" onClick={() => setFilter('completed')}>Completed</button>*/}
        </div>
    );
}

export default TodoFilter;
