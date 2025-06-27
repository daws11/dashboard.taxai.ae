import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import db from "@/app/api/_utils/db";
import User from "@/app/api/_models/User";
import bcrypt from 'bcryptjs';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }
  await db;
  const user = await User.findOne({ email: session.user.email }).select("-password");
  if (!user) {
    return new Response("User not found", { status: 404 });
  }
  return new Response(JSON.stringify(user), { status: 200, headers: { "Content-Type": "application/json" } });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }
  await db;
  const body = await req.json();
  const update: Record<string, unknown> = {};
  if (body.email) update.email = body.email;
  if (body.jobTitle) update.jobTitle = body.jobTitle;
  if (body.language) update.language = body.language;
  if (body.name) update.name = body.name;
  if (body.password) {
    update.password = await bcrypt.hash(body.password, 10);
  }
  update.updatedAt = new Date();
  const user = await User.findOneAndUpdate(
    { email: session.user.email },
    { $set: update },
    { new: true, runValidators: true, context: 'query' }
  ).select("-password");
  if (!user) {
    return new Response("User not found", { status: 404 });
  }
  return new Response(JSON.stringify(user), { status: 200, headers: { "Content-Type": "application/json" } });
}

export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }
  await db;
  const user = await User.findOneAndDelete({ email: session.user.email });
  if (!user) {
    return new Response("User not found", { status: 404 });
  }
  return new Response(null, { status: 204 });
} 