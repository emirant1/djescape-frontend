import './App.css'
import './variables.css';
import Header from "./components/header/Header.tsx";
import Footer from "./components/footer/Footer.tsx";
import Nav from "./components/nav/Nav.tsx";
import './config/i18n/i18n';
import { Route, Routes } from "react-router-dom";
import Home from "./components/home/Home.tsx";
import Dates from "./components/dates/Dates.tsx";
import Contact from "./components/contact/Contact.tsx";
import References from "./components/references/References.tsx";

function App() {
    return (
        <main>
            <Header />
            <Nav />
            <Routes>
                <Route path="/" element={ <Home /> } />
                <Route path="/dates" element={ <Dates /> } />
                <Route path="/references" element={ <References /> } />
                <Route path="/contact" element={ <Contact /> } />
            </Routes>
            <Footer />
        </main>
    )
}

export default App