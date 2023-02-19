import { ContextMenuTrigger, ContextMenu, ContextMenuItem } from 'myoasis-contextmenu';
import React, { useContext, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { logout } from '../fb.user';
import CryptoJS from "crypto-js";
import Context from '../functions/Context';
import "./../styles/history.css";
import { getDisplayDate } from '../app.functions';
import classNames from 'classnames';
import Profile from '../components/Profile';

function MessageHistory() {
    const { goto, app, messageHistory: history } = useContext(Context);
    return (
        <>
            <header className="header history-header">
                <img src="/logo192.png" alt="" className="history-icon" />
                <div className="history-header-flex">
                    <button type="button" className="button-round" onClick={() => goto("/search")}><i className="fas fa-search"></i></button>
                    <ContextMenuTrigger menu="profile" exact={false} trigger="click" type="button" className="button-round"><i className="fas fa-ellipsis-vertical"></i></ContextMenuTrigger>
                    <ContextMenu className="contextmenu" menu="profile">
                        <ContextMenuItem className="contextmenuitem"><i className="fas fa-square-check"></i>Select</ContextMenuItem>
                        <ContextMenuItem className="contextmenuitem" onClick={() => goto("/accounts/profile")}><i className="fas fa-user-edit"></i>Edit profile</ContextMenuItem>
                        <ContextMenuItem className="contextmenuitem" onClick={() => goto("/profile")}><i className="fas fa-user"></i>View profile</ContextMenuItem>
                        <ContextMenuItem className="contextmenuitem" onClick={logout}><i className="fas fa-power-off"></i>Logout</ContextMenuItem>
                    </ContextMenu>
                </div>
            </header>
            <main className="mainbody">
                {history?.length === 0 && <>
                    <div className="nullspace">Get started with <strong>{app.name}</strong> now!</div>
                    <div className="history-get-started"><button className="button button-inline button-filled" onClick={() => goto("/search")}>Search contacts</button></div>
                </>}
                {history?.length > 0 && history.map(item => <HistoryContainer key={item.id} data={item} />)}
                {!history && <>
                    <HistoryContainer />
                    <HistoryContainer />
                    <HistoryContainer />
                    <HistoryContainer />
                    <HistoryContainer />
                </>}
            </main>
        </>
    );
};

export default MessageHistory;


function HistoryContainer({data = null}) {
    const { usersListByUid, goto } = useContext(Context);
    const [user, setUser] = useState(null);

    useEffect(() => {
        usersListByUid && setUser(usersListByUid[data.uid]);
    }, [data, usersListByUid]);
    return (
        <div className={classNames(
            "history-chat",
            {"history-chat-active": data},
        )}>
            <div className="history-chat-detail" onClick={() => data && goto(`/${data.id}`)}>
                <div className="history-chat-dataline">
                    <div className="nooverflow history-chat-name">{user?.name || <Skeleton />}</div>
                    <div className="history-chat-time">{(data && getDisplayDate(data.recent)) || <Skeleton />}</div>
                </div>
                <div className="nooverflow history-chat-message">{(data && (`${data.sender ? "You: " : ""}${CryptoJS.AES.decrypt(data.content, data.encrypt).toString(CryptoJS.enc.Utf8)}`)) || <Skeleton />}</div>
            </div>
            <div className="history-chat-image" onClick={() => data && goto(`/profile/${data.uid}`)}>
                <Profile image={user?.profile} size={45} />
            </div>
        </div>
    );
}