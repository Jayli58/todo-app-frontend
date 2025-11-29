import {useFilterStore} from "../store/FilterStore";
import {FilterType} from "../dataType/FilterTypes";
import Badge, { BadgeProps } from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import {useDialogStore} from "../store/dialogStore";

export interface TodoFilterProps {
    totalNum: number;
    activeNum: number;
    completedNum: number;
}

function TodoFilter(todoFilterProps: TodoFilterProps) {
    const filter = useFilterStore((s) => s.filter);
    const setFilter = useFilterStore((s) => s.setFilter);
    const isDialogOpen = useDialogStore((s) => s.isDialogOpen);

    // has to apply customised style to not to obscur dialog
    const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
        '& .MuiBadge-badge': {
            right: -10,
            top: -15,
        },
    }));

    return (
        <div className="flex gap-2 mt-4">
            <button
                onClick={() => setFilter(FilterType.ALL)}
                className={filter === FilterType.ALL ? "btn-filter-active" : "btn-filter-inactive"}
            >
                All
                <StyledBadge
                    badgeContent={todoFilterProps.totalNum}
                    color="primary"
                    // has to apply invisible to not to obscur dialog
                    invisible={isDialogOpen}
                />
            </button>

            <button
                onClick={() => setFilter(FilterType.ACTIVE)}
                className={filter === FilterType.ACTIVE ? "btn-filter-active" : "btn-filter-inactive"}
            >
                Active
                <StyledBadge
                    badgeContent={todoFilterProps.activeNum}
                    color="primary"
                    invisible={isDialogOpen}
                />
            </button>

            <button
                onClick={() => setFilter(FilterType.COMPLETED)}
                className={filter === FilterType.COMPLETED ? "btn-filter-active" : "btn-filter-inactive"}
            >
                Completed
                <StyledBadge
                    badgeContent={todoFilterProps.completedNum}
                    color="primary"
                    invisible={isDialogOpen}
                />
            </button>
        </div>
    );
}

export default TodoFilter;
