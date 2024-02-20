declare namespace NodeJS {
    export interface ProcessEnv {
        [key : string] : string
        TOKEN: string
        CLIENT_ID: string
        GUILD_ID: string
        DB_URL: string
        DB_TOKEN: string
    }
}