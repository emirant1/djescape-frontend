import './CockpitAbout.css';
import { useState, useEffect, useCallback } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AboutRequest, AboutResponse, OPERATION_STATUS } from '../../../interfaces/common-interfaces';
import { useAuth } from '../../../context/auth/AuthContext';
import { useTranslation } from 'react-i18next';

const COCKPIT_API_URL: string = import.meta.env.VITE_COCKPIT_API_URL ?? '';
const ABOUT_RESOURCE: string = `${COCKPIT_API_URL}/cockpit/about`;

const CockpitAbout = () => {
    const { t } = useTranslation();
    const { token, logout } = useAuth();

    const [abouts, setAbouts] = useState<AboutResponse[]>([]);
    const [editingAbout, setEditingAbout] = useState<AboutResponse | null>(null);
    const [operationStatus, setOperationStatus] = useState<OPERATION_STATUS>(OPERATION_STATUS.IDLE);
    const [errorMessage, setErrorMessage] = useState<string | undefined>();
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<AboutRequest>();

    const authHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    const fetchAbouts = useCallback(async (): Promise<void> => {
        setIsLoading(true);
        try {
            const response = await fetch(`${ABOUT_RESOURCE}/list`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.status === 401) { logout(); return; }
            if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
            setAbouts(await response.json());
        } catch (e: unknown) {
            setErrorMessage(e instanceof Error ? e.message : t('errors.unknown'));
        } finally {
            setIsLoading(false);
        }
    }, [token, logout, t]);

    useEffect(() => { fetchAbouts(); }, [fetchAbouts]);

    const onSubmit: SubmitHandler<AboutRequest> = async (data) => {
        setErrorMessage(undefined);
        setOperationStatus(OPERATION_STATUS.INITIALIZED);
        try {
            const isUpdate = !!editingAbout;
            const response = await fetch(
                isUpdate ? `${ABOUT_RESOURCE}/${editingAbout!.id}` : ABOUT_RESOURCE,
                {
                    method: isUpdate ? 'PUT' : 'POST',
                    headers: authHeaders,
                    body: JSON.stringify(data)
                }
            );
            if (response.status === 401) { logout(); return; }
            if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
            setOperationStatus(OPERATION_STATUS.SUCCESS);
            setEditingAbout(null);
            reset();
            await fetchAbouts();
        } catch (e: unknown) {
            setOperationStatus(OPERATION_STATUS.FAILURE);
            setErrorMessage(e instanceof Error ? e.message : t('errors.unknown'));
        }
    };

    const handleEdit = (about: AboutResponse): void => {
        setEditingAbout(about);
        setValue('text', about.text);
        setOperationStatus(OPERATION_STATUS.IDLE);
        setErrorMessage(undefined);
    };

    const handleCancelEdit = (): void => {
        setEditingAbout(null);
        reset();
        setOperationStatus(OPERATION_STATUS.IDLE);
        setErrorMessage(undefined);
    };

    const handleDelete = async (id: number): Promise<void> => {
        if (!window.confirm(t('cockpit.about.confirmDelete'))) return;
        setErrorMessage(undefined);
        try {
            const response = await fetch(`${ABOUT_RESOURCE}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.status === 401) { logout(); return; }
            if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
            await fetchAbouts();
        } catch (e: unknown) {
            setErrorMessage(e instanceof Error ? e.message : t('errors.unknown'));
        }
    };

    return (
        <div className="body">
            {/*<div className="cockpit-header">*/}
            {/*    <h2>{ t('cockpit.about.title') }</h2>*/}
            {/*    <button type="button" className="btn-secondary" onClick={logout}>{ t('logout') }</button>*/}
            {/*</div>*/}

            <form onSubmit={handleSubmit(onSubmit)} className="about-form">
                <div className="form-group">
                    <label>{ t('cockpit.about.text') }</label>
                    <textarea
                        {...register('text', {
                            required: t('errors.required.text'),
                            maxLength: { value: 3000, message: t('errors.maxLength.text') }
                        })}
                        rows={8}
                    />
                    { errors.text && <span className="error">{ errors.text.message }</span> }
                </div>

                { operationStatus === OPERATION_STATUS.SUCCESS && !editingAbout &&
                    <p className="success">{ t('cockpit.about.saved') }</p>
                }
                { errorMessage && <div className="error">{ errorMessage }</div> }

                <div className="form-actions">
                    <button type="submit">
                        { editingAbout ? t('cockpit.about.update') : t('cockpit.about.create') }
                    </button>
                    { editingAbout &&
                        <button type="button" className="btn-secondary" onClick={handleCancelEdit}>
                            { t('cancel') }
                        </button>
                    }
                </div>
            </form>

            <div className="about-list">
                { isLoading && <p>{ t('loading') }</p> }
                { abouts.map(about => (
                    <div key={about.id} className={`about-item${about.deletedAt ? ' deleted' : ''}`}>
                        <p className="about-text">{ about.text }</p>
                        <p className="about-meta">
                            { about.deletedAt
                                ? `[${t('cockpit.about.deleted')}]`
                                : `[${t('cockpit.about.active')}]`
                            }
                        </p>
                        { !about.deletedAt &&
                            <div className="about-actions">
                                <button type="button" onClick={() => handleEdit(about)}>
                                    { t('edit') }
                                </button>
                                <button type="button" className="btn-danger" onClick={() => handleDelete(about.id)}>
                                    { t('delete') }
                                </button>
                            </div>
                        }
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CockpitAbout;
