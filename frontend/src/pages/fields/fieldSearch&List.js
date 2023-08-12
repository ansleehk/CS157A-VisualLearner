import { useState } from "react"
import { useParams } from "react-router-dom";

import FieldSearch from "./fieldSearch"
import FieldRelatedArticles from "./fieldRelated"

export default function FieldSearchAndList() {

    const { defaultConceptId } = useParams();

    const [conceptId, setConceptId] = useState(defaultConceptId);

    return <main className="primary-windows-container">
        <FieldSearch conceptId={conceptId} setConceptIdFunc={setConceptId} />
        <FieldRelatedArticles conceptId={conceptId} setConceptIdFunc={setConceptId}/>
    </main>
}