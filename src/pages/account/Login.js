// @flow
import React, { useEffect, useState } from 'react';
import { Button, Alert, Row, Col } from 'react-bootstrap';
import { Link, Navigate, useLocation } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from '../../components/Spinner';
import "../../assets/css/vinayak.css"
import { useForm } from 'react-hook-form';
import { ValidateEmail } from '../../helpers/validation';
//actions
import { resetAuth, loginUser } from '../../redux/actions';
import { toast } from "react-toastify";
// components
import { VerticalForm, FormInput } from '../../components/';

import AccountLayout from './AccountLayout';

/* bottom link of account pages */
const BottomLink = () => {
    const { t } = useTranslation();

    return (
        <Row className="mt-3">
            <Col className="text-center">
                <p className="text-muted">
                    {t("Don't have an account?")}{' '}
                    <Link to={'/account/register'} className="text-muted ms-1">
                        <b>{t('Sign Up')}</b>
                    </Link>
                </p>
            </Col>
        </Row>
    );
};

const Login = (): React$Element<any> => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const location = useLocation();
    const redirectUrl = location.state && location.state.from ? location.state.from.pathname : '/';
    const [userDetails, setUserDetails] = useState(
        {
            user_email: "",
            user_password: ""
        }
    )

    const { user_email, user_password } = userDetails;

    const onInputChange = (e) => {
        setUserDetails({
            ...userDetails,
            [e.target.name]: e.target.value
        })
    }

    useEffect(() => {
        dispatch(resetAuth());
    }, [dispatch]);

    const { loading, userLoggedIn, user, error } = useSelector((state) => ({
        loading: state.Auth.loading,
        user: state.Auth.user,
        error: state.Auth.error,
        userLoggedIn: state.Auth.userLoggedIn,
    }));

    useEffect(() => {
        return toast.error(error);
    }, [error, user, loading, userLoggedIn])

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
    const onSubmit = (e) => {
        e.preventDefault();
        if (!user_email.trim()) {
            return toast.error("Please enter email");
        }
        else if (!ValidateEmail(user_email.trim())) {
            return toast.error("Please enter valid email");
        } else if (!user_password.trim()) {
            return toast.error("Please enter password");
        } else {
            dispatch(loginUser(user_email.trim(), user_password.trim()));
        }
    };

    return (
        <>
            {(userLoggedIn || user) && <Navigate to={redirectUrl} replace />}

            <AccountLayout bottomLinks={<BottomLink />}>
                <div className="text-center w-75 m-auto">
                    <h4 className="text-dark-50 text-center mt-0 fw-bold">{t('Sign In')}</h4>
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
                        containerClass={'mb-3'}
                    />
                    <FormInput
                        label={t('Password')}
                        type="password"
                        name="password"
                        placeholder={t('Enter your password')}
                        containerClass={'mb-3'}>
                        <Link to="/account/forget-password" className="text-muted float-end">
                            <small>{t('Forgot your password?')}</small>
                        </Link>
                    </FormInput>


                    <div className="mb-3 mb-0 text-center">

                        {loading ? <Button className='btn btn-danger text-center' disabled>
                            <Spinner className="spinner-border-sm me-1" tag="span" color="white" />
                            Loading...
                        </Button>
                            :
                            <Button variant="danger" type="submit" disabled={loading}>
                                {t('Log In')}
                            </Button>
                        }
                    </div>
                </VerticalForm>
            </AccountLayout>
        </>
    );
};

export default Login;
