import applicationStore from "./reducers";
import { createStore } from "redux";

const store = createStore(applicationStore);
export default store;
