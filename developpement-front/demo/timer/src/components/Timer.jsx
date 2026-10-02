let timerId;
export default function Timer({ enabled = false, onClick }) {
  if (enabled) {
    timerId ??= setInterval(onClick, 1000);
  } else {
    clearInterval(timerId);
    timerId = null;
  }

  return <p>Timer 1s {enabled ? "started" : "stopped"}</p>;
}
