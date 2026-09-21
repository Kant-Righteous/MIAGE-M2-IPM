export default function Button({ text, enabled, onClick }) {
  const enablingClass =
    "col-3 btn " + (enabled ? "btn-primary" : "btn-secondary");
  return (
    <button className={enablingClass} disabled={!enabled} onClick={onClick}>
      {text}
    </button>
  );
}
