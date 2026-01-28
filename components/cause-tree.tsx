import React, { useState } from 'react';
import { ChevronDown, ChevronRight, } from 'lucide-react';
import { CausalBranches, Level } from "@/models/analyzeRootCauses"

interface NodeProps {
    level: Level, 
    isLast: boolean, 
    isExpanded: boolean, 
    onToggle: any,
    edit: boolean,
    index: number,
    handleChangeNode: (field: string, value: any) => void;
    translation: any;
}

interface CauseBranchProps {
    branch: CausalBranches,
    edit: boolean,
    index: number,
    handleChange: (field: string, value: any, card: "tree") => void;
    translation: any;
}

const extractLastDigit = (ix: number): number => {
    const str = ix.toString()
    const match = str.match(/\d/g);
    if (match && match.length > 0) {
        return parseInt(match[match.length - 1]);
    }
    const lastChar = str[str.length - 1];
    return lastChar.charCodeAt(0) % 10;
};

// Componente para cada nodo del árbol
const CauseNode = ({level, isLast, isExpanded, onToggle, edit, index, handleChangeNode, translation}: NodeProps) => {
    const getColorByType = (index: number) => {
        const colors = [
            'bg-orange-100 border-orange-300 text-orange-900',
            'bg-blue-100 border-blue-300 text-blue-900',
            'bg-red-100 border-red-300 text-red-900',
            'bg-purple-100 border-purple-300 text-purple-900',
            'bg-yellow-100 border-yellow-300 text-yellow-900',
            'bg-pink-100 border-pink-300 text-pink-900',
            'bg-green-100 border-green-300 text-green-900',
            'bg-teal-100 border-teal-300 text-teal-900',
            'bg-indigo-100 border-indigo-300 text-indigo-900',
            'bg-cyan-100 border-cyan-300 text-cyan-900'
        ];
        return colors[index % 10] || 'bg-gray-100 border-gray-300 text-gray-900';
    };

    return (
        <div className="relative">
            {!isLast && (
                <div className="absolute left-6 top-12 w-0.5 h-full bg-slate-300 z-0"></div>
            )}
            
            <div className="flex items-start gap-3 mb-4">
                {!isLast && (
                <button
                    onClick={onToggle}
                    className="mt-1 p-1 hover:bg-slate-100 rounded transition-colors flex-shrink-0 z-10"
                >
                    {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-slate-600" />
                    ) : (
                        <ChevronRight className="w-5 h-5 text-slate-600" />
                    )}
                </button>
                )}
            
                <div className="flex-1">
                    <div className={`p-3 rounded-lg border-2 ${getColorByType(extractLastDigit(level.level))} transition-all hover:shadow-md ${isLast ? "ml-10" : ""}`}>
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                                <p className="text-xs font-medium opacity-70 mb-1">
                                    {translation?.level || 'Nivel'} {level.level} • {" "}
                                    {edit ? (
                                        <input
                                            key={"input"+index}
                                            type="text"
                                            value={level.factor_type}
                                            onChange={(e) => handleChangeNode(`levels.${index}.factor_type`, e.target.value)}
                                            className="border-2 border-indigo-300 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                                            placeholder={translation?.factorType || 'Tipo de factor'}
                                        />
                                    ) : (
                                        level.factor_type
                                    )}
                                </p>
                                <p className="text-sm font-semibold mb-2">
                                    {edit ? (
                                        <input
                                            key={"input-question-"+index}
                                            type="text"
                                            value={level.question}
                                            onChange={(e) => handleChangeNode(`levels.${index}.question`, e.target.value)}
                                            className="w-full border-2 border-indigo-300 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                                            placeholder={translation?.question || 'Pregunta'}
                                        />
                                    ) : (
                                        level.question
                                    )}
                                </p>
                                <p className="text-sm">
                                    {edit ? (
                                        <input
                                            key={"input-cause-"+index}
                                            type="text"
                                            value={level.cause}
                                            onChange={(e) => handleChangeNode(`levels.${index}.cause`, e.target.value)}
                                            className="w-full border-2 border-indigo-300 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                                            placeholder={translation?.cause || 'Causa'}
                                        />
                                    ) : (
                                        level.cause
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CauseBranch = ({ branch, edit, index, handleChange, translation }: CauseBranchProps) => {
    // Inicializar con todos los niveles expandidos
    const [expandedLevels, setExpandedLevels] = useState<number[]>([0, 1, 2, 3, 4, 5]);
    const toggleLevel = (clickedIndex: number) => {
        setExpandedLevels(prev => {
            const isCurrentlyExpanded = prev.includes(clickedIndex);
            
            if (isCurrentlyExpanded) {
                return prev.filter(i => i <= clickedIndex - 1);
            } else {
                return [...prev, clickedIndex].sort((a, b) => a - b);
            }
        });
    };

    const getTypeColor = (index: number) => {
        const colors = [
            'bg-blue-500',
            'bg-green-500',
            'bg-purple-500',
            'bg-teal-500',
            'bg-red-500',
            'bg-orange-500',
            'bg-pink-500',
            'bg-indigo-500',
            'bg-cyan-500',
            'bg-amber-500'
        ];
        return colors[index % 10] || 'bg-gray-500';
    };

    return (
        <div className="mb-6 bg-slate-50 rounded-xl p-4 border border-slate-200">
            <div className="mb-4">
                <div className="flex items-center gap-3 mb-2">
                    <div className={`w-8 h-8 ${getTypeColor(extractLastDigit(index))} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                        {branch.branch_id}
                    </div>
                    <div className="flex-1">
                        <p className="font-bold text-slate-900 text-sm">
                            {edit ? (
                                <input
                                    key={"input-main-cause-"+index}
                                    type="text"
                                    value={branch.main_cause}
                                    onChange={(e) => handleChange(`aiAnalyzeRootCauses.causal_branches.${index}.main_cause`, e.target.value, "tree")}
                                    className="w-full border-2 border-indigo-300 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                                    placeholder={translation?.mainCause || 'Causa principal'}
                                />
                            ) : (
                                branch.main_cause
                            )}
                        </p>
                        <p className="text-xs text-slate-600 capitalize">
                            {translation?.type || 'Tipo'}: {" "}
                            {edit ? (
                                <input
                                    key={"input-type-"+index}
                                    type="text"
                                    value={branch.type}
                                    onChange={(e) => handleChange(`aiAnalyzeRootCauses.causal_branches.${index}.type`, e.target.value, "tree")}
                                    className="ml-1 border-2 border-indigo-300 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                                    placeholder={translation?.branchType || 'Tipo de rama'}
                                />
                            ) : (
                                branch.type
                            )}
                        </p>
                    </div>
                </div>
            </div>

            <div className="pl-4">
                {branch.levels.map((level: any, ix: number) => {
                    const shouldShow = ix === 0 || expandedLevels.includes(ix - 1);
                    
                    if (!shouldShow) return null;
                    
                    return (
                        <CauseNode
                            key={ix}
                            level={level}
                            isLast={ix === branch.levels.length - 1}
                            isExpanded={expandedLevels.includes(ix)}
                            onToggle={() => toggleLevel(ix)}
                            edit={edit}
                            index={ix}
                            handleChangeNode={(field, value) => 
                                handleChange(`aiAnalyzeRootCauses.causal_branches.${index}.${field}`, value, "tree")
                            }
                            translation={translation}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export { CauseBranch };