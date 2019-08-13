import React, { useContext } from "react";
import PropTypes from "prop-types";
import { CalendarContext } from "./Calendar";
import { useDrag } from "react-dnd";
import { log } from "./utils.js";
export const ItemTypes = {
  EVENT: "event",
  HORIZON_TOP: "event-horizon-top",
  HORIZON_BOTTOM: "event-horizon-bottom"
};

const eventBlockStyles = (props) => ({
    background: "blue",
    border: "1px solid black",
    position: "absolute",
    width: "90%",
    top: 0,
    left: 0,
    cursor: "pointer",
    opacity: 0.95,
    zIndex: props.isPreview ? -1 : 10,
    marginLeft: `${props.index * 2}px`,
    marginTop: `${props.offset}px`,
    opacity: props.isDragging ? 0.4 : 1,
    width: props.direction === "horizontal" ? props.size : "auto",
    height: props.direction !== "horizontal" ? props.size : "auto",
});
const EventBlock = React.forwardRef((props, ref) => <div ref={ref} style={eventBlockStyles(props)}>{props.children}</div>);

const EventLabel = (props) => <label style={{
        float: "left",
        margin: "5px",
        fontSize: "12px",
        zIndex: 10
    }}>{props.children}</label>;

const Invisible = (props) => <div style={{
  position: "relative",
  width: "100%",
  height: "100%"
}}>{props.children}</div>;

const horizonStyles = (props) => {
    let result = {
        position: "absolute",
        zIndex: 9,
        fontSize: "10px",
        fontWeight: 900,
        textAlign: "center",
        margin: "auto",
        width: ["top", "bottom"].includes(props.orientation) ? "100%" : "10px",
        height: !["top", "bottom"].includes(props.orientation) ? "auto" : "10px",
        transform: `rotate(${["top", "bottom"].includes(props.orientation) ? "0" : "90"}deg)`,
        //background: "black",
        //opacity: 0.2,
    };
    result[props.orientation] = "0px";
    return result;
//   :hover {
//     ${props => css`
//       cursor: ${["top", "bottom"].includes(props.orientation)
//         ? "ns-resize"
//         : "ew-resize"};
//     `}
//   }
};
const Horizon = ({ className, orientation, eventStart, eventEnd, duration, index }) => {
    const { toggleDragMode } = useContext(CalendarContext);
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
        begin: monitor => toggleDragMode(true)
    });
    return (
        <div ref={drag} style={horizonStyles({orientation})} className={className}>
        <i>{"="}</i>
        </div>
    );
};

export const Event = ({ label, start, end, duration, index, isPreview, offset }) => {
    const { timeDirection, blockPixelSize, timeBlockMinutes, toggleDragMode } = useContext(CalendarContext);
    const [{ isDragging }, drag ] = useDrag({
        item: { type: ItemTypes.EVENT, index, duration, start, end },
        collect: monitor => {
            return ({
                isDragging: !!monitor.isDragging()
            })
        },
        begin: monitor => log("Begin dragging") || toggleDragMode(true)
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
                    <Horizon
                        index={index}
                        orientation={timeDirection === "vertical" ? "top" : "left"}
                        eventStart={start}
                        duration={duration}
                        eventEnd={end}
                    />
                    <EventLabel>{label}</EventLabel>
                    <Horizon
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
