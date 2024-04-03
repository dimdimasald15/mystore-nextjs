import type { NextApiRequest, NextApiResponse } from "next";
import { signUp } from "@/services/auth/services";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    await signUp(req.body, (status: boolean) => {
      if (status) {
        res
          .status(200)
          .json({ statusCode: 200, status: true, message: "success" });
      } else {
        res
          .status(400)
          .json({ statusCode: 400, status: false, message: "failed" });
      }
    });
  } else {
    res
      .status(405)
      .json({ statusCode: 405, status: false, message: "Method Not Allowed" });
  }
}
