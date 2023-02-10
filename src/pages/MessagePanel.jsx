import { ContextMenuTrigger, ContextMenu, ContextMenuItem } from 'myoasis-contextmenu';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import Profile from '../components/Profile';
import Context from '../functions/Context';
import "./../styles/panel.css";
import classNames from 'classnames';
import ChatPanel from './ChatPanel';

function MessagePanel() {
    const { back, goto, connections, usersListByUid, friend, setFriend, updateCurrentConnection } = useContext(Context);
    const params = useParams();

    const [connectError, setConnectError] = useState(null);

    useEffect(() => {
        if (params?.connectid && connections && usersListByUid) {
            const store = connections[params.connectid];
            if (store) {
                const temp = usersListByUid[store];
                if (temp) {
                    setFriend(temp);
                    updateCurrentConnection(params.connectid);
                    setConnectError(null);
                } else {
                    setConnectError("The user connected to this chat does not exists. Either it was deleted or didn't existed in the first place.");
                }
            } else {
                setConnectError("This chat does not exists. This can be due to invalid connection parameter. Refresh this page or go back and try again.");
            }
        }
        return () => {
            setFriend(null);
            updateCurrentConnection(null);
        }
    }, [connections, params.connectid, setFriend, updateCurrentConnection, usersListByUid]);

    return (
        <>
            <header className="header">
                <button type="button" className="button-round" onClick={() => back()}><i className="fas fa-arrow-left"></i></button>
                <div className={classNames("panel-header", { "panel-header-active" : friend})} onClick={() => friend && goto(`${params.connectid}/profile/${friend.uid}`)}>
                    <div className="panel-header-image">
                        <Profile image={friend?.profile} size={35} />
                    </div>
                    <div className="panel-header-name nooverflow">{friend?.name || <Skeleton />}</div>
                </div>
                {friend ? <>
                    <ContextMenuTrigger menu="chat-connection" exact={false} trigger="click" type="button" className="button-round"><i className="fas fa-ellipsis-vertical"></i></ContextMenuTrigger>
                    <ContextMenu className="contextmenu" menu="chat-connection">
                        <ContextMenuItem className="contextmenuitem"><i className="fas fa-square-check"></i>Select</ContextMenuItem>
                        <ContextMenuItem className="contextmenuitem"><i className="fas fa-cog"></i>Settings</ContextMenuItem>
                        <ContextMenuItem className="contextmenuitem"><i className="fas fa-power-off"></i>Logout</ContextMenuItem>
                    </ContextMenu>
                </> : <span className="panel-header-skeleton"><Profile size={40} /></span>}
            </header>
            <main className="mainbody panel-chats">
                <ChatPanel />
            </main>
            {connectError !== null && <div className="alignalert">
                <div className="alignbox panel-error">
                    <div className="panel-error-title">Invalid token</div>
                    <div className="panel-error-text">{connectError}</div>
                    <div className="panel-error-option"><button type="button" className="button button-inline button-filled" onClick={() => back()}>Back</button></div>
                </div>
            </div>}
        </>
    );
};

export default MessagePanel;