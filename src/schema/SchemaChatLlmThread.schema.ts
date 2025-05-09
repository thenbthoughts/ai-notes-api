import mongoose, { Schema } from 'mongoose';

import { IChatLlmThread } from '../types/typesSchema/SchemaChatLlmThread.types';

// Chat Schema
const chatLlmThreadSchema = new Schema<IChatLlmThread>({
    // fields
    threadTitle: {
        type: String, default: ''
    },

    // ai
    tagsAi: { type: [String], default: [] },
    aiSummary: {
        type: String,
        default: '',
    },
    aiTasks: [
        {
            type: String,
            default: ''
        }
    ],

    // auth
    username: { type: String, required: true, default: '', index: true, },

    // auto
    createdAtUtc: {
        type: Date,
        default: null,
    },
    createdAtIpAddress: {
        type: String,
        default: '',
    },
    createdAtUserAgent: {
        type: String,
        default: '',
    },
    updatedAtUtc: {
        type: Date,
        default: null,
    },
    updatedAtIpAddress: {
        type: String,
        default: '',
    },
    updatedAtUserAgent: {
        type: String,
        default: '',
    },
});

// Chat Model
const ModelChatLlmThread = mongoose.model<IChatLlmThread>(
    'chatLlmThread',
    chatLlmThreadSchema,
    'chatLlmThread'
);

export {
    ModelChatLlmThread
};