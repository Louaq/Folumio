// 构建期（Node）内容加密：仅在 .astro frontmatter 中导入，绝不会被打包进客户端产物。
// 密文/IV/盐会随页面下发（这是密文，不是密钥，公开是安全的）；
// 只有输入正确密码、在浏览器端通过 PBKDF2 派生出同一把 AES-GCM 密钥才能解密，
// 因此密码原文与文章正文明文都不会再出现在页面源码里。
import crypto from "node:crypto";

const PBKDF2_ITERATIONS = 250_000;
const SALT_LENGTH = 16;
const IV_LENGTH = 12;
const KEY_LENGTH = 32; // AES-256

interface EncryptedContentPayload {
	cipher: string;
	iv: string;
	salt: string;
	iterations: number;
}

export function encryptContentHtml(
	html: string,
	password: string,
): EncryptedContentPayload {
	const salt = crypto.randomBytes(SALT_LENGTH);
	const iv = crypto.randomBytes(IV_LENGTH);
	const key = crypto.pbkdf2Sync(
		password,
		salt,
		PBKDF2_ITERATIONS,
		KEY_LENGTH,
		"sha256",
	);

	const cipherStream = crypto.createCipheriv("aes-256-gcm", key, iv);
	const encrypted = Buffer.concat([
		cipherStream.update(html, "utf8"),
		cipherStream.final(),
	]);
	// WebCrypto 的 AES-GCM 解密要求认证标签拼接在密文末尾
	const cipherWithTag = Buffer.concat([encrypted, cipherStream.getAuthTag()]);

	return {
		cipher: cipherWithTag.toString("base64"),
		iv: iv.toString("base64"),
		salt: salt.toString("base64"),
		iterations: PBKDF2_ITERATIONS,
	};
}
