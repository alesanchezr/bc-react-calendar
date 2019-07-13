import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { HorizontalDay, DayBlock } from "./HorizontalDay";
import moment from "moment";

export const CalendarContext = React.createContext(null);

// Create a <Title> react component that renders an <h1> which is
// centered, palevioletred and sized at 1.5em
const Frame = styled.div`
  box-sizing: border-box;
  border: 1px solid black;
  width: 100%;
  overflow-y: auto;
  display: flex;
  justify-content: space-evenly;
`;

const getLayout = {
  horizontal: styled(Frame)`
    flex-direction: row;
  `,
  vertical: styled(Frame)`
    flex-direction: column;
  `
};

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

const getYAxis = events => {
  let axis = [];
  let count = 0;
  for (let key in events) {
    axis.push({
      index: count,
      label: key,
      events: events[key]
    });
    count++;
  }

  return axis;
};

export const Calendar = ({ events, onChange, ...rest }) => {
  let yAxis = [];
  const [calendarEvents, setCalendarEvents] = useState(events);
  const [daysToShow, setDaysToShow] = useState(null);
  const [activeDate, setActiveDate] = useState(
    rest.activeDate ? rest.activeDate : moment()
  );
  const [direction, setDirection] = useState({
    days: rest.dayDirection,
    time: rest.timeDirection
  });

  console.log("Calendar setup", rest);
  console.log("Evens", calendarEvents);
  if (Array.isArray(calendarEvents)) {
    if (
      calendarEvents.length > 0 &&
      typeof calendarEvents[0].index === "undefined"
    )
      setCalendarEvents(calendarEvents.map((e, i) => ({ index: i, ...e })));
  } else {
    //The timeDirection set to horizontal because the events came as an object
    if (direction.days !== "vertical" || direction.time !== "horizontal")
      setDirection({ days: "vertical", time: "horizontal" });
    yAxis = getYAxis(calendarEvents);
  }

  if (rest.viewMode === "day" && !daysToShow) setDaysToShow([activeDate]);
  else if (rest.viewMode === "week" && !daysToShow)
    setDaysToShow(getDaysOfWeek(activeDate));

  if (!daysToShow) return "Loading...";
  const Layout = getLayout[direction.days];
  return (
    <Layout>
      <DndProvider backend={HTML5Backend}>
        <CalendarContext.Provider
          value={{
            ...rest,
            yAxis,
            timeDirection: direction.time,
            activeDate,
            updateEvent: uEv => {
              if (onChange) {
                console.log("Event updated to: ", uEv);
                onChange(uEv);
                const newEvents =
                  yAxis.length === 0
                    ? calendarEvents.map(e =>
                        e.index === uEv.index ? { ...e, ...uEv } : e
                      )
                    : (() => {
                        let newEvents = {};
                        yAxis.forEach(key => {
                          newEvents[key.label] = key.events.map(e =>
                            e.index === uEv.index ? { ...e, ...uEv } : e
                          );
                        });
                        return newEvents;
                      })();
                setCalendarEvents(newEvents);
              }
            }
          }}
        >
          {Array.isArray(calendarEvents) ? (
            <DayBlock days={daysToShow} events={calendarEvents} />
          ) : (
            <HorizontalDay
              days={daysToShow}
              events={calendarEvents}
              yAxis={yAxis}
            />
          )}
        </CalendarContext.Provider>
      </DndProvider>
    </Layout>
  );
};

Calendar.propTypes = {
  timeDirection: PropTypes.string,
  dayDirection: PropTypes.string,
  timeBlockSize: PropTypes.string,
  onChange: PropTypes.funct,
  viewMode: PropTypes.string,
  activeDate: PropTypes.date,
  events: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  timeBlockMinutes: PropTypes.number,
  dayWidth: PropTypes.string
};

Calendar.defaultProps = {
  timeDirection: "horizontal",
  dayDirection: "vertical",
  onChange: null,
  viewMode: "day",
  dayWidth: "100%",
  activeDate: null,
  blockPixelSize: 30,
  events: [],
  timeBlockMinutes: 30
};
