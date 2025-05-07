import './Contact.css';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ContactRequest, OPERATION_STATUS } from "../../interfaces/common-interfaces";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

/* Constants */
const API_URL: string = import.meta.env.VITE_API_URL?? 'http://localhost:8081';
const CONTACT_RESOURCE: string = '/api/v1/contact';

const Contact = () => {
    const { t } = useTranslation();
    const { register, reset, handleSubmit, formState: { errors } } = useForm<ContactRequest>();

    /* Setup React Hooks */
    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [submissionStatus, setSubmissionStatus] = useState<OPERATION_STATUS>(OPERATION_STATUS.IDLE);

    /* Form Handling */
    const onSubmit: SubmitHandler<ContactRequest> = async (data) => {
        setErrorMessage(undefined);
        setIsSubmitting(true);
        setSubmissionStatus(OPERATION_STATUS.INITIALIZED);

        try {
            const response = await fetch(`${API_URL}${CONTACT_RESOURCE}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            setIsSubmitting(false);

            reset();

            if (!response.ok) {
                /* Set the operation status */
                setSubmissionStatus(OPERATION_STATUS.FAILURE);

                /* Attempt to read error details from backend response body */
                setErrorMessage(`Error: ${response.status} ${response.statusText}`);
            }
            else {
                setSubmissionStatus(OPERATION_STATUS.SUCCESS);
            }
        }
        catch (error) {
            setIsSubmitting(false);
            setSubmissionStatus(OPERATION_STATUS.FAILURE);
            setErrorMessage(t('errors.unknown'));
            reset();
        }
    };

    return (
        <div className="body">
            {
                (!isSubmitting && submissionStatus !== OPERATION_STATUS.SUCCESS) &&
                <form onSubmit={ handleSubmit(onSubmit) }>
                    <div className="form-group">
                        <label htmlFor="name">{ t('name') }</label>
                        <input {...register('name', { required: t('errors.required.name') })} disabled={ isSubmitting } />
                        { errors.name && <span className="error">{ errors.name.message }</span> }
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">{ t('email') }</label>
                        <input {...register('email', {
                            required: t('errors.required.email'),
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: t('errors.invalid.email')
                            }
                        })} disabled={ isSubmitting } />
                        { errors.email && <span className="error">{ errors.email.message }</span> }
                    </div>

                    <div className="form-group">
                        <label htmlFor="comments">{ t('comments') }</label>
                        <textarea {...register('comments', { required: true })} disabled={ isSubmitting }></textarea>
                        { errors.comments && <span className="error">{ t('errors.required.comments') }</span> }
                    </div>

                    <button type="submit">{ t('submit') }</button>
                </form>
            }
            {
                (!isSubmitting && submissionStatus === OPERATION_STATUS.FAILURE && errorMessage) &&
                <div className="error">{ errorMessage }</div>
            }
            {
                (!isSubmitting && submissionStatus === OPERATION_STATUS.SUCCESS) &&
                <>
                    <h2>{ t('form.sent') }</h2>
                    <h3>{ t('form.reply') }</h3>
                    <Link to="/">{ t('back') }</Link>
                </>
            }
        </div>
    );
};

export default Contact;