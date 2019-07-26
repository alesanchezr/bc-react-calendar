import React from "react";
import PropTypes from "prop-types";
import Calendar from "./Calendar.js";
import moment from "moment";

import styled, { css } from "styled-components";

const getDaysOfWeek = activeDate => {
  const start = moment(activeDate).startOf("week");
  const end = moment(activeDate).endOf("week");
  let days = [start];
  let current = moment(start).add(1, "day");
  while (current.isBefore(end)) {
    days.push(current);
    current = moment(current).add(1, "day");
  }
  return days;
};

const DayPicker = styled.div`
    box-sizing: border-box;
    font-size: 10px;
    display: flex;
    position: relative;
    flex-direction: row;
`;

const CalendarView = ({
  events,
  timeDirection,
  dayDirection,
  onChange,
  viewMode,
  dayLabel,
  blockLabel,
  yAxisWidth,
  activeDate
}) => {
    let daysToShow = [];
    const currentDate = activeDate ? activeDate : moment().startOf("day");
    if (viewMode === "day") daysToShow = [currentDate];
    else if (viewMode === "week") daysToShow = getDaysOfWeek(currentDate);

    return (
        <div>
            <DayPicker>
                <button>Day</button>
                <button>Week</button>
            </DayPicker>
            <Calendar
                events={events}
                daysToShow={daysToShow}
                timeDirection={timeDirection}
                dayDirection={dayDirection}
                blockPixelSize={40}
                onChange={event => onChange && onChange(event)}
                viewMode={viewMode}
                dayLabel={dayLabel}
                activeDate={currentDate}
                yAxisWidth={yAxisWidth}
                blockLabel={blockLabel}
                showFrom={5}
                showUntil={24}
            />
        </div>
    );
};

CalendarView.propTypes = {
  viewMode: PropTypes.string,
  onChange: PropTypes.func,
  showPreview: PropTypes.bool,
  events: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  timeBlockMinutes: PropTypes.number,
  yAxisWidth: PropTypes.number,
  blockLabel: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node
  ]),
  dayLabel: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node
  ]),
  activeDate: PropTypes.object,
};

CalendarView.defaultProps = {
  viewMode: "day",
  onChange: null,
  activeDate: null,
  events: [],
  dayLabel: null,
  blockLabel: null,
  yAxisWidth: 40,
  timeBlockMinutes: 30
};

export default CalendarView;