import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./styles.css";
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
          viewMode={"week"}
        />
      }
      {/*
        <CalendarView
        events={simpleEvents}
        timeDirection="vertical"
        dayDirection="horizontal"
        viewMode={"week"}
        />
        */}
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
