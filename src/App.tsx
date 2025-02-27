import './App.css'
import Header from "./components/header/Header.tsx";
import Footer from "./components/footer/Footer.tsx";
import Nav from "./components/nav/Nav.tsx";
import './config/i18n/i18n';
import { useTranslation } from "react-i18next";

function App() {
    const { t } = useTranslation();

    return (
    <main>
        <Header />
        <Nav />
        <div className="body">
            <p className="about">{ t('about') }</p>
            <p className="txt">{ t('biography.p1') }</p>
            <p className="txt">{ t('biography.p2') }</p>
            <p className="txt">{ t('biography.p3') }</p>
        </div>
        <Footer />
    </main>
  )
}

export default App
