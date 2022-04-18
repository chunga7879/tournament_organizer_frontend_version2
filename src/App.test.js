import {render} from '@testing-library/react';
import {BrowserRouter} from "react-router-dom";
import App from './App';
import AppHead from "./components/AppHead";
import Footer from "./components/Footer";
import CreateTournament from "./components/CreateTournament";
import ViewTournament from "./components/ViewTournament";
import TournamentGenerated from "./components/TournamentGenerated";
import ScheduleTournament from "./components/ScheduleTournament";
import {createMemoryHistory} from 'history';

test('renders app work well', () => {
    render(<App/>);
    // const linkElement = screen.getByText(/learn react/i);
    // expect(linkElement).toBeInTheDocument();
});

describe("rendering tests", () => {
    it("head component created successfully", async () => {

        const history = createMemoryHistory({initialEntries: ['/']});
        render(
            <BrowserRouter history={history}>
                <AppHead/>
            </BrowserRouter>
        );

    });

    it("Footer component created successfully", () => {
        render(<Footer/>);

    });

    it("CreateTournament component created successfully", () => {
        render(<CreateTournament/>);
    });

    it("ViewTournament component created successfully", () => {
        render(<ViewTournament/>);
    });

    it("TournamentGenerated component created successfully", () => {
        render(<TournamentGenerated/>);
    });

    it("ScheduleTournament component created successfully", () => {
        render(<ScheduleTournament/>);
    });

})


