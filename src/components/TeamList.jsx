import {useEffect, useState} from "react";
import axios from "axios";
import {Link, useHistory, useParams} from "react-router-dom";
import '../css/teamList.css';


export default function TeamList() {

    const [teamList, setTeamList] = useState([]);

    let params = useParams();
    const userID = params.userID;

    const history = useHistory();

    useEffect(() => {

        axios.get("https://backend.hairless.brycemw.ca/teams/?user_id=" + userID).then((res) => {
            let arr = res.data.teams;
            setTeamList(arr);

        }).catch((error) => {
            history.push("/error", {
                message: "the list of teams that the user with id " + userID + " is on",
                error: "" + error,
                next: "/"
            });
        })
    }, []);


    return (
        <div className="teamList">
            <h2>Joined Teams</h2>

            <div className="lists">
                {
                    teamList?.map((team, i) => {
                        const teamMemebers = team.team_members;

                        const listTeams = teamMemebers.map((member) => {
                            return (<span>{member.user.f_name} &nbsp; </span>)
                        });

                        return (
                            <button className="oneTeamLeader" key={i + 1} style={{all: 'unset'}}>
                                <Link to={{pathname: `/teamStatus/${team.team_id}/${userID}`}} style={{all: 'unset'}}>
                                    <div className="teamInfo">
                                        <div className="head">
                                            <h4>Name: {team.team_name}</h4>
                                            <h5 style={{'display': 'flex'}}>
                                                Members: &nbsp;&nbsp;&nbsp;
                                                {listTeams}
                                            </h5>
                                        </div>
                                    </div>
                                </Link>
                            </button>
                        );

                    })
                }
            </div>


        </div>
    );
}