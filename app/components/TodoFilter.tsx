import {useFilterStore} from "../store/FilterStore";
import {FilterType} from "../dataType/FilterTypes";

function TodoFilter() {
    const filter = useFilterStore((s) => s.filter);
    const setFilter = useFilterStore((s) => s.setFilter);

    return (
        <div className="flex gap-2 mt-4">
            <button
                onClick={() => setFilter(FilterType.ALL)}
                className={filter === FilterType.ALL ? "btn-filter-active" : "btn-filter-inactive"}
            >
                All
            </button>

            <button
                onClick={() => setFilter(FilterType.ACTIVE)}
                className={filter === FilterType.ACTIVE ? "btn-filter-active" : "btn-filter-inactive"}
            >
                Active
            </button>

            <button
                onClick={() => setFilter(FilterType.COMPLETED)}
                className={filter === FilterType.COMPLETED ? "btn-filter-active" : "btn-filter-inactive"}
            >
                Completed
            </button>
        </div>
    );
}

export default TodoFilter;
