const axios = require('axios');

/**
 * ChatGPTClient provides an interface to interact with OpenAI's ChatGPT.
 * 
 * @example
 * const client = new ChatGPTClient({
 *   apiKey: 'YOUR-API-KEY',
 * });
 *
 * const messages = [
 *   {
 *     role: 'system',
 *     content: 'You are a helpful assistant.',
 *   },
 *   {
 *     role: 'user',
 *     content: 'Hello!',
 *   },
 * ];
 *
 * client.sendMessage(messages)
 *   .then(response => {
 *     console.log('Received response:', response);
 *   })
 *   .catch(error => {
 *     console.error('Error:', error);
 *   });
 */
class ChatGPTClient {
  constructor(options = {}) {
    this.apiEndpoint = 'https://api.openai.com/v1/chat/completions';
    this.apiKey = options.apiKey || process.env.OPENAI_API_KEY;
    this.model = options.model || 'gpt-3.5-turbo';
    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
    };
  }

  /**
   * Send a message to the ChatGPT API.
   * 
   * @param {Array} messages - Array of messages comprising the conversation.
   * @param {Object} [additionalParams] - Additional parameters as specified in the API documentation.
   * @returns {Promise<Object>} The response from the ChatGPT API.
   */
  async sendMessage(messages, additionalParams = {}) {
    // Build the request body based on provided messages and additional parameters
    const requestBody = {
      model: this.model,
      messages,
      ...additionalParams,
    };

    try {
      // Send the HTTP POST request to the ChatGPT API endpoint
      const response = await axios.post(this.apiEndpoint, requestBody, {
        headers: this.headers,
      });

      // Return the response object
      return response.data["choices"][0]["message"]["content"];
    } catch (error) {
      console.error('Error communicating with ChatGPT API:', error["response"]["data"]["error"]);
      //throw error;
    }
  }
}

module.exports = {
    ChatGPTClient
}