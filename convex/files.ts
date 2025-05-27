import { ConvexError, v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { getUser } from "./users"
import { error } from "console";

export const createFile = mutation({
    args: {
        name: v.string(),
        orgId: v.string(),
    },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity()
 
        if (!identity){
            throw new ConvexError("you must be logged in To upload a file");
        }
        const user = await getUser(ctx, identity.tokenIdentifier)

        if (!user.orgIds.includes(args.orgId)&& user.tokenIdentifier !== identity.tokenIdentifier)
            throw new ConvexError("you do not have access to this organization")
        
        await ctx.db.insert("files",{
            name: args.name,
            orgId: args.orgId,
        });
    },
});


export const getFiles = query({
    args: {
        orgId: v.string()
    },
    async handler(ctx, args){
        const identity = await ctx.auth.getUserIdentity()

        if (!identity){
            return[];
        }
        return ctx.db
        .query('files')
        .withIndex('by_orgId', q =>q.eq('orgId', args.orgId))    
        .collect();
    }
})