import React, { useContext, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Route, Routes, useParams } from 'react-router-dom';
import Context from '../functions/Context';

function ProfilePanel() {
    
    const { back } = useContext(Context);
    const [data, setData] = useState(null);

    const [profileError, setProfileError] = useState(null);

    return (
        <>
            <header className="header">
                <button type="button" className="button-round" onClick={() => back()}><i className="fas fa-arrow-left"></i></button>
                <div className="panel-header-name nooverflow">{data?.name || <Skeleton />}</div>
            </header>
            <main className="mainbody">
                <Skeleton className="preview-skeleton-class" containerClassName="preview-skeleton" />
                <Routes>
                    <Route path='/:userid' element={<SetUser  err={setProfileError} set={setData} />} />
                    <Route path='/' element={<SetUser  err={setProfileError} set={setData} proxy={true} />} />
                </Routes>
            </main>
            {profileError !== null && <div className="alignalert">
                <div className="alignbox panel-error">
                    <div className="panel-error-title">Invalid profile token</div>
                    <div className="panel-error-text">{profileError}</div>
                    <div className="panel-error-option"><button type="button" className="button button-inline button-filled" onClick={() => back()}>Back</button></div>
                </div>
            </div>}
        </>
    );
};

export default ProfilePanel;


function SetUser({ set = null, err = null, proxy = null}) {
    const { user, usersListByUid } = useContext(Context);
    const params = useParams();
    useEffect(() => {
        if (usersListByUid) {
            if (params.userid) {
                const uid = usersListByUid[params.userid];
                if (uid) {
                    set(uid);
                } else {
                    err("This profile url is invalid. Either the user has been removed or never existed in the first place.");
                }
            } else if (proxy) {
                set(user);
            } else {
                err("There was some error getting user profile data. Try again later.");
            }
        }
    }, [err, params.userid, proxy, set, user, usersListByUid]);
    return (<></>);
}