export default function Checkbox({ label, id, checked, stateChange }) {
    return (
        <div className="form-check">
            <input
                id={id}
                type="checkbox"
                className="form-check-input"
                checked={checked}
                onChange={(e) => stateChange(e.target.checked)}
            />
            <label className="form-check-label" htmlFor={id}>
                {label}
            </label>
        </div>
    );
}