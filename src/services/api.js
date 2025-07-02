import axios from "axios";
export const getRockets = () =>
  axios.get("https://api.spacexdata.com/v4/rockets");
