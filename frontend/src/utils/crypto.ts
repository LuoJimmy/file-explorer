/**
 * 加密工具
 */

/**
 * 生成随机盐值
 * @param length 盐值长度
 * @returns 随机盐值
 */
export function generateSalt(length: number = 16): string {
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * 生成密钥
 * @param password 密码
 * @param salt 盐值
 * @returns 密钥
 */
export async function deriveKey(
  password: string,
  salt: string
): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey']
  )

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode(salt),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

/**
 * 加密数据
 * @param data 要加密的数据
 * @param key 密钥
 * @returns 加密后的数据
 */
export async function encrypt(
  data: string,
  key: CryptoKey
): Promise<{ iv: string; data: string }> {
  const encoder = new TextEncoder()
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv
    },
    key,
    encoder.encode(data)
  )

  return {
    iv: Array.from(iv)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join(''),
    data: Array.from(new Uint8Array(encrypted))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  }
}

/**
 * 解密数据
 * @param encrypted 加密的数据
 * @param iv 初始化向量
 * @param key 密钥
 * @returns 解密后的数据
 */
export async function decrypt(
  encrypted: string,
  iv: string,
  key: CryptoKey
): Promise<string> {
  const decoder = new TextDecoder()
  const encryptedData = new Uint8Array(
    encrypted.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  )
  const ivData = new Uint8Array(
    iv.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  )

  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: ivData
    },
    key,
    encryptedData
  )

  return decoder.decode(decrypted)
}

/**
 * 生成哈希
 * @param data 要哈希的数据
 * @returns 哈希值
 */
export async function hash(data: string): Promise<string> {
  const encoder = new TextEncoder()
  const hashBuffer = await crypto.subtle.digest(
    'SHA-256',
    encoder.encode(data)
  )
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * 生成 HMAC
 * @param data 要签名的数据
 * @param key 密钥
 * @returns HMAC 值
 */
export async function hmac(
  data: string,
  key: CryptoKey
): Promise<string> {
  const encoder = new TextEncoder()
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(data)
  )
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * 生成密钥对
 * @returns 密钥对
 */
export async function generateKeyPair(): Promise<CryptoKeyPair> {
  return crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256'
    },
    true,
    ['encrypt', 'decrypt']
  )
}

/**
 * 导出公钥
 * @param keyPair 密钥对
 * @returns 公钥
 */
export async function exportPublicKey(
  keyPair: CryptoKeyPair
): Promise<string> {
  const exported = await crypto.subtle.exportKey(
    'spki',
    keyPair.publicKey
  )
  return btoa(String.fromCharCode(...new Uint8Array(exported)))
}

/**
 * 导出私钥
 * @param keyPair 密钥对
 * @returns 私钥
 */
export async function exportPrivateKey(
  keyPair: CryptoKeyPair
): Promise<string> {
  const exported = await crypto.subtle.exportKey(
    'pkcs8',
    keyPair.privateKey
  )
  return btoa(String.fromCharCode(...new Uint8Array(exported)))
}

/**
 * 导入公钥
 * @param key 公钥
 * @returns 公钥对象
 */
export async function importPublicKey(key: string): Promise<CryptoKey> {
  const binary = Uint8Array.from(atob(key), (c) => c.charCodeAt(0))
  return crypto.subtle.importKey(
    'spki',
    binary,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256'
    },
    true,
    ['encrypt']
  )
}

/**
 * 导入私钥
 * @param key 私钥
 * @returns 私钥对象
 */
export async function importPrivateKey(key: string): Promise<CryptoKey> {
  const binary = Uint8Array.from(atob(key), (c) => c.charCodeAt(0))
  return crypto.subtle.importKey(
    'pkcs8',
    binary,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256'
    },
    true,
    ['decrypt']
  )
}

/**
 * 使用公钥加密
 * @param data 要加密的数据
 * @param publicKey 公钥
 * @returns 加密后的数据
 */
export async function encryptWithPublicKey(
  data: string,
  publicKey: CryptoKey
): Promise<string> {
  const encoder = new TextEncoder()
  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'RSA-OAEP'
    },
    publicKey,
    encoder.encode(data)
  )
  return btoa(String.fromCharCode(...new Uint8Array(encrypted)))
}

/**
 * 使用私钥解密
 * @param encrypted 加密的数据
 * @param privateKey 私钥
 * @returns 解密后的数据
 */
export async function decryptWithPrivateKey(
  encrypted: string,
  privateKey: CryptoKey
): Promise<string> {
  const decoder = new TextDecoder()
  const binary = Uint8Array.from(atob(encrypted), (c) => c.charCodeAt(0))
  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'RSA-OAEP'
    },
    privateKey,
    binary
  )
  return decoder.decode(decrypted)
}
