<template>
  <div class="chat-container">
    <!-- 标题和功能按钮 -->
    <div class="chat-header">
      <h1>AI助手</h1>
      <div class="header-buttons">
        <button @click="showMCPManager" class="header-btn mcp-btn" title="MCP服务器管理">
          ⚙️ MCP
        </button>
        <button @click="showHistory" class="header-btn history-btn" title="查看历史记录">
          📜 历史
        </button>
        <button @click="clearConversation" class="header-btn clear-btn" title="清除对话历史">
          🗑️ 清除
        </button>
      </div>
    </div>

    <!-- 对话框 -->
    <div class="chat-box" ref="chatBox">
      <div v-for="(msg, index) in messages" :key="index" :class="['chat-msg', msg.role]">
        <div class="bubble">
          <span class="role-label">{{ msg.role === 'user' ? '🧑‍💻 我' : '🤖 模型' }}</span>
          <div class="text">{{ msg.text }}</div>
        </div>
      </div>
      <!-- 模型思考loading -->
      <div v-if="loading" class="chat-msg bot">
        <div class="bubble">
          <span class="role-label">🤖 模型</span>
          <div class="text">
            正在思考<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 问题输入框 -->
    <form class="input-area" @submit.prevent="handleSubmit">
      <input v-model="input" type="text" placeholder="请输入您的问题..." />
      <button type="submit" :disabled="loading">发送</button>
    </form>

    <!-- MCP管理模态框 -->
    <div v-if="showMCPModal" class="modal-overlay" @click="closeMCPManager">
      <div class="modal-content mcp-modal" @click.stop>
        <div class="modal-header">
          <h3>MCP服务器管理</h3>
          <button @click="closeMCPManager" class="close-btn">✖️</button>
        </div>
        <div class="modal-body">
          <div class="mcp-section">
            <div class="section-header">
              <h4>服务器状态</h4>
              <button @click="refreshMCPStatus" class="refresh-btn" :disabled="mcpLoading">
                {{ mcpLoading ? '🔄 刷新中...' : '🔄 刷新' }}
              </button>
            </div>
            <div v-if="mcpStatus" class="server-list">
              <div v-for="(server, name) in mcpStatus.servers" :key="name" class="server-item">
                <div class="server-name">{{ name }}</div>
                <div class="server-status" :class="{ connected: server.connected }">
                  {{ server.connected ? '🟢 已连接' : '🔴 未连接' }}
                </div>
              </div>
            </div>
            <div v-else class="loading">加载服务器状态中...</div>
          </div>

          <div class="mcp-section">
            <div class="section-header">
              <h4>可用工具</h4>
              <button @click="refreshMCPTools" class="refresh-btn" :disabled="mcpLoading">
                {{ mcpLoading ? '🔄 刷新中...' : '🔄 刷新' }}
              </button>
            </div>
            <div v-if="mcpTools" class="tools-list">
              <div v-for="(tools, serverName) in mcpTools.tools_by_server" :key="serverName" class="server-tools">
                <div class="server-tools-header">{{ serverName }}</div>
                <div v-for="tool in tools" :key="tool.function.name" class="tool-item">
                  <div class="tool-name">{{ tool.function.name }}</div>
                  <div class="tool-description">{{ tool.function.description }}</div>
                </div>
              </div>
            </div>
            <div v-else class="loading">加载工具列表中...</div>
          </div>

          <div class="mcp-section">
            <div class="section-header">
              <h4>配置管理</h4>
            </div>
            <div class="config-actions">
              <button @click="reloadMCPConfig" class="action-btn reload-btn" :disabled="mcpLoading">
                {{ mcpLoading ? '🔄 重新加载中...' : '🔄 重新加载配置' }}
              </button>
              <div class="config-info">
                <small>重新加载MCP配置文件并重新连接所有服务器</small>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeMCPManager" class="modal-btn">关闭</button>
        </div>
      </div>
    </div>

    <!-- 历史记录模态框 -->
    <div v-if="showHistoryModal" class="modal-overlay" @click="closeHistory">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>对话历史记录</h3>
          <button @click="closeHistory" class="close-btn">✖️</button>
        </div>
        <div class="modal-body">
          <div v-if="historyData.length === 0" class="no-history">
            暂无对话历史记录
          </div>
          <div v-else class="history-list">
            <div v-for="(msg, index) in historyData" :key="index" :class="['history-msg', msg.role]">
              <div class="history-bubble">
                <span class="role-label">{{ msg.role === 'user' ? '🧑‍💻 我' : '🤖 模型' }}</span>
                <div class="text">{{ msg.content }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeHistory" class="modal-btn">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick, reactive } from 'vue'

const input = ref('')
const messages = ref<{ role: 'user' | 'bot'; text: string }[]>([])
const chatBox = ref<HTMLElement | null>(null)
const loading = ref(false)
const showHistoryModal = ref(false)
const historyData = ref<{ role: string; content: string }[]>([])

// MCP 管理相关状态
const showMCPModal = ref(false)
const mcpLoading = ref(false)
const mcpStatus = ref<any>(null)
const mcpTools = ref<any>(null)

async function handleSubmit() {
  const question = input.value.trim()
  if (!question) return

  messages.value.push({ role: 'user', text: question })
  input.value = ''
  loading.value = true

  await nextTick()
  chatBox.value?.scrollTo({ top: chatBox.value.scrollHeight, behavior: 'smooth' })

  const res = await fetch('/api/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question }),
  })

  const reader = res.body?.getReader()
  if (!reader) {
    console.error('响应流为空')
    loading.value = false
    return
  }

  const decoder = new TextDecoder('utf-8')
  let botMessage = ''
  const newMessage = reactive({ role: 'bot' as const, text: '' })
  messages.value.push(newMessage)

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value, { stream: true })
    const lines = chunk.split('\n').filter((line) => line.trim())

    for (const line of lines) {
      try {
        const data = JSON.parse(line)
        if (data.response) {
          if (loading.value) {
            loading.value = false // ⬅️ 一收到响应就隐藏"正在思考"
          }
          botMessage += data.response
          newMessage.text = botMessage
        }
      } catch (err) {
        console.error('解析失败', line, err)
      }
    }

    await nextTick()
    chatBox.value?.scrollTo({ top: chatBox.value.scrollHeight, behavior: 'smooth' })
  }
}

// 清除对话历史
async function clearConversation() {
  if (!confirm('确定要清除所有对话历史吗？此操作不可撤销。')) {
    return
  }

  try {
    const response = await fetch('/api/clear', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })

    if (response.ok) {
      // 清除本地消息
      messages.value = []
      alert('对话历史已成功清除！')
    } else {
      alert('清除失败，请稍后重试')
    }
  } catch (error) {
    console.error('清除对话历史失败:', error)
    alert('清除失败，请检查网络连接')
  }
}

// 查看历史记录
async function showHistory() {
  try {
    const response = await fetch('/api/history')

    if (response.ok) {
      const data = await response.json()
      historyData.value = data.conversations || []
      showHistoryModal.value = true
    } else {
      alert('获取历史记录失败，请稍后重试')
    }
  } catch (error) {
    console.error('获取历史记录失败:', error)
    alert('获取历史记录失败，请检查网络连接')
  }
}

// 关闭历史记录模态框
function closeHistory() {
  showHistoryModal.value = false
}

// MCP 管理相关函数
async function showMCPManager() {
  showMCPModal.value = true
  await Promise.all([
    refreshMCPStatus(),
    refreshMCPTools()
  ])
}

function closeMCPManager() {
  showMCPModal.value = false
}

async function refreshMCPStatus() {
  try {
    mcpLoading.value = true
    const response = await fetch('/api/mcp/status')
    if (response.ok) {
      mcpStatus.value = await response.json()
    } else {
      console.error('获取MCP状态失败')
    }
  } catch (error) {
    console.error('获取MCP状态失败:', error)
  } finally {
    mcpLoading.value = false
  }
}

async function refreshMCPTools() {
  try {
    mcpLoading.value = true
    const response = await fetch('/api/mcp/tools')
    if (response.ok) {
      mcpTools.value = await response.json()
    } else {
      console.error('获取MCP工具失败')
    }
  } catch (error) {
    console.error('获取MCP工具失败:', error)
  } finally {
    mcpLoading.value = false
  }
}

async function reloadMCPConfig() {
  try {
    mcpLoading.value = true
    const response = await fetch('/api/mcp/reload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })

    if (response.ok) {
      const data = await response.json()
      alert('MCP配置重新加载成功！')
      // 重新获取状态和工具列表
      await Promise.all([
        refreshMCPStatus(),
        refreshMCPTools()
      ])
    } else {
      alert('MCP配置重新加载失败')
    }
  } catch (error) {
    console.error('重新加载MCP配置失败:', error)
    alert('重新加载失败，请检查网络连接')
  } finally {
    mcpLoading.value = false
  }
}
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  background: #ffffff;
  border-left: 1px solid #eee;
  border-right: 1px solid #eee;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #ddd;
  background: #f7f7f7;
}

.chat-header h1 {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
}

.header-buttons {
  display: flex;
  gap: 10px;
}

.header-btn {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.history-btn {
  background-color: #17a2b8;
  color: white;
}

.history-btn:hover {
  background-color: #138496;
}

.clear-btn {
  background-color: #dc3545;
  color: white;
}

.clear-btn:hover {
  background-color: #c82333;
}

.mcp-btn {
  background-color: #28a745;
  color: white;
}

.mcp-btn:hover {
  background-color: #218838;
}

.chat-box {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.chat-msg {
  display: flex;
  margin-bottom: 12px;
}

.chat-msg.user {
  justify-content: flex-end;
}

.chat-msg.bot {
  justify-content: flex-start;
}

.bubble {
  max-width: 70%;
  padding: 10px 14px;
  border-radius: 18px;
  line-height: 1.4;
  position: relative;
}

.chat-msg.user .bubble {
  background: #daf1ff;
  color: #333;
  border-bottom-right-radius: 4px;
}

.chat-msg.bot .bubble {
  background: #e6e6e6;
  color: #222;
  border-bottom-left-radius: 4px;
}

.role-label {
  font-size: 12px;
  color: #666;
  display: block;
  margin-bottom: 4px;
}

.input-area {
  display: flex;
  padding: 12px;
  border-top: 1px solid #ddd;
  background: #fff;
}

.input-area input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #ccc;
  border-radius: 20px;
  font-size: 16px;
  outline: none;
}

.input-area button {
  margin-left: 10px;
  padding: 10px 18px;
  font-size: 16px;
  border: none;
  border-radius: 20px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.input-area button:hover {
  background-color: #0056b3;
}

.input-area button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 80%;
  max-width: 600px;
  max-height: 80%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #666;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.no-history {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 40px 0;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.history-msg {
  display: flex;
}

.history-msg.user {
  justify-content: flex-end;
}

.history-msg.assistant {
  justify-content: flex-start;
}

.history-bubble {
  max-width: 80%;
  padding: 8px 12px;
  border-radius: 12px;
  line-height: 1.4;
}

.history-msg.user .history-bubble {
  background: #daf1ff;
  color: #333;
}

.history-msg.assistant .history-bubble {
  background: #e6e6e6;
  color: #222;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #eee;
  text-align: right;
}

.modal-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #6c757d;
  color: white;
  cursor: pointer;
}

.modal-btn:hover {
  background-color: #5a6268;
}

/* MCP管理模态框专用样式 */
.mcp-modal {
  max-width: 800px;
  max-height: 90%;
}

.mcp-section {
  margin-bottom: 24px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
  background-color: #f8f9fa;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h4 {
  margin: 0;
  color: #495057;
  font-size: 16px;
}

.refresh-btn {
  padding: 6px 12px;
  border: 1px solid #6c757d;
  border-radius: 4px;
  background-color: white;
  color: #6c757d;
  cursor: pointer;
  font-size: 12px;
}

.refresh-btn:hover:not(:disabled) {
  background-color: #6c757d;
  color: white;
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.server-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.server-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: white;
  border: 1px solid #dee2e6;
  border-radius: 4px;
}

.server-name {
  font-weight: 500;
  color: #495057;
}

.server-status {
  color: #dc3545;
  font-size: 14px;
}

.server-status.connected {
  color: #28a745;
}

.tools-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.server-tools {
  background-color: white;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 12px;
}

.server-tools-header {
  font-weight: 600;
  color: #495057;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e9ecef;
}

.tool-item {
  padding: 8px 0;
  border-bottom: 1px solid #f1f3f5;
}

.tool-item:last-child {
  border-bottom: none;
}

.tool-name {
  font-weight: 500;
  color: #495057;
  margin-bottom: 4px;
}

.tool-description {
  color: #6c757d;
  font-size: 14px;
  line-height: 1.4;
}

.config-actions {
  text-align: center;
}

.action-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 8px;
}

.reload-btn {
  background-color: #007bff;
  color: white;
}

.reload-btn:hover:not(:disabled) {
  background-color: #0056b3;
}

.reload-btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.config-info {
  color: #6c757d;
  font-size: 12px;
}

.loading {
  text-align: center;
  color: #6c757d;
  font-style: italic;
  padding: 20px 0;
}

.dot {
  animation: blink 1s infinite;
}
.dot:nth-child(2) {
  animation-delay: 0.2s;
}
.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes blink {
  0%,
  80%,
  100% {
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
}
</style>
