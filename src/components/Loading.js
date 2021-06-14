import React from 'react'
import ReactLoading from 'react-loading';

function Loading() {
    return (
        <div className="loading-screen">
            <ReactLoading className="loading-circle" type={"spin"} color={"#1DB954"} ></ReactLoading>
        </div>
    )
}

export default Loading
