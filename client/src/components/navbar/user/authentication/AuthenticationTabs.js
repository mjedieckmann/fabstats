/**
 * The content of the user dialog if no one is logged in.
 * Contains tabs that display the login and registration forms, respectively.
 */

import {useState} from "react";
import {Box, Tab} from '@mui/material';
import {TabContext, TabList, TabPanel} from '@mui/lab';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
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
                    <TabList onChange={(event, newValue) => handleTabChange(event, newValue)} aria-label="lab API tabs example" centered>
                        <Tab icon={<LoginIcon/>} label="Login" value="1" />
                        <Tab icon={<AppRegistrationIcon/>} label="Register" value="2" />
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <LoginDialog/>
                </TabPanel>
                <TabPanel value="2">
                    <RegisterDialog setTab={setTab}/>
                </TabPanel>
            </TabContext>
        </Box>
    );
}
