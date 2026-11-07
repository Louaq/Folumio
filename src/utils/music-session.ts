let sessionExpiresAt = 0;
let pendingSession: Promise<void> | null = null;

export async function solveMusicChallenge(
	challenge: string,
	difficulty: number,
): Promise<number> {
	const encoder = new TextEncoder();
	for (let nonce = 0; ; nonce++) {
		const digest = new Uint8Array(
			await crypto.subtle.digest(
				"SHA-256",
				encoder.encode(`${challenge}:${nonce}`),
			),
		);
		let bits = 0;
		for (const byte of digest) {
			if (byte === 0) bits += 8;
			else {
				bits += Math.clz32(byte) - 24;
				break;
			}
		}
		if (bits >= difficulty) return nonce;
	}
}

async function createSession(): Promise<void> {
	const challengeResponse = await fetch("/ncm/token", {
		credentials: "same-origin",
		cache: "no-store",
	});
	if (!challengeResponse.ok)
		throw new Error(`音乐认证失败 (${challengeResponse.status})`);
	const { challenge, difficulty } = await challengeResponse.json();
	const nonce = await solveMusicChallenge(challenge, difficulty);
	const response = await fetch("/ncm/token", {
		method: "POST",
		credentials: "same-origin",
		cache: "no-store",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ nonce }),
	});
	if (!response.ok) throw new Error(`音乐认证失败 (${response.status})`);
	const { ttl } = await response.json();
	sessionExpiresAt = Date.now() + (ttl - 30) * 1000;
}

export function ensureMusicSession(): Promise<void> {
	if (Date.now() < sessionExpiresAt) return Promise.resolve();
	if (!pendingSession)
		pendingSession = createSession().finally(() => {
			pendingSession = null;
		});
	return pendingSession;
}

export function renewMusicSession(): Promise<void> {
	sessionExpiresAt = 0;
	return ensureMusicSession();
}
