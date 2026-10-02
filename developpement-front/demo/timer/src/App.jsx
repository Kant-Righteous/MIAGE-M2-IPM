import Button from "./components/Button";
import Label from "./components/Label";
import Timer from "./components/Timer";
import useCountBehaviour from "./hooks/useCountBehaviour";

function App() {
  const [display, start, stop, timer, startEnabled, stopEnabled, timerEnabled] =
    useCountBehaviour();
  return (
    <>
      <p className="h1 text-center">Le compteur !!!</p>
      <div className="container text-center bg-light border border-dark rounded p-3">
        <Row>
          <Label text={display} />
        </Row>
        <Row>
          <Button text="Start" enabled={startEnabled} onClick={start} />
          <Button text="Stop" enabled={stopEnabled} onClick={stop} />
          <Button text="Timer" enabled={timerEnabled} onClick={timer} />
          <Timer enabled={timerEnabled} onClick={timer} />
        </Row>
      </div>
    </>
  );
}
function Row({ children }) {
  return <div className="row justify-content-around">{children}</div>;
}
export default App;
