const API_BASE_URL = 'http://localhost:8084';

export interface ChatbotMessage {
  message: string;
}

export interface ChatbotResponse {
  response: string;
  status: 'success' | 'error';
}

class ChatbotService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log(`Making chatbot API request to: ${API_BASE_URL}${endpoint}`);
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      console.log(`Chatbot response status: ${response.status}`);
      
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.response || errorMessage;
        } catch (jsonError) {
          try {
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
          } catch (textError) {
            // Keep the default error message
          }
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Chatbot API response data:', data);
      return data;
    } catch (error) {
      console.error('Chatbot API request failed:', error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error(`Network error: Unable to connect to the chatbot service. Please check if the service is running on ${API_BASE_URL}`);
      }
      throw error;
    }
  }

  /**
   * Send a message to the chatbot
   */
  async sendMessage(message: string): Promise<ChatbotResponse> {
    return this.request<ChatbotResponse>('/api/chatbot/message', {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  /**
   * Check if the chatbot service is available
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chatbot/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch (error) {
      console.error('Chatbot health check failed:', error);
      return false;
    }
  }
}

export const chatbotService = new ChatbotService();
