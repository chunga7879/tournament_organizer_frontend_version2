import logo from '../images/hc_logo.png';
import "../css/Footer.scss";


export default function Footer() {
    return (
        <footer className="Footer">
            <img src={logo} alt="Hairless Cat Logo" className="logo"/>
            <div>Tournament Organizer</div>
        </footer>
    );
}
