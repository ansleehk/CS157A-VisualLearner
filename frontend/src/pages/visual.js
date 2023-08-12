import MermaidDiagram from "../components/mermaid"

import { useState } from "react";

import "../styles/window.scss"

import VisualIcon from "./imgs/visual-icon.png"

const BACKEND_HOST = process.env["REACT_APP_BACKEND_HOST"];
const BACKEND_PORT = process.env["REACT_APP_BACKEND_PORT"];

const fetchArticleConceptMap = async (articleId) => {
    let conceptMap = (await (await fetch(`http://${BACKEND_HOST}:${BACKEND_PORT}/article/${articleId}/conceptMap`)).json());
    console.log(conceptMap)
    conceptMap = conceptMap["mermaid_flowchart"][0]["ConceptMapCode"];

    return conceptMap;
}

export default function Visual(props) {
    const [conceptMap, setConceptMap] = useState(null);

    const handleVisualizeMap = async (event) => {
        event.preventDefault();

        if (props.articleId === null) {
            setConceptMap(null)
            //pop up error window 
            window.alert("Please select an article first")
        } else {
            try {
                setConceptMap(await fetchArticleConceptMap(props.articleId));
            } catch (err) {
                window.alert("Error: " + err)
                setConceptMap(null)
            }
        }

    }

    return (
        <section className="window-with-tab">
            <menu className="tab">
                Visualization
            </menu>
            <main className="window">
                <menu className="top">
                    <ol>
                        <li>
                            <img className="setting-icon" src={VisualIcon} onClick={handleVisualizeMap} />
                        </li>
                    </ol>
                </menu>
                <main className="main-window-content">
                    {
                        conceptMap === null ?
                            <h1 className="error">No Visualization <br />
                                Try to Visualize the Concept</h1> :
                            <MermaidDiagram chart={conceptMap} />
                    }
                </main>
            </main>
        </section>
    )
}