import Playlists from './dashboard-components/Playlists';
import Stats from './dashboard-components/Stats';
import Footer from './Footer';

function DashboardSettings({ playlistData }) {
    return (
        <div className="dashboard-info">
              <h1 className="dashboard-titles">Your Playlists</h1>
              <Playlists playlistData={playlistData && playlistData}/>
              <h1 className="dashboard-titles">Your Stats</h1>
              <Stats />
              <Footer></Footer>
        </div>
    )
}

export default DashboardSettings
