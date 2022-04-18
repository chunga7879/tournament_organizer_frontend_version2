import {useParams} from "react-router-dom";
import '../css/after.css';
import {useHistory} from "react-router-dom/cjs/react-router-dom";


export default function JoinedTournament() {
    const {tournamentId, tournamentName, userID, teamID} = useParams();

    let history = useHistory();

    const onSubmit = (event) => {
        event.preventDefault();

        history.push({pathname: `/teamList/${userID}`});
    }

    return (
        <div className="joinedTournament">
            <h2>Joined tournament: {tournamentName}</h2>
            <form className="form" onSubmit={onSubmit}>
                <h4>Team ID: {teamID} </h4>

                <p>
                    Thanks for joining the tournament! Once an admin has generated the matches, you will be able to see
                    what team you are playing against and when.
                </p>
                <input type="submit" value="Done" className="submit"/>

            </form>
        </div>

    );

}