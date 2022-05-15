import express, { NextFunction, Request, Response, Router } from "express"
import BridgeController from "./Controller/BridgeController"

export const bridgeRouter = Router() 

const bridgeController = new BridgeController()

bridgeRouter.get("/best-route", (req: Request, res: Response) => bridgeController.bestBridge(req, res))
