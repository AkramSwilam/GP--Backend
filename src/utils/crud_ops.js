import jwt from "jsonwebtoken"
import { searchFiltering } from "./api_features.js"
import { asyncHandler } from "./error_handling.js"

const getAll = (Model) => {
    return asyncHandler(
        async (req, res, nxt) => {
            const searchFilters = searchFiltering(req.query)
            let docs
            if (!req.query.populate) {
                 docs = await Model.find(
                    ...searchFilters.whereConditions,
                ).skip(searchFilters.offset).limit(searchFilters.limit).sort(searchFilters.order)
            } else {
                 docs = await Model.find(
                    ...searchFilters.whereConditions,
                ).skip(searchFilters.offset).limit(searchFilters.limit).sort(searchFilters.order).populate(`${req.query.populate}`)
            }
            return res.status(200).json({ message: "done", docs })
        }
    )
}






const getOne = (Model) => {
    return asyncHandler(
        async (req, res, nxt) => {
            const { id } = req.params
            let doc
            if(req.query.populate){
                 doc = await Model.findById(id).populate(`${req.params.populate}`)
            }else{
                 doc = await Model.findById(id)
            }
            if (!doc) return res.status(400).json({ message: `doc not found` })
            return res.status(200).json({ message: "done", doc })
        }
    )
}

const addModel = (Model) => {
    return asyncHandler(
        async (req, res, nxt) => {
            const doc = await Model.create(req.body)
            if (!doc) return res.status(201).json({ message: `doc not created` })
            return res.json({ message: "done", doc })
        }
    )
}

const deleteModel = (Model) => {
    return asyncHandler(
        async (req, res, nxt) => {
            const { id } = req.params
            const doc = await Model.findByIdAndDelete(id)

            doc && res.status(202).json({ message: "done", doc })
            !doc && nxt(new Error(`doc Not Found`, { status: 400 }))
        }
    )
}

const updateModel = (Model) => {
    return asyncHandler(
        async (req, res, nxt) => {
            const { id } = req.params
            const doc = await Model.findByIdAndUpdate(id, req.body, { new: true })

            doc && res.status(202).json({ message: "done", doc })
            !doc && nxt(new Error("doc Not Found", { status: 400 }))
        }
    )
}

const deleteFromReq = (model) => {
    return asyncHandler(
        async (req, res, nxt) => {
            await req[model].remove()
            return res.status(200).json({ message: "done" })
        }
    )

}

const updateFromReq = (model) => {
    return asyncHandler(
        async (req, res, nxt) => {
            await req[model].updateOne(req.body)
            return res.status(202).json({ message: "done", doc: req[model] })
        }
    )
}

const uploadMedia = (Model) => {
    return asyncHandler(
        async (req, res, nxt) => {
            const { id } = req.params
            let doc = await Model.findById(id)
            if (!doc) return res.status(400).json({ message: "doc not found" })

            doc = await Model.findByIdAndUpdate(id, req.files, { new: true })
            return res.status(202).json({ message: "done", doc })
        }
    )
}

const updateOneInMedia = (
    Model,
    arr,
    max
) => {
    return asyncHandler(
        async (req, res, nxt) => {
            const { id } = req.params
            const { index } = req.body

            if (index >= max) return res.status(400).json({ message: "index above maximum files" })

            let doc = await Model.findById(id)
            if (!doc) return res.status(400).json({ message: "doc not found" })

            let fileArray = doc[arr]
            let newArray = req.files[arr]

            if (index && newArray) {
                fileArray[index] = newArray[0].finalPath;
                let updatedArray = [];
                fileArray.forEach(element => {
                    updatedArray.push({ finalPath: element });
                });
                
                doc = await Model.findByIdAndUpdate(id, { [arr]: updatedArray }, { new: true })
                console.log(doc[arr]);

                return res.status(202).json({ message: "done", doc });
            } else if (index) {
                let updatedArray = [];
                let c = 0;
                for (let indexx = 0; indexx < fileArray.length; indexx++) {
                    if (indexx == index) continue;
                    updatedArray[c] = { finalPath: fileArray[indexx] };
                    c++;
                }

                doc = await Model.findByIdAndUpdate(id, { [arr]: updatedArray }, { new: true })
                return res.status(202).json({ message: "done", doc });
            }

        }
    )
}
// export const confirmEmail = (Model, name) => {
//     return asyncHandler(
//         async (req, res, nxt) => {
//             const { token } = req.params
//             const decoded = jwt.verify(token, process.env.SECRET_KEY)
//             console.log(decoded);
//             const model = await Model.update({ emailActivated: true }, { where: { id: decoded.id }, returning: true })
//             if (!model) return res.json({ message: `${name} not found` })
//             return res.json({ message: "done" })
//         }
//     )
// }

// export const newConfirmEmail = (Model, name, path) => {
//     return asyncHandler(
//         async (req, res, nxt) => {
//             const { token } = req.body
//             const decoded = jwt.verify(token, process.env.SECRET_KEY)
//             const user = await Model.findByPk(decoded.id)
//             if (!user) return res.json({ message: `${name} not found` })
//             if (user.emailActivated) return res.json({ messgae: "email activated" })

//             const newToken = jwt.sign({
//                 id: user.id,
//             }, process.env.SECRET_KEY, { expiresIn: "5 m" })

//             await sendMail({
//                 to: user.email,
//                 subject: "New Confirmation Email",
//                 html: `<a href="${req.protocol}://${req.headers.host}/api/v1/${path}/confirmEmail/${newToken}">Confirm Accaount</a>`,
//             })
//             return res.json({ message: "done,check your email" })
//         }
//     )
// }

export const updateOneLegalDoc = (Model, object) => {
    return asyncHandler(
        async (req, res, nxt) => {
            const id = req[object].dataValues.id;
            object = req[object];
            const legalDocsArr = object["dataValues"].legalDocs; // Change from images to legalDocs
            const { legalDocs } = req.files; // Change from images to legalDocs
            const { legalDocsIndex } = req.body;
            console.log(req.files);
            console.log(legalDocs);
            console.log(legalDocsIndex);

            if (legalDocsIndex >= 8) {
                return res.json({ message: "Maximum docs is 8" });
            }

            if (legalDocs && legalDocsIndex) {
                console.log("here 1");
                legalDocsArr[legalDocsIndex] = legalDocs[0].finalPath;
                let updatedLegalDocs = [];
                legalDocsArr.forEach(element => {
                    updatedLegalDocs.push({ finalPath: element });
                });

                await Model.update({ legalDocs: updatedLegalDocs }, { where: { id } });
                const f = await Model.findByPk(id);
                return res.json({ message: "done", object: f });
            } else if (legalDocsIndex) {
                console.log("here 2");
                let updatedLegalDocs = [];
                let c = 0;
                for (let indexx = 0; indexx < legalDocsArr.length; indexx++) {
                    if (indexx == legalDocsIndex) continue;
                    updatedLegalDocs[c] = { finalPath: legalDocsArr[indexx] };
                    c++;
                }

                await Model.update({ legalDocs: updatedLegalDocs }, { where: { id } });
                const f = await Model.findByPk(id);
                return res.json({ message: "done", object: f });
            } else {
                return res.json({ message: "no doc selected" });
            }
        }
    );
}

export const crudOps = {
    getAll,
    getOne,
    addModel,
    deleteModel,
    updateModel,
    uploadMedia,
    updateOneInMedia,
    deleteFromReq,
    updateFromReq
}