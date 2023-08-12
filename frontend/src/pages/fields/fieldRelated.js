import { useEffect, useState } from "react";
import "../styles/search.scss"
import { Link } from "react-router-dom";

const BACKEND_HOST = process.env["REACT_APP_BACKEND_HOST"];
const BACKEND_PORT = process.env["REACT_APP_BACKEND_PORT"];

async function fetchArticleListsByConceptId(conceptId) {
    const articleIdList = await (await fetch(`http://${BACKEND_HOST}:${BACKEND_PORT}/concept/${conceptId}/articles`)).json();
    return articleIdList;
}

async function fetchArticle(articleId) {
    const article = await (await fetch(`http://${BACKEND_HOST}:${BACKEND_PORT}/article/${articleId}`)).json();
    return article;
}

export default function ConceptRelatedArticles(props) {

    const [articleList, setArticleList] = useState(null);

    useEffect(() => {
        async function fetchArticleList() {
            if (props.conceptId !== undefined) {
                const articleIds = await fetchArticleListsByConceptId(props.conceptId);
                const articles = await Promise.all(articleIds.map(fetchArticle));
                setArticleList(articles);
            }
        }
        fetchArticleList();
    }, [props.conceptId]);

    return (
        <section className="window-with-tab related-article">
            <menu className="tab">
                Field Related Articles
            </menu>
            <main className="window">
                <menu className="top">
                </menu>
                <main className="main-window-content">
                    {
                        props.conceptId == null ? <h1 className="error">No Field Selected<br />
                            Try to Search a Field</h1> : <>
                            <h1>
                                Related Articles
                            </h1>
                            <table className="articles">
                                <thead>
                                    <tr>
                                        <th width="35%">Name</th>
                                        <th width="25%">Related Concepts</th>
                                        <th width="25%">Related Fields</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        articleList === null ? <tr><td>Loading...</td></tr> : articleList.map((article) => (
                                            <tr key={article.articleId}>
                                                <td>{article["title"]}</td>
                                                <td>
                                                    <ul>
                                                    {
                                                        article["concepts"].map((concept) => 
                                                        <li>
                                                            {concept["name"]}
                                                        </li> )
                                                    }
                                                    </ul>
                                                </td>
                                                <td>
                                                    {
                                                        article["fieldsOfStudy"].map((field) =>
                                                            <li>
                                                                {field["name"]}
                                                            </li>
                                                        )
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        <Link to={`/${article["articleID"]}`}>
                                                            View
                                                        </Link>
                                                    }
                                                </td>
                                            </tr>
                                        ))

                                    }
                                </tbody>
                            </table>
                        </>
                    }

                </main>
            </main>
        </section>
    )
}