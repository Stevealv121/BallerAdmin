import httpCommon from "../../http-common";

class CalendarDataService {

    getEventsByMonth(month, owner_id) {
        return httpCommon.get(`calendar/month/${month}/${owner_id}`);
    }

    getEvent(id) {
        return httpCommon.get(`event/${id}`);
    }

    getEvents(owner_id) {
        return httpCommon.get(`calendar/events/${owner_id}`);
    }

}

export default new CalendarDataService();