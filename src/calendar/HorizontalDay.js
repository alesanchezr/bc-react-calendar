import React, { useContext } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { DayTimeline } from "./DayTimeline";
import moment from "moment";
import { CalendarContext } from "./Calendar";

const Day = styled.div`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  justify-content: left;
`;

const HorizontalLabel = styled.div`
  display: block;
  background: green;
  min-width: 50px;
`;

export const DayBlock = ({ days, events }) => {
  const { dayDirection, viewMode, dayWidth, activeDate } = useContext(
    CalendarContext
  );
  return days.map((d, i) => (
    <DayTimeline
      key={i}
      date={d}
      width={dayDirection === "horizontal" ? dayWidth : "auto"}
      isActive={viewMode === "week" && d.diff(activeDate.startOf("day")) === 0}
      events={events.filter(e => e.start.isBetween(d, moment(d).add(1, "day")))}
    />
  ));
};

export const HorizontalDay = ({ events, days, yAxis }) => {
  return yAxis.map((row, i) => (
    <Day key={i}>
      <HorizontalLabel>{row.label}</HorizontalLabel>
      <DayBlock
        key={row.index}
        label={row.label}
        days={days}
        events={row.events}
      />
    </Day>
  ));
};
