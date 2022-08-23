/**
 * Entry point for the frontend React application.
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import PropTypes from "prop-types";
import { Link as RouterLink } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {RecoilRoot} from "recoil";
import "./styles.css";

import reportWebVitals from './reportWebVitals';
import App from './App';
import Notification from "./components/Notification";


/**
 * Configure links and buttons to use Router by default while keeping their styling
 */
const LinkBehavior = React.forwardRef((props, ref) => {
    const { href, ...other } = props;
    // Map href (MUI) -> to (react-router)
    return <RouterLink data-testid="custom-link" ref={ref} to={href} {...other} />;
});

LinkBehavior.propTypes = {
    href: PropTypes.oneOfType([
        PropTypes.shape({
            hash: PropTypes.string,
            pathname: PropTypes.string,
            search: PropTypes.string,
        }),
        PropTypes.string,
    ]).isRequired,
};

const theme = createTheme({
    components: {
        MuiLink: {
            defaultProps: {
                component: LinkBehavior,
            },
        },
        MuiButtonBase: {
            defaultProps: {
                LinkComponent: LinkBehavior,
            },
        },
    },
});

/**
 * React root.
 */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //  Strict mode is only applied in development
  <React.StrictMode>
      {/* Set the theme that controls the links */}
      <ThemeProvider theme={theme}>
          {/* Recoil is mostly used to handle global state. Every component below it can see this state. */}
          <RecoilRoot>
            {/* The main application */}
            <App />
            {/* Notification component to give feedback to the authentication. */}
            <Notification/>
          </RecoilRoot>
      </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
