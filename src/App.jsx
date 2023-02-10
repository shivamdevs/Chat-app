import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from './fb.user';
import { useAuthState } from "react-firebase-hooks/auth";
import './App.css';
import Accounts from "myoasis-accounts";
import Index from "./pages/Index";
import Context from "./functions/Context";
import snapShot, { unsnapShot } from "./fb.chat";
import app from "./app.data";

function App() {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, loading, error] = useAuthState(auth);

    useEffect(() => {
        if (error) console.error(error);
    }, [error]);

    const [friend, setFriend] = useState(null);
    const [messages, updateMessages] = useState(null);
    const [usersList, updateUsersList] = useState(null);
    const [connections, updateConnections] = useState(null);
    const [connectedUsers, updateConnectedUsers] = useState(null);
    const [messageHistory, updateMessageHistory] = useState(null);
    const [usersListByUid, updateUsersListByUid] = useState(null);
    const [currentConnection, updateCurrentConnection] = useState(null);

    useEffect(() => {
        if (user) {
            snapShot(user, ({ connections, messageHistory, connectedUsers, usersList, usersListByUid }) => {
                updateUsersList(usersList);
                updateConnections(connections);
                updateConnectedUsers(connectedUsers);
                updateMessageHistory(messageHistory);
                updateUsersListByUid(usersListByUid);
            }, (error) => {
                console.log(error);
            });
        } else {
            unsnapShot();
        }
    }, [user]);

    const context = {
        messages,
        usersList,
        connections,
        connectedUsers,
        messageHistory,
        usersListByUid,
        currentConnection,

        updateMessages,
        updateCurrentConnection,

        app,
        friend,
        setFriend,

        user,
        userError: error,
        userLoading: loading,

        goto(to, replace = false) {
            const url = new URL(to, window?.location.origin);
            if (url.pathname === location.pathname) return;
            navigate(to, { replace: replace });
        },
        back() {
            if (location.key !== "default" && location.pathname !== "/") {
                navigate(-1);
            } else {
                navigate("/", { replace: true });
            }
        },
    };

    return (
        <Context.Provider value={context}>
            <Routes>
                <Route path="/accounts/*" element={<Accounts onUserChange={context.back} />} />
                <Route path="/*" element={<Index />} />
            </Routes>
        </Context.Provider>
    );
};

export default App;