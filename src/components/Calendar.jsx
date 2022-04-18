import FullCalendar, {formatDate} from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import React, {useContext, useEffect, useState} from "react";

import '../css/Calendar.scss';
import {setLoading, setTopLevel} from "../App";

function mapEvents(events) {
    return events.map((t) => ({
        id: t.tournament_id.toString(),
        title: t.name,
        start: new Date(t.tournament_schedule.tournament_start_time),
        end: new Date(t.tournament_schedule.tournament_end_time),
        extendedProps: t
    }))
}

export default function Calendar() {
    const load = useContext(setLoading);
    const lSetTopLevel = useContext(setTopLevel);
    const [events, setEvents] = useState([]);

    let topLevelObjs = {};

    useEffect(() => {
        load("i");

        async function e() {
            const res = await fetch("https://backend.hairless.brycemw.ca/tournaments");
            if (res.ok) {
                setEvents((await res.json()).tournaments);
            }
        }

        e().finally(() => load("d"));
    }, [load]);

    function addContent(arg) {
        const tournament = arg.event.extendedProps;
        topLevelObjs[`tourn-event-${arg.event.extendedProps.tournament_id}`] = (
            <div className="CalendarTopLevel">
                <h1>{tournament.name}</h1>
                <p>{tournament.description}</p>
                <div className="dual-row" style={{"--rows": 2}}>
                    <span>Start</span>
                    <span>{
                        formatDate(arg.event.start, {
                            month: 'long',
                            year: 'numeric',
                            day: 'numeric'
                        })
                    }</span>
                    <span>End</span>
                    <span>{
                        formatDate(arg.event.end, {
                            month: 'long',
                            year: 'numeric',
                            day: 'numeric'
                        })
                    }</span>
                    <div/>
                </div>
            </div>
        );

        return (
            <div>
                {arg.event.title}
            </div>
        );
    }

    function showContent(arg) {
        const topLevel = topLevelObjs[`tourn-event-${arg.event.extendedProps.tournament_id}`];
        lSetTopLevel(topLevel);
    }

    return (
        <div className="Calendar">
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={mapEvents(events)}
                eventContent={(arg) => addContent(arg)}
                eventClick={(arg) => showContent(arg)}
            />
        </div>
    );


}