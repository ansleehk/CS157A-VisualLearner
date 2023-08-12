import { useState } from "react"
import { useParams } from "react-router-dom";

import ConceptSearch from "./conceptSearch"
import ConceptRelatedArticles from "./conceptRelated"

export default function ConceptSearchAndList() {

    const { defaultConceptId } = useParams();

    const [conceptId, setConceptId] = useState(defaultConceptId);

    return <main className="primary-windows-container">
        <ConceptSearch conceptId={conceptId} setConceptIdFunc={setConceptId} />
        <ConceptRelatedArticles conceptId={conceptId} setConceptIdFunc={setConceptId}/>
    </main>
}