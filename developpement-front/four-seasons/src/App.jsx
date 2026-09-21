import Button from "./components/Button";
import Label from "./components/Label";
import useFourSeasonsBehaviour from "./hooks/useFourSeasonsBehaviour";

function App() {
  const [displayedSeason, currentSeason, toSpring, toSummer, toAutumn, toWinter] = useFourSeasonsBehaviour();

  return (
    <>
      <p className="h1 text-center">Les quatre saisons</p>
      <div className="container text-center bg-light border border-dark rounded p-3">
        <Row>
          <Button
            text="to Spring"
            enabled={currentSeason.enabled.springEnabled}
            onClick={() => {
              toSpring();
            }}
          />
          <Button
            text="to Summer"
            enabled={currentSeason.enabled.summerEnabled}
            onClick={() => {
              toSummer();
            }}
          />
        </Row>
        <Row>
          <Label text={`This is ${displayedSeason}`} />
        </Row>
        <Row>
          <Button
            text="to Fall"
            enabled={currentSeason.enabled.autumnEnabled}
            onClick={() => {
              toAutumn();
            }}
          />
          <Button
            text="to Winter"
            enabled={currentSeason.enabled.winterEnabled}
            onClick={() => {
              toWinter();
            }}
          />
        </Row>
      </div>
    </>
  );
}
function Row({ children }) {
  return <div className="row justify-content-around">{children}</div>;
}
export default App;
