import { ConvexError, v } from "convex/values"
import { mutation, query, QueryCtx, MutationCtx } from "./_generated/server"
import { getUser } from "./users"
import { error } from "console";
// import { hasAccessToOrg } from "./hasAccessToOrg";

export const generateUploadUrl = mutation (async(ctx)=>{
        const identity = await ctx.auth.getUserIdentity()
        console.log("IDENTITY:", identity)
 
        if (!identity){
            throw new ConvexError("you must be logged in To upload a file");
        }
      return await ctx.storage.generateUploadUrl();
    });

export const createFile = mutation({
    args: {
        name: v.string(),
        fileId: v.id("_storage"),
        orgId: v.string(),
    },
    async handler(ctx, args) {
        const identity = await ctx.auth.getUserIdentity()
        console.log("IDENTITY:", identity)
 
        if (!identity){
            throw new ConvexError("you must be logged in To upload a file");
        }
        const user = await getUser(ctx, identity.tokenIdentifier);

        if (!(user.orgIds ?? []).includes(args.orgId) && user.tokenIdentifier !== identity.tokenIdentifier)
            throw new ConvexError("you do not have access to this organization")
        
        await ctx.db.insert("files",{
            name: args.name,
            orgId: args.orgId,
            fileId: args.fileId,
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

export const deleteFile = mutation({
    args: { fileId: v.id("files") },
    async handler(ctx, args) {
      const identity = await ctx.auth.getUserIdentity();
  
      if (!identity) {
        throw new ConvexError("you do not have access to this organization");
      }
      const file = await ctx.db.get(args.fileId);
      if (!file){
        throw new ConvexError("file not found");
      }
      const hasAccess = await hasAccessToOrg(
        ctx,
        identity.tokenIdentifier,
        file.orgId,
      );
      if (!hasAccess){
        throw new ConvexError("you do not have access to delete this file");
    }
    await ctx.db.delete(args.fileId);
}
});