export function csvCell(value:unknown):string;
export function summarize(rows:{firstSeen:Date|string;acknowledgedAt:Date|string|null;severity:string;status:string}[]):{total:number;open:number;falseAlarms:number;severity:Record<string,number>;daily:{date:string;count:number}[];medianResponseSeconds:number|null};
