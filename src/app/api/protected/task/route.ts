// api/protected/task/route.ts

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    new Error("test");
    const tasks = await prisma.task.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json(
      { message: "Error", success: false },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const taskData = await req.json();

  try {
    const task = await prisma.task.create({
      data: {
        title: taskData.title,
        description: taskData.description,
        priority: taskData.priority,
        userId: taskData.userId,
      },
    });
    console.log(task);
    return NextResponse.json(
      { message: "Task created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating task" },
      { status: 500 }
    );
  }
}
