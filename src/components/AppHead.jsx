import logo from '../images/hc_logo.png';
import "../css/AppHead.scss";
import {Link} from "react-router-dom";
import {useContext} from "react";
import {useGoogleLogout} from "react-google-login";
import {clientId, pfp, setLoading, setUser, user} from "../App";

export default function AppHead() {
    const lSetUser = useContext(setUser);
    let lUser = useContext(user);
    const lPfp = useContext(pfp);
    const load = useContext(setLoading);
    const googleLogout = useGoogleLogout({
        clientId,
        onLogoutSuccess: () => {
            window.location.reload();
        },
        onFailure: () => {
            window.location.reload();
        }
    });

    const isAdmin = lUser.is_admin;
    const name = lUser.f_name + (lUser.l_name && lUser.l_name !== "Unknown" ? " " + lUser.l_name : "");
    const image = lPfp || null;

    function tryToggleAdmin() {
        load("i");
        const res = prompt("Enter the password to toggle admin status\nHint, it's our course ID", "000");
        if (res === "319") {
            toggleAdmin().finally(() => {
                lSetUser(lUser);
                load("d");
            });
        } else {
            load("d");
        }
    }

    async function toggleAdmin() {
        lUser.is_admin = !lUser.is_admin;

        await fetch(`https://backend.hairless.brycemw.ca/users/${lUser.user_id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(lUser)
        });
    }

    function logout() {
        load("i");
        googleLogout.signOut();
    }

    return (
        <header className="AppHead">
            <div>
                <Link to="/">
                    <img src={logo} alt="Hairless Cat Logo"/>
                </Link>
                <Link to="/">
                    <span>Tournament</span>
                    <span>Organizer</span>
                </Link>
                <label htmlFor="burger">
                    <div>
                        <div/>
                    </div>
                </label>
            </div>
            <input id="burger" type="checkbox"/>
            <ul>
                {isAdmin && <li><Link to="/createTournament">Create Tournament</Link></li>}
                {isAdmin && <li><Link to="/deleteTournament">Delete Tournament</Link></li>}
                {isAdmin && <li><Link to="/scheduleTournament">Schedule Tournament</Link></li>}
                {isAdmin && <li><Link to="/viewSchedules">View Tournament Schedules</Link></li>}

                <li><Link to="/joinTournament">Join Tournament</Link></li>
                <li><Link to="/manageTeams">Manage Teams</Link></li>
                <li><Link to="/teamList">Joined Teams</Link></li>
            </ul>
            <div>
                <ul>
                    <li>
                        <button onClick={() => {
                            tryToggleAdmin()
                        }}>Toggle Admin Status
                        </button>
                    </li>
                    <li>
                        <button onClick={() => {
                            logout()
                        }}>Log Out
                        </button>
                    </li>
                </ul>
                <div>
                    <span>Hi, {name}</span>
                    {image && image !== "Unknown" && <img src={image} alt="pfp"/>}
                </div>
            </div>
        </header>
    );
}