import * as React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import './Layout.scss'
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core";
import {makeStyles} from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import MainMenu from '../MainMenu/MainMenu'
import TabManager from '../TabManager/TabManager'
import SideBarMenu from '../SideBarMenu/SideBarMenu'
import StatusBar from '../StatusBar/StatusBar'
import './Layout.scss'

export default function Layout() {
    const theme = createMuiTheme({
        typography: {
            fontSize: 12
        },
        palette: {
            type: "dark",
            primary: {
                main: '#7b1fa2'
            },
            // secondary: {
            //     main: '#152a38'
            // },
            // contrastThreshold: 0.5,
            // tonalOffset: 0.7
        },
        props: {
            MuiTextField: {
                margin: 'dense'
            },
            MuiInputBase: {
                margin: 'dense'
            },
            MuiButton: {
                size: 'small'
            },
            MuiChip: {
                size: 'small'
            }
        },
        overrides: {
            MuiAppBar: {
                root: {
                    backgroundColor: '#121212 !important',
                    borderBottom: '1px solid #242424',
                    boxShadow: 'none'
                },
            },
            MuiButton: {
                root: {
                    color: '#999999 !important',
                    minWidth: 'auto',
                    padding: '4px 12px !important',
                    borderRadius: '2px',
                    textTransform: 'none',
                    '&.StockMinerBigButton': {
                        color: '#ffffff',
                        backgroundColor: '#242424',
                        padding: '16px 12px !important',
                        borderRadius: '4px !important'
                    },
                    '&.StockMinerBigButton:hover': {
                        backgroundColor: '#7b1fa2'
                    }
                }
            },
            MuiIconButton: {
                root: {
                    '&.Mui-disabled': {
                        color: '#242424 !important'
                    }
                }
            },
            MuiChip: {
                root: {
                    height: '26px',
                    maxWidth: '125px !important',
                    backgroundColor: '#242424',
                    '& .MuiChip-deleteIcon': {
                        backgroundColor: '#242424'
                    }
                }
            },
            MuiFormGroup: {
                root: {
                    width: '100%'
                }
            },
            MuiInputBase: {
                root: {
                    borderRadius: '2px !important',
                    '& .MuiChip-root': {
                        margin: '2px 3px 0 3px',
                    }
                },
            },
            MuiOutlinedInput: {
                notchedOutline: {
                    borderColor: '#424242',
                    borderWidth: '1px',
                }
            },
            MuiFormControl: {
                root: {
                    marginTop: '6px !important',
                    marginBottom: '6px !important'
                }
            },
            MuiPaper: {
                root: {
                    backgroundColor: '#151515',
                    borderRadius: '0 !important',
                }
            },
            MuiTableHead: {
                root: {
                    '& .MuiTableCell-root': {
                        backgroundColor: '#242424'
                    }
                }
            },
            MuiTableFooter: {
                root: {
                    '& .MuiTableCell-root': {
                        borderBottom: 'none !important'
                    }
                }
            },
            MuiTableRow: {
                root: {
                    '&:hover': {
                        backgroundColor: '#242424 !important'
                    },
                    '&$selected': {
                        backgroundColor: '#242424 !important'
                    },
                    '&:last-child': {}
                }
            },
            MuiTableCell: {
                root: {
                    borderBottom: '1px solid #242424',
                }
            },
            MuiTabs: {
                root: {
                    backgroundColor: '#121212;'
                },
                indicator: {
                    backgroundColor: '#7b1fa2'
                }
            },
            MuiTab: {
                root: {
                    minWidth: 'auto !important',
                    color: '#999999 !important',
                    textTransform: 'none',
                    '&$selected': {
                        backgroundColor: '#242424',
                        color: '#ffffff !important'
                    },
                    '&:hover': {
                        backgroundColor: '#242424',
                    },
                    '&.MuiButtonBase-root': {
                        padding: '6px 16px'
                    }
                },
            },
            MuiAccordion: {
                root: {
                    boxShadow: 'none',
                    backgroundColor: '#151515',
                    color: '#999999 !important',
                    '&:last-child': {
                        borderBottom: '1px solid #242424',
                    },
                    '&:not(:first-child)': {
                        borderTop: '1px solid #242424',
                    },
                    '&:before': {
                        display: 'none'
                    },
                    '&:after': {
                        display: 'none'
                    },
                    '&$expanded': {
                        margin: 'auto',
                        color: '#ffffff !important',
                        '& > :first-child': {
                            borderBottom: '1px solid #242424'
                        }
                    }
                }
            },
            MuiAccordionSummary: {
                root: {
                    '&:hover': {
                        backgroundColor: '#242424',
                    },
                    '&$expanded': {
                        backgroundColor: '#242424',
                        minHeight: '48px',
                        '& > :first-child': {
                            margin: '0 0 !important',
                        },
                        '& .MuiIconButton-label': {
                            color: '#ffffff !important'
                        }
                    },
                    '& .MuiIconButton-label': {
                        color: '#999999 !important'
                    }
                }
            },
            MuiAccordionDetails: {
                root: {
                    padding: '16px'
                }
            },
            MuiCssBaseline: {
                '@global': {
                    '*': {
                        'scrollbar-width': 'thin'
                    },
                    '*::-webkit-scrollbar': {
                        width: '8px'
                    },
                    '*::-webkit-scrollbar-track': {
                        backgroundColor: '#151515',
                        boxShadow: 'inset 0 0 6px rgba(21,21,21,1)',
                        webkitBoxShadow: 'inset 0 0 6px rgba(21,21,21,1)'
                    },
                    '*::-webkit-scrollbar-thumb': {
                        backgroundColor: '#242424',
                        outline: 'none'
                    },
                    '.MuiAutocomplete-option': {
                        color: '#999999'
                    },
                    '.MuiAutocomplete-option[data-focus="true"]': {
                        backgroundColor: '#242424 !important'
                    }
                }
            },
        }
    })

    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline/>
            <MainMenu/>
            <Grid container spacing={0} className="layout-page-grid">
                <Grid item xs={3} className="layout-sidebarmenu">
                    <SideBarMenu/>
                </Grid>
                <Grid item xs={9} className="layout-mainpanel">
                    <TabManager/>
                </Grid>
            </Grid>
            <StatusBar/>
        </MuiThemeProvider>
    );
};
