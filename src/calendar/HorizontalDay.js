import React, { useContext } from "react";
import { DayBlock } from "./DayBlock";
import { CalendarContext } from "./Calendar";

const Day = (props) => <div style={{
  boxSizing: "border-box",
  width: "100%",
  display: "flex",
  justifyContent: "left"
}}>{props.children}</div>;

const HorizontalLabel = (props) => <div style={{
    boxSizing: "border-box",
    display: "block",
    background: "#f1f1f1",
    padding: "5px",
    overflow: "hidden",
    minWidth: `${props.minWidth}px`
}}>{props.children}</div>;


export const HorizontalDay = ({ events, days, yAxis, timesToShow }) => {
  const { yAxisWidth } = useContext(CalendarContext);
  return yAxis.map((row, i) => (
    <Day key={i}>
      <HorizontalLabel minWidth={yAxisWidth}>{row.label}</HorizontalLabel>
      <DayBlock
        timesToShow={timesToShow}
        key={row.index}
        days={days}
        events={row.events}
      />
    </Day>
  ));
};
