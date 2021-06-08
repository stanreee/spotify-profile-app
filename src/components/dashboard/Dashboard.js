import Playlists from './dashboard-components/Playlists';
import Stats from './dashboard-components/Stats';
import Recommended from './dashboard-components/Recommended';

function DashboardSettings() {
    return (
        <div className="dashboard-info">
              <h1>Your Playlists</h1>
              <Playlists />
              <h1>Your Stats</h1>
              <Stats />
              <h1>Recommended</h1>
              <Recommended />
        </div>
    )
}

export default DashboardSettings
