import "./Stops.css";
import { STOPS } from "./stops";

function Stops() {
  return (
    <div className="Stops content" id="spots">
      <h1>spots</h1>
      {STOPS.map((stop) => {
        return (
          <div className="stop" key={stop.name}>
            <div className="descriptor">
              <h2>
                {stop.name}
                <span className="subtitle">{stop.notes}</span>
              </h2>
              <a
                className="google-map-link"
                href={stop.google_maps}
                target="blank"
              >
                Get Directions
              </a>
            </div>
            <div className="times">
              <div className="time">{stop.start_time}</div>
              <div className="time">{stop.stop_time}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Stops;
