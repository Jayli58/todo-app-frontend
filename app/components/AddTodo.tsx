import React, {useState} from "react";
import SearchIcon from '@mui/icons-material/Search';

interface AddTodoProps {
    addTodo: (text: string) => void;
}

function AddTodo({addTodo}: AddTodoProps) {
    const [text, setText] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (text.trim() === '') return;
        addTodo(text);
        setText('');
    }

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-3 mt-6 mb-6">
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="input text-hint::placeholder"
                placeholder="Enter keyword to search..."
            />
            <button className="btn-create">
                <SearchIcon/>
            </button>
        </form>
    );
}

export default AddTodo;
