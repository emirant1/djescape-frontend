import './Home.css';
import '../../config/i18n/i18n';
import { useTranslation } from 'react-i18next';
import useAbout from "../../hooks/useAbout.ts";

const Home = () => {
    const { t } = useTranslation();
    const { paragraphs, isLoading } = useAbout();

    return (
        <div className="body">
            <p className="about">{ t('about') }</p>
            { isLoading && <p>{ t('loading') }</p> }
            { paragraphs.map((paragraph, pIndex) => (
                <p key={pIndex}>
                    { paragraph.split('\n').map((line, lIndex, lines) => (
                        <span key={lIndex}>{line}{ lIndex < lines.length - 1 && <br/> }</span>
                    )) }
                </p>
            )) }
        </div>
    );
}

export default Home;