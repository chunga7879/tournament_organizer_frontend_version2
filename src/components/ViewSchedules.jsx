import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import TournamentList from "./TournamentList";
import "../css/ViewSchedules.scss";
import {setLoading} from "../App";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";

function mapEvents(matchs) {
    return matchs.map(m => ({
        id: m.match_id,
        title: m.teams_in_match.map((t) => t.team_name).join(" - "),
        start: new Date(m.match_start_time),
        end: new Date(m.match_end_time)
    }));
}

export default function ViewSchedules() {
    const load = useContext(setLoading);

    const calendar = useRef();
    const [smallView, setSmallView] = useState(false);
    const view = useMemo(() => {
        if (smallView) {
            return {weekday: 'short'};
        } else {
            return {weekday: 'short', month: 'numeric', day: 'numeric', omitCommas: true};
        }
    }, [smallView]);
    const checkSize = useCallback(smallView => {
        const small = window.innerWidth <= 700;
        if (!smallView && small) {
            setSmallView(true);
        } else if (smallView && !small) {
            setSmallView(false);
        }
    }, []);
    useEffect(() => {
        checkSize(false);
    }, [checkSize]);

    const [tournament, setTournament] = useState(null);
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        if (tournament !== null) {
            load("i");

            async function e() {
                const res = await fetch(`https://backend.hairless.brycemw.ca/matches/?tournament_id=${tournament.tournament_id}`);
                setMatches((await res.json()).matches);
            }

            const startTime = new Date(tournament.tournament_schedule.tournament_start_time);
            calendar.current.getApi().gotoDate(startTime);

            e().finally(() => load("d"));
        }
    }, [tournament, load]);

    return (
        <div className="ViewSchedules">
            <div hidden={tournament !== null}>
                <h1>Scheduled tournaments</h1>
                <TournamentList
                    getArgs="filter=SCHEDULED"
                    btnName="View schedule"
                    btnAction={setTournament}
                />
            </div>
            {tournament !== null &&
                <div>
                    <h1>Tournament schedule</h1>
                    <div className="BackButton">
                        <button onClick={() => setTournament(null)}>
                            <div/>
                            List
                        </button>
                    </div>
                    <div className="Calendar">
                        <FullCalendar
                            ref={calendar}
                            plugins={[timeGridPlugin]}
                            initialView="timeGridWeek"
                            allDaySlot={false}
                            dayHeaderFormat={view}
                            windowResize={() => checkSize(smallView)}
                            events={mapEvents(matches)}
                        />
                    </div>
                </div>
            }
        </div>
    );
}