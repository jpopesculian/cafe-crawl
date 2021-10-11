import { STOPS } from "./stops";
import { State } from "./StateContext";

const API_URL =
  "https://8ob2z3sdyi.execute-api.eu-central-1.amazonaws.com/default/cafe-crawl-backend";

async function request(event: string, payload: any = {}) {
  payload.event = event;
  payload.token = localStorage.getItem("token");
  let body = JSON.stringify(payload);
  return (
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    })
  ).json();
}

export async function login(password: string) {
  let result = await request("login", { password });
  if (result.event !== "login_succeeded") {
    throw new Error("Login failed: bad password");
  }
  localStorage.setItem("token", result.token);
}

export async function update(value: number) {
  let result = await request("update", { value });
  if (result.event !== "value_updated") {
    throw new Error("Value update failed: unauthorized");
  }
}

export async function read(): Promise<State> {
  let result = await request("read");
  if (result.event !== "value_read") {
    throw new Error("Value update failed: unauthorized");
  }
  let value = result.value;
  if (value < 0) {
    return { value, stop: null, going_to: false };
  }
  let stop = STOPS[Math.floor(value)];
  let going_to = value % 1 !== 0;
  return {
    value,
    stop,
    going_to,
  };
}
