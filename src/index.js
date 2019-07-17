import React from "react";
import ReactDOM from "react-dom";
import CalendarView from "./calendar/index.js";
import { simpleEvents, nestedEvents } from "./data";
import styled, { css } from "styled-components";

const DayLabel = styled.h2`
    width: 100%;
    margin: 0;
    ${props => css`
        background: ${props.active ? "orange" : "#f1f1f1"}
    `}
`;

const BlockLabel = styled.label`
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
          dayLabel={(day, active) => <DayLabel active={active}>{day.format("dddd")}</DayLabel>}

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
          dayLabel={(day, active) => <DayLabel>{day.format("dddd")}</DayLabel>}
          blockLabel={(start, end, events, occupancy) => <BlockLabel>{start.format("dddd h:m a")} ({events ? events.length: 0})</BlockLabel>}
        />
      }
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
