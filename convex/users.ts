import { Query } from "convex/server";
import { internalMutation, MutationCtx, QueryCtx } from "./_generated/server";
import { ConvexError, v } from "convex/values";

export async function getUser(ctx: QueryCtx | MutationCtx,
    tokenIdentifier: string
){
    
 const user = await ctx.db
    .query("users")
    .withIndex("by_tokenIdentifier", (q) =>
    q.eq("tokenIdentifier",tokenIdentifier)
)
.first();
if (!user){
    throw new ConvexError(`expected user to be defined for tokenIdentifier: ${tokenIdentifier}`);
}
return user;
}

export const createUser = internalMutation({
    args: {tokenIdentifier: v.string(), name: v.string(), image: v.string()},
    async handler(ctx, args){
        await ctx.db.insert("users", {
            tokenIdentifier: args.tokenIdentifier,
            orgIds: [],
            name: args.name,
            image: args.image,
        })
    }
});


export const addOrgIdToUser = internalMutation({
    args: {tokenIdentifier: v.string(), orgId: v.string(),},
    async handler(ctx, args){
        const user = await getUser(ctx, args.tokenIdentifier)


    await ctx.db.patch(user._id, {
        orgIds: [...(user.orgIds ?? []), args.orgId],
    });
},
});

export const updateRoleInOrgForUser = internalMutation({
    args: {tokenIdentifier: v.string(), orgId: v.string(), role: v.string()},
    async handler(ctx, args){
        // Implement role update logic here
    }
});

export const updateUser = internalMutation({
    args: {tokenIdentifier: v.string(), name: v.string(), image: v.string()},
    async handler(ctx, args){
        const user = await getUser(ctx, args.tokenIdentifier);
        await ctx.db.patch(user._id, {
            name: args.name,
            image: args.image,
        });
    }
});