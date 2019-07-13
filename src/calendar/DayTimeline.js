import React, { useContext } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import moment from "moment";
import { TimeBlock } from "./TimeBlock";
import { Event } from "./Event";
import { CalendarContext } from "./Calendar";

export const ItemTypes = {
  EVENT: "event"
};

const Day = styled.div`
  box-sizing: border-box;
  background: blue;
  font-size: 10px;
  border-right: 1px solid grey;
  display: flex;
  position: relative;

  ${props => css`
    width: ${props.width};
  `}
  ${props =>
    props.active &&
    css`
      background: orange;
    `}
`;

const getDayComponent = {
  horizontal: styled(Day)`
    flex-direction: row;
  `,
  vertical: styled(Day)`
    flex-direction: column;
  `
};

export const DayTimeline = ({ events, date, isActive, width }) => {
  const { timeDirection, timeBlockMinutes } = useContext(CalendarContext);
  const DayComponent = getDayComponent[timeDirection];
  const times = [...Array((60 * 24) / timeBlockMinutes)].map((n, i) => {
    const start = moment(date)
      .startOf("day")
      .add(i * timeBlockMinutes, "minutes");
    let end = moment(start).add(timeBlockMinutes, "minutes");
    return {
      start,
      end,
      label: start.format("h:m a"),
      index: i,
      events: events.filter(
        e => e.start.isBetween(start, end) || e.start.isSame(start)
      ),
      occupancy: events.filter(
        e =>
          e.start.isBetween(start, end) ||
          (e.start.isBefore(start) && e.end.isAfter(end)) ||
          e.end.isBetween(start, end)
      )
    };
  });

  if (!date) return "Loading...";
  return (
    <DayComponent width={width} active={isActive}>
      {date.format("dddd")}
      {times.map(t => (
        <TimeBlock
          key={t.index}
          label={t.label}
          start={t.start}
          occupancy={t.occupancy}
        >
          {t.events.map((e, i) => (
            <Event key={i} {...e} />
          ))}
        </TimeBlock>
      ))}
    </DayComponent>
  );
};

DayTimeline.propTypes = {
  events: PropTypes.array,
  isActive: PropTypes.bool,
  date: PropTypes.object
};

DayTimeline.defaultProps = {
  isActive: false,
  date: null,
  events: []
};
