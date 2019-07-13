import React, { useContext } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { CalendarContext } from "./Calendar";
import { useDrop } from "react-dnd";
import moment from "moment";
import { ItemTypes, Event } from "./Event";

const Block = styled.div`
  background: #f1f1f1;
  box-sizing: border-box;
  border-bottom: 0.1px solid #bdbdbd;
  position: relative;
  ${props =>
    props.direction === "horizontal"
      ? css`
          width: ${props.size};
        `
      : css`
          height: ${props.size};
        `}

  ${props =>
    props.ocupied &&
    css`
      background: grey;
    `}

    ${props =>
      props.isOver &&
      css`
        background: pink;
      `}
`;

export const TimeBlock = ({ children, label, events, occupancy, start }) => {
  const { direction, blockPixelSize, updateEvent } = useContext(
    CalendarContext
  );

  const [{ isOver }, drop] = useDrop({
    accept: [ItemTypes.EVENT, ItemTypes.HORIZON_TOP, ItemTypes.HORIZON_BOTTOM],
    drop: item =>
      item.type === ItemTypes.EVENT
        ? updateEvent({
            index: item.index,
            start: moment(start),
            end: moment(start).add(item.duration, "minutes")
          })
        : item.type === ItemTypes.HORIZON_TOP
        ? updateEvent({
            index: item.index,
            start: moment(item.start).set({
              h: start.hour(),
              m: start.minutes()
            })
          })
        : updateEvent({
            index: item.index,
            end: moment(item.start).set({
              h: start.hour(),
              m: start.minutes()
            })
          }),
    collect: monitor => ({
      isOver: !!monitor.isOver()
    })
  });

  return (
    <Block
      ref={drop}
      direction={direction}
      isOver={isOver}
      size={`${blockPixelSize}px`}
      ocupied={occupancy.length > 0}
    >
      <label>{label}</label>
      {children}
    </Block>
  );
};
TimeBlock.propTypes = {
  events: PropTypes.array,
  occupancy: PropTypes.array,
  start: PropTypes.object.isRequired,
  label: PropTypes.string
};

TimeBlock.defaultProps = {
  label: "",
  events: null,
  occupancy: []
};
