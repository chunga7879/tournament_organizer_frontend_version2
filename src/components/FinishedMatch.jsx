import {useState} from "react";
import '../css/finishedMatch.css';
import {useHistory} from "react-router-dom/cjs/react-router-dom";
import {Link} from "react-router-dom";


export default function FinishedMatch() {
    const [finishedMatchList, setFinishedMatchList] = useState([
        {
            matchID: 123,
            teamList: [{teamId: 1, teamName: "Team 1"}, {teamId: 7, teamName: "Team 7"}],
            tournamentId: 1,
            tournamentName: "Marketing Team Mario Kart Battle",
            matchDate: '2022-03-27',
            mStartTime: '12:00',
            mEndTime: '1:00',
            rank: []
        },
        {
            matchID: 124,
            teamList: [{teamId: 2, teamName: "Team 2"}, {teamId: 8, teamName: "Team 8"}],
            tournamentId: 2,
            tournamentName: "Marketing Team Mario Kart Battle",
            matchDate: '2022-03-24',
            mStartTime: '12:00',
            mEndTime: '1:00',
            rank: [2, 8]
        },
        {
            matchID: 125,
            teamList: [{teamId: 3, teamName: "Team 3"}, {teamId: 9, teamName: "Team 9"}],
            tournamentId: 3,
            tournamentName: "Marketing Team Mario Kart Battle",
            matchDate: '2022-03-28',
            mStartTime: '12:00',
            mEndTime: '1:00',
            rank: []
        },
        {
            matchID: 126,
            teamList: [{teamId: 4, teamName: "Team 4"}, {teamId: 10, teamName: "Team 10"}],
            tournamentId: 4,
            tournamentName: "Marketing Team Mario Kart Battle",
            matchDate: '2022-03-27',
            mStartTime: '12:00',
            mEndTime: '1:00',
            rank: []
        },
        {
            matchID: 127,
            teamList: [{teamId: 5, teamName: "Team 5"}, {teamId: 11, teamName: "Team 11"}],
            tournamentId: 5,
            tournamentName: "Marketing Team Mario Kart Battle",
            matchDate: '2022-03-24',
            mStartTime: '12:00',
            mEndTime: '1:00',
            rank: []
        },
        {
            matchID: 128,
            teamList: [{teamId: 6, teamName: "Team 6"}, {teamId: 12, teamName: "Team 12"}],
            tournamentId: 6,
            tournamentName: "Marketing Team Mario Kart Battle",
            matchDate: '2022-03-28',
            mStartTime: '12:00',
            mEndTime: '1:00',
            rank: []
        }
    ]);


    const history = useHistory();

    const onSubmit = ((event) => {
        event.preventDefault();

    })

    return (
        <div className="viewFinishedMatchList">
            <h2>Finished Matches</h2>

            <div className="form">
                {
                    finishedMatchList.map((match, i) => {
                        const {
                            matchID,
                            teamList,
                            tournamentId,
                            tournamentName,
                            matchDate,
                            mStartTime,
                            mEndTime,
                            rank
                        } = match;

                        if (rank.length !== 0) {
                            return (
                                <button className="oneTournament" key={i + 1} style={{all: 'unset'}}>
                                    <Link to={{pathname: `/recordMatch/${tournamentId}/${tournamentName}/${matchID}`}}
                                          style={{all: 'unset'}}>
                                        <div className="matchInfo">
                                            <div className="head">
                                                <p>{tournamentName}, Match ID: {matchID}</p>
                                            </div>
                                            <div className="middle1">
                                                Date: {matchDate} <br/>
                                                Start: {mStartTime} &nbsp;&nbsp;&nbsp;
                                                End: {mEndTime}
                                            </div>
                                            <div className="listOfTeamRanks">
                                                {
                                                    rank.map((teamID, i) => {
                                                        return (
                                                            <div className="teamRank">
                                                                <div> {i + 1}: Team ID {teamID} </div>
                                                            </div>
                                                        );
                                                    })
                                                }
                                            </div>

                                        </div>
                                    </Link>
                                </button>
                            );
                        } else {
                            return (
                                <button className="oneTournament" key={i + 1} style={{all: 'unset'}}>
                                    <Link to={{pathname: `/recordResult/${tournamentId}/${tournamentName}/${matchID}`}}
                                          style={{all: 'unset'}}>
                                        <div className="matchInfo">
                                            <div className="head">
                                                <p>{tournamentName} - MatchID: {matchID}</p>
                                            </div>
                                            <div className="middle1">
                                                Match Date: {matchDate} <br/>
                                                Start Time: {mStartTime} &nbsp;&nbsp;&nbsp;
                                                End Time: {mEndTime}
                                            </div>
                                            <div className="listOfTeams">
                                                {
                                                    teamList.map((team, i) => {
                                                        const {teamId, teamName} = team;

                                                        if (i + 1 < teamList.length) {
                                                            return (
                                                                <div className="team">
                                                                    <div>Team {teamId} &nbsp;&nbsp; VS &nbsp;&nbsp;&nbsp; </div>
                                                                </div>
                                                            );
                                                        } else {
                                                            return (
                                                                <div className="team">
                                                                    <div>{teamName}</div>
                                                                </div>
                                                            );
                                                        }

                                                    })
                                                }
                                            </div>

                                        </div>
                                    </Link>
                                </button>
                            );
                        }

                    })
                }
            </div>


        </div>

    );

}