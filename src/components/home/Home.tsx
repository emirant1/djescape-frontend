import './Home.css';
import '../../config/i18n/i18n';
import { useTranslation } from "react-i18next";

const Home = () => {
    const { t } = useTranslation();

    return (
        <div className="body">
            <p className="about">{ t('about') }</p>
            <p className="txt">{ t('biography.p1') }</p>
            <p className="txt">{ t('biography.p2') }</p>
            <p className="txt">{ t('biography.p3') }</p>
        </div>
    );
}

export default Home;