import moment from "moment";

const NOW = moment();
export const simpleEvents = [
  {
    label: "Server",
    start: NOW,
    end: moment(NOW).add(3, "hours")
  }
];
export const simpleEvents2 = [
  {
    label: "Server",
    start: NOW,
    end: moment(NOW).add(3, "hours")
  }
];

export const nestedEvents = {
  mario: simpleEvents,
  pepe: simpleEvents2,
  //juan: simpleEvents
};
