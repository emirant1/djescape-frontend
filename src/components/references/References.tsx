import './References.css'
import { Reference } from "../../interfaces/common-interfaces.ts";
import { useTranslation } from "react-i18next";

const References = () => {
    const { t } = useTranslation();

    const references: Reference[] = [
        {
            id: "nightclubs",
            title: "nightclubs",
            items: [
                { id: "biel", key: "Biel", value: "Blue Note, Duo, Gaskessel/ Coupole, Take 5, Biella Factory, Beachtown" },
                { id: "basel", key: "Basel", value: "Z7,  Balz, Nordstern, Das Viertel" },
                { id: "solothurn", key: "Solothurn", value: "Solheure, P9 Biberist, Attisholz, Kofmehl, Druckerei" },
                { id: "zuerich", key: "Zürich", value: "Jade, X- Tra, Oxa, Mascotte, Plaza, Hive, Kaufleuten" },
                { id: "genf", key: "Genf", value: "Five, The Baroque, M Club" },
                { id: "lausanne", key: "Lausanne", value: "Mad, D!" },
                { id: "st-gallen", key: "St. Gallen", value: "Elefant" },
                { id: "delemont", key: "Delémont", value: "Golf, SAS" },
            ]
        },
        {
            id: "companies",
            title: "companies",
            items: [
                { id: "company-1", key: "", value: "Calvin Klein Watches, Rado, Omega, Rolex, Hermes, Ice Watch, ESB, Mercedes Benz" },
            ]
        },
        {
            id: "specials",
            title: "specials",
            items: [
                { id: "special-1", key: "", value: "DJ School, Breakdance by Upside Down, Radio Canal 3, Radio Energy" },
            ]
        },
        {
            id: "festivals",
            title: "festivals",
            items: [
                { id: "festival-1", key: "", value: "Gurten, Royal Arena, Frauenfeld, Lakelive, Zrce CRO" },
            ]
        },
        {
            id: "artists",
            title: "artists",
            items: [
                { id: "artist-1", key: "", value: "The Beatnuts, Brick n`Lace, Culcha Candela, Seed, Royce 5`9, Horace Brown, Saian Supa Cru" },
            ]
        }
    ];

    return (
        <div className="body references-wrapper text-align-left">
            {
                references.map(reference => {
                    return (
                        <div key={ reference.id } className="margin-bottom-15-px">
                            <h4>{ t(reference.title) }</h4>
                            {
                                reference.items.map(place => {
                                    return(
                                        <div className="margin-bottom-10-px">
                                            {
                                                place.key && <div key={ place.id } className="text-underline">{ place.key }</div>
                                            }
                                            <div>{ place.value }</div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    );
                })
            }
        </div>
    );
}

export default References