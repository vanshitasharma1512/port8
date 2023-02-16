import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { TAB_ITEMS } from '../../constants/material';

function TabHeader({ handleNavigate, Index }) {
    return (
        <>
            <Row>
                <Col xl={12} lg={12}>
                    <ul className="nav nav-tabs">
                        {TAB_ITEMS.map((x, index) => (
                            <li key={index} className="nav-item" onClick={() => handleNavigate(x, index)}>
                                <a
                                    style={{ cursor: 'pointer' }}
                                    className={Index === index ? 'active-tab nav-link ' : 'nav-link'}
                                    aria-current="page">
                                    {x.text}
                                </a>
                            </li>
                        ))}
                    </ul>
                </Col>
            </Row>
        </>
    );
}

export default TabHeader;
