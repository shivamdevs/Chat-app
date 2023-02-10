import React, { useContext, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useParams } from 'react-router-dom';
import Context from '../functions/Context';

function ProfilePanel() {
    const params = useParams();
    const { user, usersListByUid, back } = useContext(Context);
    const [data, setData] = useState(null);

    const [profileError, setProfileError] = useState(null);

    return (
        <>
            <header className="header">
                <button type="button" className="button-round" onClick={() => back()}><i className="fas fa-arrow-left"></i></button>
                <div className="panel-header-name nooverflow">{data?.name || <Skeleton />}</div>
            </header>
            <main className="mainbody"></main>
            {profileError !== null && <div className="alignalert">
                <div className="alignbox panel-error">
                    <div className="panel-error-title">Invalid token</div>
                    <div className="panel-error-text">{profileError}</div>
                    <div className="panel-error-option"><button type="button" className="button button-inline button-filled" onClick={() => back()}>Back</button></div>
                </div>
            </div>}
        </>
    );
};

export default ProfilePanel;