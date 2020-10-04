import { updateEvents } from '../highlighter';

export default (showSideBar) => {
    if (showSideBar) {
        updateEvents(true);
    } else {
        updateEvents();
    }
}