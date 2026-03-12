export interface DifficultyLevel {
    id: number;
    slug: string;
    displayName: string;
    description: string;
}

export interface EvaluationType {
    id: number;
    slug: string;
    displayName: string;
}

export interface CatalogsData {
    difficulties: DifficultyLevel[];
    evaluationTypes: EvaluationType[];
}

export interface CatalogsApiResponse {
    message: string;
    data: CatalogsData;
}
