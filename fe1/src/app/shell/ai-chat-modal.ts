/**
 * @module shell/ai-chat-modal
 * AI Chat Modal — center-center glassmorphic overlay.
 * Mounts a shared ChatWidget inside a modal dialog.
 * Same markup pattern as ai.html, uses Alpine.js for reactive state.
 */

const MODAL_ID = 'ai-modal';
const BACKDROP_ID = 'ai-modal-backdrop';

// ── Init ──────────────────────────

/** Create backdrop + modal DOM elements (called once from initShell) */
export function initAiChatModal(): void {
  if (document.getElementById(BACKDROP_ID)) return;

  const backdrop = document.createElement('div');
  backdrop.id = BACKDROP_ID;
  document.body.appendChild(backdrop);

  const modal = document.createElement('div');
  modal.id = MODAL_ID;
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', 'AI Asistan');
  modal.innerHTML = buildChatMarkup();
  backdrop.appendChild(modal);

  // Backdrop click → close (only if clicking backdrop itself)
  backdrop.addEventListener('click', (e: MouseEvent) => {
    if (e.target === backdrop) closeAiModal();
  });
}

// ── Toggle / Open / Close ──────────────────────────

export function toggleAiModal(): void {
  const bd = document.getElementById(BACKDROP_ID);
  if (!bd) return;
  if (bd.classList.contains('open')) {
    closeAiModal();
  } else {
    openAiModal();
  }
}

function openAiModal(): void {
  const bd = document.getElementById(BACKDROP_ID);
  if (!bd) return;
  bd.classList.add('open');
  // Focus input after animation
  setTimeout(() => {
    (bd.querySelector('.ai-chat-input') as HTMLInputElement | null)?.focus();
  }, 120);
}

export function closeAiModal(): void {
  document.getElementById(BACKDROP_ID)?.classList.remove('open');
}

// ── Chat Markup Builder ──────────────────────────

function buildChatMarkup(): string {
  return `<div class="ai-modal-header">` +
    `<div style="display:flex;align-items:center;gap:0.5rem">` +
    `<i class="ph ph-robot" style="font-size:1.25rem;color:var(--accent)"></i>` +
    `<span style="font-weight:600;color:var(--text);font-size:0.875rem">AI Asistan</span>` +
    `</div>` +
    `<button class="ai-modal-close" onclick="closeAiModal()" title="Kapat" aria-label="Kapat">` +
    `<i class="ph ph-x"></i></button>` +
    `</div>` +
    `<div class="ai-modal-body" x-data="{` +
    `  input: '',` +
    `  typing: false,` +
    `  messages: [],` +
    `  send() {` +
    `    if (!this.input.trim()) return;` +
    `    this.messages.push({ role: 'user', text: this.input });` +
    `    this.input = '';` +
    `    this.typing = true;` +
    `    this.$nextTick(() => { this.$refs.msgArea?.scrollTo(0, this.$refs.msgArea.scrollHeight); });` +
    `    setTimeout(() => {` +
    `      this.messages.push({ role: 'ai', text: 'Bu bir mock yanittir. Backend entegrasyonu sonra yapilacak.' });` +
    `      this.typing = false;` +
    `      this.$nextTick(() => { this.$refs.msgArea?.scrollTo(0, this.$refs.msgArea.scrollHeight); });` +
    `    }, 1500);` +
    `  }` +
    `}">` +
    `<div class="ai-modal-messages" x-ref="msgArea">` +
    `<div class="ai-empty" x-show="messages.length === 0 && !typing">` +
    `<i class="ph ph-chats-circle" style="font-size:2rem;color:var(--muted);margin-bottom:0.5rem"></i>` +
    `<span style="color:var(--muted);font-size:0.8125rem">Bir soru sorarak baslayabilirsiniz</span>` +
    `</div>` +
    `<template x-for="(msg, i) in messages" :key="i">` +
    `<div :class="msg.role === 'user' ? 'ai-msg ai-msg-user' : 'ai-msg ai-msg-ai'">` +
    `<i x-show="msg.role === 'ai'" class="ph ph-robot ai-msg-icon"></i>` +
    `<span x-text="msg.text"></span>` +
    `</div>` +
    `</template>` +
    `<div x-show="typing" class="ai-msg ai-msg-ai">` +
    `<i class="ph ph-robot ai-msg-icon"></i>` +
    `<span class="ai-typing"><span class="ai-dot"></span><span class="ai-dot"></span><span class="ai-dot"></span></span>` +
    `</div>` +
    `</div>` +
    `<div class="ai-modal-input-row">` +
    `<input class="ai-chat-input" type="text" placeholder="Bir soru sorun..."` +
    ` x-model="input" @keydown.enter="send()">` +
    `<button class="ai-send-btn" @click="send()" :disabled="typing" aria-label="Gonder">` +
    `<i class="ph-fill ph-paper-plane-tilt"></i>` +
    `</button>` +
    `</div>` +
    `</div>`;
}
