import { ActionFunctionArgs } from "@remix-run/node";
import { UserModel } from "~/db/schema/users.server";
import { getUserOrFail } from "./auth/sessions.server";

type AsyncActionFunction<T> = (args: ActionFunctionArgs) => Promise<T>

export default function actionWithUser<T>(next: (user: UserModel, args: ActionFunctionArgs) => Promise<T>): AsyncActionFunction<T> {
  return async (args: ActionFunctionArgs) => {
    const user = await getUserOrFail(args.request)
    return next(user, args)
  }
}
