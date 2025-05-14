import moment from "moment";

export const GetTimeNow = () => {
  return moment().format("MM DD YYYY hh:mm:ss a");
};