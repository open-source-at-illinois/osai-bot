import { GuildMember } from "discord.js"
import { EXEC_ROLE_ID, UIUC_ROLE_ID } from "./constants"

export const isExec = (member: GuildMember): boolean => {
    if (member.roles.cache.some(role => role.id === EXEC_ROLE_ID)) {
        return true;
    }
    return false;
}

export const isIllini = (member: GuildMember): boolean => {
    if (member.roles.cache.some(role => role.id === UIUC_ROLE_ID)) {
        return true;
    }
    return false;
}