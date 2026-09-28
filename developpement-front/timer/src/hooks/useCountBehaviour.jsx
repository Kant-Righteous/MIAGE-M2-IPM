
const PossibleStates = Object.freeze({
  IDLE: {
    value: 1,
    enabled: {
      StartEnabled: true,
      StopEnabled: false,
      TimerEnabled: false,
    },
  },
  COUNTING: {
    value: 2,
    enabled: {
      StartEnabled: false,
      StopEnabled: true,
      TimerEnabled: true,
    },
  },
  ERROR: {
    value: 3,
    enabled: {
      StartEnabled: false,
      StopEnabled: false,
      TimerEnabled: false,
    },
  },
});


export default function useCountBehaviour() {
  
  const [display, setDisplay] = useState("Bonjour");
  const [state, setState] = useState(PossibleStates.IDLE);

  return [];
}
