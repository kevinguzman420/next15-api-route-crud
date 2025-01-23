import { Suspense } from "react";
import Loading from "./loading";
import { cookies } from "next/headers";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { LogIn, Pen, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";

async function getTasks() {
  const cookieStore = await cookies();

  const res = await fetch("http://localhost:3000/api/protected/task", {
    credentials: "include",
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return res;
}
export default async function DaskboardTasks() {
  let tasks = null;
  const res = await getTasks();
  console.log(res);
  if (res.ok) {
    tasks = await res.json();
  }
  if (res.status === 401) {
    return (
      <AlertModal
        trigger={true}
        title="Unauthorized"
        message="Session expired"
      />
    );
  } else if (res.status === 500) {
    // error en el servidor...
    return (
      <div className=" flex justify-center items-center h-[calc(100vh-70px)] ">
        <div className=" text-center ">
          <h1>Internal Server Error</h1>
          <p>Tasks not loaded. Try Again please</p>
        </div>
      </div>
    );
  }
  // if (!tasksResp.success) {
  //   return <div>Error</div>;
  // }
  // const tasks = tasksResp.data;
  // const tasks = await getTasks();
  console.log(tasks);

  return (
    <Suspense fallback={<Loading />}>
      <div className=" grid grid-cols-4 space-x-4 space-y-4 border ">
        {tasks.map((task: any) => (
          <Card className="w-96 h-96">
            <CardHeader>
              <CardTitle>
                {task.title} {task.id}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{task.description}</p>
              <Badge className="my-2" variant="destructive">
                Destructive
              </Badge>
              <br />
              <Badge className={buttonVariants()}>
                User Email:{task.user.email}
              </Badge>
            </CardContent>
            <CardDescription className=" space-x-3 ">
              <Button variant={"destructive"}>
                Delete it <Trash />{" "}
              </Button>
              <Button variant={"secondary"}>
                Update it <Pen />{" "}
              </Button>
            </CardDescription>
          </Card>
        ))}
      </div>
    </Suspense>
  );
}

function AlertModal({
  trigger,
  title,
  message,
}: {
  trigger: boolean;
  title: string;
  message: string;
}) {
  return (
    <AlertDialog open={trigger}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{message}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Link
            className={buttonVariants({ variant: "secondary" })}
            href="/signin"
          >
            Sign in
            <LogIn />
          </Link>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
