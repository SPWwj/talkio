export interface AssistantDto {
    id: string;
    object: string;
    createdAt: number;
    name: string;
    description?: string;
    model: string;
    instructions?: string;
    tools?: string;
    metadata?: string;
    temperature?: number;
    responseFormat?: string;
}