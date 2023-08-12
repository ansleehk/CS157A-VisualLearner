import "../styles/main.scss";

import Reader from "./reader"; 
import Visual from "./visual";

import { useState } from "react";

import { useParams } from "react-router-dom";

export default function ReaderAndVisual() {
    const { defaultArticleId } = useParams();

    console.log(defaultArticleId)

    const [articleId, setArticleId] = useState(defaultArticleId);

    return (
        <main className="primary-windows-container">
            <Reader articleId={articleId} setArticleIdFunction={setArticleId}/>
            <Visual articleId={articleId}/>
        </main>
    )
}