import React from 'react'
import ReactDOM from 'react-dom'
import Layout from './components/Layout/Layout'
import {Provider} from 'react-redux'
import reducer from './store/reducers/index'
import {createStore} from 'redux'
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core'
import './index.scss'

const App = function () {
    const palette = {
        primary: {
            main: '#7b1fa2',
            light: '#A835D8',
            lightAlt: '#C475E4',
            dark: '#4A1362',
            darkAlt: '#2A0B37'
        },
        secondary: {
            main: '#242424',
            light: '#4A4A4A',
            dark: '#151515',
            darkAlt: '#101010'
        },
        tertiary: {
            main: '#00695f',
            light: '#33877f',
            dark: '#004942'
        },
        quaternary: {
            main: '#007bb2',
            light: '#3395c1',
            dark: '#00567c'
        },
        quinary: {
            main: '#f44336',
            light: '#f6685e',
            dark: '#aa2e25'
        },
        error: {},
        warning: {},
        info: {},
        success: {},
        text: {
            primary: '#ffffff',
            secondary: 'rgba(255,255,255,0.7)',
            disabled: 'rgba(255,255,255,0.3)'
        },
        action: {
            active: '#ffffff',
            hover: 'rgba(255,255,255,0.08)',
            selected: 'rgba(255,255,255,0.16)',
            disabled: 'rgba(255,255,255,0.3)',
            disabledBackground: 'rgba(36,36,36,0.12)'
        },
        background: {
            default: '#101010',
            paper: '#242424'
        },
        divider: '#242424',
        status: {
            registered: {
                alt: '#A835D8',
                main: '#4A1362'
            },
            running: {
                alt: '#33877f',
                main: '#004942'
            },
            finished: {
                alt: '#007bb2',
                main: '#00567c'
            },
            paused: {
                main: '#242424'
            }
        }
    }

    /**
     * Create redux state store.
     */
    const store = createStore(reducer)

    /**
     * Root MUI component overrides.
     */
    const theme = createMuiTheme({
        typography: {
            fontSize: 12
        },
        palette: {
            type: "dark",
            primary: {
                main: palette.primary.main,
                light: palette.primary.light,
                lightAlt: palette.primary.lightAlt,
                dark: palette.primary.dark,
                darkAlt: palette.primary.darkAlt
            },
            secondary: {
                main: palette.secondary.main,
                light: palette.secondary.light,
                dark: palette.secondary.dark,
                darkAlt: palette.secondary.darkAlt
            },
            tertiary: {
                main: palette.tertiary.main,
                light: palette.tertiary.light,
                dark: palette.tertiary.dark,
            },
            quaternary: {
                main: palette.quaternary.main,
                light: palette.quaternary.light,
                dark: palette.quaternary.dark,
            },
            quinary: {
                main: palette.quinary.main,
                light: palette.quinary.light,
                dark: palette.quinary.dark,
            },
            // error: {},
            // warning: {},
            // info: {},
            // success: {},
            text: {
                primary: palette.text.primary,
                secondary: palette.text.secondary,
                disabled: palette.text.disabled,
            },
            action: {
                active: '#ffffff',
                hover: palette.action.hover,
                selected: palette.action.selected,
                disabled: palette.action.disabled,
                disabledBackground: palette.action.disabledBackground
            },
            background: {
                default: palette.background.default,
                paper: palette.background.paper
            },
            divider: palette.divider,
            status: {
                registered: {
                    main: palette.status.registered.main,
                    alt: palette.status.registered.alt
                },
                running: {
                    main: palette.status.running.main,
                    alt: palette.status.running.alt
                },
                finished: {
                    main: palette.status.finished.main,
                    alt: palette.status.finished.alt
                },
                paused: {
                    main: palette.status.paused.main
                }
            }
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
                    backgroundColor: palette.secondary.main,
                    boxShadow: 'none'
                },
            },
            MuiButton: {
                root: {
                    color: palette.text.secondary,
                    minWidth: 'auto',
                    padding: '4px 12px !important',
                    borderRadius: '2px',
                    textTransform: 'none',

                    // Big Button styles
                    '&.StockMiner-BigButton': {
                        color: palette.secondary.dark,
                        backgroundColor: palette.primary.light,
                        padding: '12px !important',
                        borderRadius: '4px !important',
                        '&.Mui-disabled': {
                            opacity: '0.5'
                        },
                        '&:first-of-type': {
                            marginTop: '36px'
                        },
                        '& .MuiCircularProgress-root': {
                            color: palette.text.secondary,
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            marginTop: '-12px',
                            marginLeft: '-12px',
                            zIndex: 1
                        }
                    },
                    '&.StockMiner-BigButton.MuiButton-outlined': {
                        backgroundColor: 'transparent !important',
                        borderColor: palette.primary.light,
                        color: `${palette.primary.light} !important`
                    },
                    '&.StockMiner-BigButton:hover': {
                        backgroundColor: `${palette.primary.lightAlt} !important`
                    },
                    '&.StockMiner-BigButton.MuiButton-outlined:hover': {
                        backgroundColor: `${palette.primary.darkAlt} !important`
                    },
                    '&.StockMiner-BigButton + .StockMiner-BigButton': {
                        marginTop: '12px'
                    }
                }
            },
            MuiChip: {
                root: {
                    height: '26px',
                    maxWidth: '125px !important',
                    backgroundColor: palette.primary.dark,
                    '& .MuiChip-deleteIcon': {
                        backgroundColor: palette.primary.dark,
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
                    backgroundColor: `${palette.secondary.dark}`,
                    borderRadius: '2px !important',
                    '&:hover': {
                        backgroundColor: `transparent`,
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: `${palette.secondary.main}`,
                    },
                    '&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: `${palette.secondary.main} !important`,
                    },
                    '& .MuiChip-root': {
                        margin: '2px 3px 0 3px',
                    }
                },
            },
            MuiCheckbox: {
                root: {
                    '&$checked .MuiSvgIcon-root': {
                        color: `${palette.primary.main} !important`
                    },
                    '&$checked': {
                        color: `${palette.primary.main} !important`
                    }
                }
            },
            MuiSelect: {
                root: {
                    borderRadius: '2px !important',
                }
            },
            MuiOutlinedInput: {
                notchedOutline: {
                    borderWidth: '1px'
                }
            },
            MuiFormControl: {
                root: {
                    marginTop: '6px !important',
                    marginBottom: '6px !important',
                    '& + *': {
                        marginTop: '16px !important'
                    },
                    '& + .MuiDivider-root': {
                        marginTop: '16px !important',
                        marginBottom: '16px !important'
                    }
                }
            },
            MuiDivider: {
                root: {
                    marginTop: '16px !important',
                    marginBottom: '16px !important'
                }
            },
            MuiPaper: {
                root: {
                    backgroundColor: palette.secondary.darkAlt,
                    borderRadius: '0 !important',
                }
            },
            MuiTableHead: {
                root: {
                    '& .MuiTableCell-root': {
                        backgroundColor: palette.secondary.main
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
                        backgroundColor: `${palette.secondary.dark} !important`
                    },
                    '&$selected': {
                        backgroundColor: `${palette.secondary.dark} !important`
                    },
                    '&:last-child': {}
                }
            },
            MuiTableCell: {
                root: {
                    borderBottom: `1px solid ${palette.secondary.main}`,
                }
            },
            MuiTabs: {
                indicator: {
                    backgroundColor: palette.primary.main
                }
            },
            MuiTab: {
                root: {
                    minWidth: 'auto !important',
                    color: `${palette.text.secondary}`,
                    textTransform: 'none',
                    '&$selected': {
                        backgroundColor: palette.secondary.main,
                        color: `${palette.text.primary} !important`
                    },
                    '&$disabled': {
                        color: `${palette.text.disabled}`
                    },
                    '&:hover': {
                        backgroundColor: palette.secondary.main,
                    },
                    '&.MuiButtonBase-root': {
                        padding: '6px 16px'
                    }
                },
            },
            MuiAccordion: {
                root: {
                    boxShadow: 'none',
                    backgroundColor: palette.secondary.darkAlt,
                    color: `${palette.text.disabled} !important`,
                    '&:last-child': {
                        '& .MuiAccordionSummary-root': {
                            borderBottom: `1px solid ${palette.secondary.main}`,
                        }
                    },
                    '&:not(:first-child)': {
                        borderTop: `1px solid ${palette.secondary.main}`,
                    },
                    '&:before': {
                        display: 'none'
                    },
                    '&:after': {
                        display: 'none'
                    },
                    '&$expanded': {
                        margin: 'auto',
                        color: `${palette.text.primary} !important`,
                    },
                    '& + .MuiDivider-root': {
                        marginTop: '0 !important'
                    },

                    // Accordions within Accordions
                    '& .MuiAccordion-root': {
                        width: '100%',
                        borderBottom: `1px solid ${palette.secondary.main}`,
                        backgroundColor: 'transparent !important',
                        color: `${palette.text.disabled} !important`,
                        '& + .MuiAccordion-root': {
                            borderTop: 'none !important'
                        },
                        '& .MuiAccordionSummary-root': {
                            paddingLeft: '0',
                            paddingRight: '0',
                            '&:hover': {
                                backgroundColor: 'transparent !important',
                            },
                            '&$expanded': {
                                backgroundColor: 'transparent !important',
                                color: `${palette.text.secondary} !important`,
                            },
                            '& .MuiAccordionSummary-content': {
                                margin: '0'
                            }
                        },
                        '& .MuiAccordionDetails-root': {
                            padding: '16px 0',
                            display: 'block !important',
                            '& .MuiFormControl-root': {
                                width: '100%'
                            }
                        }
                    }
                }
            },
            MuiAccordionSummary: {
                root: {
                    '&:hover': {
                        backgroundColor: palette.secondary.main,
                    },
                    '&$expanded': {
                        backgroundColor: palette.secondary.main,
                        minHeight: '48px',
                        '& > :first-child': {
                            margin: '0 0 !important',
                        },
                        '& .MuiIconButton-label': {
                            color: `${palette.text.primary} !important`
                        }
                    },
                    '& .MuiAccordionSummary-content .MuiTypography-root': {
                        fontWeight: 'bold !important'
                    },
                    '& .MuiIconButton-label': {
                        color: `${palette.text.disabled} !important`
                    }
                }
            },
            MuiAccordionDetails: {
                root: {
                    padding: '16px'
                }
            },
            MuiPopover: {
                root: {
                    '& .MuiPaper-root': {
                        backgroundColor: `${palette.secondary.dark}`,
                        '& .MuiListItem-root.Mui-selected': {
                            backgroundColor: `${palette.secondary.main}`,
                        }
                    }
                }
            },
            MuiCssBaseline: {
                '@global': {
                    '*': {
                        'scrollbar-width': 'thin',
                        'scrollbar-color': `${palette.secondary.main} ${palette.secondary.darkAlt}`
                    },
                    '*::-webkit-scrollbar': {
                        width: '8px'
                    },
                    '*::-webkit-scrollbar-track': {
                        backgroundColor: palette.secondary.darkAlt,
                        boxShadow: `inset 0 0 6px ${palette.secondary.dark}`,
                        webkitBoxShadow: `inset 0 0 6px ${palette.secondary.dark}`
                    },
                    '*::-webkit-scrollbar-thumb': {
                        backgroundColor: palette.secondary.main,
                        outline: 'none'
                    },
                    '.MuiAutocomplete-option': {
                        color: palette.text.secondary
                    },
                    '.MuiAutocomplete-option[data-focus="true"]': {
                        backgroundColor: `${palette.secondary.main} !important`
                    }
                }
            },
        }
    })

    return (
        <>
            <Provider store={store}>
                <MuiThemeProvider theme={theme}>
                    <Layout/>
                </MuiThemeProvider>
            </Provider>
        </>
    )
}

const view = App('stockminer')
const element = document.getElementById('app')
ReactDOM.render(view, element)