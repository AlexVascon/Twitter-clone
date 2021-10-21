import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import HomeIcon from '@mui/icons-material/Home';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

export default function BottomNav() {
  const [value, setValue] = React.useState('recents');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <BottomNavigation sx={{ width: 500 }} value={value} onChange={handleChange}>
      <BottomNavigationAction
        label="Recents"
        value="recents"
        icon={<HomeIcon />}
      />
      <BottomNavigationAction
        label="Favorites"
        value="favorites"
        icon={<FavoriteIcon />}
      />
      <BottomNavigationAction
        label="Nearby"
        value="nearby"
        icon={<NotificationsNoneIcon />}
      />
      <BottomNavigationAction label="Folder" value="folder" icon={<MailOutlineIcon/>} />
    </BottomNavigation>
  );
}