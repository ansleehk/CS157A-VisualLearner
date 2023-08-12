const fetch = require('node-fetch');
const chatGptService = require('./chatGptService');
const articleRepo = require('../repos/articleRepo');

class FetchMediumArticleFromRapidApi {
    constructor() {
        this.baseUrl = 'https://medium2.p.rapidapi.com/article';
        this.options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': process.env["MEDIUM_RAPID_API_KEY"],
                'X-RapidAPI-Host': 'medium2.p.rapidapi.com'
            }
        };
    }

    /**
     * Fetches the content of a Medium article by ID using the RapidAPI service.
     *
     * @async
     * @function
     * @param {string} articleID - The ID of the Medium article to fetch.
     * @returns {Promise<string>} The content of the Medium article.
     * @throws {Error} If there's an error fetching the article content.
     *
     * @example
     * const articleID = '123456';
     * const content = await fetchMediumArticleContent(articleID);
     * console.log(content); // 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...'
     */
    fetchMediumArticleContent = async (articleID) => {
        const url = `${this.baseUrl}/${articleID}/content`;
        const response = await fetch(url, this.options);
        const content = (await response.json())["content"];
        console.log(`{articleID: ${articleID}, content: ${content}}`)
        if (articleID === undefined) {
            throw new Error(`Error fetching article content: ${content}`);
        }
        return content;
    };

    /**
     * Check if the medium article exists by ID.
     * 
     * @async
     * @function
     * @param {string} articleID - The ID of the Medium article to check.
     * @returns {Promise<boolean>} A promise that resolves with a boolean value indicating whether the article exists.
     */
    checkMediumArticleExists = async (articleID) => {
        const url = `${this.baseUrl}/${articleID}`;
        const response = await fetch(url, this.options);
        console.log(response)
        return response.status === 200;
    }

    /**
     * Fetches the information of a Medium article by ID using the RapidAPI service.
     *
     * @async
     * @function`
     * @param {string} articleID - The ID of the Medium article to fetch.
     * @returns {Promise<Object>} An object containing the title and URL of the Medium article.
     * @throws {Error} If there's an error fetching the article information.
     *
     * @example
     * const articleID = '123456';
     * const articleInfo = await fetchMediumArticleInfo(articleID);
     * console.log(articleInfo); // { title: 'Lorem ipsum', url: 'https://medium.com/...' }
     */
    fetchMediumArticleInfo = async (articleID) => {
        const url = `${this.baseUrl}/${articleID}`;
        const response = await fetch(url, this.options);
        const jsonResponse = await response.json();
        const articleInfo = {
            "title": jsonResponse["title"],
            "url": jsonResponse["url"]
        };
        return articleInfo;
    };

}



class AiDetectArticle {
    constructor(articleContent) {
        this.articleContent = articleContent;
        console.log(this.articleContent)
    }
    /**
     * Identifies the fields of study related to a Medium article using a GPT-3.5 chatbot.
     *
     * @async
     * @function
     * @returns {Promise<string[]>} An array of fields of study related to the article.
     * @throws {Error} If the response from the chatbot is not a valid JSON string or does not contain a "fieldsOfStudy" property.
     *
     */
    async identifyMediumArticleFieldsOfStudy() {
        const SYS_PROMPT = {
            role: 'system',
            content: `
            In the following time, for each message, you are given an article to read. 
            Your task is to identify the fields of study related to the article. 
            The format of your response should be in JSON format.

            The maximum number of fields of study you provide should be 5 fields.

            Here's an example:
        
            {
                fieldsOfStudy: [“Computer Science”, “Artificial Intelligence”, “Machine Learning”]
            }
        
                
            `
        };

        const chatGptClient = new chatGptService.ChatGPTClient();
        const messages = [SYS_PROMPT, {
            role: 'user', content: this.articleContent
        }]

        console.log(messages)
        const response = await chatGptClient.sendMessage(messages);
        return JSON.parse(response)["fieldsOfStudy"];
    }

    /**
     * Identifies the concepts and relationships of concepts related to a Medium article using a GPT-3.5 chatbot.
     * 
     * @async
     * @function
     * @returns {Promise<string[]>} An array of concepts and relationships of concepts related to the article.
     * @Error {Error} If the response from the chatbot is not a valid JSON string or does not contain a "conceptRelationship" property.
     * 
     */
    async identifyMediumArticleConcepts() {
        const SYS_PROMPT = {
            role: 'system',
            content: `
            In the following time, for each message, you are given an article to read. 
            Your task is to identify the key concepts in the article and tell how those concepts connect with each other (Their relationships). 
            You should write down the concepts and relationships of them using JSON.

            The maximum number of conceptRelationship you provide should be 5.

            Here's an example:

            {
                "conceptRelationship" : [
                        {
                            "conceptA" : "Humankind",
                            "conceptB" : "Artificial Intelligence",
                            "relationship" "Artificial Intelligence is likely to destroy humankind": 
                        }
                    ]
                }

            `
        }

        const chatGptClient = new chatGptService.ChatGPTClient();
        const messages = [SYS_PROMPT, {
            role: 'user', content: this.articleContent
        }]
        const response = await chatGptClient.sendMessage(messages);
        return JSON.parse(response)["conceptRelationship"];
    }

    /**
     * Generates a concept map by using the concepts and relationships of concepts using a GPT-3.5 chatbot.
     * 
     * @async
     * @function
     * @param {string[]} concepts - An array of concepts and and relationships of concepts related to the article.
     * @returns {Promise<string>} - A concept map in Mermaid format generated by the chatbot.
     * @Error {Error} If the response from the chatbot is not a valid JSON string or does not contain a "mermaidCode" property.
     */
    generateConceptMap = async (conceptsAndRelationship) => {
        const SYS_PROMPT = {
            role: 'system',
            content: `
            Making a Concept Map using Mermaid

            In the following time, you will be given some concepts, as well as the relationships of those concepts in JSON format.
            
            Here's an example:
            
            {
            "conceptRelationship" : [
                    {
                        "conceptA" : "Humankind",
                        "conceptB" : "Artificial Intelligence",
                        "relationship" : "Artificial Intelligence destroys humankind": 
                    }
                ]
            }
            
            Your task is to make a concept map using the diagramming and charting language Mermaid. You are required to put the concepts into nodes, and their relationships in the middle of the concept nodes. You should put the result in JSON format.
            
            Here's an example:
            
            {
                "mermaidCode" : "{\"flowchart TD\\n    A[Artificial Intelligence] -->|Destroy| B(Humankind)\"}"
            }
            
            `
        }


        const chatGptClient = new chatGptService.ChatGPTClient();
        const messages = [SYS_PROMPT, {
            role: 'user', content: JSON.stringify(conceptsAndRelationship)
        }]
        const response = await chatGptClient.sendMessage(messages);
        // console.log(JSON.parse(response)["mermaidCode"])
        return JSON.parse(response)["mermaidCode"];
    }

}

class ArticleService {
    async getArticle(articleId) {
        //Check if the article exists in the database
        const isArticleExistsInDb = await articleRepo.checkArticleExists(articleId);

        if (isArticleExistsInDb) {
            console.log("Article exists in db")
        } else {
            await this._checkArticleExistsOnMediumAndCreateCache(articleId);
        }
        const articleEntity = await articleRepo.fetchArticle(articleId);
        const articleConcepts = await articleRepo.fetchArticleConcepts(articleId);
        const articleFields = await articleRepo.fetchArticleFields(articleId);

        return {
            articleID: articleId,
            title: articleEntity.Title,
            content: articleEntity.Content,
            sourceLink: articleEntity.SourceLink,
            concepts: articleConcepts,
            fieldsOfStudy: articleFields
        }
    }

    async _checkArticleExistsOnMediumAndCreateCache(articleId) {
            //Check if the article exists on Medium
            const fetchMediumArticleFromRapidApi = new FetchMediumArticleFromRapidApi();
            const isArticleExistOnMedium = await fetchMediumArticleFromRapidApi.checkMediumArticleExists(articleId);
            if (isArticleExistOnMedium) {
                await this._createNewArticleCache(articleId);
            } else {
                throw new Error("Article not found on Medium")
            } 
    }

    async getConceptMap(articleId) {
        //Check if the article exists in the database
        const isArticleExistsInDb = await articleRepo.checkArticleExists(articleId);

        if (isArticleExistsInDb) {
            const conceptMapCode = await articleRepo.fetchArticleConceptMap(articleId);
            return {
                mermaid_flowchart: conceptMapCode
            }
        } else {
            await this._checkArticleExistsOnMediumAndCreateCache(articleId)
            const articleConceptMap = await articleRepo.fetchArticleConceptMap(articleId);
            return {
                mermaid_flowchart: articleConceptMap
            }
        }
    }

    async _createNewArticleCache(articleId) {
        const fetchMediumArticleFromRapidApi = new FetchMediumArticleFromRapidApi();
        const articleContent = await fetchMediumArticleFromRapidApi.fetchMediumArticleContent(articleId);
        const articleInfo = await fetchMediumArticleFromRapidApi.fetchMediumArticleInfo(articleId);

        const aiDetectArticle = new AiDetectArticle(articleContent);
        const articleFieldsOfStudy = await aiDetectArticle.identifyMediumArticleFieldsOfStudy();
        const articleConceptsAndRelationships = await aiDetectArticle.identifyMediumArticleConcepts();
        const articleConceptMap = await aiDetectArticle.generateConceptMap(articleConceptsAndRelationships);

        //Save the article to the database
        const createNewArticleToDatabase = new articleRepo.CreateNewArticleToDatabase(articleId, articleInfo.title, 
            articleInfo.url, articleContent, articleFieldsOfStudy, articleConceptsAndRelationships, articleConceptMap)
        await createNewArticleToDatabase.saveArticleToDatabase();

    }

    async checkArticleExists(articleId) {
        //Check if the article exists in the database
        const isArticleExistsInDb = await articleRepo.checkArticleExists(articleId);

        if (isArticleExistsInDb) {
            return true;
        } else {
            const fetchMediumArticleFromRapidApi = new FetchMediumArticleFromRapidApi();
            const isArticleExistOnMedium = await fetchMediumArticleFromRapidApi.checkMediumArticleExists(articleId);

            await this._createNewArticleCache(articleId);

            return isArticleExistOnMedium;
        }
    }
}




module.exports = {
    FetchMediumArticleFromRapidApi,
    AiDetectArticle,
    ArticleService
};


