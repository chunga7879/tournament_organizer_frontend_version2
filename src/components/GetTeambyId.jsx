import {useEffect, useState} from "react";

import '../css/viewTournament.css';
import {useHistory} from "react-router-dom/cjs/react-router-dom";
import axios from "axios";

export default function GetTeambyId() {
    const [teamList, setList] = useState([]);

    const history = useHistory();

    useEffect(() => {
        axios.get("https://backend.hairless.brycemw.ca/teams/").then((res) => {
            let arr = res.data.teams;
            setList(arr);

        }).catch((error) => {
            history.push("/error", {message: "get list of teams", error: "" + error, next: "/"});
        })
    }, []);

    const [team, setTeam] = useState();
    const handleId = () => {
        console.log(team, "team");

        setTeam(teamList.getElementById('team_id').value)
        console.log(teamList, "list");

    };
    return (
        <div>
            <input id='team id'/>
            <h2> {team} </h2>
            <button onClick={handleId}/>
        </div>
    );
}

