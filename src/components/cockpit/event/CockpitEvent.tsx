import './CockpitEvent.css';
import { useState, useEffect, useCallback } from 'react';
import { EventRequest, EventResponse, OPERATION_STATUS } from '../../../interfaces/common-interfaces';
import { useAuth } from '../../../context/auth/AuthContext';
import { useTranslation } from 'react-i18next';

const COCKPIT_API_URL: string = import.meta.env.VITE_COCKPIT_API_URL ?? '';
const EVENT_RESOURCE: string = `${COCKPIT_API_URL}/api/cockpit/event`;

const toApiDate = (date: string): string => {
    const [year, month, day] = date.split('-');
    return `${day}.${month}.${year}`;
};

const CockpitEvent = () => {
    const { t } = useTranslation();
    const { token, logout } = useAuth();

    const [events, setEvents] = useState<EventResponse[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDate, setEditDate] = useState('');
    const [newEvents, setNewEvents] = useState<{ title: string; eventDate: string }[]>([{ title: '', eventDate: '' }]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | undefined>();
    const [createStatus, setCreateStatus] = useState<OPERATION_STATUS>(OPERATION_STATUS.IDLE);
    const [updateStatus, setUpdateStatus] = useState<OPERATION_STATUS>(OPERATION_STATUS.IDLE);

    const authHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    const fetchEvents = useCallback(async (): Promise<void> => {
        setIsLoading(true);
        try {
            const response = await fetch(EVENT_RESOURCE, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.status === 401) { logout(); return; }
            if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
            setEvents(await response.json());
        } catch (e: unknown) {
            setErrorMessage(e instanceof Error ? e.message : t('errors.unknown'));
        } finally {
            setIsLoading(false);
        }
    }, [token, logout, t]);

    useEffect(() => { fetchEvents(); }, [fetchEvents]);

    const handleAddRow = () => {
        setNewEvents(prev => [...prev, { title: '', eventDate: '' }]);
    };

    const handleRemoveRow = (index: number) => {
        setNewEvents(prev => prev.filter((_, i) => i !== index));
    };

    const handleNewEventChange = (index: number, field: 'title' | 'eventDate', value: string) => {
        setNewEvents(prev => prev.map((ev, i) => i === index ? { ...ev, [field]: value } : ev));
    };

    const handleCreate = async (): Promise<void> => {
        setErrorMessage(undefined);
        setCreateStatus(OPERATION_STATUS.INITIALIZED);
        const payload: EventRequest[] = newEvents.map(ev => ({
            title: ev.title,
            eventDate: toApiDate(ev.eventDate)
        }));
        try {
            const response = await fetch(EVENT_RESOURCE, {
                method: 'POST',
                headers: authHeaders,
                body: JSON.stringify(payload)
            });
            if (response.status === 401) { logout(); return; }
            if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
            setCreateStatus(OPERATION_STATUS.SUCCESS);
            setNewEvents([{ title: '', eventDate: '' }]);
            await fetchEvents();
        } catch (e: unknown) {
            setCreateStatus(OPERATION_STATUS.FAILURE);
            setErrorMessage(e instanceof Error ? e.message : t('errors.unknown'));
        }
    };

    const handleEdit = (event: EventResponse): void => {
        setEditingId(event.id);
        setEditTitle(event.title);
        setEditDate(event.eventDate);
        setUpdateStatus(OPERATION_STATUS.IDLE);
        setErrorMessage(undefined);
    };

    const handleCancelEdit = (): void => {
        setEditingId(null);
        setEditTitle('');
        setEditDate('');
        setUpdateStatus(OPERATION_STATUS.IDLE);
    };

    const handleUpdate = async (id: number): Promise<void> => {
        setErrorMessage(undefined);
        setUpdateStatus(OPERATION_STATUS.INITIALIZED);
        const payload: EventRequest = { title: editTitle, eventDate: toApiDate(editDate) };
        try {
            const response = await fetch(`${EVENT_RESOURCE}/${id}`, {
                method: 'PUT',
                headers: authHeaders,
                body: JSON.stringify(payload)
            });
            if (response.status === 401) { logout(); return; }
            if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
            setUpdateStatus(OPERATION_STATUS.SUCCESS);
            setEditingId(null);
            await fetchEvents();
        } catch (e: unknown) {
            setUpdateStatus(OPERATION_STATUS.FAILURE);
            setErrorMessage(e instanceof Error ? e.message : t('errors.unknown'));
        }
    };

    const handleDelete = async (id: number): Promise<void> => {
        if (!window.confirm(t('cockpit.event.confirmDelete'))) return;
        setErrorMessage(undefined);
        try {
            const response = await fetch(`${EVENT_RESOURCE}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.status === 401) { logout(); return; }
            if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
            await fetchEvents();
        } catch (e: unknown) {
            setErrorMessage(e instanceof Error ? e.message : t('errors.unknown'));
        }
    };

    return (
        <div className="body">
            <div className="event-create-section">
                <table className="event-table">
                    <thead>
                        <tr>
                            <th>{ t('cockpit.event.date') }</th>
                            <th>{ t('cockpit.event.eventTitle') }</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        { newEvents.map((ev, index) => (
                            <tr key={index}>
                                <td>
                                    <input
                                        type="date"
                                        value={ev.eventDate}
                                        onChange={e => handleNewEventChange(index, 'eventDate', e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={ev.title}
                                        onChange={e => handleNewEventChange(index, 'title', e.target.value)}
                                        maxLength={255}
                                    />
                                </td>
                                <td>
                                    { newEvents.length > 1 &&
                                        <button type="button" className="btn-danger" onClick={() => handleRemoveRow(index)}>
                                            { t('delete') }
                                        </button>
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="form-actions">
                    <button type="button" className="btn-secondary" onClick={handleAddRow}>
                        { t('cockpit.event.addRow') }
                    </button>
                    <button type="button" onClick={handleCreate} disabled={createStatus === OPERATION_STATUS.INITIALIZED}>
                        { t('cockpit.event.create') }
                    </button>
                </div>
                { createStatus === OPERATION_STATUS.SUCCESS && <p className="success">{ t('cockpit.event.saved') }</p> }
                { errorMessage && <div className="error">{ errorMessage }</div> }
            </div>

            <div className="event-list-section">
                { isLoading && <p>{ t('loading') }</p> }
                { !isLoading && events.length === 0 && <p>{ t('cockpit.event.noEvents') }</p> }
                { events.length > 0 &&
                    <table className="event-table">
                        <thead>
                            <tr>
                                <th>{ t('cockpit.event.date') }</th>
                                <th>{ t('cockpit.event.eventTitle') }</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            { events.map(event => (
                                <tr key={event.id}>
                                    { editingId === event.id ? (
                                        <>
                                            <td>
                                                <input
                                                    type="date"
                                                    value={editDate}
                                                    onChange={e => setEditDate(e.target.value)}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={editTitle}
                                                    onChange={e => setEditTitle(e.target.value)}
                                                    maxLength={255}
                                                />
                                            </td>
                                            <td className="event-actions">
                                                <button
                                                    type="button"
                                                    onClick={() => handleUpdate(event.id)}
                                                    disabled={updateStatus === OPERATION_STATUS.INITIALIZED}>
                                                    { t('cockpit.event.update') }
                                                </button>
                                                <button type="button" className="btn-secondary" onClick={handleCancelEdit}>
                                                    { t('cancel') }
                                                </button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td>{ event.eventDate }</td>
                                            <td>{ event.title }</td>
                                            <td className="event-actions">
                                                <button type="button" onClick={() => handleEdit(event)}>
                                                    { t('edit') }
                                                </button>
                                                <button type="button" className="btn-danger" onClick={() => handleDelete(event.id)}>
                                                    { t('delete') }
                                                </button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                }
            </div>
        </div>
    );
};

export default CockpitEvent;
