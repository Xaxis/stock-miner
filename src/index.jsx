import React from 'react'
import ReactDOM from 'react-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import Layout from './components/Layout/Layout'
import './index.scss'

const App = function () {
    return (
        <>
            <Layout/>
        </>
    )
}

const view = App('pywebview')
const element = document.getElementById('app')
ReactDOM.render(view, element)