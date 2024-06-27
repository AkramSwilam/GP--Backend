import { Router } from "express";
import * as usersController from "./users.controller.js"
import * as usersValidationSchemas from "./users.validation.js"
import { appValidator } from "../../middelwares/app.validation.js";
import { allowedTo } from "../../middelwares/authorization.js";
import { checkUserToken } from "../../middelwares/chcek_user_token.js";
import Joi from "joi";
import { PasswordLimiter, signInLimiter } from "./users.middelwares.js";
export const usersRouter=Router()

usersRouter.post("/signup",appValidator(usersValidationSchemas.addUserSchema),usersController.signup)

usersRouter.post("/signin",usersController.signin)

usersRouter.get("/",usersController.getUsers)

usersRouter.post("/confirmCode",appValidator(usersValidationSchemas.confirmCodeValidation),usersController.confirmCode)
//signInLimiter
usersRouter.post("/sendCode",appValidator(usersValidationSchemas.sendCodeValidation),
usersController.sendCode)
usersRouter.get("/:id",usersController.getUserData)

// usersRouter.get("/confirmEmail/:token",usersController.confirmEmail)
// usersRouter.get("/newConfirmEmail/:token",usersController.newConfirmEmail)

usersRouter.put("/update/fromUser",checkUserToken,
appValidator(usersValidationSchemas.updateUserValidation),usersController.updateUserFromUser)

usersRouter.put("/update/fromAdmin/:id",checkUserToken,allowedTo(['admin'])
,appValidator(usersValidationSchemas.updateUserValidationAdmin),usersController.updateFromAdmin)

usersRouter.delete("/delete/fromAdmin/:id",checkUserToken,allowedTo(['admin']),usersController.deleteUserFromAdmin)

usersRouter.delete("/delete/fromUser",checkUserToken,usersController.deleteUserFromUser)

//PasswordLimiter
usersRouter.get("/forgetPassword/otp",appValidator(usersValidationSchemas.forgetPasswordValidation),usersController.forgetPassword)

usersRouter.patch("/resetPassword/",appValidator(usersValidationSchemas.resetPasswordValidation),usersController.resetPassword)

usersRouter.patch("/logout",checkUserToken,usersController.logoutUser)

usersRouter.post("/createAdmin",checkUserToken,allowedTo(['admin']),usersController.createAdmin)


usersRouter.put("/change/password",appValidator(usersValidationSchemas.changePassword),usersController.changePassword)

usersRouter.put("/wishlist",checkUserToken,usersController.updateWishlist)