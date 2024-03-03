import React from 'react';

// material-ui
import { useTheme } from '@material-ui/styles';

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from './../../assets/images/logo-dark.svg';
 * import logo from './../../assets/images/logo.svg';
 *
 */

//-----------------------|| LOGO SVG ||-----------------------//

const Logo = () => {
    const theme = useTheme();

    return (
        /**
         * if you want to use image instead of svg uncomment following, and comment out <svg> element.
         *
         * <img src={logo} alt="Berry" width="100" />
         *
         */
        <svg width="35" height="35" viewBox="0 0 65 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M53.1792 0.128057C55.5639 -0.0887364 57.9638 0.0405792 60.3562 0.0177588C55.8111 9.45019 51.0645 18.7913 46.4509 28.1934C52.473 40.0777 58.4849 51.9786 64.4867 63.8959C62.0905 63.9149 59.6982 63.8959 57.3059 63.8959C55.1874 59.6665 53.046 55.4485 50.9199 51.223C48.2424 45.9159 45.561 40.6115 42.8758 35.3095C37.977 44.8066 33.2569 54.3874 28.3924 63.8959C18.9295 63.8959 9.46286 63.8959 0 63.8959C8.89742 46.2659 17.8025 28.6434 26.7151 11.0286C28.5521 7.38495 30.3473 3.72988 32.2338 0.116647C32.85 1.25767 33.4433 2.39869 34.0252 3.57394C36.9729 9.38934 39.8901 15.2123 42.8643 21.0201C46.333 14.0726 49.7713 7.10857 53.1792 0.128057ZM30.876 16.9467C24.0831 30.4868 17.1838 43.9737 10.4251 57.529C15.1147 57.4948 19.8119 57.6735 24.4977 57.4339C29.4117 47.682 34.3396 37.9364 39.2815 28.1972C36.9158 23.5798 34.687 18.9169 32.2338 14.3604C31.7242 15.2123 31.3248 16.0833 30.876 16.9467Z" fill={theme.palette.primary.main} />
        </svg>
    );
};

export default Logo;
