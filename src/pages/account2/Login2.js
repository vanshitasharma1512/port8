// @flow
import React, { useEffect } from 'react';
import { Button, Alert, Row } from 'react-bootstrap';
import { Link, Navigate, useLocation } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from '../../components/Spinner';
import "../../assets/css/vinayak.css"

// actions
import { resetAuth, loginUser } from '../../redux/actions';

// components
import { VerticalForm, FormInput } from '../../components/';

import AccountLayout from './AccountLayout';

/* bottom link */
const BottomLink = () => {
    const { t } = useTranslation();

    return (
        <footer className="footer footer-alt">
            <p className="text-muted">
                {t("Don't have an account?")}{' '}
                <Link to={'/account/register'} className="text-muted ms-1">
                    <b>{t('Sign Up')}</b>
                </Link>
            </p>
        </footer>
    );
};

const Login2 = (): React$Element<React$FragmentType> => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const location = useLocation();
    const redirectUrl = location.state && location.state.from ? location.state.from.pathname : '/';

    useEffect(() => {
        dispatch(resetAuth());
    }, [dispatch]);

    const { loading, userLoggedIn, user, error } = useSelector((state) => ({
        loading: state.Auth.loading,
        user: state.Auth.user,
        error: state.Auth.error,
        userLoggedIn: state.Auth.userLoggedIn,
    }));

    /*
    form validation schema
    */
    const schemaResolver = yupResolver(
        yup.object().shape({
            email: yup.string().required(t('Please enter email')),
            password: yup.string().required(t('Please enter Password')),
        })
    );

    /*
    handle form submission
    */
    const onSubmit = (formData) => {
        dispatch(loginUser(formData['email'], formData['password']));
    };


    return (
        <>
            {(userLoggedIn || user) && <Navigate to={redirectUrl} />}

            <AccountLayout bottomLinks={<BottomLink />}>



                <div className='mw-500'>
                    <div>
                        <h4 className="text-dark-50 mt-0 fw-bold">{t('Sign In')}</h4>
                        <p className="text-muted mb-4">
                            {t('Enter your email address and password to access admin panel.')}
                        </p>
                    </div>
                    {error && (
                        <Alert variant="danger" className="my-2">
                            {error}
                        </Alert>
                    )}
                    <VerticalForm
                        onSubmit={onSubmit}
                        resolver={schemaResolver}
                        defaultValues={{ email: '', password: '' }}>
                        <FormInput
                            label={t('Email')}
                            type="text"
                            name="email"
                            placeholder={t('Enter your email')}
                            containerClass={'mb-3 col-md-12'}
                        />
                        <FormInput
                            label={t('Password')}
                            type="password"
                            name="password"
                            placeholder={t('Enter your password')}
                            containerClass={'mb-3 col-md-12'}
                        >
                        </FormInput>


                        {loading ?
                            <div className='d-grid'>
                                <Button className='btn btn-danger text-center' disabled>
                                    <Spinner className="spinner-border-sm me-1" tag="span" color="white" />
                                    Loading...
                                </Button>
                            </div>
                            :
                            <div className='d-grid'>
                                <Button variant="danger" className='text-center' type="submit" disabled={loading}>
                                    {t('Log In')}
                                </Button>
                            </div>
                        }
                        <p className="text-center fw-bold mt-2"> <Link to="/account/forget-password">
                            <small>{t('Forgot your password?')}</small>
                        </Link>
                        </p>


                    </VerticalForm>
                </div>
            </AccountLayout>
        </>
    );
};

export default Login2;
