export function Input({ value, placeholder, textChange }) {
  return (
    <input
      type="text"
      className="form-control"
      value={value}
      placeholder={placeholder}
      onChange={(event) => textChange(event.target.value)}
    />
  );
}
