import React from 'react'
import ReactDOM from 'react-dom'
import Layout from './components/Layout/Layout'
import {Provider} from 'react-redux'
import reducer from './store/reducers/index'
import {createStore} from 'redux'
import './index.scss'

const App = function () {
    const store = createStore(reducer)

    return (
        <>
            <Provider store={store}>
                <Layout/>
            </Provider>
        </>
    )
}

const view = App('stockminer')
const element = document.getElementById('app')
ReactDOM.render(view, element)