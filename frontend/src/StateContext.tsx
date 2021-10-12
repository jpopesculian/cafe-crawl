import React from "react";
import { Stop } from "./stops";

export interface State {
  value: number;
  stop: Stop | null;
  going_to: boolean;
}

const StateContext = React.createContext<State>({
  value: -1,
  stop: null,
  going_to: false,
});

export default StateContext;
