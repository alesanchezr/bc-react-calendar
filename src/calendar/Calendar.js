import React, { useState } from "react";
import PropTypes from "prop-types";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { HorizontalDay } from "./HorizontalDay";
import { DayBlock } from "./DayBlock";
import moment from "moment";

export const CalendarContext = React.createContext(null);

// Create a <Title> react component that renders an <h1> which is
// centered, palevioletred and sized at 1.5em
const layoutStyles = (direction) => ({
  boxSizing: "border-box",
  width: "100%",
  overflowY: "auto",
  display: "flex",
  justifyContent: "space-evenly",
  flexDirection: direction == "horizontal" ? "row" : "column"
});
const Layout = ({ direction, children }) => <div style={layoutStyles(direction)}>{children}</div>

const timeStyles = (props) => ({
    width: "100%",
    margin: 0,
    padding: 0,
    fontSize: "12px",
    background: "#b1b1b1",
    marginLeft: `${props.yAxisWidth}px`,
    width: !props.width ? "100%" : `${props.width}px`
});
const Time = (props) => <ul style={timeStyles(props)}>{props.children}</ul>;

const generateAxis = events => {
  let axis = [];
  if(typeof(events) !== "object") throw new Error('The events property must be an object');
  for (let key in events) {
    axis.push({
      label: key,
      events: events[key].map((e, i) => {
        e.index = key + i;
        e.duration = moment.duration(e.end.diff(e.start)).asMinutes();
        return e;
      })
    });
  }

  return axis;
};

const Calendar = ({ daysToShow, events, onChange, ...rest }) => {

    //calendar active date
    const activeDate = rest.activeDate ? rest.activeDate : moment().startOf("day");
    let yAxis = [];

    const [calendarEvents, setCalendarEvents] = useState(events);
    const [dragMode, setDragMode] = useState(false);
    const [direction, setDirection] = useState({
        days: rest.dayDirection,
        time: rest.timeDirection
    });

    if (Array.isArray(calendarEvents)) {
        if (calendarEvents.length > 0 && typeof calendarEvents[0].index === 'undefined')
        setCalendarEvents(calendarEvents.map((e, i) => ({ index: i, duration: moment.duration(e.end.diff(e.start)).asMinutes(), ...e })));
    } else {
        //The timeDirection set to horizontal because the events came as an object
        if (direction.days !== "vertical" || direction.time !== "horizontal")
        setDirection({ days: "vertical", time: "horizontal" });
        yAxis = generateAxis(calendarEvents);
    }

    const times = [...Array((60 * 24) / rest.timeBlockMinutes)].map((n, i) => {
        const start = moment().startOf("day").add(i * rest.timeBlockMinutes, "minutes");
        let end = moment(start).add(rest.timeBlockMinutes, "minutes");
        return {
            startTime: start,
            endTime: end,
        };
    });

    if (!daysToShow) return "Loading...";
    return (
        <Layout direction={direction.days}>
        <DndProvider backend={HTML5Backend}>
            <CalendarContext.Provider
            value={{
                ...rest,
                yAxis,
                timeDirection: direction.time,
                activeDate,
                dragMode,
                toggleDragMode: (value=null) => value ? setDragMode(value) : setDragMode(!dragMode),
                updateEvent: uEv => {
                if (onChange) {
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
                <DayBlock timesToShow={times} days={daysToShow} events={calendarEvents} />
            ) : (
                <div>

                    {daysToShow.map((d,i) =>
                        <div key={i}>
                            {rest.dayLabel &&
                                <div style={{ width: (60 * 24) / rest.timeBlockMinutes * rest.blockPixelSize, marginLeft: i === 0 ? rest.yAxisWidth+"px": "0" }}>
                                    {rest.dayLabel(d, moment(activeDate).add(1, "day").isSame(d))}
                                </div>
                            }
                            <Time yAxisWidth={rest.yAxisWidth} width={(60 * 24) / rest.timeBlockMinutes * rest.blockPixelSize}>
                                {times.map((t, i) =>
                                    <li key={i} style={{
                                        width: rest.blockPixelSize+"px",
                                        display: "inline-block",
                                        listStyle: "none"
                                    }}>
                                        {t.startTime.minutes() === 0 && t.startTime.format('ha')}
                                    </li>
                                )}
                            </Time>
                        </div>
                    )}
                    <HorizontalDay
                        days={daysToShow}
                        timesToShow={times}
                        events={calendarEvents}
                        yAxis={yAxis}
                    />
                </div>
            )}
            </CalendarContext.Provider>
        </DndProvider>
        </Layout>
    );
};

Calendar.propTypes = {
  timeDirection: PropTypes.string,
  dayDirection: PropTypes.string,
  blockPixelSize: PropTypes.number,
  onChange: PropTypes.func,
  daysToShow: PropTypes.array,
  viewMode: PropTypes.string,
  activeDate: PropTypes.object,
  events: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  timeBlockMinutes: PropTypes.number,
  dayWidth: PropTypes.string,
  yAxisWidth: PropTypes.number,
  showFrom: PropTypes.number,
  showUntil: PropTypes.number,
  blockLabel: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node
  ]),
  dayLabel: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.node
  ]),
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
  daysToShow: [],
  timeBlockMinutes: 30,
  yAxisWidth: 40,
  dayLabel: null,
  blockLabel: null
};

export default Calendar;