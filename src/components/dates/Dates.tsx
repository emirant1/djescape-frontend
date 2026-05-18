import './Dates.css'
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { EventResponse } from '../../interfaces/common-interfaces.ts';

const COCKPIT_API_URL: string = import.meta.env.VITE_COCKPIT_API_URL ?? '';
const EVENT_RESOURCE: string = `${COCKPIT_API_URL}/api/cockpit/event`;

const formatEventDate = (eventDate: string): string => {
    const [day, month, year] = eventDate.split('.');
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    const weekday = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    return `${weekday} ${eventDate}`;
};

const Dates = () => {
    const { t } = useTranslation();
    const [events, setEvents] = useState<EventResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        fetch(EVENT_RESOURCE)
            .then(res => res.json())
            .then(data => setEvents(data))
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <div className="body">
            <div className="dates-wrapper">
                { isLoading && <p>{ t('loading') }</p> }
                {
                    events.map(event => (
                        <div className="date" key={ event.id }>
                            <div className="column">{ formatEventDate(event.eventDate) }</div>
                            <div className="column text-align-left">{ event.title }</div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default Dates