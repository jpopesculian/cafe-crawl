import React, { useState, useEffect } from "react";
import StateContext, { State } from "./StateContext";
import "./StateProvider.css";
import * as api from "./api";

interface Props {
  children?: React.ReactNode;
}

enum RequestState {
  Init,
  Loading,
  Delay,
  Ready,
}

function StateProvider({ children }: Props) {
  const [reqState, setReqState] = useState(RequestState.Init);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<State>({
    value: -1,
    stop: null,
    going_to: false,
  });

  useEffect(() => {
    if (reqState === RequestState.Loading || reqState === RequestState.Delay) {
      return;
    }
    setReqState(RequestState.Loading);
    api
      .read()
      .then((newState) => {
        setError(null);
        setState(newState);
        setReqState(RequestState.Delay);
      })
      .catch((err) => {
        setError(
          `Julian fucked up... I dunno. Refresh the page or some shit. I made this in a day.... ${error?.toString()}`
        );
        setReqState(RequestState.Delay);
      })
      .finally(() => {
        setTimeout(() => {
          setReqState(RequestState.Ready);
        }, 30000);
      });
  }, [state, reqState, error]);

  return (
    <StateContext.Provider value={state}>
      {error ? (
        <div className="ErrorDialog">
          <div className="ErrorMessage">{error}</div>
        </div>
      ) : null}
      {children}
    </StateContext.Provider>
  );
}

export default StateProvider;
