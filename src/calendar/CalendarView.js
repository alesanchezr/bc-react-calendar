import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Calendar } from "./Calendar.js";

export const CalendarView = ({
  events,
  timeDirection,
  dayDirection,
  onChange,
  viewMode
}) => (
  <div>
    This is my calendar
    <Calendar
      events={events}
      timeDirection={timeDirection}
      dayDirection={dayDirection}
      blockPixelSize={40}
      onChange={event => onChange && onChange(event)}
      viewMode={viewMode}
    />
  </div>
);

CalendarView.propTypes = {
  viewMode: PropTypes.string,
  onChange: PropTypes.func,
  events: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  minTimeMinutesLength: PropTypes.number
};

CalendarView.defaultProps = {
  viewMode: "day",
  onChange: null,
  events: [],
  minTimeMinutesLength: 30
};
