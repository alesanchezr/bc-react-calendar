import React, { useContext } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { CalendarContext } from "./Calendar";
import { useDrop } from "react-dnd";
import moment from "moment";
import { ItemTypes, Event } from "./Event";

const Block = styled.div`
  box-sizing: border-box;
  font-size: 10px;
  position: relative;
  ${props => props.isOver && css`
        background: pink;
    `}
  ${props =>
    props.timeDirection === "horizontal"
      ? css`
          width: ${props.size};
        `
      : css`
          height: ${props.size};
        `}

`;

const calculateNewEvent = (blockTime, minutesDelta, item, { EVENT, HORIZON_TOP, HORIZON_BOTTOM }) => {

    let start = (item.type === EVENT) ? moment(blockTime.start) : moment(item.start);
    let end = (item.type === EVENT) ? moment(blockTime.end) : moment(item.end);

    if(HORIZON_TOP === item.type) start.set({ h: moment(item.start).add(minutesDelta, "minutes").hour(), m: moment(item.start).add(minutesDelta, "minutes").minutes() })
    else if(HORIZON_BOTTOM === item.type) end.set({ h: moment(item.end).add(minutesDelta, "minutes").hour(), m: moment(item.end).add(minutesDelta, "minutes").minutes() })
    else{
        start.set({ h: moment(item.start).add(minutesDelta, "minutes").hour(), m: moment(item.start).add(minutesDelta, "minutes").minutes() });
        end.set({ h: moment(item.end).add(minutesDelta, "minutes").hour(), m: moment(item.end).add(minutesDelta, "minutes").minutes() });
    }

    return {
        start, end,
        duration: moment.duration(end.diff(start)).asMinutes()
    };
}

export const TimeBlock = ({ children, label, events, occupancy, start, end }) => {
    const { timeDirection, timeBlockMinutes, blockPixelSize, showPreview, updateEvent, dragMode, toggleDragMode, blockLabel } = useContext(CalendarContext);
    const [{ isOver }, drop] = useDrop({
        accept: [ ItemTypes.EVENT, ItemTypes.HORIZON_TOP, ItemTypes.HORIZON_BOTTOM ],
        drop: (item, monitor) => {
            let coord = monitor.getDifferenceFromInitialOffset();
            const minutesDelta = timeDirection === "horizontal" ? Math.round(coord.x / blockPixelSize) * timeBlockMinutes : Math.round(coord.y / blockPixelSize) * timeBlockMinutes;
            const newEvent = calculateNewEvent({ start, end }, minutesDelta, item, ItemTypes);
            console.log("Newwwwww: ", timeDirection)
            let updatedEvent = { index: item.index, start: newEvent.start, end: newEvent.end, duration: newEvent.duration };

            if(showPreview) toggleDragMode(false);
            updateEvent(updatedEvent);
        },
        collect: monitor => ({
            isOver: !!monitor.isOver()
        })
    });

    return (
        <Block
            ref={drop}
            timeDirection={timeDirection}
            isOver={isOver}
            dragMode={dragMode}
            size={`${blockPixelSize}px`}
            ocupied={occupancy.length > 0}
        >
            {blockLabel && blockLabel(start, end, events, occupancy)}
            {children}
        </Block>
    );
};
TimeBlock.propTypes = {
  events: PropTypes.array,
  occupancy: PropTypes.array,
  start: PropTypes.object.isRequired,
};

TimeBlock.defaultProps = {
  events: null,
  occupancy: []
};
