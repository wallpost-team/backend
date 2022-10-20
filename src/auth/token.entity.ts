import { Entity, Schema } from "redis-om";

export class RefreshToken extends Entity {
    uuid: string
    token: string
}

export const refreshTokenSchema = new Schema(RefreshToken, {
    uuid: { type: "string" },
    token: { type: "string" },
})