import { NextFunction, Request, Response } from "express";
import { prisma } from "../config/prisma";

// CREATE new blog
export const createBlog = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const newBlog = await prisma.blog.create({
      data: {...request.body},
      include: {
        author: true, // Include the related author
      },
      omit:{
        authorId : true, // Exclude authorId from the response
      }
    });

    response.status(200).send({
      success: true,
      message: "Blog added successfully",
      tracker: newBlog,
    });
  } catch (error) {
    next(error);
  }
};

// // GET all data and filtered data by title
// export const getTracker = async (
//   request: Request,
//   response: Response,
//   next: NextFunction
// ) => {
//   try {
//     const filterTracker:any = {};
//     if (request.query.title) { // If a title query parameter is provided, filter by title
//       filterTracker.title = request.query.title
//     }
//     const transactions = await prisma.transactions.findMany({
//       where:filterTracker, // Filtering based on query parameters
//       include:{
//         Categories : true, // Include the related category data
//       },
//       omit:{
//         categoryId : true, // Exclude categoryId from the response
//       }
//     });
//     response.status(200).send({
//       success: true,
//       message: "selected data retrived succesfully",
//       tracker: transactions,
//     });

//   } catch (error) {
//     next(error);
//   }
// };

// // GET total BY CATEGORY (already using postgre)
// export const getTotalByCategory = async (
//   request: Request,
//   response: Response,
//   next: NextFunction
// ) => {
//   try {
//     const result = await prisma.transactions.aggregate({
//       _sum: {
//         nominal: true,
//       },
//       where: {
//         categoryId: parseInt(request.params.categoryId),
//       }
//     });

//     response.status(200).send({
//       success: true,
//       message: "Data totalled successfully",
//       categoryId: request.params.categoryId,
//       total: result._sum.nominal
//     });

//   } catch (error) {
//     next(error);
//   }
// };

// // EDIT a data (already using postgre)
// export const editTracker = async (
//   request: Request,
//   response: Response,
//   next: NextFunction
// ) => {
//   try {
//     const update = await prisma.transactions.update({
//       where:{
//         id: parseInt(request.params.id), // Find the transaction by ID
//       },
//       data:request.body, // Update with the request body
//     })

//     response.status(200).send({
//       success: true,
//       message: "Data updated successfully",
//       tracker: update,
//     });

//   } catch (error: any) {
//     next(error);
//   }
// };

// // DELETE a data (already using postgre)
// export const deleteTracker = async (
//   request: Request,
//   response: Response,
//   next: NextFunction
// ) => {
//   try {
//     const remove = await prisma.transactions.delete({
//       where:{
//         id: parseInt(request.params.id), // Find the transaction by ID
//       }
//     })

//     response.status(200).send({
//       success: true,
//       message: "Data deleted successfully",
//       tracker: remove,
//     });
//   } catch (error: any) {
//     next(error);
//   }
// };

// // GET specific data (already using postgre)
// // export const getTrackerDetail = async (
// //   request: Request,
// //   response: Response,
// //   next: NextFunction //next untuk mengarahkan ke middleware selanjutnya (dalam case ini, ke middleware error)
// // ) => {
// //   try {
// //     const { id } = request.params;
// //     const sqlScript = "select * from transactions WHERE id = $1;";
// //     const values = [id];

// //     const result = await poolDB.query(sqlScript, values);

// //     if (result.rowCount === 0) {
// //       return response.status(404).json({
// //         success: false,
// //         message: "Data not found",
// //       });
// //     }

// //     response.status(200).send({
// //       success: true,
// //       message: "selected data retrived succesfully",
// //       tracker: result.rows[0],
// //     });
// //   } catch (error: any) {
// //     next(error);
// //   }
// // };

// //
// //

// // // GET total by DATE RANGE (already using postgre)
// // export const getTotalByDateRange = async (
// //   request: Request,
// //   response: Response,
// //   next: NextFunction
// // ) => {
// //   try {
// //     const { start, end } = request.query;

// //     if (!start || !end) {
// //       return response.status(400).json({
// //         success: false,
// //         message:
// //           "Please provide start and end query parameters in YYYY-MM-DD format.",
// //       });
// //     }

// //     const sqlScript = `
// //       SELECT
// //         SUM(CASE WHEN type = 'income' THEN nominal ELSE 0 END) AS total_income,
// //         COUNT(CASE WHEN type = 'income' THEN 1 END) AS count_income,
// //         SUM(CASE WHEN type = 'expense' THEN nominal ELSE 0 END) AS total_expense,
// //         COUNT(CASE WHEN type = 'expense' THEN 1 END) AS count_expense
// //       FROM transactions
// //       WHERE date >= $1 AND date <= $2;
// //     `;
// //     // the SUM : if the type is income, then sum the nominal, else 0
// //     // the COUNT : if the type is income, then count it as 1, else null

// //     const values = [start, end];
// //     const { rows } = await poolDB.query(sqlScript, values);

// //     const data = rows[0];

// //     const grandTotal = Number(data.total_income) - Number(data.total_expense);
// //     const totalCount = Number(data.count_income) + Number(data.count_expense);

// //     response.status(200).json({
// //       success: true,
// //       totalAmountIncome: Number(data.total_income) || 0,
// //       countAmountIncome: Number(data.count_income) || 0,
// //       totalAmountExpense: Number(data.total_expense) || 0,
// //       countAmountExpense: Number(data.count_expense) || 0,
// //       grandTotal,
// //       totalCount,
// //     });
// //   } catch (error) {
// //     next(error);
// //   }
// // };
