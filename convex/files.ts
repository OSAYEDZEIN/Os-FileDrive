import { ConvexError, v } from "convex/values"
import { mutation, query } from "./_generated/server"

export const createFile = mutation({
    args: {
        name: v.string(),
    },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity()
        
//لازم تسجل عشان تعرف ترفع فايل 
        if (!identity){
            throw new ConvexError("you must be logged in To upload a file");
        }
        await ctx.db.insert("files",{
            name: args.name,
        });
    },
});


export const getFiles = query({
    args: {},
    async handler(ctx, args){
        const identity = await ctx.auth.getUserIdentity()

        if (!identity){
            return[];
        }
        return ctx.db.query('files').collect();
    }
})