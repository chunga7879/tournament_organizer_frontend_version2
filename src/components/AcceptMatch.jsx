import {useEffect, useState} from "react";
import '../css/acceptMatch.css';
import {useHistory} from "react-router-dom/cjs/react-router-dom";
import axios from "axios";

export default function AcceptMatch(
    {
        tournamentID,
        teamID,
        userID
    }
) {
    console.log(teamID);

    const [matchList, setMatch] = useState([]);
    const [matchExist, setMatchExist] = useState(false);

    useEffect(() => {
        console.log(teamID, "accept match team id");
        axios.get("https://backend.hairless.brycemw.ca/matches/?team_id=" + teamID).then((res) => {
            let arr = res.data.matches;

            console.log(arr);

            if (arr.length !== 0) {
                setMatchExist(true);
                setMatch(arr);
            }
        }).catch((error) => {
            history.push("/error", {
                message: "get matches for the team with id " + teamID,
                error: "" + error,
                next: `/teamManage/${tournamentID}/${teamID}/${userID}`
            });
        })
    }, []);


    const history = useHistory();

    const onClick = ((event) => {
        event.preventDefault();

        console.log(event.target.value);

        axios.post("https://backend.hairless.brycemw.ca/matches/actions/" + event.target.value + "/accept_match/" + teamID).then((res) => {
            console.log(res);
            history.push({pathname: `/acceptedMatch/${tournamentID}/${teamID}/${event.target.value}/${userID}`});
        }).catch((error) => {
            console.log(error);
            history.push("/error", {
                message: "accept match for the team with id " + teamID,
                error: "" + error,
                next: `/teamManage/${tournamentID}/${teamID}/${userID}`
            });

        })

    })

    const onClickTwo = ((event) => {
        event.preventDefault();

        console.log(event.target.value);

        axios.post("https://backend.hairless.brycemw.ca/matches/" + event.target.value + "/complete").then((res) => {
            console.log(res);
            history.push({pathname: `/recordResult/${event.target.value}/leader/${userID}`});

        }).catch((error) => {
            history.push("/error", {
                message: "complete match for team with id " + teamID,
                error: "" + error,
                next: `/acceptMatch`
            });
        })

    })

    const onClickThree = ((event) => {
        event.preventDefault();

        console.log(event.target.value);

        history.push({pathname: `/recordResult/${event.target.value}/leader/${userID}`});

    })

    if (matchExist) {
        return (
            <div className="matchLists">
                <div className="matches" style={{visibility: matchExist ? "visible" : "hidden"}}>
                    {
                        matchList?.map((match, i) => {
                            let show = false;
                            const myStatus = findMyStatus(match.team_statuses, teamID);
                            console.log(myStatus);
                            if (myStatus === "PENDING") {
                                show = true;
                            }
                            const matchStatus = match.match_status;
                            let showRecord = false;
                            if (matchStatus === "COMPLETED") {
                                showRecord = true;
                            }
                            let showComplete = false;
                            if (matchStatus === "UPCOMING") {
                                showComplete = true;
                            }
                            return (
                                <div className="match" key={i + 1}>
                                    <h2 className="matchid">Match ID: {match.match_id}</h2>
                                    <div className="matchInfo">
                                        <h2>Match status : {match.match_status}</h2>
                                        <h2>Your team's Status: {myStatus}</h2>
                                        <div className="middle1">
                                            Start: {match.match_start_time} <br/>
                                            End: {match.match_end_time} <br/>
                                        </div>
                                    </div>
                                    <div>
                                        {
                                            show &&
                                            <form className="form">
                                                <button
                                                    value={match.match_id}
                                                    onClick={onClick}
                                                >
                                                    Accept match
                                                </button>
                                            </form>
                                        }
                                        {
                                            showRecord &&
                                            <form className="form">
                                                <button
                                                    value={match.match_id}
                                                    onClick={onClickThree}
                                                >
                                                    Results
                                                </button>
                                            </form>
                                        }
                                        {
                                            showComplete &&
                                            <form className="form">
                                                <button
                                                    value={match.match_id}
                                                    onClick={onClickTwo}
                                                >
                                                    Submit results
                                                </button>
                                            </form>
                                        }
                                    </div>


                                </div>
                            )
                        })
                    }
                </div>
            </div>

        );
    } else {
        return (
            <div className="notExist">
                <h2>Matches for this tournament have not been scheduled yet</h2>
                <h3>Once an admin has scheduled the matches, you can view your match here</h3>
            </div>
        )
    }


}

function findMyStatus(arr, teamID) {
    for (let t of arr) {
        console.log(t);
        if (t.team_id === parseFloat(teamID)) {
            console.log(t.team_status);
            return t.team_status;
        }
    }
    return null;
}