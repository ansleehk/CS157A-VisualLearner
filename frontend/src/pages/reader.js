import "../styles/window.scss"
import "./styles/reader.scss"

import { useEffect, useState } from "react";

import ImportLogo from "./imgs/import-icon.png"

import SubSettingMenu from "../components/sub-setting-menu";

const BACKEND_HOST = process.env["REACT_APP_BACKEND_HOST"];
const BACKEND_PORT = process.env["REACT_APP_BACKEND_PORT"];

async function fetchArticle(articleID) {
    const article = await (await fetch(`http://${BACKEND_HOST}:${BACKEND_PORT}/article/${articleID}`)).json();

    return article;
}

function ImportArticleMenu(props) {

    const handleArticleIdFetch = async (event) => {
        event.preventDefault();

        const articleID = document.getElementById("article-id").value;

        const article = await fetchArticle(articleID);

        document.getElementById("import-article").style.cursor = "wait";

        props.setArticleFunction({
            heading: article["title"],
            articleSourceLink: article["sourceLink"],
            fieldsOfStudy: article["fieldsOfStudy"],
            relatedConcepts: article["concepts"],
            content: article["content"]
        });

        props.setArticleIdFunction(articleID);

        document.getElementById("import-article").style.cursor = "default";

        props.windowDisplayFunction(false);
    }

    return (
        <div id="import-article">
            <SubSettingMenu windowDisplayFunction={props.windowDisplayFunction} />
            <div id="source-selection-container">
                <span id="source-selection-heading">
                    Import Article from Medium
                </span>
                <form id="article-source-selection" onSubmit={handleArticleIdFetch}>
                    <input id="article-id" type="text" placeholder="Article ID" />
                    <input id="submit-article" type="submit" value="Import" />
                </form>
            </div>
        </div>
    )
}


export default function Reader(props) {
    const [showImportArticleMenu, setShowImportArticleMenu] = useState(false);
    const [article, setArticle] = useState(null);

    useEffect(() => {
    async function fetchArticleData() {
        if (props.articleId !== undefined) {
            const req = await fetchArticle(props.articleId);
            setArticle({
                heading: req["title"],
                articleSourceLink: req["sourceLink"],
                fieldsOfStudy: req["fieldsOfStudy"],
                relatedConcepts: req["concepts"],
                content: req["content"]
            });
        }
    }
    fetchArticleData();
}, [props.articleId]);


    return (
    <section className="window-with-tab">
        <menu className="tab">
            Reader
        </menu>
        <main className="window">
            <menu className="top">
                <ol>
                    <li>
                        <div id="import-article-container">
                            <img id="import-icon" className="setting-icon"
                                src={ImportLogo} onClick={() => { setShowImportArticleMenu(true) }} />
                            {
                                showImportArticleMenu ? <ImportArticleMenu
                                    windowDisplayFunction={setShowImportArticleMenu}
                                    setArticleFunction={setArticle}
                                    setArticleIdFunction={props.setArticleIdFunction} /> : null
                            }
                        </div>
                    </li>
                </ol>
            </menu>
            <main className="main-window-content">
                {
                    props.articleId === undefined ?
                        <h1 className="error">No Article <br />
                            Try to Import an Article</h1> :
                        article === null ? null : // add null check here
                        <article>
                            <h1>
                                {article.heading}
                            </h1>
                            <div>
                                <p>Medium Source Link: </p>
                                <a href={article.articleSourceLink}>
                                    {article.articleSourceLink}
                                </a>
                            </div>
                            <div className="article-concepts">
                                <p>Related Concepts: </p>
                                <ol>
                                    {article.relatedConcepts.map((concept) =>
                                        <li key={concept["id"]}>
                                            <a href={`/conceptSearch&List/${concept["id"]}`}>{concept["name"]}</a>
                                        </li>
                                    )}
                                </ol>
                            </div>
                            <div className="article-fields-of-study">
                                <p>Related Fields of Study: </p>
                                <ol>
                                    {article.fieldsOfStudy.map((field) =>
                                        <li key={field["id"]}>
                                            <a href={`/field/${field["id"]}`}>{field["name"]}</a>
                                        </li>
                                    )}
                                </ol>
                            </div>
                            <main className="article-content">
                                {article.content}
                            </main>
                        </article>
                }
            </main>
        </main>
    </section>
)
}
