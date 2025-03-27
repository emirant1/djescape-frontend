import './Nav.css';
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { navigationItems } from "../../config/navigation/navigation-config.ts";

const Nav = () => {
    /* Utility functions */
    const { t } = useTranslation();
    const navigate = useNavigate();

    /* The React Hooks and functions */
    const [selectMenuOpen, setSelectMenuOpen] = useState(false);

    const toggleSelectMenu = () => {
        setSelectMenuOpen((prevState) => {
            return !prevState;
        });
    };

    /* Utility function that will create a navigation event */
    const navigateTo = (link: string): void => {
        toggleSelectMenu();
        navigate(link);
    };

    return (
        <>
            <nav>
                <span>{ t('navTitle') }</span>
                <ul>
                    {
                        navigationItems.map(item => {
                            return (
                                <li key={ item.i18nKey }>
                                    <Link to={ item.link }>
                                        { t(`${ item.i18nKey }`) }
                                    </Link>
                                </li>
                            )
                        })
                    }
                </ul>
                <div className="burger" onClick={ toggleSelectMenu }>
                    <img src="/images/navigation/burger-menu.svg" alt="Select your next action"/>
                </div>
            </nav>
            <div className={ selectMenuOpen ? 'select-menu open' : 'select-menu' }>
                {
                    navigationItems.map(item => {
                        return (
                            <div key={ item.i18nKey }
                                 onClick={ () => navigateTo(item.link) }>
                                { t(`${ item.i18nKey }`) }
                            </div>
                        )
                    })
                }
            </div>
        </>
    );
}

export default Nav;