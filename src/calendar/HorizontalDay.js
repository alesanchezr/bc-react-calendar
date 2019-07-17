import React, { useContext } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";
import { DayBlock } from "./DayBlock";
import { CalendarContext } from "./Calendar";

const Day = styled.div`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  justify-content: left;
`;

const HorizontalLabel = styled.div`
  box-sizing: border-box;
  display: block;
  background: #f1f1f1;
  padding: 5px;
  overflow: hidden;
  ${props => css`
    min-width: ${props.minWidth}px;
  `}
`;


export const HorizontalDay = ({ events, days, yAxis, timesToShow }) => {
  const { yAxisWidth } = useContext(CalendarContext);
  return yAxis.map((row, i) => (
    <Day key={i}>
      <HorizontalLabel minWidth={yAxisWidth}>{row.label}</HorizontalLabel>
      <DayBlock
        timesToShow={timesToShow}
        key={row.index}
        days={days}
        events={row.events}
      />
    </Day>
  ));
};
