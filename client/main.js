import React from 'react'
import { hydrate, render } from 'react-dom'
import App from './App'

// render(<App/>, document.getElementById('root'))
hydrate(<App/>, document.getElementById('root'))
