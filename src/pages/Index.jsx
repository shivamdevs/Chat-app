import React, { useContext } from 'react';
import { SkeletonTheme } from 'react-loading-skeleton';
import { Route, Routes } from 'react-router-dom';
import Context from '../functions/Context';
import './../styles/index.css';
import 'react-loading-skeleton/dist/skeleton.css';
import Welcome from './Welcome';
import Window from './Window';

function Index() {
    const {userLoading: loading, user } = useContext(Context);
    return (
        <SkeletonTheme baseColor="#18232c" highlightColor="#202d38">
            {!loading && user && <Routes>
                <Route path="/*" element={<Window />} />
            </Routes>}
            {!loading && !user && <Welcome />}
            {loading && <div className="loading-screen">
                <img src="/logo192.png" onLoad={({target}) => target.classList.add("loading-image")} alt="" />
                <span>Loading...</span>
            </div>}
        </SkeletonTheme>
    );
};

export default Index;