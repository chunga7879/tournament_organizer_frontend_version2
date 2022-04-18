import TournamentList from "./TournamentList";
import {useContext, useState} from "react";
import {setLoading} from "../App";

export default function DeleteTournament() {
    const load = useContext(setLoading);
    const [refresh, setRefresh] = useState(false);

    function deleteTournament(t) {
        load("i");

        async function e() {
            await fetch(
                `https://backend.hairless.brycemw.ca/tournaments/?tournament_id=${t.tournament_id}`,
                {
                    method: "DELETE"
                }
            );
        }

        e().finally(() => {
            setRefresh(!refresh);
            load("d");
        });
    }

    return (
        <div className="DeleteTournament">
            <h1>Delete tournament</h1>
            <TournamentList
                btnName="Delete"
                btnAction={deleteTournament}
                refresh={refresh}
            />
        </div>
    );

}