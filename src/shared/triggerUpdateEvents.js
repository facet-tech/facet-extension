import { updateEvents } from '../highlighter';

export default (showSideBar) => {
    // console.log('@triggerUpdateEvents', showSideBar);
    if (showSideBar) {
        updateEvents(true);
    } else {
        updateEvents();
    }
}