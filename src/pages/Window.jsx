import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MessageHistory from './MessageHistory';
import MessagePanel from './MessagePanel';
import Preview from './Preview';
import ProfilePanel from './ProfilePanel';
import SearchContact from './SearchContact';

function Window() {
    return (
        <>
            <div className="section window-main">
                <MessageHistory />
            </div>
            <Routes>
                <Route path="/preview/*" element={<Preview />} />
                <Route path="/search/*" element={
                    <div className="section window-main">
                        <SearchContact />
                    </div>
                } />
                <Route path="/profile/*" element={
                    <div className="section window-main">
                        <ProfilePanel />
                    </div>
                } />
                <Route path="/:connectid/*" element={
                    <div className="section window-main">
                        <MessagePanel />
                    </div>
                } />
            </Routes>
        </>
    );
};

export default Window;