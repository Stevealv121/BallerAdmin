import { useEffect, useMemo, useRef, useState } from "react";
import FullCalendar, { EventApi, formatDate } from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import {
    Box,
    List,
    ListItem,
    ListItemText,
    Typography,
    useTheme,
} from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import CalendarDataService from "../../services/api/calendar";

const Calendar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [currentEvents, setCurrentEvents] = useState([]);

    const [areEvents, setAreEvents] = useState(false);
    const calendarRef = useRef(null);

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const initCalendarEvents = () => {

        if (areEvents) {
            currentEvents.forEach((event) => {
                calendarRef.current.getApi().addEvent(event);
                sleep(500);
                console.log("event added");
            });
            console.log(calendarRef.current.getApi().getEvents());
        } else {
            console.log("no events");
        }

    };

    const editEvent = (selected) => {
        const eventEdited = selected.event.toPlainObject({ collapseExtendedProps: true });
        CalendarDataService.editEvent(JSON.stringify(eventEdited)).then((response) => {
            console.log(response.data);
        }).catch((e) => {
            console.log(e);
        });
    };

    const saveEvent = (event) => {
        CalendarDataService.createEvent(JSON.stringify(event)).then((response) => {
            console.log(response.data);
        }).catch((e) => {
            console.log(e);
        });
    };


    const handleDateClick = (selected) => {
        const title = prompt("Please enter a new title for your event");
        const calendarApi = selected.view.calendar;
        calendarApi.unselect();

        if (title) {
            calendarApi.addEvent({
                id: `${selected.dateStr}-${title}`,
                title,
                start: selected.startStr,
                end: selected.endStr,
                allDay: selected.allDay,
            });
            const new_event = {
                title: title,
                start: selected.startStr,
                end: selected.endStr,
                allDay: selected.allDay,
                owner_id: 1,
            };
            console.log(new_event);
            saveEvent(new_event);
        }
    };

    const getEvents = async (owner_id) => {
        const data = await CalendarDataService.getEvents(owner_id).then(
            (response) => {
                return response.data;
            }
        );
        setAreEvents(true);
        setCurrentEvents(data);
    };

    const handleEventClick = (selected) => {
        if (
            window.confirm(
                `Are you sure you want to delete the event '${selected.event.title}'`
            )
        ) {
            selected.event.remove();
        }
    };

    useEffect(() => {
        getEvents(1);
        initCalendarEvents();
        setCurrentEvents(calendarRef.current.getApi().getEvents());
    }, [areEvents]);

    return (
        <Box m="20px">
            <Header title="Calendar" subtitle="Full Calendar Interactive Page" />

            <Box display="flex" justifyContent="space-between">
                {/* CALENDAR SIDEBAR */}
                <Box
                    flex="1 1 20%"
                    backgroundColor={colors.primary[400]}
                    p="15px"
                    borderRadius="4px"
                >
                    <Typography variant="h5">Events</Typography>
                    <List>
                        {currentEvents.map((event) => (
                            <ListItem
                                //key={event.id}
                                sx={{
                                    backgroundColor: colors.greenAccent[500],
                                    margin: "10px 0",
                                    borderRadius: "2px",
                                }}
                            >
                                <ListItemText
                                    primary={event.title}
                                    secondary={
                                        <Typography>
                                            {formatDate(event.start, {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>

                {/* CALENDAR */}
                <Box flex="1 1 100%" ml="15px">
                    <FullCalendar
                        ref={calendarRef}
                        height="75vh"
                        plugins={[
                            dayGridPlugin,
                            timeGridPlugin,
                            interactionPlugin,
                            listPlugin,
                        ]}
                        headerToolbar={{
                            left: "prev,next today",
                            center: "title",
                            right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
                        }}
                        initialView="dayGridMonth"
                        editable={true}
                        selectable={true}
                        selectMirror={true}
                        dayMaxEvents={true}
                        select={handleDateClick}
                        eventClick={handleEventClick}
                        eventsSet={(events) => setCurrentEvents(events)}
                        eventDrop={editEvent}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default Calendar;