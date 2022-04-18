import {useContext, useEffect, useState} from "react";
import '../css/CreateTournament.scss';
import TextareaAutosize from 'react-textarea-autosize';
import {setLoading, user} from "../App";
import {useHistory} from "react-router-dom";

function getDateString(today) {
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }

    return yyyy + '-' + mm + '-' + dd;
}

function daysFromToday(days) {
    const today = new Date();
    return new Date(today.setDate(today.getDate() + days));
}

function getOptions(styles) {
    return styles.map((s) => {
        const human_name = s[0] + s.toLocaleLowerCase().slice(1).replaceAll("_", " ");
        return <option value={s} key={s}>{human_name}</option>;
    });
}

export default function CreateTournament() {
    const load = useContext(setLoading);
    const lUser = useContext(user);
    const history = useHistory();

    const [styles, setStyles] = useState(["SINGLE_ROUND_ROBIN"]);

    const [tournamentName, setTournamentName] = useState("");
    const [tournamentDescription, setTournamentDescription] = useState("");
    const [tournamentStyle, setTournamentStyle] = useState("SINGLE_ROUND_ROBIN");
    const [start, setStart] = useState(getDateString(new Date()));
    const [end, setEnd] = useState(getDateString(daysFromToday(7)));
    const [numTeams, setNumTeams] = useState(2);
    const [minPlayers, setMinPlayers] = useState(2);
    const [maxPlayers, setMaxPlayers] = useState(7);

    useEffect(() => {
        load("i");

        async function e() {
            const res = await fetch(`https://backend.hairless.brycemw.ca/tournament_styles`);
            const nStyles = (await res.json()).tournament_styles;
            if (nStyles.length > 0) {
                setStyles(nStyles);
                setTournamentStyle(nStyles[0]);
            }
        }

        e().finally(() => load("d"));
    }, [load]);

    function createTournament() {
        load("i");

        async function e() {
            const tournament = {
                name: tournamentName,
                description: tournamentDescription,
                tournament_parameters: {
                    required_number_of_teams: numTeams,
                    min_number_of_players_per_team: minPlayers,
                    max_number_of_players_per_team: maxPlayers,
                    tournament_type: "TEAM",
                    tournament_style: tournamentStyle
                },
                tournament_schedule: {
                    tournament_start_time: start + "T09:00:00",
                    tournament_end_time: end + "T18:00:00",
                }
            };
            await fetch(
                `https://backend.hairless.brycemw.ca/tournaments/?userID=${lUser.user_id}`,
                {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(tournament)
                }
            );
            history.push("/");
        }

        e().finally(() => load("d"));
    }

    return (
        <div className="CreateTournament">
            <h1>Create new tournament</h1>
            <form onSubmit={(e) => {
                e.preventDefault();
                createTournament()
            }} className="dual-row" style={{"--rows": 6}}>
                <label htmlFor="tournamentName">
                    Name
                </label>
                <input
                    placeholder="Mario Kart"
                    type="text"
                    name="tournamentName"
                    id="tournamentName"
                    value={tournamentName}
                    minLength={1}
                    pattern=".*[^\s].*"
                    required
                    onChange={(event) => setTournamentName(event.target.value)}
                />

                <label htmlFor="tournamentDescription">
                    Description
                </label>
                <TextareaAutosize
                    placeholder="Fun 4v4 Mario Kart game! The winning team is the team that&hellip;"
                    name="tournamentDescription"
                    id="tournamentDescription"
                    minLength={1}
                    value={tournamentDescription}
                    required
                    onChange={(event) => setTournamentDescription(event.target.value)}
                />

                <label htmlFor="tournamentStyle">
                    Style
                </label>
                <select
                    name="tournamentStyle"
                    id="tournamentStyle"
                    required
                    value={tournamentStyle}
                    onChange={(event) => setTournamentStyle(event.target.value)}
                >
                    {getOptions(styles)}
                </select>

                <label htmlFor="minTeams">Team Number:</label>
                <input
                    type="number"
                    id="minTeams"
                    name="minTeams"
                    value={numTeams}
                    min={2}
                    inputMode="numeric"
                    required
                    onChange={(event) => setNumTeams(parseInt(event.target.value))}
                />

                <span>
                    Players per team
                </span>
                <div className="minMax">
                    <label htmlFor="minPlayers">Min:</label>
                    <input
                        type="number"
                        name="minPlayers"
                        id="minPlayers"
                        value={minPlayers}
                        min={1}
                        max={maxPlayers}
                        inputMode="numeric"
                        required
                        onChange={(event) => setMinPlayers(parseInt(event.target.value))}
                    />
                    <label htmlFor="maxPlayers">Max:</label>
                    <input
                        type="number"
                        name="maxPlayers"
                        id="maxPlayers"
                        value={maxPlayers}
                        min={minPlayers}
                        max={100}
                        inputMode="numeric"
                        required
                        onChange={(event) => setMaxPlayers(parseInt(event.target.value))}
                    />
                </div>

                <span>
                    Date
                </span>
                <div className="minMax">
                    <label htmlFor="start">Start:</label>
                    <input
                        type="date"
                        name="start"
                        id="start"
                        value={start}
                        min={getDateString(new Date())}
                        max={end}
                        required
                        onChange={(event) => setStart(event.target.value)}
                    />
                    <label htmlFor="end">End:</label>
                    <input
                        type="date"
                        name="end"
                        id="end"
                        value={end}
                        min={start}
                        required
                        onChange={(event) => setEnd(event.target.value)}
                    />
                </div>

                <input type="submit" value="Generate Tournament" className="submit"/>
                <div/>
            </form>
        </div>

    );
}
