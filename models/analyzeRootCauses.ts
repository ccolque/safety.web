export interface Level {
    level: number;
    question: string;
    cause: string;
    factor_type: string
}

export interface CausalBranches {
    branch_id: string;
    main_cause: string;
    type: string;
    levels: Level[]
}

export interface IAnalyzeRootCauses {
    causal_branches: CausalBranches[];
}