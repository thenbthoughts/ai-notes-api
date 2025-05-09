import mongoose, { PipelineStage } from 'mongoose';
import { Router, Request, Response } from 'express';

import middlewareUserAuth from '../../../middleware/middlewareUserAuth';
import { ModelLifeEvents } from '../../../schema/SchemaLifeEvents.schema';

const router = Router();

// Get Life Events API
router.post('/lifeEventsGet', middlewareUserAuth, async (req: Request, res: Response) => {
    try {
        let tempStage = {} as PipelineStage;
        const pipelineDocument: PipelineStage[] = [];
        const pipelineCount: PipelineStage[] = [];

        // args
        let page = 1;
        let perPage = 10;

        // set arg -> page
        if (typeof req.body?.page === 'number') {
            if (req.body.page >= 1) {
                page = req.body.page;
            }
        }
        // set arg -> perPage
        if (typeof req.body?.perPage === 'number') {
            if (req.body.perPage >= 1) {
                perPage = req.body.perPage;
            }
        }

        // stage -> match -> auth
        tempStage = {
            $match: {
                username: res.locals.auth_username,
            }
        };
        pipelineDocument.push(tempStage);
        pipelineCount.push(tempStage);

        // stage -> match -> lifeEventId
        const arg_recordId = req.body.recordId;
        if (typeof arg_recordId === 'string') {
            if (arg_recordId.length === 24) {
                let _id = null as mongoose.Types.ObjectId | null;
                _id = arg_recordId ? mongoose.Types.ObjectId.createFromHexString(arg_recordId) : null;
                if (_id) {
                    if (_id.toHexString().length === 24) {
                        tempStage = {
                            $match: {
                                _id: _id,
                            }
                        };
                        pipelineDocument.push(tempStage);
                        pipelineCount.push(tempStage);
                    }
                }
            }
        }

        // stage -> search
        if (typeof req.body?.search === 'string') {
            if (req.body.search.length >= 1) {
                let searchQuery = req.body.search as string;

                let searchQueryArr = searchQuery
                    .replace('-', ' ')
                    .split(' ');

                const matchAnd = [];
                for (let index = 0; index < searchQueryArr.length; index++) {
                    const elementStr = searchQueryArr[index];
                    matchAnd.push({
                        $or: [
                            { title: { $regex: elementStr, $options: 'i' } },
                            { description: { $regex: elementStr, $options: 'i' } },
                            { categoryUniqueKey: { $regex: elementStr, $options: 'i' } },
                            { categorySubUniqueKey: { $regex: elementStr, $options: 'i' } },
                            { aiSummary: { $regex: elementStr, $options: 'i' } },
                            { aiTags: { $regex: elementStr, $options: 'i' } },
                            { aiSuggestions: { $regex: elementStr, $options: 'i' } },
                        ]
                    })
                }

                tempStage = {
                    $match: {
                        $and: [
                            ...matchAnd,
                        ],
                    },
                };
                console.log(JSON.stringify([
                    tempStage,
                ]))
                pipelineDocument.push(tempStage);
                pipelineCount.push(tempStage);
            }
        }

        // sort
        tempStage = {
            $sort: {
                eventDateUtc: 1,
            }
        };
        pipelineDocument.push(tempStage);
        pipelineCount.push(tempStage);

        // stage -> skip
        tempStage = {
            $skip: (page - 1) * perPage,
        };
        pipelineDocument.push(tempStage);

        // stage -> limit
        tempStage = {
            $limit: perPage,
        };
        pipelineDocument.push(tempStage);

        // stageCount -> count
        pipelineCount.push({
            $count: 'count'
        });

        const lifeEvents = await ModelLifeEvents.aggregate(pipelineDocument);

        const lifeEventsCount = await ModelLifeEvents.aggregate(pipelineCount);

        let totalCount = 0;
        if (lifeEventsCount.length === 1) {
            if (lifeEventsCount[0].count) {
                totalCount = lifeEventsCount[0].count;
            }
        }

        return res.json({
            message: 'Life events retrieved successfully',
            count: totalCount,
            docs: lifeEvents,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Delete Life Event API
router.post('/lifeEventsDelete', middlewareUserAuth, async (req: Request, res: Response) => {
    try {
        let _id = null as mongoose.Types.ObjectId | null;
        const arg_id = req.body._id;
        if (typeof arg_id === 'string') {
            _id = arg_id ? mongoose.Types.ObjectId.createFromHexString(arg_id) : null;
        }
        if (_id === null) {
            return res.status(400).json({ message: 'Life event ID cannot be null' });
        }

        const lifeEvent = await ModelLifeEvents.findOneAndDelete({
            _id: _id,
            username: res.locals.auth_username,
        });

        if (!lifeEvent) {
            return res.status(404).json({ message: 'Life event not found or unauthorized' });
        }

        return res.json({ message: 'Life event deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Add Life Event API
router.post('/lifeEventsAdd', middlewareUserAuth, async (req: Request, res: Response) => {
    try {
        const eventDateUtc = new Date();
        const year = eventDateUtc.getUTCFullYear();
        const month = (eventDateUtc.getUTCMonth() + 1).toString().padStart(2, '0');
        const eventDateYearStr = `${year}-${month}`;
        const eventDateYearMonthStr = `${year}-${month}`;

        const newLifeEvent = await ModelLifeEvents.create({
            eventDateUtc,
            eventDateYearStr,
            eventDateYearMonthStr,

            username: res.locals.auth_username,
            title: `Empty Event - ${eventDateUtc.toDateString()} ${eventDateUtc.toLocaleTimeString().substring(0, 7)}`,

            aiTags: ['Empty event'],
        });

        return res.json({
            message: 'Life event added successfully',
            doc: newLifeEvent,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Edit Life Event API
router.post('/lifeEventsEdit', middlewareUserAuth, async (req: Request, res: Response) => {
    try {
        let _id = null as mongoose.Types.ObjectId | null;
        const arg_id = req.body._id;
        if (typeof arg_id === 'string') {
            _id = arg_id ? mongoose.Types.ObjectId.createFromHexString(arg_id) : null;
        }
        if (_id === null) {
            return res.status(400).json({ message: 'Life event ID cannot be null' });
        }

        const updateObj = {

        } as {
            title?: string;
            description?: string;
            categoryUniqueKey?: string;
            categorySubUniqueKey?: string;
            isStarred?: boolean;
            eventImpact?: string;
            eventDateUtc?: Date;
        };

        if (typeof req.body.title === 'string') {
            updateObj.title = req.body.title;
        }
        if (typeof req.body.description === 'string') {
            updateObj.description = req.body.description;
        }
        if (typeof req.body.categoryUniqueKey === 'string') {
            updateObj.categoryUniqueKey = req.body.categoryUniqueKey;
        }
        if (typeof req.body.categorySubUniqueKey === 'string') {
            updateObj.categorySubUniqueKey = req.body.categorySubUniqueKey;
        }
        if (typeof req.body.isStarred === 'boolean') {
            updateObj.isStarred = req.body.isStarred;
        }
        if (typeof req.body.eventImpact === 'string') {
            updateObj.eventImpact = req.body.eventImpact;
        }
        if (req.body.eventDateUtc) {
            const date = new Date(req.body.eventDateUtc);
            if (!isNaN(date.getTime())) {
                updateObj.eventDateUtc = date;
            }
            // if (typeof req.body.eventDateYearStr === 'string') {
            //     updateObj.eventDateYearStr = req.body.eventDateYearStr;
            // }
            // if (typeof req.body.eventDateYearMonthStr === 'string') {
            //     updateObj.eventDateYearMonthStr = req.body.eventDateYearMonthStr;
            // }
        }

        if (Object.keys(updateObj).length >= 1) {
            const newLifeEvent = await ModelLifeEvents.updateOne(
                {
                    _id: _id,
                    username: res.locals.auth_username,
                },
                {
                    $set: {
                        ...updateObj,
                    }
                }
            );
            console.log(newLifeEvent);
        }

        return res.json({
            message: 'Life event edited successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});

export default router;