import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const authData = await auth();
    
    if (!authData.userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // This will switch to the personal workspace
    // The actual switching is handled by Clerk's auth system
    // We just need to clear the active organization
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error switching organization:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
