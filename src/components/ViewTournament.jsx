import {useEffect, useState} from "react";
import '../css/viewTournament.css';
import axios from "axios";
import {useParams} from "react-router-dom";

export default function ViewTournament() {

    let params = useParams();
    const userID = params.userID;
    console.log(userID);
    const [tournamentList, setList] = useState([]);

    useEffect(() => {
        axios.get("https://backend.hairless.brycemw.ca/tournaments/?userID=" + userID).then((res) => {

            let arr = res.data;
            setList(arr);
            console.log(tournamentList, "list");

        }).catch((error) => {
            history.push("/error", {
                message: "get all tournaments joined by the user with user id " + userID,
                error: "" + error,
                next: "/"
            });
        })
    }, []);

    return (
        <div className="viewTournament">
            <h2>Manage My Tournaments</h2>

            <div className="listTournaments">
                {
                    tournamentList?.map((tournament, i) => {
                        const {tid, name, description, status, tournament_parameters, tournament_schedule} = tournament;
                        const startDate = tournament_schedule.tournament_start_time.substr(0, 10);
                        const endDate = tournament_schedule.tournament_end_time.substr(0, 10);

                        return (
                            <div className="oneTournament" key={i + 1}>
                                <h3>Tournament ID: {tid}</h3>

                                <form className="tournamentInfo">
                                    <div className="head">
                                        <h4>{name}</h4>
                                        <h5>
                                            Tournament Type: {tournament_parameters.tournament_type} <br/>
                                            Tournament Style: {tournament_parameters.tournament_style}
                                        </h5>
                                    </div>
                                    <div className="middle1">
                                        Status: {status} <br/>
                                        Start: {startDate} <br/>
                                        End: {endDate}
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