import {useEffect, useState} from "react";

import '../css/viewTournament.css';
import {useHistory} from "react-router-dom/cjs/react-router-dom";
import axios from "axios";

export default function GetTeams() {
    const [teamList, setList] = useState([]);

    const history = useHistory();

    useEffect(() => {
        axios.get("https://backend.hairless.brycemw.ca/teams").then((res) => {
            let arr = res.data.teams;
            setList(arr);

        }).catch((error) => {
            history.push("/error", {message: "get list of teams", error: "" + error, next: "/"});
        })
    }, []);


    return (
        <div className="viewTeams">
            <h2>Teams</h2>

            <div className="listTeams">
                {
                    teamList.map((team, i) => {
                        const {team_id, teamName, users} = team;
                        console.log(team, "team");

                        return (
                            <div className="oneTeam" key={i + 1}>
                                <h3>Team {i + 1}</h3>

                                <form className="teamInfo">
                                    <div className="head">
                                        <h4>{teamName}</h4>
                                    </div>
                                    <div className="middle1">
                                        Members: {users} <br/>
                                    </div>
                                </form>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
}

