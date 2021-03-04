import React from 'react'
import ReactDOM from 'react-dom'
import Layout from './components/Layout/Layout'
import './index.scss'

const App = function () {
    return (
        <>
            <Layout/>
        </>
    )
}

const view = App('stockminer')
const element = document.getElementById('app')
ReactDOM.render(view, element)