import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { useLoadingStore } from "../store/LoadingStore";


interface SearchTodoProps {
    // searchTodo: (text: string) => Todo[];
    searchTodo: (text: string) => Promise<void>;
}

function SearchTodo({ searchTodo }: SearchTodoProps) {
    const [text, setText] = useState('');
    const searching = useLoadingStore((s) => s.loadingActions.has("search"));

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await searchTodo(text);
    }

    return (
        <form onSubmit={handleSubmit} className="search-bar">
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="input text-hint::placeholder"
                placeholder="Enter keyword to search..."
                disabled={searching}
            />
            <button className="btn-create" disabled={searching}>
                <SearchIcon />
            </button>
        </form>
    );
}

export default SearchTodo;
