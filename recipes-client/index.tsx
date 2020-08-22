import {render} from 'react-dom'
import * as React from "react";

import {greeting} from "~consts";

const App = () => (
    <div>{greeting}</div>
)

render(<App />, document.getElementById('root'))
