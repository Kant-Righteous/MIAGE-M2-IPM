export function Range({ min, max, value, label, valueChange }) {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor="price-range">
        {label}: {value.toFixed(2)}
      </label>
      <input
        id="price-range"
        type="range"
        className="form-range"
        min={min}
        max={max}
        step="0.01"
        value={value}
        onChange={(event) => valueChange(Number(event.target.value))}
      />
    </div>
  );
}
