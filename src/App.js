import {BrowserRouter, Route, Switch} from "react-router-dom";
import AppHead from "./components/AppHead";
import Footer from "./components/Footer";
import CreateTournament from "./components/CreateTournament";
import ScheduleTournament from "./components/ScheduleTournament";
import DeleteTournament from "./components/DeleteTournament";
import JoinTournament from "./components/JoinTournament";
import JoinedTournament from "./components/JoinedTournament";
import AcceptMatch from "./components/AcceptMatch"
import AcceptedMatch from "./components/AcceptedMatch";
import RecordMatch from "./components/RecordMatch";
import GeneratedSchedule from "./components/GeneratedSchedule";
import Calendar from "./components/Calendar";
import GetTeams from "./components/GetTeams"
import GetTeambyId from "./components/GetTeambyId"
import ManageTeams from "./components/ManageTeams";
import TeamList from "./components/TeamList";
import TeamManage from "./components/TeamManage";
import ErrorReturn from "./components/ErrorReturn";
import ViewSchedules from "./components/ViewSchedules";
import React, {createContext, useContext, useReducer, useState} from "react";
import Loading from "./components/Loading";
import "./css/App.scss";
import {useGoogleLogin} from "react-google-login";

export const clientId = '305885881555-fa3k18ajmgrlj0toth807kc80hgu0pa6.apps.googleusercontent.com';
export const loading = createContext(false);
export const setLoading = createContext((_) => {
});
export const user = createContext(null);
export const setUser = createContext((_) => {
});
export const pfp = createContext(null);
export const setTopLevel = createContext((_) => {
});

async function updateUser(user) {
    const res = await fetch(
        `https://backend.hairless.brycemw.ca/users/${user.user_id}`,
        {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        }
    );
    if (res.ok) {
        await fetch(
            `https://backend.hairless.brycemw.ca/users/${user.user_id}`,
            {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(user)
            }
        );
    } else {
        await fetch(
            `https://backend.hairless.brycemw.ca/users`,
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(user)
            }
        );
    }
}

function CheckLoggedIn({children}) {
    const load = useContext(setLoading);
    const [luser, lSetUser] = useState(null);
    const [lpfp, setPfp] = useState(null);
    const [topLevel, lSetTopLevel] = useState(undefined);
    const googleLogin = useGoogleLogin({
        onSuccess: OnGoogleSuccess,
        onFailure: () => {
            load("i");
        },
        clientId,
        isSignedIn: true,
        accessType: "offline"
    });

    function LocalLogIn() {
        load("i");

        async function e() {
            const id = document.querySelector(".LogIn > div > div > input:nth-of-type(1)").value;
            const user = {
                user_id: id,
                is_admin: true,
                department: null,
                company: null,
                f_name: id,
                l_name: null,
                email: `${id}@${id}.${id}`,
                p_number: null
            };
            await updateUser(user);
            lSetUser(user);
        }

        e().finally(() => load("d"));
    }

    function GoogleLogIn() {
        load("i");
        googleLogin.signIn();
    }

    function OnGoogleSuccess(res) {
        let refreshTime = (res.tokenObj.expires_in || 3600 - 5 * 60) * 1000;

        async function refreshToken() {
            try {
                const newAuthRes = await res.reloadAuthResponse();
                refreshTime = (newAuthRes.expires_in || 3600 - 5 * 60) * 1000;
                setTimeout(refreshToken, refreshTime);
            } catch (ignored) {
                window.location.reload();
            }
        }

        setTimeout(refreshToken, refreshTime);

        setPfp(res.profileObj.imageUrl);

        async function e(gUser) {
            let admin = false;
            let nUser = {
                user_id: "google-" + gUser.googleId,
                is_admin: admin,
                department: null,
                company: null,
                f_name: gUser.givenName || null,
                l_name: gUser.familyName || null,
                email: gUser.email || "Unknown@example.com",
                p_number: null
            }
            const res = await fetch(
                `https://backend.hairless.brycemw.ca/users/${"google-" + gUser.googleId}`,
                {
                    method: 'GET',
                    headers: {'Content-Type': 'application/json'}
                }
            );
            if (res.ok) {
                admin = (await res.json()).is_admin || false;

                nUser.is_admin = admin;
                lSetUser(nUser);
                await fetch(
                    `https://backend.hairless.brycemw.ca/users/${"google-" + gUser.googleId}`,
                    {
                        method: 'PUT',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(nUser)
                    }
                );
            } else {
                // User does not exist yet
                lSetUser(nUser);
                await fetch(
                    `https://backend.hairless.brycemw.ca/users`,
                    {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(nUser)
                    }
                );
            }
        }

        e(res.profileObj).finally(() => load("d"));
    }

    if (luser === null) {
        return (
            <div className="LogIn">
                <div>
                    <button onClick={() => {
                        GoogleLogIn()
                    }}>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="G"/>
                        <div>Log in with Google</div>
                    </button>
                    <div>
                        <input type="text" placeholder="Test user ID"/>
                        <button onClick={() => {
                            LocalLogIn()
                        }}>
                            Log in with Test User
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <user.Provider value={luser}>
            <pfp.Provider value={lpfp}>
                {
                    topLevel &&
                    <div className="TopLevel">
                        <div>
                            {topLevel}
                            <div onClick={() => lSetTopLevel(undefined)}/>
                        </div>
                    </div>
                }
                <div style={{overflowY: "scroll"}}>
                    <setUser.Provider value={lSetUser}>
                        <AppHead/>
                    </setUser.Provider>
                    <setTopLevel.Provider value={lSetTopLevel}>
                        {children}
                    </setTopLevel.Provider>
                    <Footer/>
                </div>
            </pfp.Provider>
        </user.Provider>
    );
}

export default function App() {
    const [isLoading, load] = useReducer(
        (s, action) => {
            if (action === "i") {
                return s + 1;
            } else if (action === "d") {
                return s - 1 >= 0 ? s - 1 : 0;
            }
        },
        0
    );

    return (
        <BrowserRouter>
            <loading.Provider value={isLoading}>
                <Loading/>
            </loading.Provider>
            <setLoading.Provider value={load}>
                <CheckLoggedIn>
                    <div className="contents">
                        <Switch>
                            <Route exact path="/index.html" component={Calendar}/>
                            <Route exact path="/" component={Calendar}/>

                            <Route exact path="/createTournament" component={CreateTournament}/>
                            <Route exact path="/deleteTournament" component={DeleteTournament}/>
                            <Route exact path="/scheduleTournament" component={ScheduleTournament}/>
                            <Route exact path="/viewSchedules" component={ViewSchedules}/>

                            <Route exact path="/joinTournament" component={JoinTournament}/>
                            <Route exact path="/manageTeams" component={ManageTeams}/>

                            <Route exact path="/generatedSchedule/:tournamentID"
                                   component={GeneratedSchedule}/>


                            <Route exact path="/teamList" component={TeamList}/>

                            <Route exact path="/teamManage/:tournamentID/:teamID" component={TeamManage}/>


                            <Route exact path="/joinedTournament/:tournamentId/:tournamentName/:teamID"
                                   component={JoinedTournament}/>


                            <Route exact path="/acceptMatch" component={AcceptMatch}/>
                            <Route exact path="/acceptedMatch/:tournamentID/:teamID/:matchID"
                                   component={AcceptedMatch}/>

                            <Route exact path="/recordResult/:matchID/:from" component={RecordMatch}/>


                            <Route exact path="/getTeams" component={GetTeams}/>
                            <Route exact path="/getTeamById" component={GetTeambyId}/>

                            <Route exact path="/error" component={ErrorReturn}/>
                        </Switch>
                    </div>
                </CheckLoggedIn>
            </setLoading.Provider>
        </BrowserRouter>
    );
}
