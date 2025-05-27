import { Clerk } from "@clerk/clerk-sdk-node";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  files: defineTable({name: v.string(),orgId: v.string() }).index(
    "by_orgId",
    ["orgId"]
  ) ,
  users: defineTable({
    tokenIdentifier: v.string(),
    orgIds: v.array(v.string()),
    name: v.string(),
    image: v.string(),
  }).index("by_tokenIdentifier",["tokenIdentifier"])
});
