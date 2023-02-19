import classNames from 'classnames';
import React from 'react';
import PrismaZoom from 'react-prismazoom';
import "./../styles/preview.css";

function Preview({image = null }) {

    return (
        <PrismaZoom className="preview-zoomer">
            <img
                className={classNames("preview-image", "preview-target", "preview-waiting")}
                src={image}
                alt=""
                onLoad={({ target }) => { target.classList.remove("preview-waiting"); target.classList.remove("preview-broken"); }}
                onError={({ target }) => { target.classList.remove("preview-waiting"); target.classList.add("preview-broken"); }}
            />
        </PrismaZoom>
    );
};

export default Preview;