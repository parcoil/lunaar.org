// luna ai goes crazy
class AIChatbot {
  constructor() {
    this.conversationHistory = [];
    this.isProcessing = false;

    this.chatMessages = document.getElementById("chatMessages");
    this.chatForm = document.getElementById("chatForm");
    this.messageInput = document.getElementById("messageInput");
    this.sendButton = document.getElementById("sendButton");
    this.modelSelector = document.getElementById("modelSelector");
    this.selectedModel = this.modelSelector.value;

    this.modelSelector.addEventListener("change", () => {
      this.selectedModel = this.modelSelector.value;
      this.sendSystemMessage(`Switched to model: ${this.selectedModel}`);
    });

    this.setupEventListeners();
    this.scrollToBottom();
    this.messageInput.focus();
  }

  setupEventListeners() {
    this.chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.sendMessage();
    });

    this.messageInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });
  }

  async sendMessage() {
    const message = this.messageInput.value.trim();

    if (!message || this.isProcessing) return;

    this.addMessage(message, "user");
    this.messageInput.value = "";

    this.showTypingIndicator();

    try {
      this.isProcessing = true;
      this.disableInput();

      const response = await this.getAIResponse(message);

      this.hideTypingIndicator();
      this.addMessage(response, "ai");

      this.saveToHistory(message, response);
    } catch (error) {
      console.error("Error sending message:", error);
      this.hideTypingIndicator();
      this.addMessage("Sorry, I encountered an error. Please try again.", "ai");
    } finally {
      this.isProcessing = false;
      this.enableInput();
      this.scrollToBottom();
      this.messageInput.focus();
    }
  }

  async getAIResponse(message) {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message,
          conversationHistory: this.conversationHistory,
          model: this.selectedModel,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || errorData.details || `HTTP ${response.status}`,
        );
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        throw new Error("Network error: Unable to connect to the server");
      }
      throw error;
    }
  }

  addMessage(content, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${sender}-message`;

    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    avatar.innerHTML =
      sender === "user"
        ? '<i class="fas fa-user"></i>'
        : '<i class="fas fa-robot"></i>';

    const messageContent = document.createElement("div");
    messageContent.className = "message-content";
    messageContent.innerHTML = this.formatMessage(content);

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);
    this.chatMessages.appendChild(messageDiv);

    this.scrollToBottom();
  }

  sendSystemMessage(text) {
    // this.addMessage("Luna", text, true);
    this.chatMessages.innerHTML += `
      <div class="message ai-message">
        <div class="message-avatar">
          <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
          <p>${text}</p>
        </div>
      </div>
    `;
  }

  formatMessage(content) {
    return content
      .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br>");
  }

  showTypingIndicator() {
    const typingDiv = document.createElement("div");
    typingDiv.className = "message ai-message typing-indicator";
    typingDiv.id = "typingIndicator";

    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    avatar.innerHTML = '<i class="fas fa-robot"></i>';

    const content = document.createElement("div");
    content.className = "message-content";
    content.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <span>AI is typing</span>
        <div class="typing-dots">
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
          <div class="typing-dot"></div>
        </div>
      </div>
    `;

    typingDiv.appendChild(avatar);
    typingDiv.appendChild(content);
    this.chatMessages.appendChild(typingDiv);
    this.scrollToBottom();
  }

  hideTypingIndicator() {
    const typingIndicator = document.getElementById("typingIndicator");
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  saveToHistory(userMessage, aiResponse) {
    this.conversationHistory.push(
      { role: "user", content: userMessage },
      { role: "assistant", content: aiResponse },
    );

    if (this.conversationHistory.length > 20) {
      this.conversationHistory = this.conversationHistory.slice(-20);
    }
  }

  disableInput() {
    this.messageInput.disabled = true;
    this.sendButton.disabled = true;
  }

  enableInput() {
    this.messageInput.disabled = false;
    this.sendButton.disabled = false;
  }

  scrollToBottom() {
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  }

  clearChat() {
    this.conversationHistory = [];
    this.chatMessages.innerHTML = `
      <div class="message ai-message">
        <div class="message-avatar">
          <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
          <p>Chat history cleared. How can I help you today?</p>
        </div>
      </div>
    `;
    this.scrollToBottom();
    this.messageInput.focus();
  }
  async checkAIStatusWithToast() {
    try {
      const res = await fetch("/api/ai-status");
      let isOnline = false;

      if (res.ok) {
        const data = await res.json();
        isOnline = data.online === true;
      }

      Toastify({
        text: isOnline
          ? "Luna AI is online"
          : "⚠️ Luna AI is offline or API key missing Join our discord for help",
        duration: 4000,
        gravity: "top",
        position: "right",
        style: {
          background: isOnline ? "green" : "#e74c3c",
          borderRadius: "var(--border-radius)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        },
      }).showToast();

      return isOnline;
    } catch (err) {
      console.error("AI status check failed:", err);

      Toastify({
        text: "⚠️ Luna AI status check failed",
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
          background: "#e74c3c",
          borderRadius: "var(--border-radius)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        },
      }).showToast();

      return false;
    }
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  window.aiChatbot = new AIChatbot();

  const isOnline = await window.aiChatbot.checkAIStatusWithToast();
});

document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    e.preventDefault();
    const sendButton = document.getElementById("sendButton");
    if (sendButton && !sendButton.disabled) {
      sendButton.click();
    }
  }

  if (e.key === "Escape") {
    const messageInput = document.getElementById("messageInput");
    if (messageInput) {
      messageInput.value = "";
    }
  }
});
