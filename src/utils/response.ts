import {Response} from 'express';

export const ok = (res: Response, msg: string, data?: unknown)  => 
  res.status(200).json({ success: true, message: msg, ...(data !== undefined && { data }) });


export const created = (res: Response, msg: string, data: unknown) =>
  res.status(201).json({ success: true, message: msg, data });

export const err = (res: Response, code: number, msg: string, errors?: unknown) =>
  res.status(code).json({ success: false, message: msg, ...(errors !== undefined && { errors }) });