import {useEffect, useState} from "preact/hooks";
import {Game} from "../model/Game.ts";

import "./variables.css";
import "./app.css";


export function App() {

    const [initialized, setInitialized] = useState(false);
    useEffect(() => {
        if (!initialized) {
            setInitialized(true);
            new Game("game-container")
        }
    }, [setInitialized]);

    return <div id="game-container"/>;
}
