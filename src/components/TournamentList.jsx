import "../css/TournamentList.scss";
import {useCallback, useContext, useEffect, useState} from "react";
import {setLoading} from "../App";
import {formatDate} from "@fullcalendar/react";

function getHumanName(name) {
    return name[0] + name.toLocaleLowerCase().slice(1).replaceAll("_", " ");
}

async function getTeam(t) {
    const res = await fetch(`https://backend.hairless.brycemw.ca/teams/${t.team_id}`);
    return await res.json();
}

export default function TournamentList({getArgs, btnName, btnAction, btnPred, detail, additional, refresh}) {
    const load = useContext(setLoading);
    const [tournaments, setTournaments] = useState([]);
    const [tournamentMap, setTournamentMap] = useState({});
    const getParmams = getArgs === undefined ? "" : Array.isArray(getArgs) ? "?" + getArgs.join("&") : "?" + getArgs;

    const getDetailedTournament = useCallback(async t => {
        const res = await fetch(`https://backend.hairless.brycemw.ca/tournaments/${t.tournament_id}`);
        let tournament = await res.json();
        if (additional === "full_teams") {
            tournament.teams = await Promise.all(tournament.teams.map(getTeam));
        }
        return tournament;
    }, [additional]);

    useEffect(() => {
        load("i");

        async function e() {
            const res = await fetch(`https://backend.hairless.brycemw.ca/tournaments${getParmams}`);
            if (res.ok) {
                let tournaments = (await res.json()).tournaments;
                tournaments.sort((a, b) => new Date(a.tournament_schedule.tournament_start_time) - new Date(b.tournament_schedule.tournament_start_time));
                if (btnPred || detail) {
                    tournaments = await Promise.all(tournaments.map(getDetailedTournament));
                }
                let tournamentMap = {};
                for (let tournament of tournaments) {
                    tournamentMap[tournament.tournament_id] = tournament;
                }
                setTournaments(tournaments);
                setTournamentMap(tournamentMap);
            }
        }

        e().finally(() => load("d"));
    }, [load, getParmams, btnPred, detail, refresh, getDetailedTournament]);

    function getTournamentFromEvent(e) {
        const element = e.target.parentElement.parentElement;
        const id = element.dataset.tournamentId;
        return tournamentMap[id];
    }

    function renderTournament(t) {
        let button = <button onClick={(e) => btnAction(getTournamentFromEvent(e))}>{btnName}</button>;

        if (btnPred && !btnPred(t)) {
            button = <button className="disabled">{btnName}</button>;
        }

        return (
            <div key={t.tournament_id} data-tournament-id={t.tournament_id}>
                <h1>{t.name}</h1>
                <h2>{getHumanName(t.status)}</h2>
                {detail && detail(t)}
                <div className="dual-row" style={{"--rows": 2}}>
                    <h3>Start</h3>
                    <h3>{
                        formatDate(new Date(t.tournament_schedule.tournament_start_time), {
                            month: 'long',
                            year: 'numeric',
                            day: 'numeric'
                        })
                    }</h3>
                    <h3>End</h3>
                    <h3>{
                        formatDate(new Date(t.tournament_schedule.tournament_end_time), {
                            month: 'long',
                            year: 'numeric',
                            day: 'numeric'
                        })
                    }</h3>
                    <div/>
                </div>
                <p>{t.description}</p>
                <span>{button}</span>
            </div>
        );
    }

    return (
        <div className="TournamentList">
            {tournaments.map(renderTournament)}
        </div>
    );
}
