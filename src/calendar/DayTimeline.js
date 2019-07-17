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
  font-size: 10px;
  border-right: 1px solid grey;
  display: flex;
  position: relative;

  ${props => css`
    width: ${props.width};
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

export const DayTimeline = ({ events, date, isActive, width, timesToShow }) => {
    const { timeDirection, dayLabel } = useContext(CalendarContext);
    const DayComponent = getDayComponent[timeDirection];

    const times = timesToShow.map(({ startTime,  endTime, ...rest }, i) => {
        const start = moment(date).set({ h: startTime.hours(), m: startTime.minutes() });
        let end = moment(date).set({ h: endTime.hours(), m: endTime.minutes() });
        return {
        start,
        end,
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
      {timeDirection === "vertical" && dayLabel && dayLabel(date)}
      {times.map(t => (
        <TimeBlock
          key={t.index}
          label={t.label}
          start={t.start}
          end={t.end}
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
