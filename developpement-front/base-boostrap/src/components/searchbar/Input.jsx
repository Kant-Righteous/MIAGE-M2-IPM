export default function Input({ value, placeholder, textChange }) {
    return (
        <input
            type="text"
            className="form-control"
            value={value}
            placeholder={placeholder}
            onChange={(e) => textChange(e.target.value)}
        />
    );
}
