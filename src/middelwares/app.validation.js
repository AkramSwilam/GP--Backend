export const appValidator = (schema) => {
    return (req, res, nxt) => {
        let errors = []
        const validation = schema.validate({...req.body,...req.params,...req.query},{abortEarly:false})
        if(validation.error){
            validation.error.details.forEach(element => {
                errors.push(element.message)
            });
        }
        if (errors.length>0) {
            return nxt(new Error(errors,{status:400}))
        }
        nxt()
    }

}