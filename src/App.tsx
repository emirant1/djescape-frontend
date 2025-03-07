import './App.css'
import Header from "./components/header/Header.tsx";
import Footer from "./components/footer/Footer.tsx";
import Nav from "./components/nav/Nav.tsx";
import './config/i18n/i18n';
import {Route, Routes} from "react-router-dom";
import Home from "./components/home/Home.tsx";
import Contact from "./components/contact/Contact.tsx";

function App() {
    return (
        <main>
            <Header />
            <Nav />
            <Routes>
                <Route path="/" element={ <Home /> } />
                <Route path="/contact" element={ <Contact /> } />
            </Routes>
            <Footer />
        </main>
    )
}

export default App