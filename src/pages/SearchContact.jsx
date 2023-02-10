import React, { useContext, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import reactStringReplace from 'react-string-replace';
import LoadSVG from '../components/LoadSVG';
import Profile from '../components/Profile';
import { createFriendBond } from '../fb.chat';
import Context from '../functions/Context';
import "./../styles/search.css";

function SearchContact() {
    const { back, app, user, usersList, usersListByUid, connections } = useContext(Context);

    const [search, setSearch] = useState("");
    const [result, setResult] = useState(null);

    const [connect, setConnect] = useState(null);

    const [recentSearches, updateRecentSearches] = useState(() => {
        let result = null;
        if (window.localStorage) {
            result = window.localStorage.getItem(`${app.bucket}searches`);
            if (result !== null) {
                try {
                    result = JSON.parse(result);
                } catch (e) {
                    result = [];
                }
            } else {
                result = [];
            }
        }
        return result;
    });

    const [shuffleResult, setShuffleResult] = useState(null);

    useEffect(() => {
        if (usersList && user) {
            if (!search) {
                setResult(null);
            } else {
                setResult(usersList.filter(snap => (snap.name.toLowerCase().includes(search.trim().toLowerCase()) || snap.uid === search) && snap.uid !== user.uid));
            }
        }
    }, [user, search, usersList]);

    useEffect(() => {
        if (usersList && !shuffleResult) {
            const array = [...usersList];
            let currentIndex = array.length, randomIndex;
            while (currentIndex !== 0) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex--;
                [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
            }
            setShuffleResult(array.slice(0, 10));
        }
    }, [shuffleResult, usersList]);

    useEffect(() => {
        if (connect) {
            updateRecentSearches(old => {
                const data = [...old];
                if (data.indexOf(connect) > -1) data.splice(data.indexOf(connect), 1);
                data.unshift(connect);
                return (usersListByUid ? data.filter(item => !!usersListByUid[item]) : data).slice(0, 10);
            });
        }
    }, [connect, connections, usersListByUid]);


    useEffect(() => {
        if (window.localStorage) {
            window.localStorage.setItem(`${app.bucket}searches`, JSON.stringify(recentSearches));
        }
    }, [app.bucket, recentSearches]);
    return (
        <>
            <header className="header search-header">
                <div className="search-header-top">
                    <button type="button" className="button-round" onClick={() => back()}><i className="fas fa-arrow-left"></i></button>
                    <div className="nooverflow">Search contacts</div>
                </div>
                <div className="search-header-bottom">
                    <button type="button" className="search-header-button search-header-label"><i className="fas fa-search"></i></button>
                    <input type="search" name="search" autoFocus id="search" autoComplete="off" value={search} onChange={({ target }) => (target.value !== " ") && setSearch(target.value)} placeholder="Search..." className="search-header-input" />
                    {search.length > 0 && <button type="button" className="search-header-button search-header-clear" onClick={() => setSearch("")}><i className="fas fa-times"></i></button>}
                </div>
            </header>
            <main className="mainbody">
                {result !== null && <div className="search-block">
                    <div className="search-block-header nooverflow"><span>Searches ({result.length})</span></div>
                    {result?.length > 0 && result.map(item => <ContactItem key={item.uid} filter={search} connect={setConnect} data={item.uid} />)}
                    {result?.length === 0 && <div className="nullspace">No contact matched your search.</div>}
                </div>}
                {recentSearches?.length > 0 && <div className="search-block">
                    <div className="search-block-header nooverflow"><span>Recents</span><span onClick={() => updateRecentSearches([])}>Clear All</span></div>
                    {recentSearches.map(item => <ContactItem key={item} filter={search} connect={setConnect} data={item} />)}
                </div>}
                <div className="search-block">
                    <div className="search-block-header nooverflow"><span>Suggestions</span><span onClick={() => setShuffleResult(null)}>Refresh</span></div>
                    {!shuffleResult && <>
                        <ContactItem />
                        <ContactItem />
                    </>}
                    {shuffleResult?.length > 0 && shuffleResult.map(item => <ContactItem key={item.uid} connect={setConnect} data={item.uid} />)}
                </div>
            </main>
            {connect && <div className="alignalert">
                <div className="alignbox">
                    <div className="search-loading"><LoadSVG />Loading...</div>
                </div>
            </div>}
        </>
    );
};

export default SearchContact;


function ContactItem({ data = null, filter = null, connect = null }) {
    const { user: me, usersListByUid, connections, goto } = useContext(Context);

    const [user, setUser] = useState(null);

    useEffect(() => {
        usersListByUid && setUser(usersListByUid[data]);
    }, [data, usersListByUid]);

    async function getConnection() {
        if (!connections) return;
        let bond = connections[data];
        if (!bond) {
            const snap = await createFriendBond(me, user);
            if (snap.id) bond = snap.id;
        } else {
            await new Promise(resolve => setTimeout(() => resolve(), 1));
        }
        if (bond) goto(`/${bond}`, true);
    }
    return (
        <div className="search-item" onClick={() => {
            connect && connect(data || null);
            getConnection();
        }}>
            <div className="search-item-image">
                <div className="search-item-image">
                    <Profile image={user?.profile} size={35} />
                </div>
            </div>
            <div className="search-item-name nooverflow">{(user && (filter ? reactStringReplace(user.name, filter, (match, i) => <span className="search-item-bold" key={i}>{match}</span>) : user.name)) || <Skeleton />}</div>
        </div>
    );
}