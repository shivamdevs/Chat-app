import classNames from 'classnames';
import React, { useState } from 'react';
import Skeleton from 'react-loading-skeleton';

function Profile({ image = null, size = 40 }) {
    const [proxy, setProxy] = useState(null);
    const [loaded, setLoaded] = useState(false);
    return (
        <>
            {!loaded && <Skeleton circle containerClassName="avatar-image-skeleton" height="100%" width="100%" />}
            <img src={proxy || image} onLoad={() => setLoaded(true)} onError={() => setProxy("https://assets.myoasis.tech/accounts/user-no-image.svg")} alt="" className={classNames("avatar-image", `avatar-image-${size}`, { "avatar-image-loaded": loaded })} />
        </>
    );
};

export default Profile;