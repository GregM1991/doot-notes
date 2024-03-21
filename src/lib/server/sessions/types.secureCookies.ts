import type { CookieParseOptions, CookieSerializeOptions } from 'cookie'

interface SessionData {
	[name: string]: any
}
export type CookieOptions = CookieParseOptions &
	CookieSerializeOptions & { secrets?: string[]; name?: string }

export type CreateCookieSessionStorageFunction = <
	Data = SessionData,
	FlashData = Data,
>(
	cookie: CookieOptions,
) => SessionStorage<Data, FlashData>

interface SessionStorage<Data = SessionData, FlashData = Data> {
	getSession: (
		getCookie: GetCookie,
		options?: CookieParseOptions,
	) => Promise<Session<Data, FlashData>>
	commitSession: (
		session: Session<Data, FlashData>,
		options?: CookieSerializeOptions,
	) => Promise<string>
	destroySession: (
		session: Session<Data, FlashData>,
		options?: CookieSerializeOptions,
	) => Promise<string>
}

interface Session<Data = SessionData, FlashData = Data> {
	readonly id: string
	readonly data: FlashSessionData<Data, FlashData>
	has(name: (keyof Data | keyof FlashData) & string): boolean
	get<Key extends (keyof Data | keyof FlashData) & string>(
		name: Key,
	):
		| (Key extends keyof Data ? Data[Key] : undefined)
		| (Key extends keyof FlashData ? FlashData[Key] : undefined)
		| undefined
	set<Key extends keyof Data & string>(name: Key, value: Data[Key]): void
	flash<Key extends keyof Data & string>(name: Key, value: Data[Key]): void
	unset(name: keyof Data & string): void
}

type FlashSessionData<Data, FlashData> = Partial<
	Data & {
		[Key in keyof FlashData as FlashDataKey<Key & string>]: FlashData[Key]
	}
>
type FlashDataKey<Key extends string> = `__flash_${Key}__`

export type GetCookie = (
	name: string,
	opts?: CookieParseOptions,
) => string | undefined
