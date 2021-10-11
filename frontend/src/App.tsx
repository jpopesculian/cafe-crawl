import React from "react";
import "./App.css";
import Map from "./Mapbox/Map";
import Admin from "./Admin";
import StateProvider from "./StateProvider";
import Head from "./Head";

function App() {
  return (
    <div className="App">
      <StateProvider>
        <Map
          styleUrl="mapbox://styles/jpopesculian/ckuldgwfj3sk517q1b8j9wf3y"
          accessToken="pk.eyJ1IjoianBvcGVzY3VsaWFuIiwiYSI6ImNKdFQ0YTQifQ.Cd0WdGn5B7TquMZGqJEyPw"
          zoom={14}
          center={[16.373599444210306, 48.208540078045324]}
        >
          <Head />
        </Map>
        <Admin />
      </StateProvider>
    </div>
  );
}

export default App;
