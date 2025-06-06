export interface tsUserApiKey {
    // api key groq
    apiKeyGroqValid: boolean;
    apiKeyGroq: string;

    // api key openrouter
    apiKeyOpenrouterValid: boolean;
    apiKeyOpenrouter: string;

    // api key s3
    apiKeyS3Valid: boolean;
    apiKeyS3Endpoint: string;
    apiKeyS3Region: string;
    apiKeyS3AccessKeyId: string;
    apiKeyS3SecretAccessKey: string;
    apiKeyS3BucketName: string;
}

export const getApiKeyByObject = (apiKeyObject: any) => {
    const apiKey = {
        // api key groq
        apiKeyGroqValid: false,
        apiKeyGroq: '',
        
        // api key openrouter
        apiKeyOpenrouterValid: false,
        apiKeyOpenrouter: '',
        
        // api key s3
        apiKeyS3Valid: false,
        apiKeyS3Endpoint: '',
        apiKeyS3Region: '',
        apiKeyS3AccessKeyId: '',
        apiKeyS3SecretAccessKey: '',
        apiKeyS3BucketName: '',
    } as tsUserApiKey;

    try {
        if (apiKeyObject && typeof apiKeyObject === 'object') {

            // api key groq
            if (typeof apiKeyObject.apiKeyGroqValid === 'boolean') {
                if(apiKeyObject.apiKeyGroqValid) {
                    apiKey.apiKeyGroqValid = true;
                }
            }
            if (typeof apiKeyObject.apiKeyGroq === 'string') {
                apiKey.apiKeyGroq = apiKeyObject.apiKeyGroq;
            }

            // api key openrouter
            if (typeof apiKeyObject.apiKeyOpenrouterValid === 'boolean') {
                if(apiKeyObject.apiKeyOpenrouterValid) {
                    apiKey.apiKeyOpenrouterValid = true;
                }
            }
            if (typeof apiKeyObject.apiKeyOpenrouter === 'string') {
                apiKey.apiKeyOpenrouter = apiKeyObject.apiKeyOpenrouter;
            }

            // api key s3
            if (typeof apiKeyObject.apiKeyS3Valid === 'boolean') {
                if(apiKeyObject.apiKeyS3Valid) {
                    apiKey.apiKeyS3Valid = true;
                }
            }
            if (typeof apiKeyObject.apiKeyS3Endpoint === 'string') {
                apiKey.apiKeyS3Endpoint = apiKeyObject.apiKeyS3Endpoint;
            }
            if (typeof apiKeyObject.apiKeyS3Region === 'string') {
                apiKey.apiKeyS3Region = apiKeyObject.apiKeyS3Region;
            }
            if (typeof apiKeyObject.apiKeyS3AccessKeyId === 'string') {
                apiKey.apiKeyS3AccessKeyId = apiKeyObject.apiKeyS3AccessKeyId;
            }
            if (typeof apiKeyObject.apiKeyS3SecretAccessKey === 'string') {
                apiKey.apiKeyS3SecretAccessKey = apiKeyObject.apiKeyS3SecretAccessKey;
            }
            if (typeof apiKeyObject.apiKeyS3BucketName === 'string') {
                apiKey.apiKeyS3BucketName = apiKeyObject.apiKeyS3BucketName;
            }
        }
        return apiKey;
    } catch (error) {
        return apiKey;
    }
}