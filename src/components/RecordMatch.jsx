import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useHistory} from "react-router-dom/cjs/react-router-dom";
import '../css/recordMatch.css';
import axios from "axios";

export default function RecordMatch() {
    const {matchID, from, userID} = useParams();
    const [teamList, setTeamList] = useState([]);
    const participantNumber = teamList.length;
    const [rank, setRank] = useState(new Array(participantNumber));
    const [showRank, setShowRank] = useState([]);
    const [resultExist, setResultExist] = useState(false);

    let history = useHistory();

    useEffect(() => {
        axios.get("https://backend.hairless.brycemw.ca/results/" + matchID + "/match").then((res) => {

            let results = res.data.team_results;
            console.log(results.length, "length");
            if (results.length === 0) {
                setResultExist(false);
                axios.get("https://backend.hairless.brycemw.ca/matches/" + matchID).then((res) => {
                    let arr = res.data.teams_in_match;
                    console.log(results.length, "length ?");

                    setTeamList(arr);
                    console.log(teamList, "list");
                }).catch((error) => {
                    history.push("/error", {
                        message: "get details of the match with id " + matchID,
                        error: "" + error,
                        next: "/"
                    });
                })
            } else {
                setResultExist(true);
                setShowRank(results);
                console.log(showRank);
            }
        }).catch((error) => {
            console.log(error.response.status);

            if (error.response.status === 404) {
                setResultExist(false);
                axios.get("https://backend.hairless.brycemw.ca/matches/" + matchID).then((res) => {
                    let arr = res.data.teams_in_match;

                    setTeamList(arr);
                    console.log(teamList, "list");
                }).catch((error) => {
                    history.push("/error", {
                        message: "get details of the match with id " + matchID,
                        error: "" + error,
                        next: "/"
                    });
                })
            } else {
                history.push("/error", {
                    message: "get results of the match with id " + matchID,
                    error: "" + error,
                    next: "/"
                });
            }

        })

    }, []);

    const onsubmit = ((event) => {
        event.preventDefault();
        setRank(rank);
        console.log(rank);

        axios.post("https://backend.hairless.brycemw.ca/results/" + matchID, {
            team_results: rank
        }).then((res) => {
            console.log(res);
            history.push({pathname: `/recordResult/${matchID}/leader/${userID}`});
        }).catch((error) => {
            console.log(error);
            history.push("/error", {
                message: "submit results for the match with id " + matchID,
                error: "" + error,
                next: `/recordResult/${matchID}/leader`
            });
        })
    })

    if (from === "leader") {
        return (
            <div>
                {
                    resultExist &&

                    <div className="listRanks">
                        <h2>Match results</h2>
                        <div className="listOfTeamRanks">
                            {
                                showRank?.map((team, i) => {
                                    const teamName = team.team_name;

                                    return (
                                        <div className="teamRank" key={i + 1}>
                                            <div> #{i + 1}: {teamName} </div>
                                        </div>
                                    );

                                })
                            }
                        </div>

                        <p>Invalidate the match if the results are erroneous</p>
                        <button className="validate"
                                onClick={(event) => {
                                    axios.delete("https://backend.hairless.brycemw.ca/results/" + matchID).then((res) => {
                                        console.log(res);
                                        console.log("here?");

                                        history.push({pathname: `/recordResult/${matchID}/leader/${userID}`});
                                        window.location.reload(false);

                                    }).catch((error) => {
                                        console.log(error);
                                        history.push("/error", {
                                            message: "delete results by " + matchID + "is on ",
                                            error: "" + error,
                                            next: `/recordResult/${matchID}/leader`
                                        });

                                    })
                                }}
                        >
                            Invalidate
                        </button>

                    </div>
                }
                {
                    !resultExist &&
                    <div className="recordMatch">
                        <h2>Record match results</h2>
                        <h3> Match ID: {matchID} </h3>
                        <form className="form" onSubmit={onsubmit}>
                            {
                                teamList?.map((team, i) => {
                                    return (
                                        <div className="oneTeam" key={i + 1}>
                                            <div className="teamInfo">
                                                Name: {team.team_name}
                                            </div>
                                            <input
                                                type="number"
                                                onChange={(event) => {
                                                    const val = event.target.value - 1;
                                                    rank[val] = team.team_id;
                                                }}
                                            />
                                        </div>
                                    );
                                })
                            }

                            <input type="submit" value="Submit Record Of Match" className="submit"/>
                        </form>
                    </div>
                }
            </div>

        );
    } else {
        return (
            <div>
                {
                    resultExist &&

                    <div className="listRanks">
                        <h2>Match results</h2>

                        <div className="listOfTeamRanks">
                            {
                                showRank.map((team, i) => {
                                    const teamName = team.team_name;

                                    return (

                                        <div className="teamRank">
                                            <div> #{i + 1}: {teamName} </div>
                                        </div>
                                    );

                                })
                            }
                        </div>
                    </div>
                }
                {
                    !resultExist &&
                    <div className="notReSult">
                        Results have not been submitted for this match yet.<br/>
                        Only the leader of a participating team can submit the results. Once the results are submitted,
                        they will show up here.
                    </div>
                }
            </div>
        );
    }


}