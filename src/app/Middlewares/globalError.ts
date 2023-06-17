/* eslint-disable no-console */
/* eslint-disable no-unused-expressions */
import { ErrorRequestHandler, Request, Response } from 'express'
import { Error } from 'mongoose'
import config from '../../config'

import { ZodError } from 'zod'
import { IGenericErrorMessage } from '../../interfaces/error'
import { errorlogger } from '../../shared/logger'
import ApiError from '../../Errors/ApiError'
import handleZodError from '../../Errors/handleZodError'
import handleCastError from '../../Errors/handleCastError'
import handleValidationError from '../../Errors/handleValidationError'

const globalErrorHandler: ErrorRequestHandler = (
  error,
  req: Request,
  res: Response
) => {
  config.env === 'development'
    ? console.log(`🐱‍🏍 globalErrorHandler ~~`, error)
    : errorlogger.error(`🐱‍🏍 globalErrorHandler ~~`, error)

  let statusCode = 500
  let message = 'Something went wrong !'
  let errorMessages: IGenericErrorMessage[] = []

  if (error?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(error)
    statusCode = simplifiedError.statusCode
    message = simplifiedError.message
    errorMessages = simplifiedError.errorMessages
  } else if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error)
    statusCode = simplifiedError.statusCode
    message = simplifiedError.message
    errorMessages = simplifiedError.errorMessages
  } else if (error?.name === 'CastError') {
    const simplifiedError = handleCastError(error)
    statusCode = simplifiedError.statusCode
    message = simplifiedError.message
    errorMessages = simplifiedError.errorMessages
  } else if (error instanceof ApiError) {
    statusCode = error?.statusCode
    message = error.message
    errorMessages = error?.message
      ? [
          {
            path: '',
            message: error?.message,
          },
        ]
      : []
  } else if (error instanceof Error) {
    message = error?.message
    errorMessages = error?.message
      ? [
          {
            path: '',
            message: error?.message,
          },
        ]
      : []
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.env !== 'production' ? error?.stack : undefined,
  })
}

export default globalErrorHandler

//path:
//message:

// 2025 Fall

// 2025 and
