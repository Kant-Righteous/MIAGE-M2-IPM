import { useState } from "react";

const possibleStates = Object.freeze({
  SPRING: { value: 1,
    enabled: { 
      springEnabled: false,
      summerEnabled: true,
      fallEnabled: false,
      winterEnabled: false
    }
  },
  SUMMER: { value: 2,
    enabled: { 
      springEnabled: false,
      summerEnabled: false,
      fallEnabled: true,
      winterEnabled: false
    }
  },
  FALL: { value: 3,
    enabled: { 
      springEnabled: false,
      summerEnabled: false,
      fallEnabled: false,
      winterEnabled: true
    }
  },
  WINTER: { value: 4,
    enabled: { 
      springEnabled: true, 
      summerEnabled: false,
      fallEnabled: false,
      winterEnabled: false
    }
  },
  ERROR: { value: 5,
    enabled: { 
      springEnabled: false,
      summerEnabled: false,
      fallEnabled: false,
      winterEnabled: false
    }
  }
});

export default function useFourSeasonsBehaviour() {
  
  const [displayedSeason, setDisplayedSeason] = useState("Spring");
  const [currentSeason, setCurrentSeason] = useState(possibleStates.SPRING);

  const toSpring = () => {
    setDisplayedSeason("Spring");
    setCurrentSeason(possibleStates.SPRING);
  }

  const toSummer = () => {
    setDisplayedSeason("Summer");
    setCurrentSeason(possibleStates.SUMMER);
  }

  const toFall = () => {
    setDisplayedSeason("Fall");
    setCurrentSeason(possibleStates.FALL);
  }

  const toWinter = () => {
    setDisplayedSeason("Winter");
    setCurrentSeason(possibleStates.WINTER);
  }

  return [displayedSeason, currentSeason, toSpring, toSummer, toFall, toWinter];
}
