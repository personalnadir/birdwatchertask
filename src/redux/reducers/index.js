import { combineReducers } from "redux";
import application from "./application";
import task from "./task";
import trial from "./trial";
import data from "./data";

export default combineReducers({
	application,
	task,
	trial,
	data
});
