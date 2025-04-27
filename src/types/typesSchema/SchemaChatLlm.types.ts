import mongoose, { Document } from 'mongoose';

// Chat Interface
export interface IChatLlm extends Document {
    // identification
    threadId: mongoose.Schema.Types.ObjectId | null;

    // ai
    type: string,
    content: string;
    username: string;
    tags: string[];
    visibility: string;
    fileUrlArr: string[];

    // model info
    isAi: boolean;
    aiModelName: string;
    aiModelProvider: string;

    // file
    fileUrl: string;
    fileContentAi: string;

    // auto
    createdAtUtc: Date;
    createdAtIpAddress: string;
    createdAtUserAgent: string;
    updatedAtUtc: Date;
    updatedAtIpAddress: string;
    updatedAtUserAgent: string;

    // auto ai
    tagsAutoAi: string[];
};