import React, { useContext } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { CalendarContext } from "./Calendar";
import { useDrag, useDrop } from "react-dnd";
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
    cursor: pointer;
    opacity: 0.95;
    z-index: 10;
    ${props => css`
        margin-left: ${props.index * 2}px;
        margin-top: ${props.offset}px;
    `}

    ${props => props.isDragging && css`
        opacity: 0.4;
    `}

    ${props => props.isPreview && css`
        z-index: -1;
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

const Horizon = ({ className, orientation, eventStart, eventEnd, duration, index }) => {
    const { dragMode, toggleDragMode, showPreview } = useContext(CalendarContext);
    const [props, drag] = useDrag({
        item: {
            type: ["top", "left"].includes(orientation)
                ? ItemTypes.HORIZON_TOP
                    : ItemTypes.HORIZON_BOTTOM,
            orientation,
            index,
            start: eventStart,
            end: eventEnd,
            duration
        },
        begin: monitor => {
            console.log("Horizon: Drag begins");
            if(showPreview) toggleDragMode(true);
        }
    });
    return (
        <div ref={drag} className={className}>
        <i>{"="}</i>
        </div>
    );
};
const HorizonStyled = styled(Horizon)`
    position: absolute;
    z-index: 9;
    font-size: 10px;
    font-weight: 900;
    text-align: center;
    margin: auto;
  ${props => css`
    ${props.orientation}: 0px;
    width: ${["top", "bottom"].includes(props.orientation) ? "100%" : "10px"};
    transform: rotate(${["top", "bottom"].includes(props.orientation) ? "0" : "90"}deg);
  `}
  :hover {
    opacity: 0.2;
    height: 8px;
    background: black;
    ${props => css`
      cursor: ${["top", "bottom"].includes(props.orientation)
        ? "ns-resize"
        : "ew-resize"};
    `}
  }
`;

export const Event = ({ label, start, end, duration, index, isPreview, offset }) => {
    const { timeDirection, blockPixelSize, timeBlockMinutes, dragMode, toggleDragMode, showPreview } = useContext(CalendarContext);
    const [{ isDragging }, drag, preview] = useDrag({
        item: { type: ItemTypes.EVENT, index, duration, start, end },
        collect: monitor => {
            return ({
                isDragging: !!monitor.isDragging()
            })
        },
        begin: monitor => {
            console.log("Event: Drag begins: ", monitor.getInitialClientOffset());
            if(showPreview) toggleDragMode(true);
        },
    });

    return (
        <EventBlock
            ref={drag}
            isDragging={isDragging}
            isPreview={isPreview}
            offset={offset}
            direction={timeDirection}
            index={index}
            size={`${Math.floor((duration / timeBlockMinutes) * blockPixelSize)}px`}
        >
            { !isPreview &&
                <Invisible>
                    <HorizonStyled
                        index={index}
                        orientation={timeDirection === "vertical" ? "top" : "left"}
                        eventStart={start}
                        duration={duration}
                        eventEnd={end}
                    />
                    <EventLabel>{label}</EventLabel>
                    <HorizonStyled
                        index={index}
                        orientation={timeDirection === "vertical" ? "bottom" : "right"}
                        eventStart={start}
                        duration={duration}
                        eventEnd={end}
                    />
                </Invisible>
            }
        </EventBlock>
    );
};

Event.propTypes = {
  index: PropTypes.string.isRequired,
  label: PropTypes.string
};

Event.defaultProps = {
  label: "",
  index: "0"
};
