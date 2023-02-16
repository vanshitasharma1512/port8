// @flow
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { Button, Alert, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// actions
import { resetAuth, signupUser } from '../../redux/actions';

// components
import { VerticalForm, FormInput } from '../../components/';

import AccountLayout from './AccountLayout';

/* bottom link */
const BottomLink = () => {
    const { t } = useTranslation();


    return (
        <footer className="footer footer-alt">
            <p className="text-muted">
                {t('Already have account?')}{' '}
                <Link to={'/account/login'} className="text-muted ms-1">
                    <b>{t('Log In')}</b>
                </Link>
            </p>
        </footer>
    );
};

const Register2 = (): React$Element<React$FragmentType> => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, userSignUp, error } = useSelector((state) => ({
        loading: state.Auth.loading,
        error: state.Auth.error,
        userSignUp: state.Auth.userSignUp,
    }));

    useEffect(() => {
        dispatch(resetAuth());
    }, [dispatch]);

    /*
     * form validation schema
     */
    const schemaResolver = yupResolver(
        yup.object().shape({
            organizationname: yup.string().required(t('Please enter organization name')),
            fullname: yup.string().required(t('Please enter name')),
            email: yup.string().required(t('Please enter email address')),
            password: yup.string().required(t('Please enter password')),
            confirmpassword: yup.string().required(t('Please enter confirm password')),
        })
    );

    /*
     * handle form submission
     */
    const onFormSubmit = (e) => {
        navigate("/account/register-step-two")
    };

    return (
        <>

            <AccountLayout bottomLinks={<BottomLink />}>
                <h2 style={{ fontWeight: "bold" }} className="">{t('Sign Up')}</h2>
                <p  className="mb-3   ">
                    {t("Create An Account")}
                </p>


                <form onSubmit={onFormSubmit}>
                    <FormInput
                        label={t('Organization Name *')}
                        type="text"
                        name="organizationname"
                        placeholder={t('Enter organization name')}
                        containerClass={'mb-3'}
                    />
                    <Row>
                        <FormInput
                            label={t('Contact Person Name *')}
                            type="text"
                            name="fullname"
                            placeholder={t('Enter contact person name')}
                            containerClass={'mb-3 col'}
                        />
                        <FormInput
                            label={t('Email *')}
                            type="email"
                            name="email"
                            placeholder={t('Enter email')}
                            containerClass={'mb-3 col'}
                        />
                    </Row>

                    <Row>

                        <FormInput
                            label={t('Mobile Number')}
                            type="text"
                            name="text"
                            placeholder={t('Enter mobile number')}
                            containerClass={'mb-3 col'}
                        />
                        <FormInput
                            label={t('Country')}
                            type="text"
                            name="text"
                            placeholder={t('Enter country')}
                            containerClass={'mb-3 col'}
                        />
                    </Row>
                    <Row>

                        <FormInput
                            label={t('State')}
                            type="text"
                            name="text"
                            placeholder={t('Enter state')}
                            containerClass={'mb-3 col'}
                        />
                        <FormInput
                            label={t('City')}
                            type="text"
                            name="text"
                            placeholder={t('Enter city')}
                            containerClass={'mb-3 col'}
                        />
                    </Row>


                    <div className="mb-0 text-center">
                        <div className='d-flex' style={{ justifyContent: "space-between" }}>
                            <div className='col'></div>
                            <Button variant="danger" type="submit" disabled={loading}>
                                {t('Continue')}
                            </Button>
                        </div>
                    </div>

                    {/* social links */}
                    {/* <div className="text-center mt-4">
                        <p className="text-muted font-16">{t('Sign up using')}</p>
                        <ul className="social-list list-inline mt-3">
                            <li className="list-inline-item">
                                <Link to="#" className="social-list-item border-primary text-primary">
                                    <i className="mdi mdi-facebook"></i>
                                </Link>
                            </li>
                            <li className="list-inline-item">
                                <Link to="#" className="social-list-item border-danger text-danger">
                                    <i className="mdi mdi-google"></i>
                                </Link>
                            </li>
                            <li className="list-inline-item">
                                <Link to="#" className="social-list-item border-info text-info">
                                    <i className="mdi mdi-twitter"></i>
                                </Link>
                            </li>
                            <li className="list-inline-item">
                                <Link to="#" className="social-list-item border-secondary text-secondary">
                                    <i className="mdi mdi-github"></i>
                                </Link>
                            </li>
                        </ul>
                    </div> */}
                </form>
            </AccountLayout>
        </>
    );
};

export default Register2;
