import { useEffect, useRef, useState } from "react";
const possibleState = {
  IDLE: {
    value: 1,
    enabled: {
      startEnabled: true,
      stopEnabled: false,
      timerEnabled: false,
    },
  },
  COUNTING: {
    value: 2,
    enabled: {
      startEnabled: false,
      stopEnabled: true,
      timerEnabled: true,
    },
  },
  ERROR: {
    value: 5,
    enabled: {
      startEnabled: false,
      stopEnabled: false,
      timerEnabled: false,
    },
  },
};
export default function useCountBehaviour() {
  const [display, setDisplay] = useState("Bonjour");
  const [state, setState] = useState(possibleState.IDLE);
  const [n, setN] = useState(0);
  const [toDisplay, setToDisplay] = useState("");

  const goToState = (aState, aN) => {
    setState(aState);
    setN(aN);
  };

  const nRef = useRef(n);
  nRef.current = n;

  useEffect(() => {
    switch (toDisplay) {
      case "Count":
        setDisplay(n);
        break;
      case "Stopped":
        setDisplay("Stopped");
        break;
      case "Finished":
        setDisplay("Finished");
        break;
      default:
        setDisplay("Bla bla");
    }
  }, [n, toDisplay, state]);

  const start = () => {
    switch (state.value) {
      case possibleState.IDLE.value:
        goToState(possibleState.COUNTING, 0);
        setToDisplay("Count");
        break;
      default:
        setState(possibleState.ERROR);
        setDisplay("Error");
    }
  };
  const stop = () => {
    switch (state.value) {
      case possibleState.COUNTING.value:
        goToState(possibleState.IDLE, 0);
        setToDisplay("Stopped");
        break;
      default:
        setState(possibleState.ERROR);
        setDisplay("Error");
    }
  };
  const timer = () => {
    switch (state.value) {
      case possibleState.COUNTING.value:
        if (nRef.current < 9) {
          goToState(possibleState.COUNTING, nRef.current + 1);
          setToDisplay("Count");
        } else if (nRef.current == 9) {
          goToState(possibleState.IDLE, 0);
          setToDisplay("Finished");
        } else {
          setState(possibleState.ERROR);
          setDisplay("Error");
        }
        break;
      default:
        setState(possibleState.ERROR);
        setDisplay("Error");
    }
  };

  console.log(n);

  return [
    display,
    start,
    stop,
    timer,
    state.enabled.startEnabled,
    state.enabled.stopEnabled,
    state.enabled.timerEnabled,
  ];
}
