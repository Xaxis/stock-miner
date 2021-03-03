import * as React from 'react'
import {useState, useEffect} from "react"
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

export default function Search() {
    const [open, setOpen] = useState(false)
    const [options, setOptions] = useState([])
    const [chars, setChars] = useState('')
    const loading = open && options.length === 0 && chars.length > 0

    useEffect(() => {
        let active = true
        if (!loading) {
            return undefined
        }

        (async () => {
            const response = await fetch(`http://localhost:2222/api/get/symbols/${chars}/5`)
            await sleep(250)
            const symbols_arr = await response.json()
            if (active) {
                setOptions(symbols_arr)
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
        <FormGroup>
            <Autocomplete
                multiple
                style={{width: '400px', marginRight: 'auto'}}
                onClose={() => {
                    setOpen(false)
                }}
                onInputChange={(event) => {
                    setOpen(true)
                    setOptions([])
                    setChars(event.currentTarget.value)
                }}
                getOptionSelected={(option, value) => option.s === value.s}
                getOptionLabel={(option) => option.s + ' - ' + option.n}
                options={options}
                open={open}
                loading={loading}
                // groupBy={(option) => option.title[0].toUpperCase()}
                // getOptionLabel={(option) => option.title + ' - ' + option.name}
                filterSelectedOptions
                disableClearable
                clearOnEscape
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
                                        {!loading ? <IconButton size="small">
                                            <AddIcon/>
                                        </IconButton> : null}
                                    </React.Fragment>
                                )
                            }}
                        />
                    )
                }}
            />
        </FormGroup>
    );
};
