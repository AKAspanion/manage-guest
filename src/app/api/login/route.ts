// pages/api/login.ts
import { getDB } from "@/db/mongo";
import { UserWithPassword } from "@/schema/user";
import { NextResponse } from "next/server";

export async function POST(_req: Request) {
  try {
    const { email, password } = await _req.json();

    const db = await getDB("guests");

    const data = await db
      .collection("users")
      .findOne<UserWithPassword>({ email });

    if (!data) {
      return NextResponse.json(
        { message: "User authentication failed" },
        { status: 401 }
      );
    }

    if (data?.password !== password) {
      return NextResponse.json(
        { message: "User authentication failed" },
        { status: 401 }
      );
    }

    const token = Buffer.from(`${data?.name}:${data?.password}`).toString(
      "base64"
    );
    return NextResponse.json(
      {
        data: {
          user: { email: data?.email, name: data?.name, _id: data?._id },
          token,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { data: { message: "Something went wrong" } },
      { status: 500 }
    );
  }
}
