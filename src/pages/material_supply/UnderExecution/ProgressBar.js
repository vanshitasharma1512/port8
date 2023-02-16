import React, { useState } from 'react';
import { useEffect } from 'react';
import { progressBarStatus } from '../Constants';
import './progress.scss';

function ProgressBar({ data }) {
    const [currentstep, setcurrentstep] = useState(data.current_status);
    const [doneupto, setdoneupto] = useState();
    const STEPS = progressBarStatus;
    useEffect(() => {
        let index = STEPS.findIndex((x) => x.key === currentstep);
        setdoneupto(index);
    }, []);

    return (
        <div className="progressBarWrap">
            <div id="steps">
                {STEPS.map((item, index) => {
                    return (
                        <div
                            key={index}
                            className={`step ${
                                currentstep == item.key ? `active` : `${doneupto < index ? `` : `done`}`
                            }`}
                            data-desc={item.name}>
                            {index + 1}
                        </div>
                    );
                })}

                {/* <div className="step done" data-desc="PO Accepted">
                    2
                </div>
                <div className="step active" data-desc="Delivery Started">
                    3
                </div>
                <div className="step " data-desc="Delivery Completed">
                    3
                </div>
                <div className="step" data-desc="Invoice Created">
                    4
                </div>
                <div className="step" data-desc="Payment Received">
                    4
                </div>
                <div className="step" data-desc="Completed">
                    4
                </div> */}
            </div>
        </div>
    );
}

export default ProgressBar;
