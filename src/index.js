import React, { useState } from "react";
import ReactDOM from "react-dom";
import CalendarView from "./calendar/index.js";
import { simpleEvents, nestedEvents } from "./data";
import styled, { css } from "styled-components";

const Label = styled.label`
    ${props => css`
        background: ${props.active ? "orange" : "white"}
    `}
`;

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
          timeBlockMinutes={10}
          yAxisWidth={60}
          dayLabel={(day, active) => <Label active={active}>{day.format("dddd")}</Label>}
        />
      }
      {
        <CalendarView
          events={simpleEvents}
          timeDirection="vertical"
          dayDirection="horizontal"
          viewMode={"week"}
          activeDate={null}
          timeBlockMinutes={30}
          dayLabel={(day, active) => <h1>{day.format("dddd")}</h1>}
          blockLabel={(start, end, events, occupancy) => <Label>{start.format("dddd h:m a")} ({events ? events.length: 0})</Label>}
        />
      }
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
