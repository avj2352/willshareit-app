import * as React from 'react';
import { hot } from "react-hot-loader/root";
import { SnackbarProvider } from 'notistack';
import { MuiThemeProvider, StylesProvider } from '@material-ui/core/styles';
// custom
import { useThemeOptions } from './common/theme/material/ThemeConfigProvider';
import AdvisorView from './views/Advisor.view';
import GlobalStyle from './common/theme/styled/GlobalStyled';



class App extends React.Component {
  render() {    
    return (
      <MuiThemeProvider
      theme = {useThemeOptions()}>
          <SnackbarProvider maxSnack={3} anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
          }}>
          <StylesProvider injectFirst>
              <GlobalStyle/>
                <AdvisorView/>
          </StylesProvider>
          </SnackbarProvider>
      </MuiThemeProvider>      
    );
  }
}

export default hot(App);
