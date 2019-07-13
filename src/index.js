import React, { useState } from "react";
import ReactDOM from "react-dom";
import CalendarView from "./calendar/index.js";
import { simpleEvents, nestedEvents } from "./data";

function App() {
  return (
    <div className="App">
      {
        <CalendarView
          events={nestedEvents}
          timeDirection="horizontal"
          onChange={() => null}
          dayDirection="vertical"
          viewMode={"day"}
        />
      }
      {
        <CalendarView
          events={simpleEvents}
          timeDirection="vertical"
          dayDirection="horizontal"
          viewMode={"day"}
        />
      }
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
