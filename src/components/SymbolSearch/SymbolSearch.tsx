import * as React from 'react'
import {useState, useEffect} from "react"
import PropTypes from "prop-types"
import {connect} from 'react-redux'
import * as ActionTypes from '../../store/actions'
import fetch from 'cross-fetch'
import FormGroup from '@material-ui/core/FormGroup'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import AddIcon from '@material-ui/icons/Add'
import CircularProgress from '@material-ui/core/CircularProgress'

function sleep(delay = 0) {
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    })
}

const SymbolSearch = (props) => {
    const {
        tableID,
        addTableRow,
        ...other
    } = props;
    const [open, setOpen] = useState(false)
    const [options, setOptions] = useState([])
    const [chars, setChars] = useState('')
    const [selectedSymbols, setSelectedSymbols] = useState([])
    const [addButtonDisabled, setAddButtonDisabled] = useState(true)
    const loading = open && options.length === 0 && chars.length > 0

    const handleAddButtonClick = () => {
        addTableRow(tableID, selectedSymbols)
        setSelectedSymbols([])
        setAddButtonDisabled(true)
    }

    useEffect(() => {
        let active = true
        if (!loading) {
            return undefined
        }

        (async () => {
            try {
                const response = await fetch(`http://localhost:2222/api/get/symbols/${chars}/10`)
                await sleep(100)
                const symbols_arr = await response.json()
                if (active) {
                    setOptions(symbols_arr)
                }
            } catch (error) {
                console.log(`Symbol Search didn't like that input. Stock Miner handled it.`)
            }
        })();

        return () => {
            active = false;
        }
    }, [chars])

    useEffect(() => {
        if (!open) {
            setOptions([])
        }
    }, [open])

    return (
        <FormGroup id={`symbol-search-datatable-${tableID}`}>
            <Autocomplete
                multiple
                style={{width: '350px', marginRight: 'auto'}}
                value={selectedSymbols}
                onClose={() => {
                    setOpen(false)
                }}
                onInputChange={(event) => {
                    setOpen(true)
                    setOptions([])
                    setChars(event.currentTarget.value)
                }}
                onChange={(event, value) => {
                    setSelectedSymbols(value)
                    if (value.length) {
                        setAddButtonDisabled(false)
                    } else {
                        setAddButtonDisabled(true)
                    }
                }}
                getOptionSelected={(option, value) => option.s === value.s}
                getOptionLabel={(option) => option.s + ' - ' + option.n}
                options={options}
                open={open}
                loading={loading}
                filterSelectedOptions
                disableClearable
                clearOnEscape
                autoHighlight
                limitTags={2}
                forcePopupIcon={false}
                renderInput={params => {
                    return (
                        <TextField
                            {...params}
                            variant="outlined"
                            label="Add Symbols"
                            placeholder=""
                            fullWidth
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <React.Fragment>
                                        {loading ? <CircularProgress color="inherit" size={20}/> : null}
                                        {!loading ? <IconButton
                                            size="small"
                                            disabled={addButtonDisabled}
                                            onClick={handleAddButtonClick}

                                        >
                                            <AddIcon/>
                                        </IconButton> : null}
                                    </React.Fragment>
                                )
                            }}
                            onKeyDown={(event) => {
                                if (event.key.toUpperCase() === 'ENTER' && selectedSymbols.length) {
                                    handleAddButtonClick()
                                }
                            }}
                        />
                    )
                }}
            />
        </FormGroup>
    )
}

SymbolSearch.propTypes = {
    tableID: PropTypes.any.isRequired
}

const mapStateToProps = (state) => {
    return {}
}

const mapDispatchToProps = (dispatch) => {
    return {
        addTableRow: (tableID, rows) => dispatch(ActionTypes.addTableRow(tableID, rows)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SymbolSearch)