import mongoose, { Document } from 'mongoose';

// InfoVault Address
export interface IInfoVaultAddress extends Document {
    // identification
    infoVaultId: mongoose.Schema.Types.ObjectId;
    username: string;

    // fields
    countryRegion: string;
    address: string;
    city: string;
    pincode: string;
    state: string;
    poBox: string;
    label: string; // e.g., "home", "work", "other"

    latitude: number;
    longitude: number;

    isPrimary: boolean;

    // auto
    createdAtUtc: Date;
    createdAtIpAddress: string;
    createdAtUserAgent: string;
    updatedAtUtc: Date;
    updatedAtIpAddress: string;
    updatedAtUserAgent: string;
}; 