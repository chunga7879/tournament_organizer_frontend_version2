import React, {useContext, useState} from "react";
import TournamentList from "./TournamentList";
import {setLoading} from "../App";

function teamsReady(t) {
    for (let team of t.teams) {
        if (team.team_members.length < t.tournament_parameters.min_number_of_players_per_team) {
            return "members";
        } else if (!team.has_indicated_availability) {
            return "availability";
        }
    }
    return true;
}

function canBeScheduled(t) {
    const teamCount = t.teams.length >= t.tournament_parameters.required_number_of_teams;
    return teamCount && teamsReady(t) === true;
}

function showTeamCount(t) {
    const teams = teamsReady(t);
    return [
        <h2 key="1">{t.teams.length} teams, {t.tournament_parameters.required_number_of_teams} required</h2>,
        teams !== true &&
        <h2 key="2">{teams === "members" ? "Some teams don't have enough members" : "Not all teams have submitted availability"}</h2>,
        t.tournament_schedule.schedule_status !== "SCHEDULE_NOT_GENERATED" &&
        <h2 key="2">{t.tournament_schedule.schedule_status_error_message}</h2>
    ];
}

export default function ScheduleTournament() {
    const load = useContext(setLoading);
    const [refresh, setRefresh] = useState(false);

    function scheduleTournament(t) {
        load("i");

        async function e() {
            await fetch(
                `https://backend.hairless.brycemw.ca/tournaments/actions/gen_match_schedule/${t.tournament_id}`,
                {
                    method: "POST"
                }
            );
        }

        e().finally(() => {
            load("d");
            setRefresh(!refresh);
        });
    }

    return (
        <div className="GenerateSchedule">
            <h1>Generate Schedule</h1>
            <TournamentList
                getArgs="filter=UNSCHEDULED"
                btnName="Schedule"
                btnAction={scheduleTournament}
                btnPred={canBeScheduled}
                detail={showTeamCount}
                additional="full_teams"
                refresh={refresh}
            />
        </div>

    );
}
