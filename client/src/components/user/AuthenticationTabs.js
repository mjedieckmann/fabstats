import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import {useState} from "react";
import LoginDialog from "./LoginDialog";
import RegisterDialog from "./RegisterDialog";

export default function AuthenticationTabs() {
    const [tab, setTab] = useState('1');

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
    };

    return (
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={tab}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleTabChange} aria-label="lab API tabs example" centered>
                        <Tab icon={<FavoriteIcon/>} label="Item Two" value="1" />
                        <Tab icon={<PersonPinIcon/>} label="Item Three" value="2" />
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <LoginDialog/>
                </TabPanel>
                <TabPanel value="2">
                    <RegisterDialog/>
                </TabPanel>
            </TabContext>
        </Box>
    );
}
