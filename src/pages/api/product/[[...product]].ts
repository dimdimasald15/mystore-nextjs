import {
  addData,
  deleteData,
  retrieveData,
  retrieveDataById,
  updateData,
} from "@/lib/firebase/service";
import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { product }: any = req.query;

    const data =
      product && product[0]
        ? await retrieveDataById("products", product[0])
        : await retrieveData("products");

    res.status(200).json({
      status: true,
      statusCode: 200,
      message: "success",
      data,
    });
  } else if (req.method === "POST") {
    const token = req.headers.authorization?.split(" ")[1] || "";
    jwt.verify(
      token,
      process.env.NEXTAUTH_SECRET || "",
      async (err: any, decoded: any) => {
        if (decoded && decoded.role === "admin") {
          let data = req.body;
          data.created_at = new Date();
          data.updated_at = new Date();
          data.price = parseInt(data.price);
          data.stock.filter((stock: any) => {
            stock.qty = parseInt(stock.qty);
          });
          await addData("products", data, (status: boolean, result: any) => {
            if (status) {
              res.status(200).json({
                status: true,
                statusCode: 200,
                message: "success",
                data: { id: result.split("/")[1] },
              });
            } else {
              res.status(400).json({
                status: false,
                statusCode: 400,
                message: "failed",
                data: {},
              });
            }
          });
        } else {
          res.status(403).json({
            status: false,
            statusCode: 403,
            message: "failed",
          });
        }
      }
    );
  } else if (req.method === "PUT") {
    const { product }: any = req.query;
    const { data } = req.body;
    const token = req.headers.authorization?.split(" ")[1] || "";
    jwt.verify(
      token,
      process.env.NEXTAUTH_SECRET || "",
      async (err: any, decoded: any) => {
        if (decoded && decoded.role === "admin") {
          if (data.stock && data.price) {
            data.price = parseInt(data.price);
            data.stock.filter((stock: any) => {
              stock.qty = parseInt(stock.qty);
            });
          }
          
          await updateData("products", product[0], data, (status: boolean) => {
            if (status) {
              res.status(200).json({
                status: true,
                statusCode: 200,
                message: "success",
              });
            } else {
              res.status(400).json({
                status: false,
                statusCode: 400,
                message: "failed",
              });
            }
          });
        } else {
          res.status(403).json({
            status: false,
            statusCode: 403,
            message: "failed",
          });
        }
      }
    );
  } else if (req.method === "DELETE") {
    const { product }: any = req.query;
    const token = req.headers.authorization?.split(" ")[1] || "";

    jwt.verify(
      token,
      process.env.NEXTAUTH_SECRET || "",
      async (err: any, decoded: any) => {
        if (decoded && decoded.role === "admin") {
          await deleteData("products", product[0], (result: boolean) => {
            if (result) {
              res.status(200).json({
                status: true,
                statusCode: 200,
                message: "success",
              });
            } else {
              res.status(400).json({
                status: false,
                statusCode: 400,
                message: "failed",
              });
            }
          });
        } else {
          res.status(403).json({
            status: false,
            statusCode: 403,
            message: "Access denied",
          });
        }
      }
    );
  }
}
