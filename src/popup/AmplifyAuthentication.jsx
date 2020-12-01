import React from 'react'
import Amplify, { Auth } from 'aws-amplify'

function AmplifyAuthentication(props) {
    return <div className="App">
        <header className="App-header">
            <p>
                Edit <code>src/App.js</code> and save to reload.
          </p>
            <button onClick={() => Auth.federatedSignIn()}>Sign In</button>
        </header>
    </div>

}

export default AmplifyAuthentication