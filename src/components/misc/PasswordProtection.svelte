<script lang="ts">
import { onDestroy, onMount } from "svelte";

export let postId: string;

let inputPassword = "";
let errorMessage = "";
let isUnlocked = false;
let isShaking = false;
let isFrozen = false;
let remainingTime = 0;
let countdownInterval: number | null = null;

const MAX_ATTEMPTS = 3; // 最大尝试次数
const BASE_FREEZE_TIME = 5 * 60 * 1000; // 基础冻结时间：5分钟（毫秒）
const STORAGE_KEY = `password_freeze_${postId}`;

function getFreezeState() {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			return JSON.parse(stored);
		}
	} catch (e) {
		// 忽略解析错误
	}
	return { attempts: 0, freezeCount: 0, freezeUntil: 0 };
}

function saveFreezeState(state: {
	attempts: number;
	freezeCount: number;
	freezeUntil: number;
}) {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	} catch (e) {
		// 忽略存储错误
	}
}

function checkFrozen() {
	const state = getFreezeState();
	const now = Date.now();

	if (state.freezeUntil > now) {
		isFrozen = true;
		remainingTime = Math.ceil((state.freezeUntil - now) / 1000);
		startCountdown();
		return true;
	}
	if (state.freezeUntil > 0) {
		// 冻结时间已过，重置尝试次数，但保留冻结计数
		state.attempts = 0;
		state.freezeUntil = 0;
		saveFreezeState(state);
	}

	isFrozen = false;
	return false;
}

function startCountdown() {
	if (countdownInterval) {
		clearInterval(countdownInterval);
	}

	countdownInterval = window.setInterval(() => {
		if (remainingTime > 0) {
			remainingTime--;
			updateErrorMessage();
		} else {
			isFrozen = false;
			errorMessage = "";
			if (countdownInterval) {
				clearInterval(countdownInterval);
				countdownInterval = null;
			}
		}
	}, 1000);
}

function updateErrorMessage() {
	if (isFrozen && remainingTime > 0) {
		const minutes = Math.floor(remainingTime / 60);
		const seconds = remainingTime % 60;
		errorMessage = `输入错误次数过多，请等待 ${minutes}分${seconds}秒 后重试`;
	}
}

function formatTime(seconds: number): string {
	const minutes = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${minutes}分${secs}秒`;
}

function base64ToBytes(base64: string): Uint8Array {
	const binary = atob(base64);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) {
		bytes[i] = binary.charCodeAt(i);
	}
	return bytes;
}

// 用输入的密码尝试解密正文；密码错误时 AES-GCM 认证标签校验会失败并抛出异常
async function decryptProtectedContent(
	candidatePassword: string,
): Promise<string | null> {
	const el = document.getElementById("protected-content");
	if (!el) return null;

	const { cipher, iv, salt, iterations } = el.dataset;
	if (!cipher || !iv || !salt || !iterations) return null;

	const keyMaterial = await crypto.subtle.importKey(
		"raw",
		new TextEncoder().encode(candidatePassword),
		"PBKDF2",
		false,
		["deriveKey"],
	);
	const key = await crypto.subtle.deriveKey(
		{
			name: "PBKDF2",
			salt: base64ToBytes(salt),
			iterations: Number(iterations),
			hash: "SHA-256",
		},
		keyMaterial,
		{ name: "AES-GCM", length: 256 },
		false,
		["decrypt"],
	);

	const plainBuffer = await crypto.subtle.decrypt(
		{ name: "AES-GCM", iv: base64ToBytes(iv) },
		key,
		base64ToBytes(cipher),
	);

	return new TextDecoder().decode(plainBuffer);
}

// 通过 innerHTML 注入的 <script> 不会自动执行（浏览器安全限制），
// 需要手动替换为新节点才能让正文里的脚本（表格滚动包裹等）生效
function reviveScripts(container: HTMLElement) {
	for (const oldScript of Array.from(container.querySelectorAll("script"))) {
		const newScript = document.createElement("script");
		for (const attr of Array.from(oldScript.attributes)) {
			newScript.setAttribute(attr.name, attr.value);
		}
		newScript.textContent = oldScript.textContent;
		oldScript.replaceWith(newScript);
	}
}

async function verifyPassword() {
	if (checkFrozen()) {
		updateErrorMessage();
		isShaking = true;
		setTimeout(() => {
			isShaking = false;
		}, 500);
		return;
	}

	let decryptedHtml: string | null = null;
	try {
		decryptedHtml = await decryptProtectedContent(inputPassword);
	} catch (e) {
		decryptedHtml = null;
	}

	if (decryptedHtml !== null) {
		localStorage.removeItem(STORAGE_KEY);
		errorMessage = "";
		isUnlocked = true;

		const el = document.getElementById("protected-content");
		if (el) {
			el.innerHTML = decryptedHtml;
			reviveScripts(el);
			el.style.display = "block";
		}

		// 正文是解锁后才注入 DOM 的，需要重新触发依赖 astro:page-load 的
		// 初始化逻辑（表格滚动包裹、TOC、代码块复制按钮等）
		document.dispatchEvent(new Event("astro:page-load"));
	} else {
		const state = getFreezeState();
		state.attempts++;

		if (state.attempts >= MAX_ATTEMPTS) {
			state.freezeCount++;
			const freezeDuration = BASE_FREEZE_TIME * state.freezeCount;
			state.freezeUntil = Date.now() + freezeDuration;
			state.attempts = 0; // 重置尝试次数

			saveFreezeState(state);

			isFrozen = true;
			remainingTime = Math.ceil(freezeDuration / 1000);
			updateErrorMessage();
			startCountdown();
		} else {
			const remainingAttempts = MAX_ATTEMPTS - state.attempts;
			errorMessage = `密码错误，还剩 ${remainingAttempts} 次尝试机会`;
			saveFreezeState(state);
		}

		isShaking = true;

		inputPassword = "";

		setTimeout(() => {
			isShaking = false;
		}, 500);
	}
}

function handleKeyPress(event: KeyboardEvent) {
	if (event.key === "Enter" && !isFrozen) {
		verifyPassword();
	}
}

onMount(() => {
	checkFrozen();
});

onDestroy(() => {
	if (countdownInterval) {
		clearInterval(countdownInterval);
	}
});
</script>

{#if !isUnlocked}
<div class="password-protection-container">
  <div class="password-protection-card" class:shake={isShaking}>
    <div class="password-icon">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
    </div>

    <h2 class="password-title">请输入密码查看内容</h2>

    <div class="password-input-group">
      <input
        type="password"
        bind:value={inputPassword}
        on:keypress={handleKeyPress}
        placeholder="文章密码"
        class="password-input"
        class:disabled={isFrozen}
        autocomplete="off"
        disabled={isFrozen}
      />
      <button
        class="password-button"
        class:disabled={isFrozen}
        on:click={verifyPassword}
        disabled={isFrozen}
      >
        {isFrozen ? '已冻结' : '确定'}
      </button>
    </div>

    {#if errorMessage}
      <div class="error-message">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span>{errorMessage}</span>
      </div>
    {/if}
  </div>
</div>
{/if}

<style>
  .password-protection-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
    padding: 2rem 1rem;
  }
  
  .password-protection-card {
    background: transparent;
    border-radius: var(--radius-large);
    padding: 2.5rem 1.5rem;
    max-width: 360px;
    width: 100%;
    text-align: center;
  }

  .password-protection-card.shake {
    animation: shake 0.5s;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }

  .password-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    margin: 0 auto 1.25rem;
    border-radius: 50%;
    border: 1.5px solid var(--line-divider, #e5e5e5);
    color: var(--text-primary, #1a1a1a);
  }

  :global(.dark) .password-icon {
    border-color: var(--line-divider, #404040);
    color: var(--text-primary, #f5f5f5);
  }

  .password-title {
    font-size: 1.0625rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: var(--text-primary, #1a1a1a);
  }

  :global(.dark) .password-title {
    color: var(--text-primary, #f5f5f5);
  }

  .password-input-group {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-bottom: 0.75rem;
  }

  .password-input {
    width: 100%;
    padding: 0.5rem 0.25rem;
    border: none;
    border-bottom: 1.5px solid var(--line-divider, #e5e5e5);
    border-radius: 0;
    font-size: 0.875rem;
    text-align: center;
    background: transparent;
    color: var(--text-primary, #1a1a1a);
    outline: none;
  }

  .password-input:focus {
    border-color: var(--primary);
  }

  .password-input:disabled,
  .password-input.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  :global(.dark) .password-input {
    color: var(--text-primary, #f5f5f5);
    border-color: var(--line-divider, #404040);
  }

  .password-button {
    width: 100%;
    padding: 0.625rem 1.25rem;
    background: #1a1a1a;
    color: #fff;
    border: none;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    /* 只过渡交互反馈属性，颜色属性随主题即时翻转 */
    transition: opacity 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
  }

  .password-button:hover {
    opacity: 0.85;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  .password-button:active {
    transform: translateY(0);
  }

  .password-button:disabled,
  .password-button.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  .password-button:disabled:hover,
  .password-button.disabled:hover {
    opacity: 0.5;
    transform: none;
    box-shadow: none;
  }

  :global(.dark) .password-button {
    background: #f5f5f5;
    color: #1a1a1a;
  }

  .error-message {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    color: #ef4444;
    font-size: 0.8125rem;
    padding: 0.75rem 1rem;
    background: rgba(239, 68, 68, 0.1);
    border-radius: var(--radius-small, 0.375rem);
    animation: fadeIn 0.3s ease;
    font-weight: 500;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @media (max-width: 640px) {
    .password-protection-card {
      padding: 1.5rem 1.25rem;
    }
    
    .password-title {
      font-size: 1.125rem;
    }
  }
</style>

