import "../styles/search.scss"

import { useState, useEffect } from "react";

const BACKEND_HOST = process.env["REACT_APP_BACKEND_HOST"];
const BACKEND_PORT = process.env["REACT_APP_BACKEND_PORT"];

async function fetchConceptIdsByNameAndMode(fieldName, mode) {
    const fieldList = await (await fetch(`http://${BACKEND_HOST}:${BACKEND_PORT}/field/search/${fieldName}?` +
        new URLSearchParams({
            searchMode: mode
        }))).json();
    return fieldList["fields"];
}

async function fetchConceptNameById(conceptId) {
    const concept = await (await fetch(`http://${BACKEND_HOST}:${BACKEND_PORT}/field/${conceptId}`)).json();
    console.log(concept);
    return concept;
}

function SearchForm(props) {
    const [conceptName, setConceptName] = useState(null);

    useEffect(() => {
        async function fetchConcept() {
            if (props.conceptId !== undefined) {
                console.log(props.conceptId);
                const name = await fetchConceptNameById(props.conceptId);
                setConceptName(name);
            }
        }
        fetchConcept();
    }, [props.conceptId]);

    const handleSearchEvent = async (event) => {
        event.preventDefault();
        const conceptList = await fetchConceptIdsByNameAndMode(
            document.getElementById("concept-name").value,
            document.getElementById("searchMode").value
        )
        props.setSearchResultFunc(conceptList);
    }

    return <form className="search" onSubmit={handleSearchEvent}>
        <h1>Field Search</h1>
        {
            conceptName === null ?
                <input type="text" id="concept-name" placeholder="Field Name" /> :
                <input type="text" id="concept-name" defaultValue={conceptName} />
        }
        <select name="searchMode" id="searchMode">
            <option value="" disabled defaultValue>Select a Search Mode</option>
            <option value="exact">Exact Match</option>
            <option value="exact">Similar Match</option>
        </select>
        <input type="submit" value="Search" />
    </form>
}

function SearchResult(props) {
    return <div className="search-result">
        <h1>Field Result</h1>
        <table>
            <thead>
                <tr>
                    <th width="80%">Field Name</th>
                    <th width="20%"></th>
                </tr>
            </thead>
            <tbody>
                {
                    props.searchResult ? props.searchResult.map((concept) => {
                        console.log(concept);
                        return <tr key={concept["conceptId"]}>
                            <td>{concept["conceptName"]}</td>
                            <td><a onClick={() => {
                                props.setConceptIdFunc(concept["conceptId"])
                            }}>View</a></td>
                        </tr>
                    }) : null
                }
            </tbody>
        </table>
    </div>
}

export default function ConceptSearch(props) {
    const [searchResult, setSearchResult] = useState(null);


    return <section className="window-with-tab">
        <menu className="tab">
            Field Search
        </menu>
        <main className="window">
            <menu className="top">
            </menu>
            <main className="main-window-content search">
                <SearchForm conceptId={props.conceptId} setSearchResultFunc={setSearchResult} />
                <SearchResult setConceptIdFunc={props.setConceptIdFunc} searchResult={searchResult} />
            </main>
        </main>
    </section>
}