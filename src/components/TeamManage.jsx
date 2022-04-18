import {useHistory, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import AcceptMatch from "./AcceptMatch";
import '../css/teamManage.css';


export default function TeamManage() {

    const {tournamentID, teamID, userID} = useParams();
    const [show, setShow] = useState(true);
    const [teamTimeslots, setTeamTimeSlot] = useState([]);

    console.log(teamID, "team manage team id");
    const history = useHistory();

    useEffect(() => {
        axios.get("https://backend.hairless.brycemw.ca/teams/" + teamID + "/team_availabilities").then((res) => {
            let arr = res.data.timeslots;
            console.log("change");
            setTeamTimeSlot(arr);
            if (arr.length > 0) {
                setShow(false);
            }
        }).catch((error) => {
            history.push("/error", {
                message: "get the list of timeslots for the team with team id " + teamID,
                error: "" + error,
                next: "/"
            });

        })
    }, []);


    const onSubmit = ((event) => {
        event.preventDefault();

        axios.post("https://backend.hairless.brycemw.ca/teams/actions/post_team_availabilities/" + teamID, {
            user_id: userID
        }).then((res) => {
            setShow(false);
            console.log(res);
            history.push(`/teamStatus/${teamID}/${userID}`);
        }).catch((error) => {
            console.log(error.response.data, "3");

            history.push("/error", {
                message: "set team's available timeslots with " + teamID,
                error: "" + error.response.data,
                next: `/teamManage/${tournamentID}/${teamID}/${userID}`
            });
        })
    });

    if (show) {
        return (
            <div className="teamManage">
                <div className="availability one">
                    <form className="postAvailability" onSubmit={onSubmit}>
                        <h2>Submit your team's availability</h2>
                        <input type="submit" value="Submit Team's Available Timeslots" className="submit"/>
                    </form>
                </div>
            </div>
        );

    } else {
        return (
            <div className="teamManage">
                <div className="availability two">
                    <div className="submitted">
                        <h2>Your team's availability has already been submitted</h2>
                        <div className="lists">
                            {
                                teamTimeslots?.map((timeslot, i) => {
                                    return (
                                        <div className="timeslot" key={i + 1}>
                                            <h5 className="title">TimeSlot {i + 1} : </h5>

                                            <p>{timeslot.timeslot_start_time} ~ {timeslot.timeslot_end_time}</p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className="acceptMatch">
                    <AcceptMatch
                        tournamentID={tournamentID}
                        teamID={teamID}
                        userID={userID}
                    />
                </div>
            </div>
        );
    }

}
