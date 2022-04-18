import '../css/acceptMatch.css';
import {useHistory} from "react-router-dom/cjs/react-router-dom";

export default function AcceptMatch() {
    const history = useHistory();
    const {next, message, error} = history.location.state || {next: '/', message: '', error: ''};

    const onSubmit = ((event) => {
        console.log(next, message, error);
        event.preventDefault();
        history.push({pathname: next});
    })

    return (
        <div className="acceptedTournament">
            <h2>Failed to {message}</h2>
            <form className="form" onSubmit={onSubmit}>

                <h2>{error}</h2>

                <input type="submit" value="Done" className="submit"/>

            </form>
        </div>
    );

}