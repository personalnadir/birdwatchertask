import { combineReducers } from "redux";
import application from "./application";
import task from "./task";
import trial from "./trial";

export default combineReducers({
	application,
	task,
	trial
});
