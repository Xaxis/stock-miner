import * as React from 'react'
import Grid from '@material-ui/core/Grid'
import Autocomplete from '@material-ui/lab/Autocomplete'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import AddIcon from '@material-ui/icons/Add'
import SearchList from './SearchList'
import {makeStyles} from '@material-ui/core/styles'
import './Search.scss'

export default function Search() {
    const classes = makeStyles((theme) => ({
        root: {
        }
    }))

    return (
        <Grid container spacing={1} className={classes.root}>
            <Grid item xs={12}>
                <Autocomplete
                    multiple
                    id="symbol-search"
                    options={SearchList}
                    groupBy={(option) => option.title[0].toUpperCase()}
                    getOptionLabel={(option) => option.title}
                    filterSelectedOptions
                    disableClearable
                    forcePopupIcon={false}
                    renderInput={params => {
                        return (
                            <TextField
                                {...params}
                                variant="outlined"
                                label="Symbols"
                                placeholder="Search"
                                fullWidth
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment:
                                        <IconButton size="small" disabled>
                                            <AddIcon />
                                        </IconButton>
                                }}
                            />
                        )
                    }}
                />
            </Grid>
        </Grid>
    );
};
