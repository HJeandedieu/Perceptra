export function shouldAlert(incident:{id:string;severity:string;status:string;activities?:{action:string}[]},seen:Set<string>):boolean;
