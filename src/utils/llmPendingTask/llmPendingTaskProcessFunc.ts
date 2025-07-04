import mongoose from "mongoose";
import { ModelLlmPendingTaskCron } from "../../schema/SchemaLlmPendingTaskCron.schema";
import { llmPendingTaskTypes } from "./llmPendingTaskConstants";
import generateChatThreadTitleById from "./page/chat/generateChatThreadTitleById";
import generateChatTagsById from "./page/chat/generateChatTagsById";
import generateLifeEventAiTagsById from "./page/lifeEvents/generateLifeEventAiTagsById";
import generateLifeEventAiSummaryById from "./page/lifeEvents/generateLifeEventAiSummaryById";
import generateLifeEventAiCategoryById from "./page/lifeEvents/generateLifeEventAiCategoryById";
import generateNotesAiSummaryById from "./page/notes/generateNotesAiSummaryById";
import generateNotesAiTagsById from "./page/notes/generateNotesAiTagsById";

const llmPendingTaskProcessFunc = async ({
    _id,
}: {
    _id: mongoose.mongo.BSON.ObjectId
}) => {
    try {
        const dateTimeStart = new Date().valueOf();
        let isTaskDone = false;

        console.log('_id: ', _id);

        const resultTask = await ModelLlmPendingTaskCron.findOne({
            _id: _id,
            taskStatus: {
                $ne: 'done'
            },
        });

        if (!resultTask) {
            throw new Error('Task not found');
        }

        // TODO is task lock
        let isTaskLock = false;

        switch (resultTask.taskType) {
            // Chat tasks
            case llmPendingTaskTypes.page.chat.generateChatThreadTitleById:
                isTaskDone = await generateChatThreadTitleById({
                    targetRecordId: resultTask.targetRecordId,
                });
                break;
            
            case llmPendingTaskTypes.page.chat.generateChatTagsById:
                isTaskDone = await generateChatTagsById({
                    targetRecordId: resultTask.targetRecordId,
                });
                break;
            
            // Life Events tasks
            case llmPendingTaskTypes.page.lifeEvents.generateLifeEventAiSummaryById:
                isTaskDone = await generateLifeEventAiSummaryById({
                    targetRecordId: resultTask.targetRecordId,
                });
                break;
            
            case llmPendingTaskTypes.page.lifeEvents.generateLifeEventAiTagsById:
                console.log('generateLifeEventAiTagsById', resultTask.targetRecordId);
                isTaskDone = await generateLifeEventAiTagsById({
                    targetRecordId: resultTask.targetRecordId,
                });
                break;
            
            case llmPendingTaskTypes.page.lifeEvents.generateLifeEventAiCategoryById:
                isTaskDone = await generateLifeEventAiCategoryById({
                    targetRecordId: resultTask.targetRecordId,
                });
                break;
            
            // Notes tasks
            case llmPendingTaskTypes.page.notes.generateNoteAiSummaryById:
                isTaskDone = await generateNotesAiSummaryById({
                    targetRecordId: resultTask.targetRecordId,
                });
                break;
            
            case llmPendingTaskTypes.page.notes.generateNoteAiTagsById:
                isTaskDone = await generateNotesAiTagsById({
                    targetRecordId: resultTask.targetRecordId,
                });
                break;
            
            default:
                console.warn('Unknown task type:', resultTask.taskType);
                break;
        }

        // update task info
        if (isTaskDone === true) {
            resultTask.taskStatus = 'success';
        } else {
            resultTask.taskRetryCount += 1;
        }
        if (resultTask.taskRetryCount >= 3) {
            resultTask.taskStatus = 'failed';
        }
        const dateTimeEnd = new Date().valueOf();
        console.log(dateTimeEnd - dateTimeStart);
        resultTask.taskTimeTakenInMills = dateTimeEnd - dateTimeStart;
        await resultTask.save();

        return isTaskDone;
    } catch (error) {
        console.error(error);
        return false;
    }
};

export default llmPendingTaskProcessFunc;