import moment from "moment";

const NOW = moment();
export const simpleEvents = [
  {
    label: "Server",
    start: NOW,
    end: moment(NOW).add(3, "hours")
  },
  {
    label: "Chef",
    start: moment(NOW).add(1, "hours"),
    end: moment(NOW).add(4, "hours")
  },
  {
    label: "Chef",
    start: moment(NOW).add(1, "day"),
    end: moment(NOW).add(4, "day")
  }
];

export const nestedEvents = {
  mario: simpleEvents,
  juan: simpleEvents
};
