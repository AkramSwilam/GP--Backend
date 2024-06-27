import { User } from "../../database/models/user.js";
import { sendMail } from "../../utils/email.js";
import { asyncHandler } from "../../utils/error_handling.js";
import jwt, { decode } from "jsonwebtoken"
import bcrypt from "bcrypt"
import otpGenerator from "otp-generator"
import { crudOps } from "../../utils/crud_ops.js";
import { OTP } from "../../database/models/otp.js";
import { LoginTimes } from "../../database/models/login_times.js";

export const signup = asyncHandler(
    async (req, res, nxt) => {
        const { email } = req.body
        const userExisit = await User.findOne({ email })
        if (userExisit) return res.status(409).json({ message: "email already exisits" })

        const user = await User.create(req.body)



        return res.status(201).json({ message: "done", doc: user })
    }
)

export const signin = asyncHandler(
    async (req, res, nxt) => {
        const { email, password } = req.body
        const userExisit = await User.findOne({ email })
        console.log(userExisit);
        if (!userExisit) return res.status(402).json({ message: "wrong email or password" })
        const rightPassword = bcrypt.compareSync(password, userExisit.password)
        console.log(rightPassword);
        if (!rightPassword) return res.status(402).json({ message: "wrong email or password" })

        if (!userExisit.emailActivated) {
            return res.status(400).json({ "message": "email is not activated yet, check your inbox to activate your email" })
        }




        console.log(process.env.SECRET_KEY);
        const token = jwt.sign({
            id: userExisit._id,
            email: userExisit.email
        }, process.env.SECRET_KEY)
        console.log("here");
        console.log(userExisit.logout);
        console.log(userExisit.updatedAt.getTime() / 1000 > jwt.verify(token, process.env.SECRET_KEY).iat);
        return res.status(200).json({ message: "done", doc: userExisit, token })
    }
)


export const getUsers = crudOps.getAll(User)



export const updateUserFromUser = asyncHandler(
    async (req, res, nxt) => {

        if (req.body.password && !req.body.oldPassword) return res.status(400).json({ message: "send old password" })

        if (req.body.password && req.body.oldPassword) {
            const rightPassword = bcrypt.compareSync(req.body.oldPassword, req.user.password)
            if (!rightPassword) return res.status(402).json({ message: "wrong password" })
        }

        await req.user.updateOne(req.body)
        return res.status(202).json({ message: "done", doc: req.user })
    }
)

export const updateUserFromAdmin = crudOps.updateModel(User)



export const deleteUserFromAdmin = crudOps.deleteModel(User)
export const deleteUserFromUser = crudOps.deleteFromReq('user')

export const getUserData = crudOps.getOne(User)

export const forgetPassword = asyncHandler(
    async (req, res, nxt) => {
        const { email } = req.body
        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({ message: "invalid email" })

        const code = otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false, digits: true })
        const otp = await OTP.create({ code, userId: user.id })
        await sendMail({
            to: user.email,
            subject: 'OTP Code',
            html: `<h2>${code}</h2>`
        })
        return res.status(200).json({ message: "check your email", userId: otp.userId })
    }
)
export const resetPassword = asyncHandler(
    async (req, res, nxt) => {
        const { code } = req.body
        const otp = await OTP.findOne({ code })
        if (!otp) return res.status(400).json({ message: "expired or wrong otp" })
        return res.status(202).json({ message: "done", userId: otp.userId })
    }
)

export const changePassword = asyncHandler(
    async (req, res, nxt) => {
        const user = await User.findById(req.body.id, { password: req.body.password }, { new: true })
        return res.status(201).json({ message: "done", doc: user })
    }
)

export const logoutUser = asyncHandler(
    async (req, res, nxt) => {
        await req.user.update({ logout: true })
        return res.status(202).json({ message: "done" })
    }
)

export const createAdmin = asyncHandler(
    async (req, res, nxt) => {
        const { name, email, password, phone } = req.body
        const userExisit = await User.findOne({ where: { email } })
        if (userExisit) return res.json({ message: "email already exisits" })
        const user = await User.create({ email, password, name, phone, role: 'admin', emailActivated: true })
        return res.json({ message: "done", doc: user })
    }
)

export const updateFromAdmin = crudOps.updateModel(User)


export const confirmCode = asyncHandler(
    async (req, res, nxt) => {
        const { code, id } = req.body
        const otp = await OTP.findOne({ code, userId: id })
        if (!otp) return res.status(400).json({ message: "expired" })
        let user = await User.findById(id)
        if (user.emailActivated) return res.status(400).json({ message: "activated" })
        user = await user.updateOne({ emailActivated: true }, { new: true })
        return res.status(202).json({ message: "done", doc: user })
    }
)


export const sendCode = asyncHandler(
    async (req, res, nxt) => {
        const { id } = req.body
        const user = await User.findById(id)
        if (!user || user.emailActivated) return res.status(400).json({ message: "not found or activated" })

        let loginTimes = await LoginTimes.findOne({ userId: id })
        if (loginTimes && loginTimes.times > 3) return res.status(400).json({ message: "trials limit exceeded" })

        const code = otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false, digits: true })
        const otp = await OTP.create({ code, userId: id })
        await sendMail({
            to: user.email,
            subject: 'OTP Code',
            html: `<h2>${code}</h2>`
        })

        if (!loginTimes) loginTimes = await LoginTimes.create({ userId: id })
        console.log(loginTimes);
        await loginTimes.updateOne({ times: loginTimes.times + 1 })

        return res.status(200).json({ message: "done" })
    }
)

export const updateWishlist = asyncHandler(
    async (req, res, nxt) => {
        const { stock, op } = req.body
        if (op == "add") {
            await req.user.wishlist.push(stock)
            await req.user.save()
        } else {
            console.log("here");
            const wishlist = req.user.wishlist;
            const updatedWishlist = wishlist.filter(item => item.toString() !== stock);
            req.user.wishlist = updatedWishlist;
            await req.user.save()
        }
        const user= await User.findById(req.user._id).populate('wishlist')
        return res.status(201).json({ message: "done", user })
    }
)