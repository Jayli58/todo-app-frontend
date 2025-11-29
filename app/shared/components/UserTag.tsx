import AccountBoxIcon from "@mui/icons-material/AccountBox";

export default function UserTag(props: { name: string }) {
    return (
        <div className="user-tag">
            <AccountBoxIcon fontSize="small" className="text-white" />
            <span>{props.name}</span>
        </div>
    );
}
