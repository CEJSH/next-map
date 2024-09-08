import { NextResponse } from "next/server";
import prisma from "@/db";

import { getServerSession } from "next-auth";
import authOptions from "../auth/[...nextauth]/options";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") as string;
  const limit = searchParams.get("limit") as string;
  const storeId = searchParams.get("storeId") as string;
  const user = searchParams.get("user") as unknown;

  const session = await getServerSession(authOptions);
  //    get 요청을 처리한다.

  const count = await prisma.comment.count({
    where: {
      storeId: storeId ? parseInt(storeId) : {},
      userId: user ? session?.user.id : {},
    },
  });
  const skipPage = parseInt(page) - 1;
  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: "desc" },
    where: {
      storeId: storeId ? parseInt(storeId) : {},
      userId: user ? session?.user.id : {},
    },
    skip: skipPage * parseInt(limit),
    take: parseInt(limit),
    include: {
      user: true,
      store: true,
    },
  });

  // totalPage, data, page
  return NextResponse.json(
    {
      page: parseInt(page),
      data: comments,
      totalPage: Math.ceil(count / parseInt(limit)),
    },
    { status: 200 }
  );
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json(null, { status: 401 });
  }
  // 데이터 생성을 처리한다.
  const formData = await req.json();
  const comment = await prisma.comment.create({
    data: {
      storeId: formData.storeId,
      body: formData.body,
      userId: session?.user.id,
    },
  });

  return NextResponse.json(comment, { status: 200 });
}

export async function PUT(req: Request) {
  // 데이터 수정을 처리한다
  const formData = await req.json();

  const result = await prisma.comment.update({
    where: {
      id: formData.id,
    },
    data: { ...formData, body: formData.body },
  });

  return NextResponse.json(result, { status: 200 });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!session?.user || !id) {
    return NextResponse.json({ status: 401 });
  }
  const result = await prisma.comment.delete({
    where: {
      id: parseInt(id),
    },
  });
  return NextResponse.json(result, { status: 200 });
}
