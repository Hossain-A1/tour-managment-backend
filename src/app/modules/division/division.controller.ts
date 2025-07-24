/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { DivisionService } from "./division.service";
import { IDivision } from "./division.interface";

//create division handaler
const handleCreateDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload: IDivision = {
      ...req.body,
      thambnail: req.file?.path,
    };

    const division = await DivisionService.createDivision(payload);

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
    const payload:IDivision ={
      ...req.body,
      thambnail:req.file?.path
    }
    const id = req.params.id;

    const division = await DivisionService.updateDivision(payload, id);

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
    const query = req.query;
    const divisions = await DivisionService.getDivision(
      query as Record<string, string>
    );

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Divisions returns successfully!",
      data: divisions.data,
      meta: divisions.meta,
    });
  }
);
//get single division handaler
const handleGetSingleDivision = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const slug = req.params.slug;
    const divisions = await DivisionService.getSingleDivision(slug);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Single division return successfully!",
      data: divisions.data,
    });
  }
);

export const DivisionController = {
  handleCreateDivision,
  handleUpdateDivision,
  handleDeleteDivision,
  handleGetDivision,
  handleGetSingleDivision,
};
