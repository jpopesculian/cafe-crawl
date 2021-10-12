import React, { useState, useContext, useEffect } from "react";
import "./Admin.css";
import * as api from "./api";
import { STOPS, Stop } from "./stops";
import StateContext from "./StateContext";

interface RequestResult {
  success: boolean;
  message: string;
}

function StopOption({ stop, idx }: { stop: Stop; idx: number }) {
  return (
    <>
      <option value={idx + 0.5}>GOING TO: {stop.name}</option>
      <option value={idx}>ARRIVED AT: {stop.name}</option>
    </>
  );
}

function Admin() {
  const state = useContext(StateContext);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [reqResult, setReqResult] = useState<RequestResult | null>(null);
  const [password, setPassword] = useState("");
  const [value, setValue] = useState({ value: "-1", auto: true });

  useEffect(() => {
    if (!value.auto) {
      return;
    }
    let newValue = state.value.toString();
    if (newValue !== value.value) {
      setValue({ value: newValue, auto: true });
    }
  }, [state, value]);

  return (
    <div className="Admin">
      <button
        className="OpenAdminPanel"
        onClick={() => setAdminPanelOpen(true)}
      >
        Admin
      </button>
      <div className={`AdminPanel ${adminPanelOpen ? "" : "hidden"}`}>
        <button
          className="CloseAdminPanel"
          onClick={() => setAdminPanelOpen(false)}
        >
          X
        </button>
        <div className="LoginForm form">
          <input
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={() =>
              api
                .login(password)
                .then(() => {
                  setReqResult({ success: true, message: "Login successful" });
                })
                .catch((err) => {
                  setReqResult({ success: false, message: err.message });
                })
            }
          >
            Login
          </button>
        </div>
        <div className="UpdateForm form">
          <select
            value={value.value}
            onChange={(e) => setValue({ value: e.target.value, auto: false })}
          >
            <option value="-1">Havent started</option>
            {STOPS.map((stop, idx) => {
              return <StopOption key={idx} stop={stop} idx={idx} />;
            })}
          </select>
          <button
            onClick={() =>
              api
                .update(parseFloat(value.value))
                .then(() => {
                  setReqResult({ success: true, message: "Value updated" });
                })
                .catch((err) => {
                  setReqResult({ success: false, message: err.message });
                })
            }
          >
            Update
          </button>
        </div>
        <div className="FormNotifications">
          {reqResult ? (
            <span className={`${reqResult.success ? "success" : "error"}`}>
              {reqResult.message}
            </span>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;
