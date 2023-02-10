import generateUniqueId from 'generate-unique-id';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useParams } from "react-router-dom";
import { sendMessage, setBufferMesage, snapMessageChannel, unsnapMessageChannel } from '../fb.chat';
import Context from '../functions/Context';
import CryptoJS from "crypto-js";
import "./../styles/chat.css";
import sortBy from 'sort-by';
import groupBy from 'group-by';
import classNames from 'classnames';
import Skeleton from 'react-loading-skeleton';
import { getDisplayDate } from '../app.functions';
import Profile from '../components/Profile';
import LoadSVG from '../components/LoadSVG';

function ChatPanel() {
    const { user, currentConnection, messages, updateMessages, friend } = useContext(Context);
    const [messageList, setMessageList] = useState(null);

    useEffect(() => {
        currentConnection && snapMessageChannel(currentConnection, (snap) => {
            if (!snap) return updateMessages(null);
            updateMessages(snap);
        }, (error) => {
            toast.error("Error getting your messages.");
        });
        return () => {
            updateMessages(null);
            unsnapMessageChannel();
        }
    }, [currentConnection, updateMessages]);

    useEffect(() => {
        if (messages?.length) {
            const msg = [...messages];
            msg.sort(sortBy("sortby", "groupby"));
            setMessageList(groupBy(msg, "groupby"));
        } else {
            setMessageList(null);
        }
    }, [messages]);

    const textbox = useRef();
    const [message, setMessage] = useState("");
    const params = useParams();

    const sendData = () => {
        const postmessage = message.trim().replace(/(\n\s*?\n)\s*\n/, '$1');
        setMessage("");
        textbox.current && (textbox.current.value = "");
        textbox.current && textbox.current.focus();

        sendMessage(postmessage, currentConnection, user, friend, (snap) => {
            const slip = { ...snap };
            slip.pending = true;
            slip.id = generateUniqueId({ length: 32 });
            updateMessages(old => [...old, slip]);
        }, (error) => {
            toast.error("Failed to send message.");
        });
    };

    useEffect(() => {
        setBufferMesage(params.uid, message);
        if (textbox.current) {
            textbox.current.style.height = 0;
            textbox.current.style.height = (textbox.current.scrollHeight) + "px";
        }
    }, [message, params.uid]);

    return (
        <>
            <div className="chat-area">
                <div className="chat-flex">
                    {messageList === null && <>
                        <ChatDate reverse={true} />
                        <ChatDate />
                    </>}
                    {messageList && Object.keys(messageList).map(data => <ChatDate key={data} timestamp={data} data={messageList[data]} />)}
                </div>
            </div>
            <footer className="chat-box">
                <div className="chat-footer">
                    <button className="chat-attach button-round"><i className="fas fa-paperclip"></i></button>
                    <textarea
                        ref={textbox}
                        className="chat-textbox"
                        autoFocus={true}
                        value={message}
                        placeholder="Enter your message..."
                        // onBlur={({ target }) => target.focus()}
                        onChange={({ target }) => setMessage(target.value)}
                    ></textarea>
                    <button className="chat-send button-round" onClick={sendData} disabled={message.trim().length === 0 || message.length > 250}><i className="fas fa-paper-plane"></i></button>

                </div>
                {message.length > 250 && <div className="chat-error">Message is too long. Please cut it short.</div>}
            </footer>
        </>
    );
};

export default ChatPanel;

function ChatDate({ data = null, timestamp = null, reverse = null }) {
    return (
        <div className="chat-date">
            <div className="chat-date-block">
                {timestamp ? <div className="chat-date-item">{getDisplayDate(+timestamp, true)}</div> : <span className="chat-date-skeleton"><Skeleton /></span>}
            </div>
            <ChatBucket data={data} reverse={reverse} />
        </div>
    );
}

function ChatBucket({ data = null, reverse = null }) {
    const { user, friend } = useContext(Context);
    const [chats, setChats] = useState(null);

    useEffect(() => {

        if (data?.length) {
            const dataArray = [];
            for (let i = 0; i < data.length; ++i) {
                const dataItem = {
                    key: data[i].id,
                    from: data[i].sender,
                    data: [data[i]],
                    pendings: data[i].pending ? 1 : 0,
                };
                while (i < data.length - 1 && data[i].sender === data[i + 1].sender) {
                    ++i;
                    dataItem.data.push(data[i]);
                    if (data[i].pending) dataItem.pendings += 1;
                }
                dataArray.push(dataItem);
            }
            setChats(dataArray);
        } else {
            setChats(null);
        }
    }, [data]);
    return (
        <>
            {chats?.length > 0 && chats.map(obj => <div key={obj.key} className={classNames(
                "chat-bucket",
                (obj && (obj.from === user.uid ? "chat-bucket-reverse" : "")),
            )}>
                <div className="chat-bucket-image">
                    {obj.pendings > 0 && <span className="chat-bucket-pending"><LoadSVG size={36} stroke={10} /></span>}
                    <Profile image={(obj.from === user.uid ? user.photoURL : friend.profile)} size={30} />
                </div>
                <div className="chat-bucket-block">
                    {obj?.data?.length > 0 && obj.data.map(chat => <ChatBox key={chat.id} data={chat} />)}
                </div>
            </div>)}
            {chats === null && <>
                <div className={classNames(
                    "chat-bucket",
                    { "chat-bucket-reverse": !reverse }
                )}>
                    <div className="chat-bucket-image">
                        <Profile size={30} />
                    </div>
                    <div className="chat-bucket-block">
                        <ChatBox left={!reverse} right={reverse} />
                        <ChatBox left={!reverse} right={reverse} />
                    </div>
                </div>
            </>}
        </>
    );
}

function ChatBox({ data = null, right = null, left = null }) {
    const { user } = useContext(Context);
    return (
        <div className={classNames(
            "chatbox",
            (data && (data.sender === user.uid ? "chatbox-current" : "chatbox-friend")),
            {
                "chatbox-current": left,
                "chatbox-friend": right,
            }
        )}>
            {data ? <div className="chatbox-area">
                <div className="chatbox-message">{CryptoJS.AES.decrypt(data.content, data.encrypt).toString(CryptoJS.enc.Utf8)}</div>
                <div className="chatbox-time">{data.sent}</div>
            </div> : <Skeleton containerClassName="chat-skeleton" style={{ height: "100%", lineHeight: "3" }} />}
        </div>
    );
}