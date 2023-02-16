// @flow
import React, { useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// images
import LogoLight from '../../assets/images/logo.png';
import LogoDark from '../../assets/images/logo/PE_logo.png';
import logoWhite from '../../assets/images/logo/logo-white.png';
import PieLogoImg from '../../assets/images/logo/pie_graph.png';


type AccountLayoutProps = {
    bottomLinks?: React$Element<any>,
    children?: any,
};

const AccountLayout = ({ bottomLinks, children }: AccountLayoutProps): React$Element<React$FragmentType> => {
    // useEffect(() => {
    //     if (document.body) document.body.classList.add('authentication-bg');

    //     return () => {
    //         if (document.body) document.body.classList.remove('authentication-bg');
    //     };
    // },
    //     []);

    const { t } = useTranslation();

    return (
        <>
            <div className="auth-fluid row">

                {/* Auth fluid right content */}
                <div className="auth-fluid-right text-center col-lg-6">
                    {/* logo */}

                    <div className="auth-brand text-center text-lg-start">
                        {/* <Link to="/" className="logo-dark">
                                <span>
                                  
                                </span>
                            </Link> */}
                        {/* <Link to="/" className="logo-light">
                                <span>
                                    <img src={logoWhite} alt="" height="40" />
                                </span>
                            </Link> */}
                    </div>
                    <div className='text-center signupright'>
                        <div>
                            <img src={LogoDark} alt="" height="40" />
                        </div>
                        <div>
                            <img src={PieLogoImg} width="500px" className='mt-4' />
                        </div>
                    </div>
                </div>


                {/* Auth fluid left content */}
                <div className="auth-fluid-form-box col-lg-6">
                    <div className="align-items-center d-flex ">
                        <Card.Body style={{ padding: "0" }}>
                            {children}

                            {/* footer links */}
                            {bottomLinks}
                        </Card.Body>
                    </div>
                </div>


            </div>
        </>
    );
};

export default AccountLayout;
