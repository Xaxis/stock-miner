import * as React from 'react'
import FormGroup from '@material-ui/core/FormGroup'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import AddIcon from '@material-ui/icons/Add'
import SearchList from './SearchList'
import {makeStyles} from '@material-ui/core/styles'

export default function Search() {
    const classes = makeStyles((theme) => ({
        formGroup: {
            width: '350px',
            marginLeft: 'auto',
            marginRight: '24px'
        },
        autoComplete: {

        },
    }))()

    return (
        <FormGroup className={classes.formGroup}>
            <Autocomplete
                className={classes.autoComplete}
                multiple
                id="symbol-search"
                options={SearchList}
                groupBy={(option) => option.title[0].toUpperCase()}
                getOptionLabel={(option) => option.title + ' - ' + option.name}
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
                                endAdornment:
                                    <IconButton size="small">
                                        <AddIcon/>
                                    </IconButton>
                            }}
                        />
                    )
                }}
            />
        </FormGroup>
    );
};
