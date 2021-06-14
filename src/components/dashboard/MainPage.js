import Header from './Header'
import Body from './Body'

import React from 'react'

import {animated} from 'react-spring'

function MainPage({ style, userData, playlistData }) {
    return (
        <animated.div style={style} className="dashboard">
            <Header />
            <Body userData={userData} playlistData={playlistData} />
        </animated.div>
    )
}

export default MainPage
