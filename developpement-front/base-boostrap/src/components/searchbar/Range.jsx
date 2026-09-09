export default function Range({ min, max, value, label, valueChange }) {
    return (
        <div className="form-group">
            <label className="form-label" htmlFor={`priceRange-${label}`}>
                {label}: {value}
            </label>
            <input
                type="range"
                id={`priceRange-${label}`}
                className="form-control-range"
                min={min * 100}
                max={max * 100}
                value={value * 100}
                onChange={(e) => valueChange(e.target.value / 100)}
            />
        </div>
    );
}