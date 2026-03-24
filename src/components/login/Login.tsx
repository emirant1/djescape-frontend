import './Login.css';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { LoginRequest } from '../../interfaces/common-interfaces';
import { useAuth } from '../../context/auth/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Login = () => {
    const { t } = useTranslation();
    const { login } = useAuth();
    const navigate = useNavigate();
    const { state } = useLocation();
    const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>();
    const [errorMessage, setErrorMessage] = useState<string | undefined>();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit: SubmitHandler<LoginRequest> = async (data) => {
        setErrorMessage(undefined);
        setIsSubmitting(true);
        try {
            await login(data);
            navigate(state?.from ?? '/api/cockpit/about');
        } catch (e: unknown) {
            setErrorMessage(e instanceof Error ? e.message : t('errors.unknown'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="body">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label htmlFor="email">{ t('email') }</label>
                    <input
                        id="email"
                        type="email"
                        {...register('email', {
                            required: t('errors.required.email'),
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: t('errors.invalid.email')
                            }
                        })}
                        disabled={isSubmitting}
                    />
                    { errors.email && <span className="error">{ errors.email.message }</span> }
                </div>

                <div className="form-group">
                    <label htmlFor="password">{ t('password') }</label>
                    <input
                        id="password"
                        type="password"
                        {...register('password', { required: t('errors.required.password') })}
                        disabled={isSubmitting}
                    />
                    { errors.password && <span className="error">{ errors.password.message }</span> }
                </div>

                { errorMessage && <div className="error">{ errorMessage }</div> }

                <button type="submit" disabled={isSubmitting}>{ t('login') }</button>
            </form>
        </div>
    );
};

export default Login;
