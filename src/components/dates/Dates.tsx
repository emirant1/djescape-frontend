import './Dates.css'
import { BasicItem } from "../../interfaces/common-interfaces.ts";

const Dates = () => {

    const dates: BasicItem[] = [
        { id:"1", key: "FRI 09.05.2025", value: "Opening Tankbar" },
        { id:"2", key: "SAT 10.05.2025", value: "P9 Biberist" },
        { id:"3", key: "FRI 16.05.2025", value: "Druckerei" },
        { id:"4", key: "SAT 24.05.2025", value: "Zrce Beach CRO" },
        { id:"5", key: "THU 19.06.2025", value: "Corporate Event" },
        { id:"6", key: "FRI 20.06.2025", value: "Lyssbachmärit" },
        { id:"7", key: "SAT 21.06.2025", value: "Lyssbachmärit" },
        { id:"8", key: "FRI 27.06.2025", value: "Braderie Biel" },
        { id:"9", key: "SAT 28.06.2025", value: "Braderie Biel" },
        { id:"10", key: "SAT 05.07.2025", value: "Beachtown Biel" }
    ];

    return (
        <div className="body">
            <div className="dates-wrapper">
                {
                    dates.map(basicItem => {
                        return (
                            <div className="date" key={ basicItem.id }>
                                <div className="column">{ basicItem.key }</div>
                                <div className="column text-align-left">{ basicItem.value }</div>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
}

export default Dates