/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { DivisionService } from "./division.service";

//create division handaler
const handleCreateDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;

    const division = await DivisionService.createDivision(name);

    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "Division has been created successfully!",
      data: division,
    });
  }
);
//update division handaler
const handleUpdateDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const body = req.body;
    const id = req.params.id;

    const division = await DivisionService.updateDivision(body, id);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Division has been updated successfully!",
      data: division,
    });
  }
);
//delete division handaler
const handleDeleteDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    await DivisionService.deleteDivision(id);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Division has been deleted successfully!",
      data: null,
    });
  }
);
//get division handaler
const handleGetDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const divisions = await DivisionService.getDivision();

    sendResponse(res, {
      success: true,
      statusCode: 201,
      message: "Divisions returns successfully!",
      data: divisions.data,
      meta: divisions.meta,
    });
  }
);

export const DivisionController = {
  handleCreateDivision,
  handleUpdateDivision,
  handleDeleteDivision,
  handleGetDivision,
};
