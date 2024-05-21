import { authenticate } from "@medusajs/medusa/dist/utils/authenticate-middleware"
import { AuthUserScopedMedusaRequest } from "../restaurants/types"
import { NextFunction, Response } from "express"
import { MiddlewareRoute } from "@medusajs/medusa"

const isAdmin = (
  req: AuthUserScopedMedusaRequest,
  res: Response,
  next: NextFunction
) => {
  console.log("first isAdmin middleware", req.auth)

  if (req.auth_user_id) {
    return next()
  }

  const auth_user_id =
    req.auth?.app_metadata?.restaurant_admin_id ||
    req.auth?.app_metadata?.driver_id

  // if (!auth_user_id) {
  //   return res.status(403).json({ message: "Unauthorized" })
  // }

  console.log("isAdmin middleware", auth_user_id)

  req.auth_user_id = auth_user_id

  console.log("isAdmin middleware", auth_user_id)

  return next()
}

const logger = (req, res, next: NextFunction) => {
  console.log("logger middleware", req)
  return next()
}

export const usersMiddlewares: MiddlewareRoute[] = [
  {
    method: ["GET"],
    matcher: "/users/me",
    middlewares: [authenticate(/driver|restaurant/g, "bearer")],
  },
  {
    method: ["POST"],
    matcher: "/users",
    middlewares: [authenticate(/driver|restaurant/g, "bearer")],
  },
]
