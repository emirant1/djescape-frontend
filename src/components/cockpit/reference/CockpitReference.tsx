import './CockpitReference.css';
import { useState, useEffect, useCallback } from 'react';
import { ReferenceRequest, ReferenceResponse, OPERATION_STATUS } from '../../../interfaces/common-interfaces';
import { useAuth } from '../../../context/auth/AuthContext';
import { useTranslation } from 'react-i18next';

const COCKPIT_API_URL: string = import.meta.env.VITE_COCKPIT_API_URL ?? '';
const REFERENCE_RESOURCE: string = `${COCKPIT_API_URL}/api/cockpit/reference`;

const CockpitReference = () => {
    const { t } = useTranslation();
    const { token, logout } = useAuth();

    const [references, setReferences] = useState<ReferenceResponse[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editCategory, setEditCategory] = useState('');
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editUrl, setEditUrl] = useState('');
    const [newReferences, setNewReferences] = useState<ReferenceRequest[]>([{ category: '', title: '', description: '', url: '' }]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | undefined>();
    const [createStatus, setCreateStatus] = useState<OPERATION_STATUS>(OPERATION_STATUS.IDLE);
    const [updateStatus, setUpdateStatus] = useState<OPERATION_STATUS>(OPERATION_STATUS.IDLE);

    const authHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    const fetchReferences = useCallback(async (): Promise<void> => {
        setIsLoading(true);
        try {
            const response = await fetch(REFERENCE_RESOURCE, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.status === 401) { logout(); return; }
            if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
            setReferences(await response.json());
        } catch (e: unknown) {
            setErrorMessage(e instanceof Error ? e.message : t('errors.unknown'));
        } finally {
            setIsLoading(false);
        }
    }, [token, logout, t]);

    useEffect(() => { fetchReferences(); }, [fetchReferences]);

    const handleAddRow = () => {
        setNewReferences(prev => [...prev, { category: '', title: '', description: '', url: '' }]);
    };

    const handleRemoveRow = (index: number) => {
        setNewReferences(prev => prev.filter((_, i) => i !== index));
    };

    const handleNewReferenceChange = (index: number, field: keyof ReferenceRequest, value: string) => {
        setNewReferences(prev => prev.map((ref, i) => i === index ? { ...ref, [field]: value } : ref));
    };

    const handleCreate = async (): Promise<void> => {
        setErrorMessage(undefined);
        setCreateStatus(OPERATION_STATUS.INITIALIZED);
        try {
            const response = await fetch(REFERENCE_RESOURCE, {
                method: 'POST',
                headers: authHeaders,
                body: JSON.stringify(newReferences)
            });
            if (response.status === 401) { logout(); return; }
            if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
            setCreateStatus(OPERATION_STATUS.SUCCESS);
            setNewReferences([{ category: '', title: '', description: '', url: '' }]);
            await fetchReferences();
        } catch (e: unknown) {
            setCreateStatus(OPERATION_STATUS.FAILURE);
            setErrorMessage(e instanceof Error ? e.message : t('errors.unknown'));
        }
    };

    const handleEdit = (reference: ReferenceResponse): void => {
        setEditingId(reference.id);
        setEditCategory(reference.category);
        setEditTitle(reference.title);
        setEditDescription(reference.description);
        setEditUrl(reference.url);
        setUpdateStatus(OPERATION_STATUS.IDLE);
        setErrorMessage(undefined);
    };

    const handleCancelEdit = (): void => {
        setEditingId(null);
        setEditCategory('');
        setEditTitle('');
        setEditDescription('');
        setEditUrl('');
        setUpdateStatus(OPERATION_STATUS.IDLE);
    };

    const handleUpdate = async (id: number): Promise<void> => {
        setErrorMessage(undefined);
        setUpdateStatus(OPERATION_STATUS.INITIALIZED);
        const payload: ReferenceRequest = {
            category: editCategory,
            title: editTitle,
            description: editDescription,
            url: editUrl
        };
        try {
            const response = await fetch(`${REFERENCE_RESOURCE}/${id}`, {
                method: 'PUT',
                headers: authHeaders,
                body: JSON.stringify(payload)
            });
            if (response.status === 401) { logout(); return; }
            if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
            setUpdateStatus(OPERATION_STATUS.SUCCESS);
            setEditingId(null);
            await fetchReferences();
        } catch (e: unknown) {
            setUpdateStatus(OPERATION_STATUS.FAILURE);
            setErrorMessage(e instanceof Error ? e.message : t('errors.unknown'));
        }
    };

    const handleDelete = async (id: number): Promise<void> => {
        if (!window.confirm(t('cockpit.reference.confirmDelete'))) return;
        setErrorMessage(undefined);
        try {
            const response = await fetch(`${REFERENCE_RESOURCE}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.status === 401) { logout(); return; }
            if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
            await fetchReferences();
        } catch (e: unknown) {
            setErrorMessage(e instanceof Error ? e.message : t('errors.unknown'));
        }
    };

    return (
        <div className="body">
            <div className="reference-create-section">
                <table className="reference-table">
                    <thead>
                        <tr>
                            <th>{ t('cockpit.reference.category') }</th>
                            <th>{ t('cockpit.reference.referenceTitle') }</th>
                            <th>{ t('cockpit.reference.description') }</th>
                            <th>{ t('cockpit.reference.url') }</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        { newReferences.map((ref, index) => (
                            <tr key={index}>
                                <td>
                                    <input
                                        type="text"
                                        value={ref.category}
                                        onChange={e => handleNewReferenceChange(index, 'category', e.target.value)}
                                        maxLength={100}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        value={ref.title}
                                        onChange={e => handleNewReferenceChange(index, 'title', e.target.value)}
                                        maxLength={255}
                                    />
                                </td>
                                <td>
                                    <textarea
                                        value={ref.description}
                                        onChange={e => handleNewReferenceChange(index, 'description', e.target.value)}
                                        maxLength={1000}
                                        rows={2}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="url"
                                        value={ref.url}
                                        onChange={e => handleNewReferenceChange(index, 'url', e.target.value)}
                                        maxLength={500}
                                    />
                                </td>
                                <td>
                                    { newReferences.length > 1 &&
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
                        { t('cockpit.reference.addRow') }
                    </button>
                    <button type="button" onClick={handleCreate} disabled={createStatus === OPERATION_STATUS.INITIALIZED}>
                        { t('cockpit.reference.create') }
                    </button>
                </div>
                { createStatus === OPERATION_STATUS.SUCCESS && <p className="success">{ t('cockpit.reference.saved') }</p> }
                { errorMessage && <div className="error">{ errorMessage }</div> }
            </div>

            <div className="reference-list-section">
                { isLoading && <p>{ t('loading') }</p> }
                { !isLoading && references.length === 0 && <p>{ t('cockpit.reference.noReferences') }</p> }
                { references.length > 0 &&
                    <table className="reference-table">
                        <thead>
                            <tr>
                                <th>{ t('cockpit.reference.category') }</th>
                                <th>{ t('cockpit.reference.referenceTitle') }</th>
                                <th>{ t('cockpit.reference.description') }</th>
                                <th>{ t('cockpit.reference.url') }</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            { references.map(reference => (
                                <tr key={reference.id}>
                                    { editingId === reference.id ? (
                                        <>
                                            <td>
                                                <input
                                                    type="text"
                                                    value={editCategory}
                                                    onChange={e => setEditCategory(e.target.value)}
                                                    maxLength={100}
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
                                            <td>
                                                <textarea
                                                    value={editDescription}
                                                    onChange={e => setEditDescription(e.target.value)}
                                                    maxLength={1000}
                                                    rows={2}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="url"
                                                    value={editUrl}
                                                    onChange={e => setEditUrl(e.target.value)}
                                                    maxLength={500}
                                                />
                                            </td>
                                            <td className="reference-actions">
                                                <button
                                                    type="button"
                                                    onClick={() => handleUpdate(reference.id)}
                                                    disabled={updateStatus === OPERATION_STATUS.INITIALIZED}>
                                                    { t('cockpit.reference.update') }
                                                </button>
                                                <button type="button" className="btn-secondary" onClick={handleCancelEdit}>
                                                    { t('cancel') }
                                                </button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td>{ reference.category }</td>
                                            <td>{ reference.title }</td>
                                            <td>{ reference.description }</td>
                                            <td>
                                                { reference.url && (
                                                    <a href={reference.url} target="_blank" rel="noopener noreferrer">
                                                        { reference.url }
                                                    </a>
                                                )}
                                            </td>
                                            <td className="reference-actions">
                                                <button type="button" onClick={() => handleEdit(reference)}>
                                                    { t('edit') }
                                                </button>
                                                <button type="button" className="btn-danger" onClick={() => handleDelete(reference.id)}>
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

export default CockpitReference;
