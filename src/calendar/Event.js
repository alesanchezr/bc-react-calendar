import React, { useContext } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { CalendarContext } from "./Calendar";
import { useDrag } from "react-dnd";
import moment from "moment";
export const ItemTypes = {
  EVENT: "event",
  HORIZON_TOP: "event-horizon-top",
  HORIZON_BOTTOM: "event-horizon-bottom"
};

const EventBlock = styled.div`
  background: blue;
  border: 1px solid black;
  position: absolute;
  width: 90%;
  top: 0;
  left: 0;
  z-index: 10;
  cursor: pointer;
  opacity: 0.95;
  margin-left: ${props =>
      css`
        ${props.index * 2}px;
      `}
    ${props =>
      props.isDragging &&
      css`
        opacity: 0.5;
      `}
    ${props =>
      props.direction === "horizontal"
        ? css`
            width: ${props.size};
          `
        : css`
            height: ${props.size};
          `};
`;

const EventLabel = styled.label`
  float: left;
  margin: 5px;
  font-size: 12px;
  z-index: 10;
`;
const Invisible = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const Horizon = ({ className, orientation, start, index }) => {
  const [{ isDragging }, drag] = useDrag({
    item: {
      type: ["top", "left"].includes(orientation)
        ? ItemTypes.HORIZON_TOP
        : ItemTypes.HORIZON_BOTTOM,
      orientation,
      index,
      start
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    })
  });
  return (
    <div isDragging={isDragging} ref={drag} className={className}>
      {"="}
    </div>
  );
};
const HorizonStyled = styled(Horizon)`
  position: absolute;
  z-index: 9;
  width: 100%;
  font-size: 10px;
  font-weight: 900;
  text-align: center;
  margin: auto;
  :hover {
    opacity: 0.2;
    height: 8px;
    background: black;
    cursor: ns-resize;
  }
  ${props => css`
    ${props.orientation}: 0px;
  `}
`;

export const Event = ({ label, start, end, index }) => {
  const { timeDirection, blockPixelSize, timeBlockMinutes } = useContext(
    CalendarContext
  );
  const duration = moment.duration(end.diff(start)).asMinutes();

  const [{ isDragging }, drag] = useDrag({
    item: { type: ItemTypes.EVENT, index, duration, start, end },
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    })
  });
  return (
    <EventBlock
      ref={drag}
      isDragging={isDragging}
      direction={timeDirection}
      index={index}
      size={`${Math.floor((duration / timeBlockMinutes) * blockPixelSize)}px`}
    >
      <Invisible>
        <HorizonStyled
          index={index}
          orientation={timeDirection === "vertical" ? "top" : "left"}
          start={start}
        />
        <EventLabel>{label}</EventLabel>
        <HorizonStyled
          index={index}
          orientation={timeDirection === "vertical" ? "bottom" : "right"}
          start={end}
        />
      </Invisible>
    </EventBlock>
  );
};

Event.propTypes = {
  index: PropTypes.number.isRequired,
  label: PropTypes.string
};

Event.defaultProps = {
  label: "",
  index: 0
};
