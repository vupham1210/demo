import { Router } from "express";

const SubdoimainRouter = Router();

SubdoimainRouter.get('/', (req, res, next) => {
    console.log('get subdoimain')
    return res.status(200).json({name: 'hoan'});
})
export default SubdoimainRouter;