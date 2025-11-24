function TodoFilter({setFilter}: any) {
    return (
        <div>
            <buttton onClick={() => setFilter('all')}>All</buttton>
            <buttton onClick={() => setFilter('active')}>Active</buttton>
            <buttton onClick={() => setFilter('completed')}>Completed</buttton>
        </div>
    );
}

export default TodoFilter;
