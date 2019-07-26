import React from "react";
import ReactDOM from "react-dom";
import { CalendarView, Calendar } from "./calendar/index.js";
import { simpleEvents, nestedEvents } from "./data";
import styled, { css } from "styled-components";
import moment from "moment";

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { text, boolean, number, array, object, select } from '@storybook/addon-knobs';

const DayLabel = styled.h2`
    width: 100%;
    margin: 0;
    ${props => css`
        background: ${props.active ? "orange" : "#f1f1f1"}
    `}
`;

const BlockLabel = styled.label`
`;


/**
 *  Actionable Item
 */

storiesOf('CalendarView', module).add('horizontal configuration', () => (<div>
    <CalendarView
        timeDirection={select('timeDirection', ['horizontal','vertical'], 'horizontal')}
        dayDirection={select('dayDirection', ['horizontal','vertical'], 'vertical')}
        onChange={(value) => action('onChange')(value)}
        viewMode={select('viewMode', ['day','week'], "day")}
        timeBlockMinutes={number('timeBlockMinutes',10)}
        yAxisWidth={number('yAxisWidth',60)}
        dayLabel={(day, active) => <DayLabel active={active}>{day.format("dddd")}</DayLabel>}
        events={object('events', nestedEvents)}
    />
</div>));

/**
 *  Actionable Item
 */

storiesOf('CalendarView', module).add('vertical configuration', () => (<div>
        <CalendarView
          timeDirection={select('timeDirection', ['horizontal','vertical'], 'vertical')}
          dayDirection={select('dayDirection', ['horizontal','vertical'], 'horizontal')}
          viewMode={select('viewMode', ['day','week'], "week")}
          onChange={(value) => action('onChange')(value)}
          activeDate={null}
          timeBlockMinutes={number('timeBlockMinutes',30)}
          dayLabel={(day, active) => <DayLabel>{day.format("dddd")}</DayLabel>}
          blockLabel={(start, end, events, occupancy) => <BlockLabel>{start.format("dddd h:m a")} ({events ? events.length: 0})</BlockLabel>}
          events={object('events', simpleEvents)}
        />
</div>));

/**
 *  Actionable Item
 */

storiesOf('Calendar', module).add('horizontal configuration', () => (<div>
        <Calendar
            daysToShow={object('daysToShow', [moment().startOf("day")])}
            timeDirection={select('timeDirection', ['horizontal','vertical'], 'horizontal')}
            dayDirection={select('dayDirection', ['horizontal','vertical'], 'vertical')}
            blockPixelSize={number('blockPixelSize',40)}
            onChange={(value) => action('onChange')(value)}
            viewMode={select('viewMode', ['day','week'], "day")}
            activeDate={object('activeDate',moment().startOf("day"))}
            yAxisWidth={number('yAxisWidth',60)}
            showFrom={number('showFrom',5)}
            showUntil={number('showUntil',24)}
            events={object('events', nestedEvents)}
        />
</div>));